
<template>
    <div   style="text-align: center;" class="window">
        <div class="head" >
            <button >Calendar</button>
            <button >Table</button>
            <button @click="this.$store.dispatch('getAllTasks')">Get Request</button>
        </div>
        <div>
            <clock_donut></clock_donut>
            <div id="clock_donut1"></div>
            <calendar></calendar>
            <div class="doughnut_box">
                <div class="doughnut_left">
                    <mychart/>
                </div>
                <div class="doughnut_right" >
                    <mychart/>
                </div>
            </div>
            
            <div class="task_tables">
                <mytask/>

            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import  mychart from './components/MyChart'
    import mytask from './components/TaskList'
    import calendar from "./components/MyCalendar.vue"
    import clock_donut from './components/ClockDonut.vue'

    export default {
        components: {
            mychart,
            mytask,
            calendar,
            clock_donut
        },
        data() {
            return {
                selectedPage:"Workspace",
                u:0,
                User: {
                    username: '',
                    email: '',
                    password: ''
                },
            }
        },
        mounted(){
            this.$store.dispatch('getAllTasks')
            
        },
        methods: {
            logout(){
                
                location.href = 'http://localhost:8080/';
                //TODO Add logout function
            },
        }
    }
</script>

<style>
    td{
        background-color: white;
        border-radius: 13px;
    }
    

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
    #daysBox{
        text-align: right;
        
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
    
</style>