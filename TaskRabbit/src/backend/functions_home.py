from db_connections import *

def create_folder(user_id, color, name):
    # write to database
    write_folder(user_id, color, name)
    print('folder created')

# main
if __name__ == "__main__":
    create_folder(8, "red", "test")