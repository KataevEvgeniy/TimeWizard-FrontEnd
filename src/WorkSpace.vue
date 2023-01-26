
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
                let selectedDay = this.$store.getters.selectedDay.date;
                
                //let inputDates = [{start:50,end:70},{start:400,end:500},{start:60,end:65},{start:500,end:700},{start:1,end:30},{start:40,end:80},{start:1000,end:1100},{start:900,end:1440}]
                dates.forEach(function(date){
                    let startInMinutes = date.startDate < selectedDay ? 0 : new Date(date.startDate).getHours()*60 + new Date(date.startDate).getMinutes();
                    let endInMinutes =  (date.endDate - selectedDay) > 86400000 ? 1440 : new Date(date.endDate).getHours()*60 + new Date(date.endDate).getMinutes();
                    inputDates.push({date:date,start: startInMinutes,end: endInMinutes})
                })
                
                
                inputDates.sort((a, b) => a.start - b.start);
                let sortedDatesForSircle = sortSircle(inputDates);
                
                function sortSircle(inputArr){
                    let arraysForAllRing = []
                    while(inputArr.length > 0){
                        let arrayForSingleRing = []
                        for(let i = 0, lastEnd = 0;i<inputArr.length;i++){
                            if(inputArr[i].start>=lastEnd){
                                lastEnd = inputArr[i].end;
                                arrayForSingleRing.push(inputArr[i]);
                                inputArr.splice(i,1);
                            }
                        }
                        arraysForAllRing.push(arrayForSingleRing)
                    }
                    return arraysForAllRing;
                }
                
                
                
                var stage = new Konva.Stage({
                    container: canvas,
                    width: 400,
                    height: 400
                });
                var layer = new Konva.Layer();

                const arrow = new Konva.Arrow({
                    
                    points: [0, 0, 0, -65], // x1, y1, x2, y2
                    stroke: 'white',
                    x: stage.width() / 2,
                    y: stage.height() / 2,
                    rotation: 0,
                    strokeWidth: 3
                });
                
                layer.add(arrow);

                function setRotation() {
                    let minutes = new Date().getHours()*60  + new Date().getMinutes();
                    arrow.rotation(minutes * 0.25);
                    layer.draw();
                };
                
                setInterval(setRotation(), 60000);
                
                for(let i = 0;i<sortedDatesForSircle.length;i++){
                    sortedDatesForSircle[i].forEach(function(data){
                        var arc = new Konva.Arc({
                            x: stage.width() / 2,
                            y: stage.height() / 2,
                            innerRadius: 70+i*30,
                            outerRadius: 100+i*30,
                            angle: (data.end-data.start)/4,
                            fill: data.date.colorInHex,
                            stroke: 'black',
                            strokeWidth: 2,
                            cornerRadius:20,
                            rotation: data.start/4-90
                        });
                        
                        arc.on('mouseover', function(event) {
                            var tooltip = new Konva.Label({
                                x: event.evt.offsetX,
                                y: event.evt.offsetY,
                                opacity: 0.75
                            });

                            tooltip.add(new Konva.Tag({
                                fill: 'black'
                            }));

                            tooltip.add(new Konva.Text({
                                text: Math.floor(data.start/60).toString().padStart(2, "0") + ":" + (data.start%60).toString().padStart(2, "0")
                                 + " - " + Math.floor(data.end/60).toString().padStart(2, "0") + ":" + (data.end%60).toString().padStart(2, "0"),
                                fontFamily: 'Calibri',
                                fontSize: 18,
                                padding: 5,
                                fill: 'white'
                                
                            }));

                            layer.add(tooltip);
                            layer.draw();
                        });
                        
                        arc.on('mouseout', function() {
                            layer.find('Label')[0].remove();
                            layer.draw();
                        });

                        arc.on('click', function(){
                            document.getElementById(data.date.id).scrollIntoView({ behavior: 'smooth', block: 'start' })
                        });
                        layer.add(arc);

                        
                    })
                }
                
                
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