import os
import io
import re
import time
import json
import queue
import traceback
import concurrent
from threading import Thread
from collections import namedtuple
from multiprocessing import TimeoutError, Event, Queue, Process, Array, get_context

import requests
from flask import abort
from pebble import ProcessPool
from RestrictedPython import compile_restricted_exec
from RestrictedPython import CompileResult
from RestrictedPython import (
    safe_builtins,
)
from RestrictedPython.Eval import default_guarded_getitem
from RestrictedPython.Guards import (
    full_write_guard,
    guarded_iter_unpack_sequence,
    guarded_unpack_sequence,
    safer_getattr
)


__all__ = ('exec_code_in_process', 
           'exec_code_with_output', 
           'exec_code_with_dynamic_input_in_process', 
           'exec_problem',
           'send_input',
           'end_process',
           'run_multi_tests')


def _safe_import(name, *args, **kwargs):
    if name not in _SAFE_MODULES:
        raise ImportError(f'Unable to import module {name!r} - modules must be one of {_SAFE_MODULES}.')
    return __import__(name, *args, **kwargs)

_SAFE_MODULES = frozenset(('math', 'random'))
_state = {}
regex = r"\):([\s\S]*?)File \"<user_input>"
Output = namedtuple('Output', 'output status')
ExtendedOutput = namedtuple('ExtendedOutput', 'output status time')
Answer = namedtuple('Answer', 'info status')
url_origin = os.environ.get('origin', 'http://localhost:5000')
custom_globals = {
    '__builtins__': {
        **safe_builtins,
        '__import__': _safe_import,
        'min': min,
        'max': max,
        'sum': sum,
        'any': any,
        'all': all,
        'enumerate': enumerate,
        'list': list,
        'tuple': tuple,
        'set': set,
        'dict': dict,
        'type': type
    },
    '_getattr_': safer_getattr,
    '_write_': full_write_guard,
    '_getiter_': iter,
    '_getitem_': default_guarded_getitem,
    '_iter_unpack_sequence_': guarded_iter_unpack_sequence,
    '_unpack_sequence_': guarded_unpack_sequence
}


def compile_code(source_code: str) -> CompileResult:
    byte_code = compile_restricted_exec(source_code, filename='<user_input>')
    return byte_code


def clean_exception_trace(trace: str) -> str:
    return re.sub(regex, '):\\n  ...(omitted)...\\n  \"<user_input>', trace) 


def exec_code(byte_code: CompileResult, extra_builtins=None, out=None, shorten_error=False, modified=False) -> Output:
    if extra_builtins is None:
        extra_builtins = {}

    if out is None:
        out = io.StringIO()
    
    class PrintWrapper:
        def __init__(self, _getattr_=None):
            self._getattr_ = _getattr_

        def write(self, obj: str) -> None:
            out.write(obj)

        def __call__(self):
            return out.getvalue()
        
        def _call_print(self, *_, **kwargs):
            if kwargs.get('file', None) is None:
                kwargs['file'] = self
            else:
                self._getattr_(kwargs['file'], 'write')

            kwargs['file'] = out
            print(*_, **kwargs)

    c_globals = custom_globals.copy()
    c_globals['_print_'] = PrintWrapper
    c_globals['__builtins__'].update(extra_builtins)

    status = 'success'
    try:
        exec(byte_code.code, c_globals)
    except BaseException as exc:
        status = 'error'
        if shorten_error:
            if modified:
                tb = exc.__traceback__.tb_next
            else:
                tb = exc.__traceback__
            tr = f'(Line {tb.tb_next.tb_lineno}) {type(exc).__name__}: {str(exc)}'
        else:
            tr = clean_exception_trace(''.join(traceback.TracebackException.from_exception(exc).format()))
        out.write(tr)

    if (len(out.getvalue()) > 65536):
        out.seek(65536)
        out.truncate(65536)
        out.write('\n\nOutput truncated to 65536 characters')
    
    return Output(out.getvalue(), status)


def exec_code_with_output(code: str) -> Output:
    start = time.perf_counter()
    byte_code = compile_code(code)
    
    if byte_code.errors:
        return ExtendedOutput('\n'.join(byte_code.errors), 'compile error', time.perf_counter() - start)
    
    if 'input' in byte_code.used_names:
        return ExtendedOutput('Use interactive websocket execution endpoint', 
                              'redirect-ws', 
                              time.perf_counter() - start)
    
    start = time.perf_counter()
    output = exec_code(byte_code)
    return ExtendedOutput(*output, time.perf_counter() - start)


def exec_func_with_output(code: str, func_call: str, shorten_error=True) -> Output:
    start = time.perf_counter()
    code_with_call = f'{code}\nprint({func_call})'
    byte_code = compile_code(code_with_call)

    if (byte_code.errors):
        return ExtendedOutput('\n'.join(byte_code.errors), 'compile error', time.perf_counter() - start)
    
    start = time.perf_counter()
    output = exec_code(byte_code, shorten_error=shorten_error, modified=True)
    return ExtendedOutput(*output, time.perf_counter() - start)


def exec_code_with_inputs(code: str, inputs: "list[str]", shorten_error=True) -> Output:
    start = time.perf_counter()
    
    def new_input(_, /):
        try:
            return inputs.pop(0)
        except IndexError:
            return ""
    
    byte_code = compile_code(code)

    if (byte_code.errors):
        return ExtendedOutput('\n'.join(byte_code.errors), 'compile error', time.perf_counter() - start)
    
    start = time.perf_counter()
    output = exec_code(byte_code, {'input': new_input}, shorten_error=shorten_error)
    return ExtendedOutput(*output, time.perf_counter() - start)


def exec_multi_in_pool(func, code: str, arg_list: "list") -> "list[ExtendedOutput]":
    results: "list[ExtendedOutput]" = []

    with ProcessPool(context=get_context('spawn')) as pool:
        res = pool.map(func, [code] * len(arg_list), arg_list, timeout=2)
        
        iterator = res.result()
        while True:
            try:
                result = next(iterator)
            except StopIteration:
                break
            except concurrent.futures.TimeoutError:
                result = ExtendedOutput('Execution timed out (>2s). Maybe you have an infinite loop?', 'timeout', 2)
            results.append(result)

    return results


def check_multi_results(result: "list[ExtendedOutput]", answers_list: "list[str]"):
    answers: "list[Answer]" = []

    for index, (res, answer) in enumerate(zip(result, answers_list), start=1):
        if res.output.strip('\n') == answer:
            answers.append(Answer(f'Test case {index}: Correct answer', 'correct'))
        elif res.status == 'compile error':
            answers.append(Answer(f'Test case {index}: {res.output}', 'error'))
        elif res.status == 'error':
            answers.append(Answer(f'Test case {index}: {res.output.split(":")[0]}', 'error'))
        elif res.status == 'timeout':
            answers.append(Answer(f'Test case {index}: Timed out (>2s)', 'timeout'))
        else:
            answers.append(Answer(f'Test case {index}: Incorrect answer', 'incorrect'))
    
    return answers


def run_multi_tests(code: str, problem_id: str) -> "list[dict]":
    problems = json.load(open('problems.json'))
    if problem_id not in problems:
        abort(404)

    problem = problems[problem_id]
    if problem['type'] == 'func':
        func = exec_func_with_output
        arg = problem['calls']
    else:
        func = exec_code_with_inputs
        arg = problem['inputs']
    answers = [str(ans) for ans in problem['answers']]
    multi_results = exec_multi_in_pool(func, code, arg)
    return [res._asdict() for res in check_multi_results(multi_results, answers)]


def exec_problem(code: str, problem_id: str):
    problems = json.load(open('problems.json'))
    if problem_id not in problems:
        abort(404)
    problem = problems[problem_id]

    if problem['type'] == 'func':
        func = exec_func_with_output
        args = problem['test_call']
        description = f' for {problem["test_call"]}'
    else:
        func = exec_code_with_inputs
        args = problem["test_input"]
        description = f' with user-inputted values of [{", ".join([str(_) for _ in problem["test_input"]])}]'
    test_answer = str(problem['test_answer'])
    result = exec_code_in_process(func, code, args, shorten_error=False)
    if result.status == 'timeout':
        answer = Answer(f'Timed out (>2s) - expected {test_answer}', 'timeout')
    elif result.status == 'compile error':
        answer = Answer(f'Compile error - expected {test_answer}', 'error')
    elif result.status == 'error':
        answer = Answer(f'Error - expected {test_answer}', 'error')
    elif result.output.strip('\n') == test_answer:
        answer = Answer(f'Correct answer - expected & got {test_answer}', 'correct')
    else:
        answer = Answer(f'Incorrect answer - expected {test_answer}', 'incorrect')

    if answer.status == 'correct':
        description = f'Solution accepted {description}'
    else:
        description = f'Solution rejected {description}'
    
    return {'answer': answer._asdict(), 'output': result._asdict(), 'description': description}


def exec_code_with_result_args(
        code: str, 
        sid: str, 
        input_queue,
        input_event,
        finish_input_event, 
        result, 
        result_type, 
        extra_builtins=None, 
        out=None
    ):
    byte_code = compile_code(code)

    def new_input(prompt='', /):
        finish_input_event.clear()
        input_event.set()
        out.write(f'{prompt}')
        requests.post(f'{url_origin}/_send_event', 
                      json={'output': out.getvalue()}, 
                      params={'sid': sid, 'event': 'input'})
        try:
            input_str = input_queue.get(timeout=60)
            out.write(input_str + '\n')
            return input_str
        except queue.Empty:
            raise TimeoutError('Execution timed out - did not recieve input within 60s.')
        finally:
            input_event.clear()
            finish_input_event.set()

    if extra_builtins is None:
        extra_builtins = {}
    ex_builtins = extra_builtins.copy()
    ex_builtins['input'] = new_input

    if out is None:
        out = io.StringIO()

    output = exec_code(byte_code, ex_builtins, out)
    input_event.set()
    finish_input_event.set()
    result.get_obj().value = output[0]
    result_type.get_obj().value = output[1]


def exec_code_with_dynamic_input(code: str, sid: str, input_queue: Queue):
    start = time.perf_counter()
    byte_code = compile_code(code)
    
    if byte_code.errors:
        result = ExtendedOutput('\n'.join(byte_code.errors), 'compile error', time.perf_counter() - start)
        requests.post(f'{url_origin}/_send_event', 
                      json=result._asdict(), 
                      params={'sid': sid, 'event': 'finished'})
    
    input_event = Event()
    finish_input_event = Event()
    res = Array('u', 100000)
    res_type = Array('u', 100)
    proc_args = (code, sid, input_queue, input_event, finish_input_event, res, res_type)
    process = Process(target=exec_code_with_result_args, args=proc_args)
    process.start()
    while input_event.wait(2):
        if not process.is_alive():
            break
        finish_input_event.wait()
    if not process.is_alive():
        result = ExtendedOutput(res.get_obj().value, res_type.get_obj().value, time.perf_counter() - start)
    else:
        process.kill()
        process.join()
        result = ExtendedOutput('Execution timed out (>2s). Maybe you have an infinite loop?', 'timeout', time.perf_counter() - start)
    requests.post(f'{url_origin}/_send_event', 
                  json=result._asdict(), 
                  params={'sid': sid, 'event': 'finished'})


def exec_code_with_dynamic_input_in_process(code: str, sid: str):
    input_queue = Queue()
    process = Process(target=exec_code_with_dynamic_input, args=(code, sid, input_queue))
    process.start()
    Thread(target=clear_state, args=(sid, process)).start()
    _state[sid] = (process, input_queue)


def clear_state(sid: str, process: Process):
    process.join()
    _state.pop(sid, None)


def send_input(sid: str, value: str):
    if _state.get(sid) is None:
        return False
    _state[sid][1].put(value)
    return True


def end_process(sid: str):
    if res := _state.pop(sid, None):
        res[0].kill()
        res[0].join()


def exec_code_in_process(func, *args, **kwargs) -> Output:   
    with get_context('spawn').Pool(1) as pool:
        result = pool.apply_async(func, args, kwargs)
        try:
            return ExtendedOutput(*result.get(timeout=2))
        except TimeoutError:
            return ExtendedOutput('Execution timed out (>2s). Maybe you have an infinite loop?', 'timeout', 2)


if __name__ == '__main__':
    source_code = """
import random

if random.randint(0, 1) == 1:
    while True:
        pass

def func(num):
    for _ in range(100000, random.randint(1, 5) * 100000):
        pass
    return num
"""

    args = (
        'func(1)',
        'func(3)',
        'func(5)',
        'func(7)',
        'func(9)',
        'func(2)',
        'func(4)',
        'func(6)',
        'func(8)',
        'func(10)'
    )

    print(exec_multi_in_pool(exec_func_with_output, source_code, args))
