import mysql.connector
import pwd

def init_db():
    return mysql.connector.connect(user='admin', password='tAirftr1!!',
                                 host='taskrabbit.c9f5nnvukk3u.us-east-2.rds.amazonaws.com',
                                 database='main')

# TODO: make password a secret
def get_all_users():
    db = mysql.connector.connect(user='admin', password='tAirftr1!!',
                                 host='taskrabbit.c9f5nnvukk3u.us-east-2.rds.amazonaws.com',
                                 database='main')

    # TODO: use try, except, finally when accessing the database
    cursor = db.cursor()
    query = "SELECT * from users"
    cursor.execute(query)

    for (user_id, first_name, last_name, email) in cursor:
        print(user_id, first_name, last_name, email)

    cursor.close()
    db.close()
    return cursor

def get_all_folder():
    db = mysql.connector.connect(user='admin', password='tAirftr1!!',
                                 host='taskrabbit.c9f5nnvukk3u.us-east-2.rds.amazonaws.com',
                                 database='main')

    # TODO: use try, except, finally when accessing the database
    cursor = db.cursor()
    query = "SELECT * from folders"
    cursor.execute(query)

    for (folder_id, name) in cursor:
        print(folder_id, name)

    cursor.close()
    db.close()
    return cursor

def write_folder(user_id, name, color):
    db = mysql.connector.connect(user='admin', password='tAirftr1!!',
                                 host='taskrabbit.c9f5nnvukk3u.us-east-2.rds.amazonaws.com',
                                 database='main')

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
        db.close()
        return (0, written_folder_id)
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        return -1
    

if __name__ == "__main__":
    db = init_db()
    write_folder(1, "test", "red")
    db.close()