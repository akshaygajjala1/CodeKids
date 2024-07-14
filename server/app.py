from flask import Flask, request

from sandbox import exec_code_in_process


app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello, World!'


@app.route('/sandbox', methods=['POST'])
def sandbox():
    code = request.json.get('code', '')
    return exec_code_in_process(code)._asdict()
