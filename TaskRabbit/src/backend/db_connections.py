from asyncio import create_task
import mysql.connector
from mysql.connector import MySQLConnection, Error
from sqlalchemy import create_engine, text
from error_handling import InvalidAPIUsage


db = mysql.connector.connect(user='root', password='tAirftr1!!',
                             host='34.132.172.198',
                             database='main')   


connection_string = 'Attempting connection to DB'

# connect to db using SQL Alchemy
engine = create_engine(
    'mysql+mysqlconnector://root:tAirftr1!!@34.132.172.198:3306/main')



def get_all_users():
    # TODO: use try, except, finally when accessing the database
    print('Attempting connection to DB')
    cursor = db.cursor()
    query = "SELECT * from users"
    cursor.execute(query)

    for (user_id, first_name, last_name, email) in cursor:
        print(user_id, first_name, last_name, email)

    db.commit()
    cursor.close()
    # db.close()
    return cursor


def get_lists(user_id, folder_id):
    cursor = db.cursor()
    try:
        cursor = db.cursor()
        args = [user_id, folder_id]
        cursor.callproc('get_lists', args)
        lists = []
        li = []
        for res in cursor.stored_results():
            li = res.fetchall()
        for (listid,listname) in li:
            dict = {"listId":listid,
            "listName":listname}
            lists.append(dict)
        db.commit()
        cursor.close()
    except Error as e:
        print(e)
    cursor.close()

    return lists


def get_folders(user_id):
    cursor = db.cursor()
    query1 = """SELECT users.first_name, folders.folder_id,folders.name,folders.color
    FROM user_folder
    LEFT JOIN folders ON user_folder.folder_id = folders.folder_id
    LEFT JOIN users ON user_folder.user_id = users.user_id
    WHERE users.user_id = %s"""
    cursor.execute(query1, (user_id,))
    print(cursor.statement)


    first_name = "Peter"

    #print number of rows in the resultset
    print("Total number of rows in folders is: ", cursor.rowcount) 
    json_data = []
    for (_, folder_id, name, color) in cursor:
        json_data.append(
            {'folderId': folder_id, 'folderName': name, 'folderColor': color})

    db.commit()
    cursor.close()
    return (first_name, json_data)


def get_all_folder():
    print('Attempting connection to DB')

    # TODO: use try, except, finally when accessing the database
    cursor = db.cursor()
    query = "SELECT * from folders"
    cursor.execute(query)

    for (folder_id, name) in cursor:
        print(folder_id, name)

    db.commit()
    cursor.close()
    db.close()
    return cursor


def write_folder(user_id, name, color):
    print(connection_string)
    try:
        cursor = db.cursor()
        # insert to folders table
        sql = "INSERT INTO folders (folder_id, name, color) VALUES (%s, %s, %s)"
        val = (0, name, color)
        cursor.execute(sql, val)
        written_folder_id = cursor.lastrowid

        # insert to user_folder table
        print()
        sql = "INSERT INTO user_folder (user_id, folder_id) VALUES (%s, %s)"
        val = (user_id, cursor.lastrowid)
        cursor.execute(sql, val)

        db.commit()
        cursor.close()
        # db.close()
        return (0, written_folder_id)
    except mysql.connector.Error as err:
        raise InvalidAPIUsage(format(err))


def write_list(user_id, folder_id, list_name):
    print('Attempting connection to DB')
    try:
        cursor = db.cursor()
        # insert to folders table
        sql = "INSERT INTO lists (list_id, list_name, folder_id) VALUES (%s, %s, %s)"
        val = (0, list_name, folder_id)
        cursor.execute(sql, val)
        written_list_id = cursor.lastrowid

        db.commit()
        cursor.close()
        # db.close()
        return (0, written_list_id)
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        raise InvalidAPIUsage(format(err))


def write_task(list_id, task_name, deadline, tag=0):
    print(connection_string)
    try:
        cursor = db.cursor()
        # insert to folders table
        sql = "INSERT INTO tasks (task_id, description, is_completed, deadline, list_id, tag_id) VALUES (%s, %s, %s, %s, %s, %s)"
        # check if tag is null
        if tag == 0 or tag == None or tag == '':
            val = (0,  task_name, False, deadline, list_id, 1)
        else:
            val = (0,  task_name, False, deadline, list_id, 2)
        cursor.execute(sql, val)

        print(cursor.statement)

        written_list_id = cursor.lastrowid

        db.commit()
        cursor.close()
        # db.close()
        print("Write task complete")

        # todo: tag to tag_id

        return (0, written_list_id)
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        raise InvalidAPIUsage(format(err))


def get_tasks(user_id, list_id):
    print(connection_string)
    try:
        cursor = db.cursor()

        query = """
        SELECT task_id, tasks.description, is_completed, deadline, tags.description
        From tasks 
        LEFT JOIN tags ON tasks.tag_id = tags.tag_id
        WHERE list_id = %s 
        """
        cursor.execute(query, (list_id,))

        result = cursor.fetchall()
        print(result)

        task = []
        for (task_id, description, is_completed, deadline, tag) in result:
            task.append({'taskId': task_id, 'taskName': description, 'taskIsCompleted': is_completed,
                        'taskDeadline': deadline, 'taskTag': tag})

        print(task)

        db.commit()
        cursor.close()
        # db.close()
        print("query complete")
        return task
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        raise InvalidAPIUsage(format(err))


def edit_task(task_id, action):
    if action not in ['complete', 'uncomplete', 'delete']:
        raise InvalidAPIUsage(
            'Invalid action - must be complete, uncomplete, or delete')
    try:
        print(connection_string)
        # complete task
        if action == 'complete':
            engine.execute(text(
                "UPDATE tasks SET is_completed = TRUE WHERE task_id = :task_id"), task_id=task_id)
            print('Task completed')
        # uncomplete task
        elif action == 'uncomplete':
            engine.execute(text(
                "UPDATE tasks SET is_completed = FALSE WHERE task_id = :task_id"), task_id=task_id)
            print('Task uncompleted')
        # delete task
        elif action == 'delete':
            engine.execute(
                text("DELETE FROM tasks WHERE task_id = :task_id"), task_id=task_id)
            print('Task deleted')
    except Exception as e:
        print(e)
        raise InvalidAPIUsage(format(e))

def delete_folder(folder_id):
    try:
        print(connection_string)
        # delete folder
        engine.execute(
            text("DELETE FROM folders WHERE folder_id = :folder_id"), folder_id=folder_id)
        print('Folder deleted')
    except Exception as e:
        print(e)
        raise InvalidAPIUsage(format(e))

def delete_list(list_id):
    try:
        print(connection_string)
        # delete list
        engine.execute(
            text("DELETE FROM lists WHERE list_id = :list_id"), list_id=list_id)
        print('List deleted')
    except Exception as e:
        print(e)
        raise InvalidAPIUsage(format(e))


def login_user(email, password):
    print(connection_string)
    try:
        cursor = db.cursor()
        query = "SELECT user_id, first_name, last_name FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        print(result)
        if result == None:
            return ('User not found', -1, "", "")
        else:
            user_id = result[0]
            first_name = result[1]
            last_name = result[2]
            return ("Success", user_id, first_name, last_name)
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        raise InvalidAPIUsage(format(err))


def get_all_tag(user_id):
    print(connection_string)
    try:
        cursor = db.cursor()
        query = "SELECT tag_id, description FROM tags"
        cursor.execute(query)
        result = cursor.fetchall()
        print(result)

        tag = []
        for (tag_id, description) in result:
            tag.append(description)

        print(tag)

        db.commit()
        cursor.close()
        # db.close()
        print("query complete")
        return tag
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        raise InvalidAPIUsage(format(err))


if __name__ == "__main__":
    # edit_task(35, 'uncomplete')
    # # write_task(1, "test", "test", 0)
    # print(login_user("test@", "test"))
    print(get_all_tag(1))
    db.close()
