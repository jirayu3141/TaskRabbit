CREATE
    DEFINER = admin@`%` PROCEDURE get_lists(IN user_id int, IN folder_id int)
BEGIN
	SELECT lists.list_id as list_id, lists.list_name
    FROM lists
    LEFT JOIN user_folder
    ON user_folder.folder_id = lists.folder_id
    WHERE user_folder.user_id = user_id AND user_folder.folder_id = folder_id;
END;

