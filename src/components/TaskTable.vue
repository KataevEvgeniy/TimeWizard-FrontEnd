<template>
    <div class="task_container">
        <button @click="getAllTasks()"></button>
        <div 
            class="column" 
            :key="i" 
            v-for="(column, i) in array"
            @drop="drop(column.tasks)" 
            @dragover.prevent
            >
            <div 
                class="task" 
                :key="j" 
                v-for="(task,j) in column.tasks"
                draggable="true" 
                @dragstart="dragStart(task,column.tasks)"
                >{{ task.text }}
            </div>
            <textarea 
                oninput="this.style.height = (this.scrollHeight - 4) + 'px';"
                :value="column.taskTemplate.text" 
                placeholder="Название" 
                @input="column.taskTemplate.text = $event.target.value"  
                maxlength="500"
                class="task_template_text">
            </textarea>
            <button @click="createTask(column.taskTemplate)">Add Task</button>
        </div>
    </div>
</template>
  
<script>
    import axios from 'axios'
    export default {
        data(){
            return{
                array:[
                    {tasks:[],taskTemplate:{columnNumber:null,text:""}},
                    {tasks:[],taskTemplate:{columnNumber:null,text:""}}
                ],
                select:{
                    task:null,
                    sourceColumn:[]
                },
                
            }
        },
        methods: {
            dragStart(task,sourceColumn) {
                this.select.task = task;
                this.select.sourceColumn = sourceColumn;
            },
            drop(column) {
                const task = this.select.task;
                const sourceColumn = this.select.sourceColumn;
                sourceColumn.splice(sourceColumn.indexOf(task), 1);
                column.push(task)
            },
            async createTask(data){
                console.log(data)
                await axios.post("http://localhost:8081/taskScheduler/saveTableTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
            },
            async getAllTasks(){
                await axios.get("http://localhost:8081/taskScheduler/getAllTableTasks",{headers:{'Authorization': localStorage.getItem('token'),
                    "Access-Control-Allow-Origin": "*"}})
                    .then((response) => {
                        console.log(response);
                        let arra = response.data
                        arra.forEach((task) => {
                            if(this.array[task.columnNumber] == null){
                                this.array[task.columnNumber] = {
                                    tasks:[],
                                    taskTemplate:{
                                        columnNumber:null,
                                        text:""
                                    }
                                }
                            }
                            this.array[task.columnNumber].tasks.push(task)
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    
                });
            }
        }
    };
</script>
  
<style>
    .task_container{
        display: inline-flex;
        
    }
    .column{
        background-color: gray;
        width: 300px;
        margin: 10px;
        text-align: center;
    }
    .task{
        background-color: lightgray;
        width: 290px;
        margin: 5px;
    }
    .task_template_text{
        background-color: lightgray;
        width: 285px;
        margin: 5px;
        resize: none;
    }
</style>
  