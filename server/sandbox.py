import os
import io
import re
import time
import queue
import traceback
from threading import Thread
from collections import namedtuple
from multiprocessing import TimeoutError, Event, Queue, Process, Array, get_context

import requests
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
           'send_input',
           'end_process')


def _safe_import(name, *args, **kwargs):
    if name not in _SAFE_MODULES:
        raise ImportError(f'Unable to import module {name!r} - modules must be one of {_SAFE_MODULES}.')
    return __import__(name, *args, **kwargs)

_SAFE_MODULES = frozenset(('math', 'random'))
_state = {}
regex = r"\):([\s\S]*?)File \"<user_input>"
Output = namedtuple('Output', 'output status')
ExtendedOutput = namedtuple('ExtendedOutput', 'output status time')
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
        'dict': dict
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


def exec_code(byte_code: CompileResult, extra_builtins=None, out=None) -> Output:
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
        return ExtendedOutput('\n'.join(byte_code.errors), 'error', time.perf_counter() - start)
    
    if 'input' in byte_code.used_names:
        return ExtendedOutput('Use interactive websocket execution endpoint', 
                              'redirect-ws', 
                              time.perf_counter() - start)
    
    start = time.perf_counter()
    output = exec_code(byte_code)
    return ExtendedOutput(*output, time.perf_counter() - start)


def exec_func_with_output(code: str, func_call: str) -> Output:
    start = time.perf_counter()
    code_with_call = f'{code}\nprint({func_call})'
    byte_code = compile_code(code_with_call)

    if (byte_code.errors):
        return ExtendedOutput('\n'.join(byte_code.errors), 'error', time.perf_counter() - start)
    
    start = time.perf_counter()
    output = exec_code(byte_code)
    return ExtendedOutput(*output, time.perf_counter() - start)


def exec_code_with_inputs(code: str, inputs: "list[str]") -> Output:
    start = time.perf_counter()
    
    def new_input(_, /):
        try:
            return inputs.pop(0)
        except IndexError:
            return ""
    
    byte_code = compile_code(code)

    if (byte_code.errors):
        return ExtendedOutput('\n'.join(byte_code.errors), 'error', time.perf_counter() - start)
    
    start = time.perf_counter()
    output = exec_code(byte_code, {'input': new_input})
    return ExtendedOutput(*output, time.perf_counter() - start)


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
        result = ExtendedOutput('\n'.join(byte_code.errors), 'error', time.perf_counter() - start)
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
print('Hello, World!')
import math

print(math.pi)

def my_func():
    return 4

def func_two():
    return 0

my_list = [1, 2, 3]
print(1 in my_list)
for i, num in enumerate(my_list):
    print(i, num, end="\t")
print()

a, b, c = my_list
print(a, b, c)
print(tuple([a, b, c]))

set()
dict()

print('🦖')
"""

    print(exec_code_in_process(exec_code_with_output, source_code))
