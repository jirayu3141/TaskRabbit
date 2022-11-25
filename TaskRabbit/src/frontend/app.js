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
            showFolders: true,
            title: 'TaskRabbit',

            /*HOME */
            currentFolderId: '',
            newFolderName: '',
            newFolderColor: '',
            folders: [],

            /*FOLDER */
            currentListId: '',
            newListName: '',
            lists: [],

            
            /*TASKS */
            currentTaskId: '',
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
        async testGlobals(){
            console.log("getting global from list!");
            for (const e of this.lists) 
            {
                console.log("listname: %s ", e.name);
            }
        },
        goHome() {
            //redirect user to home page
            console.log("lets go to the home page!!");
            this.showFolders = true;
            this.showTasks = false;
            //
            this.lists.splice(0);
            this.tasks.splice(0);
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
        displayFolderColor(folderC, colorNum) {
            //returns whether that color matches with the folder's color
            //console.log("COLOR CHECK!!");
            var fcolor = parseInt(folderC.color); //this folder's color           

            if (fcolor == colorNum)
            {
                //console.log("true");
                return true;
            }
            
            //console.log("false");
            return false;

        },
        async addFolder() {
            var tmpFolderStatus;
            var tmpFolderId;

            //TODO: check against empty name and color
            if (this.newFolderColor == '')
            {
                this.newFolderColor = '1';
            }

            console.log("trying to add a folder %s", this.newFolderName);
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
            tmpFolderId = data.folder_id;
            console.log(tmpFolderStatus, tmpFolderId);

            //check status if folder is created: Status”: <int> (0 : success, 1 - already exist, -1 fail)
            if (tmpFolderStatus == -1) 
            { //error
                alert('error');
            }
            else if (tmpFolderStatus == 1)
            { //already exists
                alert('Folder ' + this.newFolderName + ' already exists!');
            }
            else if (tmpFolderStatus == 0 && tmpFolderId != null)
            { //success 0
                console.log("folder '%s' (%d) is created\n", this.newFolderName, tmpFolderId);
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

        toggleShowLists(cFolder) {
            console.log("show me my tasks");
            //don't grab task from backend twice
            if (!this.showLists) {
                this.getLists(cFolder);
                this.showLists = !this.showLists;
            }
            else {
                //remove all data from local task array
                this.lists.splice(0);
            }
            this.showLists = !this.showLists;

        }, 
        async getLists(cFolder) {
            //hide folders to show lists
            this.showFolders = false;
            this.currentFolderId = cFolder.id;
            console.log("THIS IS THE CURRENT FOLDERID %d", this.currentFolderId);
            //TODO : set folderID to currentFolderId

            console.log("getting all lists from this user");
            const requestOptions = 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    folderId: cFolder.id
                })
            };

            const response = await fetch("http://127.0.0.1:5000/folder", requestOptions);
            const data = await response.json();
            this.postId = data.id;
            console.log(data); //data object from 

            for (const e of data.lists) 
            { //iterate over all tasks and push to 'task' array
                tmpListId = e.listId;
                tmpListName = e.listName;
            
                //push tasks to array
                this.lists.push({id: tmpListId, name: tmpListName});
            }

        },

        async addList() {
            //allows user to add another task to their lisr            
    
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    folderId: this.currentFolderId,
                    listName: this.newListName, 
                })
            };
            const response = await fetch("http://127.0.0.1:5000/createList", requestOptions);
            const data = await response.json();
            this.updatedAt = data.updatedAt;

            tmpListStatus = data.status;
            tmpListId = data.list_id;
            console.log(tmpListStatus, tmpListId);

            //check status if folder is created: Status”: <int> (0 : success, 1 - already exist, -1 fail)
            if (tmpListStatus == -1) 
            { //error
                alert('error');
            }
            else if (tmpListStatus == 0 && tmpListId != null)
            { //success 0
                console.log("folder '%s' (%d) is created\n", this.newFolderName, tmpFolderId);
                this.lists.push({id: tmpListId, name: this.newListName});
                
            }
            //set back to empty text field
            this.newListName = '';
            console.log("list '%s' is created\n", this.newListName);


        }, 

         async deleteList(list) {
            //delete a specific list 
            this.lists = this.lists.filter((l) => l !== list);

            //TODO: backend delete from db
        },

        /*TASKS */
        toggleShowTasks(cList) {
            console.log("show me my tasks");
            //don't grab task from backend twice
            if (!this.showTasks) {
                this.getTasks(cList);
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
                    listId: this.currentListId,
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

            console.log(tmpTaskId, tmpTaskStatus);

            if (tmpTaskStatus == 1)
            { //fail
                alert("error creating task!");
            }
            else if (tmpTaskStatus == 0)
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
                    listId: this.currentListId,
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
            else if (tmpDeleteStatus == 0)
            { //success -> delete task from local
                console.log("deleting task: %s (%d)", task.name, task.id);
                this.tasks = this.tasks.filter((t) => t !== task);
            }
        
        },
        async editTask(task) {
            console.log("changing competion of task " + task.name +" ("+ task.id + ") to" + task.is_completed);
            //change the is_completed variable in this specific task in the backend
            //check whether the task is changed to complete or incomplete
            var taskAction;
            if (!task.is_completed)
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
                    listId: this.currentListId,
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
            else if (tmpEditStatus == 0)
            { //success -> delete task from local
                console.log("editing task: %s (%d)", task.name, task.id);
                task.is_completed = !task.is_completed;
            }

        },
        async getTasks(cList) {
            //cList is the current list that these tasks are from
            //this.showTasks = true;
            this.currentListId = cList.id; //get current folder
            console.log("CURRENT LIST ID: %d",this.currentListId)
            const requestOptions = 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 1, //todo: user auth
                    listId: cList.id
                })
            };

            const response = await fetch("http://127.0.0.1:5000/list", requestOptions);
            const data = await response.json();
            this.postId = data.id;
            console.log("getting all task", data); //data object from 

            for (const e of data.tasks) 
            { //iterate over all tasks and push to 'task' array
                tmpTaskId= e.taskId;
                tmpTaskName = e.taskName;
                tmpTaskIsCompleted = e.taskIsCompleted;
                tmpTaskTag = e.taskTag;
                tmpTaskDeadline = e.taskDeadline;
                //push tasks to array
                console.log("task %s (%d)", tmpTaskName, tmpTaskIsCompleted);
                    this.tasks.push({id: tmpTaskId, name: tmpTaskName, is_completed: tmpTaskIsCompleted, tag: tmpTaskTag, deadline: tmpTaskDeadline});
            }

          }, 
    
    }, 
    mounted() {
        //immediatly get the folders from home
        this.getFolders();
        //this.getLists();
      },


})
app.mount('#app')

console.log("hello")