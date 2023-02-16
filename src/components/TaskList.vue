<template>
    
	<div @submit.prevent class="tasks">
        <div  
        :id="post.id" 
        class="task_exam" 
        :style="{background: getMainGradient(post.colorInHex)}" 
        v-for="post in posts" 
        :key="post"
         >
            <div class="task_body">
                <div class="name">> {{post.title}} </div>
                
                <div class="definition">> {{post.definition}}</div>
                <div>{{ post.timeUnit + " "  + post.frequency }}</div>
                <div class="date">>
                    {{ post.startDate < this.$store.state.selectedDay.startDateTime ? new Date(post.startDate).toDateString().slice(3,10) : "" }} 
                    {{new Date(post.startDate).toTimeString().slice(0,5)}} - 
                    {{ (post.endDate - this.$store.state.selectedDay.startDateTime) > 86400000 ? new Date(post.endDate).toDateString().slice(3,10) : "" }} 
                    {{new Date(post.endDate).toTimeString().slice(0,5)}}
                </div>
            </div>
            <div class="task_menu">
                <span v-if="post.completed == null" class="menu_button"> 
                    <button @click="taskTemplate.completed = true; updateTask(post) " >Выполнено</button>
                    <button @click="taskTemplate.completed = false; updateTask(post)" >Провалено</button>
                    
                </span>
                <button @click="deleteTaskOnServer(post)" class="menu_button">Удалить</button>
            </div>
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
                    <input :value="taskTemplate.colorInHex" @input="taskTemplate.colorInHex = $event.target.value" type="color"/>
                    <input v-show="taskTemplate.timeUnit != 'never'" min=1 :value="taskTemplate.frequency" @input="taskTemplate.frequency = $event.target.value" type="number"/>
                    <select :value="taskTemplate.timeUnit" @input="taskTemplate.timeUnit = $event.target.value">
                        <option value="never">never</option>
                        <option value="day">day</option>
                        <option value="week">week</option>
                        <option value="month">month</option>
                        <option value="year">year</option>
                    </select><br>
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
        <button @click="this.$store.dispatch('showMessage',{messageText:'hell',color:'red'})">click</button>  
        
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
                color1:'#0076D1',
                
                
                taskTemplate:{
                    title: '',
                    definition: '',
                    startDate:this.getCurrentDate(0),
                    endDate:this.getCurrentDate(1),
                    completed: null,
                    colorInHex: "#FFFFFF",
                    frequency:1,
                    timeUnit:"never",
                    
                    
                    rollBack(){
                        this.title = '';
                        this.definition = '';
                        this.completed = null;
                        this.frequency = 1;
                        this.timeUnit = "never";
                        
                    }
                },
                
            }
        },
        mounted() {
            this.defineTasksOfDay(this.$store.getters.selectedDay);
        },
        computed: {
            ...mapGetters(['selectedDay']),
            ...mapGetters(['taskList']),
            
        },
        watch: {
            selectedDay() {
                this.defineTasksOfDay(this.$store.getters.selectedDay);
            },
            taskList(){
                this.defineTasksOfDay(this.$store.getters.selectedDay);
            },
            
            
        },
        methods: {
            async createTask(){
                const newTask = {
                    title: this.taskTemplate.title,
                    definition: this.taskTemplate.definition,
                    startDate:  new Date(this.taskTemplate.startDate.date + " " + this.taskTemplate.startDate.time),
                    endDate: new Date(this.taskTemplate.endDate.date + " " + this.taskTemplate.endDate.time),
                    completed: null,
                    colorInHex: this.taskTemplate.colorInHex,
                    frequency: this.taskTemplate.frequency,
                    timeUnit: this.taskTemplate.timeUnit,
                }
                if(newTask.startDate > newTask.endDate){
                    this.$store.dispatch('showMessage',{messageText:'Task cannot end before it starts',color:'red'})
                    return;
                }
                
                await this.createTaskOnServer(newTask);
                
                
            },
            getMainGradient(color) {
                return `linear-gradient(114deg, #222629 60%, ${color} 95%)`;
            },
            async createTaskOnServer(data){
                await axios.post("http://localhost:8081/taskScheduler/saveCalendarTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        this.taskTemplate.rollBack();
                        this.$store.dispatch('getAllTasks');
                        console.log(response);//TODO delete this
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
            defineTasksOfDay(selectedDate){
                let singlyTasks = this.$store.getters.taskList.singly;
                let dailyTasks = this.$store.getters.taskList.daily;
                let weeklyTasks = this.$store.getters.taskList.weekly;
                let monthlyTasks = this.$store.getters.taskList.monthly;
                let yearlyTasks = this.$store.getters.taskList.yearly;
                
                let taskInThisDay = [];
                singlyTasks.forEach((item)=>{
                    if(roundDate(item.startDate) <= selectedDate.startDateTime.getTime() && selectedDate.startDateTime.getTime() <= roundDate(item.endDate) )
                        taskInThisDay.push(item);
                });
                dailyTasks.forEach((item)=>{
                    let dayInMillis = 86400000;
                    let deltaDays = Math.round((selectedDate.startDateTime.getTime() - item.startDate)/dayInMillis) + 1 ;
                    if((deltaDays % item.frequency == 0 || deltaDays == 0)  && deltaDays >= 0){
                        let cloneItem = {...item}
                        cloneItem.startDate += dayInMillis * deltaDays;
                        cloneItem.endDate += dayInMillis * deltaDays;
                        taskInThisDay.push(cloneItem);
                    }
                });
                weeklyTasks.forEach((item)=>{
                    let weekInMillis = 604800000;
                    let deltaWeeks = Math.round((selectedDate.endDateTime.getTime() - item.startDate)/weekInMillis) ;
                    if(selectedDate.startDateTime.getDay() == new Date(item.startDate).getDay() && deltaWeeks >= 0 && deltaWeeks % item.frequency == 0){
                        let cloneItem = {...item}
                        cloneItem.startDate += weekInMillis * deltaWeeks;
                        cloneItem.endDate += weekInMillis * deltaWeeks;
                        taskInThisDay.push(cloneItem);
                    }
                });
                monthlyTasks.forEach((item)=>{
                    let localSelectedDate = selectedDate.endDateTime;
                    let localStartDate = new Date(item.startDate)
                    let deltaMonthInMonth = (localSelectedDate.getFullYear()-localStartDate.getFullYear())*12 + (localSelectedDate.getMonth() - localStartDate.getMonth());
                    if(selectedDate.startDateTime.getDate() == new Date(item.startDate).getDate() && deltaMonthInMonth >= 0 && deltaMonthInMonth % item.frequency == 0){
                        let cloneItem = {...item}
                        cloneItem.startDate = new Date(cloneItem.startDate).setMonth(new Date(cloneItem.startDate).getMonth() + deltaMonthInMonth);
                        cloneItem.endDate = new Date(cloneItem.endDate).setMonth(new Date(cloneItem.endDate).getMonth() + deltaMonthInMonth);
                        taskInThisDay.push(cloneItem);
                    }
                });
                yearlyTasks.forEach((item)=>{
                    let localSelectedDate = selectedDate.startDateTime;
                    let localStartDate = new Date(item.startDate);
                    let deltaYears = localSelectedDate.getFullYear()-localStartDate.getFullYear();
                    if(localSelectedDate.getDate() == localStartDate.getDate() && localSelectedDate.getMonth() == localStartDate.getMonth() && deltaYears >= 0 && deltaYears % item.frequency == 0){
                        let cloneItem = {...item}
                        cloneItem.startDate = new Date(cloneItem.startDate).setFullYear(new Date(cloneItem.startDate).getFullYear() + deltaYears);
                        cloneItem.endDate = new Date(cloneItem.endDate).setFullYear(new Date(cloneItem.endDate).getFullYear() + deltaYears);
                        taskInThisDay.push(cloneItem);
                    }
                });
                taskInThisDay.sort((a,b)=>(a.startDate - b.startDate));
                this.$store.commit('taskInThisDay',taskInThisDay);
                this.posts = this.$store.getters.taskInThisDay;

                function roundDate(dateInMillis){
                    let d = new Date(dateInMillis);
                    return new Date(d.getFullYear(),d.getMonth(),d.getDate())
                }
            },
            async updateTask(task){
                let tempTask = task
                tempTask.completed = this.taskTemplate.completed;
                await this.updateTaskOnServer(tempTask);
                
                
            },
            async updateTaskOnServer(data){
                await axios.post("http://localhost:8081/taskScheduler/updateTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.taskTemplate.rollBack();
                this.$store.dispatch('getAllTasks')
            },
            
            deleteTask(task){
                let tempTask = task;
                tempTask.completed = this.taskTemplate.completed;
                this.deleteTaskOnServer(tempTask);
            },
            async deleteTaskOnServer(data){
                await axios.post("http://localhost:8081/taskScheduler/deleteTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.taskTemplate.rollBack();
                this.$store.dispatch('getAllTasks');
            },
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
        user-select: contain;
        border: 1px solid;
        border-color: grey;
        display: flex;
        flex-direction: row;
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
    .task_body{
        
        width: 85%;
    }
    .task_menu{
        width: 15%;
    }
    .menu_button{
        
        
        
        
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
    input[type="color"]{
        width: 30px;
        height: 30px;
        border: none;
        background-color: rgba(0, 0, 0, 0);
        margin-left: 10px;
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