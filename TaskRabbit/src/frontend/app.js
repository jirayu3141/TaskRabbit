/** '  python3 server.py  ' in terminal will start server  */
//pip install mysql-connector-python
//pip install -U flask-cors
//pip install Flask-SQLAlchemy



const app = Vue.createApp({
    //TODO: ckeck w backend on tag and deadline parsing
    //TODO: edit and delete tasks
    //TODO: make funtioning web
    //TODO: navigaiton
    //TODO: seperate functions into dif files
    data() {
        return {
            showTasks: false,
            title: 'TaskRabbit',

            /*HOME */
            newFolderName: '',
            newFolderColor: '',
            folders: [],

            /*FOLDER */
            newListName: '',
            lists: [],

            /*TASKS */
            hideCompleted: false,
            taskId: 1,
            newTaskName: '',
            newTaskTag: '',
            newTaskDeadline: '',
            tasks: [],
        }
    },
    computed: {
        //filter the todo list to either show completed tasks or not
        filteredTasks() {
          return this.hideCompleted
            ? this.tasks.filter((t) => !t.is_completed)
            : this.tasks
        },


    },
    methods:{
        goHome() {
            console.log("lets go to the home page!!");
            //TODO: redirect user to home page
        },

         /*FOLDERS */
        toggleShowFolders() {
            console.log("show me my folders");
           
            if (!this.showFolders) {
                this.getFolders();
            }
            else {
                this.folders.splice(0);
            }
            this.showFolders = !this.showFolders;

        }, 
        async getFolders() {
            console.log("getting all folders from this user");
            const requestOptions = 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                })
            };

            const response = await fetch("http://127.0.0.1:5000/home", requestOptions);
            const data = await response.json();
            this.postId = data.id;
            console.log(data); //data object from 

            for (const e of data.folders) 
            { //iterate over all tasks and push to 'task' array
                tmpFolderId = e.folderId;
                tmpFolderName = e.folderName;
                tmpFolderColor = e.folderColor;
                //push tasks to array
                this.folders.push({id: tmpFolderId, name: tmpFolderName, color: tmpFolderColor});
            }

        },
        async addFolder() {
            var tmpFolderStatus;
            var tmpFolderId;

            console.log("trying to add a folder");
            //connect to backend 
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: 0,
                    folderName: this.newFolderName, 
                    folderColor: this.newFolderColor
                })
            };
            const response = await fetch("http://127.0.0.1:5000/createFolder", requestOptions);
            const data = await response.json();
            this.updatedAt = data.updatedAt;

            console.log("create folder status", data);
            tmpFolderStatus = data.status;
            tmpFolderId = data.folderId;

            //check status if folder is created: Status”: <int> (0 : success, 1 - already exist, -1 fail)
            if (tmpFolderStatus == -1) 
            { //error
                alert('error');
            }
            else if (tmpFolderStatus == 1)
            { //already exists
                alert('Folder ' + this.newFolderName + ' already exists!');
            }
            else
            { //success 0
                console.log("folder '%s' is created\n", this.newFolderName);
                this.folders.push({id: tmpFolderId, name: this.newFolderName, color: this.newFolderColor});
            }

            
            //set back to empty text field
            this.newFolderName = ''; 
            this.newFolderColor = ''; 

        }, 
        async deleteFolder(folder) {
            //delete a specific folder 
            //TODO : uer with right click can delete with menue
            this.folders = this.folders.filter((f) => f !== folder);

            //TODO: backend delete from db
        },

         /*LISTS */

        toggleShowLists() {
            console.log("show me my lists");
           
            if (!this.showLists) {
                this.getLists();
            }
            else {
                this.lists.splice(0);
            }
            this.showLists = !this.showLists;

        }, 
        async getLists() {
            console.log("getting all lists from this user");
            const requestOptions = 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: 0
                })
            };

            const response = await fetch("http://127.0.0.1:5000/home", requestOptions);
            const data = await response.json();
            this.postId = data.id;
            console.log(data); //data object from 

            for (const e of data.folders) 
            { //iterate over all tasks and push to 'task' array
                tmpListId = e.listId;
                tmpListName = e.listName;
            
                //push tasks to array
                this.folders.push({id: tmpListId, name: tmpListName});
            }

        },

        async addList() {
            //allows user to add another task to their list
            console.log("list '%s' is created\n", this.newListName);
            this.lists.push({name: this.newListName});
            
    
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: 0,
                    listName: this.newListName, 
                })
            };
            const response = await fetch("http://127.0.0.1:5000/createList", requestOptions);
            const data = await response.json();
            this.updatedAt = data.updatedAt;


            //set back to empty text field
            this.newListName = '';

         }, 

         async deleteList(list) {
            //delete a specific list 
            this.lists = this.lists.filter((l) => l !== list);

            //TODO: backend delete from db
        },

        /*TASKS */
        toggleShowTasks() {
            console.log("show me my tasks");
            //don't grab task from backend twice
            if (!this.showTasks) {
                this.getTasks();
            }
            else {
                //remove all data from local task array
                this.tasks.splice(0);
            }
            this.showTasks = !this.showTasks;

        }, 
        async addTask() {
            //allows user to add another task to their list
            var tmpTaskId;
            var tmpTaskStatus;
            
            //call backend to send in new task to database
            // PUT request using fetch with async/await
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: 0,
                    taskName: this.newTaskName, 
                    taskTag: this.newTaskTag, 
                    taskDeadline: this.newTaskDeadline
                })
            };
            const response = await fetch("http://127.0.0.1:5000/createTask", requestOptions);
            const data = await response.json();
            this.updatedAt = data.updatedAt;
            console.log("create task status", data);

            //TODO: check status <int> (0 : success, 1 fail)
            tmpTaskId = data.taskId;
            tmpTaskStatus = data.status;

            if (tmpTaskStatus == 1)
            { //fail
                alert("error creating task!");
            }
            else
            { //success -> add task to local
                console.log("task '%s' (%d) is sent\n", this.newTaskName, tmpTaskId);
                this.tasks.push({id: tmpTaskId, name: this.newTaskName, is_completed: false, tag: this.newTaskTag, deadline: this.newTaskDeadline});
            
            }

            //set back to empty text field
            this.newTaskName = ''; 
            this.newTaskTag = ''; 
            this.newTaskDeadline = ''; 

        }, 
        async deleteTask(task) {
            //delete a specific task from the list
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: 0, //TODO: get list number
                    taskId: task.id,
                    action: 'delete'
                    
                })
            };
            const response = await fetch("http://127.0.0.1:5000/editTask", requestOptions);
            const data = await response.json();
            this.updatedAt = data.updatedAt;
            console.log("delete task status", data);
            tmpDeleteStatus = data.status;

            //check delete status
            if (tmpDeleteStatus == 1)
            { //fail
                alert("error deleting task!");
            }
            else
            { //success -> delete task from local
                console.log("deleting task: %s (%d)", task.name, task.id);
                this.tasks = this.tasks.filter((t) => t !== task);
            }
        
        },
        async editTask(task) {
            console.log("changing competion of task " + task.name + task.id + "to" + task.is_completed);
            //change the is_completed variable in this specific task in the backend
            //check whether the task is changed to complete or incomplete
            var taskAction;
            if (task.is_completed)
            { //task completed
                taskAction = "complete"
            }
            else
            { //task turned incomplete
                taskAction = "uncomplete"
            }

            //request backend
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: 0, //TODO: get list number
                    taskId: task.id,
                    action: taskAction
                    
                })
            };
            const response = await fetch("http://127.0.0.1:5000/editTask", requestOptions);
            const data = await response.json();
            this.updatedAt = data.updatedAt;
            console.log("changeing task status", data);
            tmpEditStatus = data.status;

            //check delete status
            if (tmpEditStatus == 1)
            { //fail
                alert("error editing task!");
            }
            else
            { //success -> delete task from local
                console.log("editing task: %s (%d)", task.name, task.id);
            }

        },
        async getTasks() {
            console.log("getting all tasks in this list");
            const requestOptions = 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: 0
                })
            };

            const response = await fetch("http://127.0.0.1:5000/list", requestOptions);
            const data = await response.json();
            this.postId = data.id;
            console.log(data); //data object from 

            for (const e of data.tasks) 
            { //iterate over all tasks and push to 'task' array
                tmpTaskId= e.taskId;
                tmpTaskName = e.taskName;
                tmpTaskIsCompleted = e.taskIsCompleted;
                tmpTaskTag = e.taskTag;
                tmpTaskDeadline = e.taskDeadline;
                //push tasks to array
                    this.tasks.push({id: tmpTaskId, name: tmpTaskName, is_completed: tmpTaskIsCompleted, tag_id: tmpTaskTag, deadline: tmpTaskDeadline});
            }



          }, 
    
    }, 
    mounted() {
        //immediatly get the folders from home
        this.getFolders();
      },


})
app.mount('#app')

console.log("hello")