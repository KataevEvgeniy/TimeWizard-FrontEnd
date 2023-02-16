
<template>
    <div   style="text-align: center;" class="window">
        <div class="head" >
            <button @click="selectedPageName = 'Calendar'">Calendar</button>
            <button @click="selectedPageName = 'Table'">Table</button>
            <button @click="this.$store.dispatch('getAllTasks')">Get Request</button>
        </div>
        <div v-if="selectedPageName == 'Table'">
            <task_table></task_table>
        </div>
        <div v-if="selectedPageName == 'Calendar'">
            <clock_donut></clock_donut>
            <calendar></calendar>
            <div class="task_tables">
                <task_list></task_list>
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import task_list from './components/TaskList'
    import calendar from "./components/MyCalendar.vue"
    import clock_donut from './components/ClockDonut.vue'
    import task_table from './components/TaskTable.vue'
    export default {
        components: {
            task_table,
            task_list,
            calendar,
            clock_donut
        },
        data() {
            return {
                selectedPageName:"Calendar",
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