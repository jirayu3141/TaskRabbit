CREATE TABLE lists
(
    list_id   int AUTO_INCREMENT
        PRIMARY KEY,
    list_name text NULL,
    folder_id int  NULL
);

CREATE INDEX lists_user_folder_folder_id_fk
    ON lists (folder_id);

