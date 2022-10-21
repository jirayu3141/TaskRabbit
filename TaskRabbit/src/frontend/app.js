const app = Vue.createApp({
    //data, function
    data() {
        return {
            showThings: true,
            title: 'groceries',
            number: 23,
            one: 'apples',
            two: 'milk',

            books: [
                {name: 'book', price: '$1.23'},
                {name: 'plushy', price: '$2.23'},
                {name: 'yo yo', price: '$0.23'},
            ],

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
        changeTitle(aa) {
            console.log("you clicked me!!");
            //to update variables, you need to ref this
            this.title= aa
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
         }
    
    },
})
app.mount('#app')

console.log("hello")