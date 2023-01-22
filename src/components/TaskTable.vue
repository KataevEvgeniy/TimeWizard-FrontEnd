<template>
    
	<div @submit.prevent class="tasks">
        <div  :id="post.id" class="task_exam" v-for="post in posts" :key="post" >
            <div class="name">> {{post.title}} </div>
            
            <div class="definition">> {{post.definition}}</div>
            <div class="date">> {{new Date(post.startDate)}} - {{new Date(post.endDate)}}</div>
            <span v-if="post.completed == null"> 
                <button @click="taskTemplate.completed = true; updateTask(post)">Выполнено</button>
                <button @click="taskTemplate.completed = false; updateTask(post)">Провалено</button>
            </span>
        </div>
        <span class="create_form_box">
            <form @submit.prevent class="task_form" >
                    <textarea 
                        oninput="this.style.height = (this.scrollHeight - 4) + 'px';" 
                        :value="taskTemplate.title" 
                        placeholder="Название" 
                        @input="taskTemplate.title = $event.target.value"  
                        maxlength="200"
                        class="name_input"></textarea><br>
                    
                    <textarea 
                        oninput="this.style.height = (this.scrollHeight - 4) + 'px';" 
                        :value="taskTemplate.definition" 
                        placeholder="Описание" 
                        @input="taskTemplate.definition = $event.target.value" 
                        maxlength="500" 
                        class="definition_input"></textarea><br>
                    <span style="margin-left: 10px">
                        <input :value="taskTemplate.startDate.date" @input="taskTemplate.startDate.date = $event.target.value"  type="date"/>
                        <input :value="taskTemplate.startDate.time" @input="taskTemplate.startDate.time = $event.target.value"  type="time" >
                        &#8212;
                        <input :value="taskTemplate.endDate.date" @input="taskTemplate.endDate.date = $event.target.value" style="margin-left: 10px" type="date"/>
                        <input :value="taskTemplate.endDate.time" @input="taskTemplate.endDate.time = $event.target.value" type="time" >
                    </span>
                    
            </form>
            <button class="create_button" @click="createTask"></button>
        </span>
        <button @click="getStartTime"></button>
    </div>
</template>

<script>
    //import { useStore } from './store'
    import axios from 'axios'
    import { mapGetters } from 'vuex';

	export default{
        
		data() {
            return {
                posts: [],
                
                
                
                taskTemplate:{
                    title: '',
                    definition: '',
                    startDate:this.getCurrentDate(0),
                    endDate:this.getCurrentDate(1),
                    completed: null,

                    rollBack(){
                        this.title = '';
                        this.definition = '';
                        this.startDate = this.getCurrentDate(0),
                        this.endDate = this.getCurrentDate(1),
                        this.completed = null;
                    }
                },
                
            }
        },
        mounted() {
            this.displayTasks(this.$store.getters.selectedDay.date.getTime());
        },
        computed: {
            ...mapGetters(['selectedDay']),
            ...mapGetters(['taskTableArray']),
            
        },
        watch: {
            selectedDay() {
                this.displayTasks(this.$store.getters.selectedDay.date.getTime());
            },
            taskTableArray(){
                this.displayTasks(this.$store.getters.selectedDay.date.getTime());
            },
            
            
        },
        methods: {
            async createTask(){
                const newTask = {
                    title: this.taskTemplate.title,
                    definition: this.taskTemplate.definition,
                    startDate:  new Date(this.taskTemplate.startDate.date + " " + this.taskTemplate.startDate.time),
                    endDate: new Date(this.taskTemplate.endDate.date + " " + this.taskTemplate.endDate.time),
                    date: this.$store.getters.selectedDay.date,
                    completed: null,
                }
                
                await this.createTaskOnServer(newTask);
                this.taskTemplate.rollBack();
                this.$store.dispatch('getAllTasks');
                
            },
            async createTaskOnServer(data){
                await axios.post("http://localhost:8081/taskScheduler/saveTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                });
            },
            getCurrentDate(appendedHour){
                let curDate = new Date();
                curDate.setHours(curDate.getHours() + appendedHour);
                return {
                    date:curDate.getFullYear() + "-" + (curDate.getMonth() + 1).toString().padStart(2, "0") + "-" + curDate.getDate().toString().padStart(2, "0"),
                    time:curDate.getHours().toString().padStart(2, "0") + ":" + curDate.getMinutes().toString().padStart(2, "0")
                };
            },
            displayTasks(date){
                let allTasks = this.$store.getters.taskTableArray;
                let taskInThisDay = [];
                allTasks.forEach((item,index)=>{
                    if(item.date == date)
                        taskInThisDay.push(allTasks[index]);
                })
                this.$store.commit('taskInThisDay',taskInThisDay)
                this.posts = this.$store.getters.taskInThisDay;
            },
            async updateTask(task){
                let tempTask = task
                tempTask.completed = this.taskTemplate.completed;
                await this.updateTaskOnServer(tempTask);
                this.$store.dispatch('getAllTasks')
            },
            async updateTaskOnServer(data){
                await axios.post("http://localhost:8081/taskScheduler/updateTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                    this.taskTemplate.rollBack();
            }
        }
    }
</script>

<style scoped>
    textarea {
        resize: none;
    }
	.task_exam,.create_form_box{
		min-width: 400px;
        margin-top: 15px;
	}
	.task_exam{
		border-radius: 14px;
        
        border: 1px solid;
        border-color: grey;
    }
    .task_exam:hover{
        border-color: red;
        transform: scale(1.05);
    }
	.task_form{
        
        text-align: left;
        width: 90%;
    }
    .tasks{
        display:inline-block;
        width:60%;
        vertical-align:top;
    }
    
    
    .name,.definition,.date{
        margin-left: 5%;
        text-align: left;
        word-wrap: break-word;
    }
    
    .definition,.date{
        font-size: 16px;
    }
    
    .create_form_box{
        display: flex;
        flex-direction: row;
        border-radius: 14px;
        background-color: #474B4F;
    }
    .definition_input,.name_input{
		border: none;
        margin-left: 10px;
        border-radius: 10px;
        margin-top: 2px;
        margin-bottom: 2px;
        color: white;
        background-color: #222629;
        width: 90%;
    }
    .create_button{
        background:
            linear-gradient(#474B4F,#474B4F),
            linear-gradient(#474B4F,#474B4F);
        background-position:center;
        background-size: 50% 3px,3px 50%; 
        background-repeat:no-repeat;
        border: none;
        color: white;
        background-color: #222629;
        width: 10%;
        margin-left: 0;
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
    }
    .create_button:hover{
        outline: 4px solid #474B4F;
        outline-offset: -4px;
        
    }
    input[type="time"],input[type="date"] {
        
        border: none;
        color: #d4d4d4;
        font-size: 14px;
        font-family: helvetica;
        width: 60px;
        height: 18px;
        background-color: rgba(0, 0, 0, 0);
    }
    input[type="time"]::-webkit-datetime-edit-fields-wrapper {
        display: flex;
        
    }
    input[type="time"]::-webkit-datetime-edit-text {
        padding: 19px 4px;
    }
    input[type="time"]::-webkit-datetime-edit-hour-field {
        /* background-color: #f2f4f5; */
        border-radius: 15%;
        padding: 19px 5px;
    }
    input[type="time"]::-webkit-datetime-edit-minute-field {
        /* background-color: #f2f4f5; */
        border-radius: 15%;
        padding: 19px 5px;
    }
    input[type="time"]::-webkit-datetime-edit-ampm-field {
        display: none;
    }
    input[type="time"]::-webkit-clear-button {
        display: none;
    }
    input[type="time"]::-webkit-inner-spin-button {
        display: none;
    }
    input[type="time"]::-webkit-calendar-picker-indicator {
        display: none;
    }
    input[type="date"]{
        width: 95px;
    }
</style>