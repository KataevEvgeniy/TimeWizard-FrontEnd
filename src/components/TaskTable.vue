<template>
	<div class="tasks">
        <div class="task_exam" v-for="post in posts" :key="post" >
                <div class="name">> {{post.title}} </div>
                <div class="definition">> {{post.definition}}</div>
                <div class="date">> {{post.startTime}} - {{post.endTime}}</div>
        </div>
        <span class="create_form_box">
            <form @submit.prevent class="task_form" >
                    <textarea 
                        oninput="this.style.height = (this.scrollHeight - 4) + 'px';" 
                        :value="title" 
                        placeholder="Название" 
                        @input="title = $event.target.value"  
                        maxlength="200"
                        class="name_input"></textarea><br>
                    
                    <textarea 
                        oninput="this.style.height = (this.scrollHeight - 4) + 'px';" 
                        :value="definition" 
                        placeholder="Описание" 
                        @input="definition = $event.target.value" 
                        maxlength="500" 
                        class="definition_input"></textarea><br>
                    <span>
                        <input :value="startTime" @input="startTime = $event.target.value" style="margin-left: 10px" type="time" >
                        &#8212;
                        <input :value="endTime" @input="endTime = $event.target.value" type="time" >
                    </span>
            </form>
            <button class="create_button" @click="createPost"></button>
        </span>
    </div>
</template>

<script>
    //import { useStore } from './store'
    import axios from 'axios'


	export default{
        props:{
            taskId: Number,
        },
		data() {
            return {
                posts: this.$store.state.taskTableArray[this.taskId-1],
                id: 0,
                title: '',
                definition: '',
                startTime: "00:00",
                endTime:"00:00",
                color: "red",
                styleObject: {
                    border: '3px solid red',
                    background: "linear-gradient(to right, red 3%, #474B4F 3%)",
                }
            }
        },
        setup(){
            console.log("setup");
        },
        methods: {
            async createPost(){
                const newPost = {
                    title: this.title,
                    definition: this.definition,
                    startTime: this.startTime,
                    endTime: this.endTime,
                }
                await this.saveTask(newPost);
                newPost.id = this.id
                this.posts.push(newPost);
                this.title = "";
                this.definition = "";
                localStorage.setItem("tasks", JSON.stringify(this.$store.state.taskTableArray))
                
                //this.posts = JSON.parse(localStorage.getItem("tasks"));
                
                //useStore.commit("addTable",{id:this.taskId, postArray:this.posts});
            },
            async saveTask(data){
                await axios.post("http://localhost:8081/taskScheduler/saveTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        this.id = parseInt(response.headers.get("task-id"));
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
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
    input[type=time] {
        
        border: none;
        color: #d4d4d4;
        font-size: 14px;
        font-family: helvetica;
        width: 60px;
        height: 18px;
        background-color: rgba(0, 0, 0, 0);
    }
    input[type=time]::-webkit-datetime-edit-fields-wrapper {
        display: flex;
        
    }
    input[type=time]::-webkit-datetime-edit-text {
        padding: 19px 4px;
    }
    input[type=time]::-webkit-datetime-edit-hour-field {
        /* background-color: #f2f4f5; */
        border-radius: 15%;
        padding: 19px 5px;
    }
    input[type=time]::-webkit-datetime-edit-minute-field {
        /* background-color: #f2f4f5; */
        border-radius: 15%;
        padding: 19px 5px;
    }
    input[type=time]::-webkit-datetime-edit-ampm-field {
        display: none;
    }
    input[type=time]::-webkit-clear-button {
        display: none;
    }
    input[type=time]::-webkit-inner-spin-button {
        display: none;
    }
    input[type="time"]::-webkit-calendar-picker-indicator {
        display: none;
    }
</style>