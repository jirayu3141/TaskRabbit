from distutils.log import debug
from json import dumps
from multiprocessing.sharedctypes import Value
from flask import Flask, request
from db_connections import *
from werkzeug.exceptions import HTTPException
from error_handling import InvalidAPIUsage

app = Flask(__name__)


@app.errorhandler(InvalidAPIUsage)
def invalid_api_usage(e):
    return dumps(e.to_dict()), e.status_code

# app.register_error_handler(HTTPException, defaultHandler)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test")
def test():
    return "<p>Test</p>"


@app.route("/createFolder", methods=['POST'])
def create_folder():
    content = request.json
    user_id = content['userId']
    color = content['folderColor']
    name = content['folderName']

    # check user id must be integer
    if not user_id or not isinstance(user_id, int):
        raise InvalidAPIUsage("Invalid userId")

    (status, folder_id) = write_folder(user_id, name, color)
    return dumps({
        'status': status,
        'folder_id': folder_id,
    })



if __name__ == "__main__":
    app.run(debug=True)
