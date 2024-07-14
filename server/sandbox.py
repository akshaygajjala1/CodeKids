import io
import re
import traceback
from collections import namedtuple
from multiprocessing import Pool, TimeoutError

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


__all__ = ('exec_code_in_process',)


_SAFE_MODULES = frozenset(('math', 'random'))
regex = r"\):([\s\S]*?)File \"<user_input>"
Output = namedtuple('Output', 'output status')


def _safe_import(name, *args, **kwargs):
    if name not in _SAFE_MODULES:
        raise ImportError(f'Unable to import module {name!r} - modules must be one of {_SAFE_MODULES}.')
    return __import__(name, *args, **kwargs)


def compile_code(source_code: str) -> CompileResult:
    byte_code = compile_restricted_exec(source_code, filename='<user_input>')
    return byte_code


def clean_exception_trace(trace: str) -> str:
    return re.sub(regex, '):\\n  ...(omitted)...\\n  \"<user_input>', trace) 


def exec_code(byte_code: CompileResult) -> Output:
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
        '_print_': PrintWrapper,
        '_getattr_': safer_getattr,
        '_write_': full_write_guard,
        '_getiter_': iter,
        '_getitem_': default_guarded_getitem,
        '_iter_unpack_sequence_': guarded_iter_unpack_sequence,
        '_unpack_sequence_': guarded_unpack_sequence
    }

    status = 'success'
    try:
        exec(byte_code.code, custom_globals)
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
    byte_code = compile_code(code)
    
    if (byte_code.errors):
        return Output('\n'.join(byte_code.errors), 'error')
    
    output = exec_code(byte_code)
    return output


def exec_code_in_process(code: str) -> Output:
    with Pool(1) as pool:
        result = pool.apply_async(exec_code_with_output, (code,))
        try:
            return result.get(timeout=2)
        except TimeoutError:
            return Output('Execution timed out (>2s). Maybe you have an infinite loop?', 'timeout')


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
    print(i, num)

a, b, c = my_list
print(a, b, c)
print(tuple([a, b, c]))

set()
dict()

print('asdf' * 100000)


"""

    print(exec_code_in_process(source_code).output)
