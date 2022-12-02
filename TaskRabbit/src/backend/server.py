from distutils.log import debug
from json import dumps
from multiprocessing.sharedctypes import Value
from flask import Flask, request, jsonify
from db_connections import *
from werkzeug.exceptions import HTTPException
from error_handling import InvalidAPIUsage
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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


@app.route('/home', methods=['POST'])
def home_url():
    content = request.json
    user_id = content['userId']
    (first_name, folders) = get_folders(user_id)
    return jsonify({'firstName': first_name,
                    'folders': folders})

@app.route('/folder', methods=['POST'])
def get_list():
    content = request.json
    user_id = content['userId']
    folder_id = content['folderId']
    lists = get_lists(user_id,folder_id)
    return jsonify({'status': 0,
                    'lists': lists})


@app.route("/listSample", methods=['POST'])
def get_task_sample():
    task_sample = [
        {'taskId': 1, 'taskName': "item1", 'taskDeadline': "2020-12-12",
            'taskTag': "Important", 'taskIsCompleted': True},
        {'taskId': 2, 'taskName': "item2", 'taskDeadline': "2020-12-12",
            'taskTag': "Important", 'taskIsCompleted': True},
        {'taskId': 3, 'taskName': "item3", 'taskDeadline': "2020-12-12", 'taskTag': "Important", 'taskIsCompleted': True}]

    return jsonify({
        'status': 0,
        'tasks': task_sample,
    })


@app.route("/list", methods=['POST'])
def get_task_url():
    content = request.json
    user_id = content['userId']
    list_id = content['listId']

    print(list_id)
    result = get_tasks(user_id, list_id)

    return jsonify({
        'status': 0,
        'tasks': result,
    })


@ app.route("/createTask", methods=['POST'])
def create_task():
    content = request.json
    list_id = content['listId']
    task_name = content['taskName']
    task_deadline = content['taskDeadline']
    task_tag = content['taskTag']

    print('input: ' + str(content))

    (status, task_id) = write_task(list_id, task_name, task_deadline, task_tag)
    return jsonify({
        'status': status,
        'taskId': task_id,
    })


@ app.route("/createFolder", methods=['POST'])
def create_folder():
    content = request.json
    user_id = content['userId']
    color = content['folderColor']
    name = content['folderName']

    # check user id must be integer
    if not user_id or not isinstance(user_id, int):
        raise InvalidAPIUsage("Invalid userId")

    (status, folder_id) = write_folder(user_id, name, color)
    return jsonify({
        'status': status,
        'folder_id': folder_id,
    })


@ app.route("/createList", methods=['POST'])
def create_list():
    content = request.json
    user_id = content['userId']
    folder_id = content['folderId']
    list_name = content['listName']

    # check user id must be integer
    if not user_id or not isinstance(user_id, int):
        raise InvalidAPIUsage("Invalid userId")

    (status, list_id) = write_list(user_id, folder_id, list_name)
    return jsonify({
        'status': status,
        'list_id': list_id,
    })

@ app.route("/editTask", methods=['POST'])
def edit_task_url():
    content = request.json
    user_id = content['userId']
    task_id = content['taskId']
    action = content['action']

    # check user id must be integer
    if not user_id or not isinstance(user_id, int):
        raise InvalidAPIUsage("Invalid userId")

    edit_task(task_id, action)
    return jsonify({
        'status': 0
    })

@ app.route("/deleteList", methods=['POST'])
def delete_list_url():
    content = request.json
    user_id = content['userId']
    list_id = content['listId']

    # check user id must be integer
    if not user_id or not isinstance(user_id, int):
        raise InvalidAPIUsage("Invalid userId")

    delete_list(list_id)
    return jsonify({
        'status': 0
    })

@ app.route("/deleteTask", methods=['POST'])
def delete_task_url():
    content = request.json
    user_id = content['userId']
    task_id = content['taskId']

    # check user id must be integer
    if not user_id or not isinstance(user_id, int):
        raise InvalidAPIUsage("Invalid userId")

    delete_task(task_id)
    return jsonify({
        'status': 0
    })



if __name__ == "__main__":
    app.run(debug=True)