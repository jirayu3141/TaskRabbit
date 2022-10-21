/** '  python3 server.py  ' in terminal will start server  */

const app = Vue.createApp({
    //data, function

    
    data() {
        return {
            showThings: true,
            title: 'TaskRabbit',

            tasks: [
                {name: 'water', is_completed: true, tag: 'important', deadline: null},
                {name: 'chicken', is_completed: false, tag: null, deadline: '12/2'},
                {name: 'salt', is_completed: false, tag: 'important', deadline: '12/2'},

            ],

            newTask: '',
        }
    },
    methods:{
        goHome() {
            console.log("lets go to the home page!!");
            //TODO: redirect user to home page
        },
        toggleShowThings() {
            console.log("want to see a magic trick?");
            this.showThings = !this.showThings;
        },
        handleEvent(e, data) {
            //can take in undefined args ex. data
            console.log("event", e, e.type);
            if (data) {
                console.log(data);
            }
        },
        addTask() {
            //allows user to add another task to their list
            console.log("task '%s' is sent\n", this.newTask);
            this.tasks.push({name: this.newTask, is_completed: false, tag_id: null, deadline: null});
            this.newTask = ''; //set back to empty text field
            
            //TODO: call backend to send in new task to database
         }, 
        async goHome() {
            //test code to see if i can grab data from json
            console.log("going home");
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Vue POST Request Example" })
              };
              const response = await fetch("http://127.0.0.1:5000/home", requestOptions);
              const data = await response.json();
              this.postId = data.id;
              console.log(data);
              console.log(data.firstName);



          },
        async getTasks() {
            console.log("getting all tasks in this list");
            const requestOptions = 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Vue POST Request Example" })
            };

            const response = await fetch("http://127.0.0.1:5000/list", requestOptions);
            const data = await response.json();
            this.postId = data.id;
            console.log(data); //data object from 

            console.log(data.tasks[0].taskName);

            for (const e of data.tasks) 
            { //iterate over all tasks and push to 'task' array
                tmpTaskName = e.taskName;
                tmpTaskIsCompleted = e.taskIsCompleted;
                tmpTaskTag = e.taskTag;
                tmpTaskDeadline = e.taskDeadline;
                //push tasks to array
                this.tasks.push({name: tmpTaskName, is_completed: tmpTaskIsCompleted, tag_id: tmpTaskTag, deadline: tmpTaskDeadline});
            }

          }
    
    },


})
app.mount('#app')

console.log("hello")