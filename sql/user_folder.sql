CREATE TABLE user_folder
(
    user_id   int NOT NULL,
    folder_id int NOT NULL,
    PRIMARY KEY (folder_id, user_id)
);

CREATE INDEX user_folder_users_user_id_fk
    ON user_folder (user_id);

