import { createApp } from 'vue'

console.log('hello, vue');
createApp({
    data(){
        return{
            title: 'The Final Empire'
        }
    }
  
}).mount('#app')