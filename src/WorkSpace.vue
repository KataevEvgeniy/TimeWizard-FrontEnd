<template>
    <div style="text-align: center;" class="window">
        <div class="head" >
            <button @click="getAllTask">Get Request</button>
            <button @click="saveData">Save</button>
            <button @click="logout">Выход</button>
        </div>
        <div class="doughnut_box">
            <div class="doughnut_left">
                <mychart/>
            </div>
            <div class="doughnut_right" >
                <mychart/>
            </div>
        </div>
        
        <div>
            <button class="chose_task_table_button" @click="taskTableNumber = 1">#1</button>
            <button class="chose_task_table_button" @click="taskTableNumber = 2">#2</button>
            <button class="chose_task_table_button" @click="taskTableNumber = 3">#3</button>
        </div>
        <div class="task_tables">
            <mytask v-if="taskTableNumber == 1" taskId=1 />
            <mytask v-if="taskTableNumber == 2" taskId=2 />
            <mytask v-if="taskTableNumber == 3" taskId=3 />
        </div>
    </div>
    <clock/>
</template>

<script>
    import  mychart from './components/MyChart'
    import mytask from './components/TaskTable'
    import axios from 'axios'
    

    //import { useStore } from './components/store'

    //import vuex from 'vuex'

    export default {
        components: {
            
            mychart,
            mytask,
        },
        data() {
            return {
                p:[],
                taskTableNumber: 1,
                User: {
                    username: '',
                    email: '',
                    password: ''
                },
            }
        },
        methods: {
            logout(){
                
                location.href = 'http://localhost:8080/';

            },
            async getAllTask(){
                await axios.get("http://localhost:8081/taskScheduler/getAllTasks",{headers:{'Authorization': localStorage.getItem('token'),
                "Access-Control-Allow-Origin": "*"}})
                .then((response) => {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                    
                });
            },
            
        }
    }
</script>

<style>
    body{
        margin: 0px;
        padding: 0px;
        padding-bottom: 30px;
        background-color: #222629;
    }
    .head{
        text-align: right;
        display: block;
        background-color: #222629;
        position: static;
        height: 100px;
    }
    .doughnut_box{
        border-radius: 10px;
        height: 440px;
        background-image:  url('./assets/doughnut-background.jpg');
        background-repeat: no-repeat;
        background-size: 100%;
        text-align: center;
    }
    .doughnut_left,.doughnut_right{
        position: static;
        height: 93%;
        width: 400px;
        background-image: url('./assets/clock.png');
        background-size: 47.5%;
        background-repeat: no-repeat;
        background-position: center;
        display:inline-block;
    }
    .doughnut_left{
        margin-right: 50px;
    }
    .doughnut_right{
        margin-left: 50px;
    }
    .task_tables{
        text-align: center;
        font-size: 20px;
        color: #FFFFFF;
        background-color: #222629;
    }
    .chose_task_table_button{
        margin-top: 10px;
        margin-right: 5px;
        margin-left: 5px;
        border-radius: 14px;
        background-color: #474B4F;
        border-width: 2px;
        border-color: rgba(0,0,0,0);
        display: inline-block;
        width: 20%;
        height: 30px;
    }
    .chose_task_table_button:hover{
        border-color: white;
        border-width: 2px;
        transform: scale(1.05);
    }
</style>