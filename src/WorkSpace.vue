
<template>
    <div   style="text-align: center;" class="window">
        <div class="head" >
            <button @click="this.$store.dispatch('getAllTasks')">Get Request</button>
            <button @click="drawAnything(this.$store.getters.taskInThisDay)">Выход</button>
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
            drawAnything(dates){
                var canvas = document.getElementById("canv");

                let minutesInDay = 1440;
                let minArcRadius = 70;
                let inputDates = [];
                //let inputDates = [{start:50,end:70},{start:400,end:500},{start:60,end:65},{start:500,end:700},{start:1,end:30},{start:40,end:80},{start:1000,end:1100},{start:900,end:1440}]
                dates.forEach(function(date){
                    let startInMinutes = new Date(date.startDate).getHours()*60 + new Date(date.startDate).getMinutes();
                    let endInMinutes =  new Date(date.endDate).getHours()*60 + new Date(date.endDate).getMinutes();
                    inputDates.push({start: startInMinutes,end: endInMinutes})
                })
                
                
                inputDates.sort((a, b) => a.start - b.start);

                let sortedForSirclesDates = []
                while(sortForSircles(inputDates)){}
                
                function sortForSircles(dateArray){
                    let unsortedDates=[]
                    let sortedDates = []
                    for(let i = 0, lastEnd = 0;i<dateArray.length;i++){
                        if(dateArray[i].start<lastEnd)
                            unsortedDates.push(dateArray[i]);
                        else
                            sortedDates.push(dateArray[i]);
                        lastEnd = dateArray[i].end;
                    }
                    sortedForSirclesDates.push(sortedDates)
                    if(unsortedDates.length == 0)
                        return false;
                    else{
                        inputDates = unsortedDates;
                        return true;
                    }
                }
                console.log(sortedForSirclesDates);
                
                
                var stage = new Konva.Stage({
                    container: canvas,
                    width: 400,
                    height: 400
                });
                var layer = new Konva.Layer();
                
                var text = new Konva.Text({
                    x: (stage.width() / 2)-minArcRadius/1.4,
                    y: (stage.height() / 2)-minArcRadius/1.4,
                    text: '00:00 00.00.00',
                    fontSize: 30,
                    fontFamily: 'Calibri',
                    fill: 'black',
                    width: (minArcRadius*2)/1.4,
                    align: 'left'
                });
                for(let i = 0;i<sortedForSirclesDates.length;i++){
                    sortedForSirclesDates[i].forEach(function(date){
                        var arc = new Konva.Arc({
                            x: stage.width() / 2,
                            y: stage.height() / 2,
                            innerRadius: 70+i*30,
                            outerRadius: 100+i*30,
                            angle: (date.end-date.start)/4,
                            fill: 'green',
                            stroke: 'black',
                            strokeWidth: 4,
                            rotation: date.start/4-90
                        });
                        arc.on('mouseover', function() {
                            var newColor = Konva.Util.getRandomColor();
                            
                            this.fill(newColor);
                            
                            layer.draw();
                        });
                        
                        layer.add(arc);
                    })
                }
                layer.add(text)
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