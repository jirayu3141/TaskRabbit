const app = Vue.createApp({
    //data, function

    
    data() {
        return {
            showThings: true,
            title: 'TaskRabbit',

            tasks: [
                {taskid: 0, description: 'water', is_completed: true, tag_id: 0, deadline: null},
                {taskid: 1, description: 'chicken', is_completed: true, tag_id: 1, deadline: null},
                {taskid: 2, description: 'bread', is_completed: false, tag_id: null, deadline: null},
                {taskid: 3, description: 'salt', is_completed: false, tag_id: 2, deadline: null},
                {taskid: 4, description: 'onions', is_completed: false, tag_id: 0, deadline: '12/2'},
            ],

            newTask: ''
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
        onEnter: function() {
            console.log("task '%s' is sent\n", this.newTask);
            this.tasks.push({taskid: 5, description: this.newTask, is_completed: false, tag_id: null, deadline: null});
            this.newTask = ''; //set back to empty text field
            
            //this.tasks.push(ntask);
         }, 
         async created() {
            console.log("going home");
            // Simple POST request with a JSON body using fetch
            
            /*
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: "Vue POST Request Example" })
            };

            //fetch data from db
            fetch("http://127.0.0.1:5000/home", requestOptions)
              .then(response => console.log(response.json()))
              
            //  .then(data => (this.postId = data.id))
              ;
              */
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



          }
    
    },


})
app.mount('#app')

console.log("hello")