
<template>
    <div   style="text-align: center;" class="window">
        <div class="head" >
            <button @click="this.$store.dispatch('getAllTasks')">Get Request</button>
            <button @click="drawAnything">Выход</button>
        </div>
        <div id="canv"></div>
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
</template>

<script>
    /* eslint-disable */
    import  mychart from './components/MyChart'
    import mytask from './components/TaskTable'
    //import axios from 'axios'
    import calendar from "./components/MyCalendar.vue"
    import Konva from "konva";
    
    
    //import "vue-calendar-3/style";
    //import { useStore } from './components/store'

    //import vuex from 'vuex'

    export default {
        components: {
            mychart,
            mytask,
            calendar,
        },
        data() {
            return {
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
            drawAnything(){
                var canvas = document.getElementById("canv");

                let minutesInDay = 1440;

                let dates = [{start:1,end:30},{start:40,end:80},{start:400,end:500},{start:500,end:700},{start:900,end:1440}]
                
                var stage = new Konva.Stage({
                    container: canvas,
                    width: 400,
                    height: 300
                });
                var layer = new Konva.Layer();
                
                
                dates.forEach(function(date){
                
                var arc = new Konva.Arc({
                    x: stage.width() / 2,
                    y: stage.height() / 2,
                    innerRadius: 70,
                    outerRadius: 100,
                    angle: (date.end-date.start)/4,
                    fill: 'green',
                    stroke: 'black',
                    strokeWidth: 4,
                    rotation: date.start/4-90
                });
                arc.on('click', function() {
                    var newColor = Konva.Util.getRandomColor();
                    
                    this.fill(newColor);
                    
                    layer.draw();
                });
                
                layer.add(arc);
                })
                
                
                

                
                

                
                stage.add(layer);
                
            }
            
            
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