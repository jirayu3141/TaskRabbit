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
            const data = await response.json(); //get status from data
            this.updatedAt = data.updatedAt;

            console.log(data);
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
            console.log("task '%s' is sent\n", this.newTaskName);
            this.tasks.push({name: this.newTaskName, is_completed: false, tag: this.newTaskTag, deadline: this.newTaskDeadline});
            
            
            //TODO: call backend to send in new task to database
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

            //TODO: check status <int> (0 : success, 1 - already exist, -1 fail)


            newfolderid = data.folderId;
            console.log("new folder id is: ", newfolderid);


            //set back to empty text field
            this.newTaskName = ''; 
            this.newTaskTag = ''; 
            this.newTaskDeadline = ''; 

         }, 
        async deleteTask(task) {
            //delete a specific task from the list
            this.tasks = this.tasks.filter((t) => t !== task);

            //TODO: backend delete from db
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
                tmpTaskName = e.taskName;
                tmpTaskIsCompleted = e.taskIsCompleted;
                tmpTaskTag = e.taskTag;
                tmpTaskDeadline = e.taskDeadline;
                //push tasks to array
                this.tasks.push({name: tmpTaskName, is_completed: tmpTaskIsCompleted, tag_id: tmpTaskTag, deadline: tmpTaskDeadline});
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
