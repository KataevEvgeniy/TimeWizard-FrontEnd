<template>
    <div class="task_container">
        <button @click="getAllColumns();"></button>
        
        
            <div 
                
                class="column" 
                :key="i" 
                v-for="(column, i) in columns"
                
                >
                <div>{{ column.title }}</div>
                <!-- <div
                    @drop="drop(column.tasks,i)" 
                    @dragover.prevent
                    class="task" 
                    :key="j" 
                    v-for="(task,j) in column.tasks"
                    draggable="true" 
                    @dragstart="dragStart(task,column.tasks)"
                    @mouseover="showMenu('menu' + i + j)" @mouseleave="hideMenu('menu' + i + j)"
                    >
                    <div>{{ task.text }}</div>
                    <div :id="'menu' + i + j" style="display: none;">
                        <button @click="deleteTask(task)">delete</button>
                        <button>change</button>
                    </div>
                </div> -->
                <button v-if="selectedColumn != i" @click="selectedColumn = i">Add Task</button>
                <div v-if="selectedColumn == i">
                    <textarea 
                        oninput="this.style.height = (this.scrollHeight - 4) + 'px';"
                        :value="taskTemplate.text" 
                        placeholder="Название" 
                        @input="taskTemplate.text = $event.target.value"  
                        maxlength="500"
                        class="task_template_text">
                    </textarea>
                    <button @click="taskTemplate.tableColumn = column; createTask(taskTemplate)">Add Task</button>
                </div>
            </div>
            <div>
                <textarea 
                    oninput="this.style.height = (this.scrollHeight - 4) + 'px';"
                    :value="columnTemplate.title" 
                    placeholder="Название" 
                    @input="columnTemplate.title = $event.target.value"  
                    maxlength="100"
                    class="task_template_text">
                </textarea><br>
                <button @click="createColumn(columnTemplate)">Create column</button>
            </div>
        </div>
    
</template>
  
<script>

import axios from 'axios'
    export default {
        data(){
            return{
                columns:[],
                tasksMap:{},
                select:{
                    task:null,
                    sourceColumn:[]
                },
                taskTemplate:{
                    tableColumn:null,
                    text:""
                },
                columnTemplate:{title:""},
                selectedColumn:null,
            }
        },
        methods: {
            showMenu(id){
                document.getElementById(id).style.display="block";
                
            },
            hideMenu(id){
                document.getElementById(id).style.display="none";
            },
            dragStart(task,sourceColumn) {
                this.select.task = task;
                this.select.sourceColumn = sourceColumn;
            },
            drop(column,index) {
                const task = this.select.task;
                const sourceColumn = this.select.sourceColumn;
                sourceColumn.splice(sourceColumn.indexOf(task), 1);
                task.columnNumber = index;
                column.push(task);
                this.updateTask(task);
            },
            async createColumn(column){
                await axios.post("http://localhost:8081/taskScheduler/saveTableColumn", column,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
            },
            async updateColumn(column){
                await axios.post("http://localhost:8081/taskScheduler/updateTableColumn", column,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
            },
            async deleteColumn(column){
                await axios.post("http://localhost:8081/taskScheduler/deleteTableColumn", column,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
            },
            async getAllColumns(){
                await axios.get("http://localhost:8081/taskScheduler/getAllTableColumns",{headers:{'Authorization': localStorage.getItem('token'),
                    "Access-Control-Allow-Origin": "*"}})
                    .then((response) => {
                        console.log(response);
                        this.columns = response.data
                        this.columns.forEach((column,index)=>{
                            this.getAllTasks(column,index);
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    
                });
            },
            async createTask(data){
                if(data.text === ""){
                    this.$store.dispatch('showMessage',{messageText:'Cannot create empty task',color:'red'})
                    return;
                }
                await axios.post("http://localhost:8081/taskScheduler/saveTableTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
            },
            async updateTask(data){
                await axios.post("http://localhost:8081/taskScheduler/updateTableTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                
            },
            async deleteTask(data){
                await axios.post("http://localhost:8081/taskScheduler/deleteTableTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                
            },
            getAllTasks(column,index){
                axios.post("http://localhost:8081/taskScheduler/getAllTableTasks",column,{headers:{'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'}})
                    .then((response) => {
                        console.log(response);
                        this.tasksMap[index] = response.data;
                        
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
        text-align: left;
        
    }
    .task{
        background-color: lightgray;
        width: 290px;
        margin: 5px;
        overflow-wrap: break-word;
    }
    .task_template_text{
        
        background-color: lightgray;
        width: 285px;
        margin: 5px;
        resize: none;
        
    }
    
</style>
  