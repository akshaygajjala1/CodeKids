from flask import Flask, request, Response
from flask_socketio import SocketIO, ConnectionRefusedError

from sandbox import *


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')


@app.route('/')
def index():
    return 'Hello, World!'


@app.route('/sandbox', methods=['POST'])
def sandbox():
    code = request.json.get('code', '')
    return exec_code_in_process(exec_code_with_output, code)._asdict()


@app.route('/sandbox/<problem_id>', methods=['POST'])
def test_problem(problem_id):
    code = request.json.get('code', '')
    return exec_problem(code, problem_id)


@app.route('/problem/<problem_id>', methods=['POST'])
def problem(problem_id):
    code = request.json.get('code', '')
    return run_multi_tests(code, problem_id)


@app.route('/_send_event', methods=['POST'])
def send_event():
    json = request.get_json()
    sid = request.args.get('sid')
    event = request.args.get('event')
    socketio.emit(event, json, to=sid)
    return Response(status=200)


@socketio.on('connect')
def connect(auth):
    if not auth.get('code'):
        raise ConnectionRefusedError('Invalid parameters.')
    try:
        exec_code_with_dynamic_input_in_process(auth.get('code'), request.sid)
        return True
    except Exception as exc:
        print(exc)
        raise ConnectionRefusedError('An unexpected error occured.')


@socketio.on('input')
def input_data(data):
    send_input(request.sid, data)


@socketio.on('disconnect')
def disconnect_ev():
    end_process(request.sid)


if __name__ == '__main__':
    socketio.run(app, host='localhost', use_reloader=True)