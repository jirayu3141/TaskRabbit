/** '  python3 server.py  ' in terminal will start server  */
//pip install mysql-connector-python
//pip install -U flask-cors
//npm install --save axios vue-axios
const app = Vue.createApp({
    //data, function

    
    data() {
        return {
            showTasks: false,
            title: 'TaskRabbit',

            //var section for creating a new task
            newTask: '',
            newTag:'',
            newDeadline:'',

            tasks: [
                {name: 'water', is_completed: true, tag: 'important', deadline: null},
                {name: 'chicken', is_completed: false, tag: null, deadline: '12/2'},
                {name: 'salt', is_completed: false, tag: 'important', deadline: '12/2'},

            ],
        }
    },
    methods:{
        goHome() {
            console.log("lets go to the home page!!");
            //TODO: redirect user to home page
        },
        toggleShowTasks() {
            console.log("show me my tasks");
            //don't grab task from backend twice
            this.getTasks();
                this.showTasks = !this.showTasks;
        },
        handleEvent(e, data) {
            //can take in undefined args ex. data
            console.log("event", e, e.type);
            if (data) {
                console.log(data);
            }
        },
        async addTask() {
            //allows user to add another task to their list
            console.log("task '%s' is sent\n", this.newTask);
            this.tasks.push({name: this.newTask, is_completed: false, tag: this.newTag, deadline: this.newDeadline});
            
            
            //TODO: call backend to send in new task to database
            // PUT request using fetch with async/await
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 0, //todo: user auth
                    listId: 0,
                    taskName: this.newTask, 
                    taskTag: this.newTag, 
                    taskDeadline: this.newDeadline
                })
            };
            const response = await fetch("http://127.0.0.1:5000/createTask", requestOptions);
            const data = await response.json();
            this.updatedAt = data.updatedAt;


            //set back to empty text field
            this.newTask = ''; 
            this.newTag = ''; 
            this.newDeadline = ''; 

         }, 
        async getTasks() {
            console.log("getting all tasks in this list");
            const requestOptions = 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: 0, //todo: user auth
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


})
app.mount('#app')

console.log("hello")