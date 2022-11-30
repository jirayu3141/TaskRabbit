CREATE TABLE tasks
(
    task_id      int AUTO_INCREMENT
        PRIMARY KEY,
    description  text       NULL,
    is_completed tinyint(1) NULL,
    tag_id       int        NULL,
    deadline     text       NULL,
    list_id      int        NULL
);

CREATE INDEX tasks_lists_list_id_fk
    ON tasks (list_id);

CREATE INDEX tasks_tags_tag_id_fk
    ON tasks (tag_id);

