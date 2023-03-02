<template>
    <div  class="task_container">
        <div 
        @drop="drop(column)" 
        class="column" 
        :key="i" 
        v-for="(column, i) in columns"
        @dragover.prevent>
            <div>{{ column.title }}</div>
            <div
            class="task" 
            :key="j" 
            v-for="(task,j) in tasksMap[i]"
            draggable="true" 
            @dragstart="dragStart(task,tasksMap[i])"
            @mouseover="showMenu('menu' + i + j)" @mouseleave="hideMenu('menu' + i + j)">
                <div :id="'text' + i + j">{{ task.text }}</div>
                <div :id="'menu' + i + j" style="display: none;">
                    <button @click="deleteTask(task)">delete</button>
                    <button @click="showChangeMenu(task)">change</button>
                </div>
            </div>
            <button class="creating_task_field" v-if="selectedColumn != i" @click="selectedColumn = i">Add Task</button>
            <div  v-if="selectedColumn == i">
                <textarea 
                    oninput="this.style.height = (this.scrollHeight - 4) + 'px';"
                    :value="taskTemplate.text" 
                    placeholder="Название" 
                    @input="taskTemplate.text = $event.target.value"  
                    maxlength="500"
                    class="task_template_text">
                </textarea>
                <button @click=" createTask(taskTemplate,column); ">Add Task</button>
            </div>
        </div>
        <div class="creating_column_field">
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
    <div style="display: none;"  id="creating_menu">
        <textarea 
            oninput="this.style.height = (this.scrollHeight - 4) + 'px';"
            :value="selectedTask.text" 
            placeholder="Название" 
            @input="selectedTask.text = $event.target.value"  
            maxlength="500"
            class="task_template_text">
        </textarea>
        <button @click="updateTask(this.selectedTask); hideChangeMenu()">Change</button>
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
                    sourceColumn:null
                },
                taskTemplate:{
                    tableColumn:null,
                    text:""
                },
                columnTemplate:{title:""},
                selectedColumn:{},
                selectedTask:{}
            }
        },
        mounted(){
            this.getAllColumns()
        },
        methods: {
            showChangeMenu(task){
                this.selectedTask = task;
                document.getElementById('creating_menu').style.display = 'block';
            },
            hideChangeMenu(){
                this.selectedTask = {};
                document.getElementById('creating_menu').style.display = 'none';
            },
            showMenu(id){
                document.getElementById(id).style.display="block";
                
            },
            hideMenu(id){
                document.getElementById(id).style.display="none";
            },
            dragStart(task) {
                console.log(task)
                this.select.task = task;
            },
            drop(column) {
                const task = this.select.task;
                task.tableColumn = column
                this.updateTask(task);
            },
            async createColumn(column){
                await axios.post(this.$store.state.backendLink + "/saveTableColumn", column,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.getAllColumns();
            },
            async updateColumn(column){
                await axios.post(this.$store.state.backendLink + "/updateTableColumn", column,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.getAllColumns();
            },
            async deleteColumn(column){
                await axios.post(this.$store.state.backendLink + "/deleteTableColumn", column,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.getAllColumns();
            },
            getAllColumns(){
                axios.get(this.$store.state.backendLink + "/getAllTableColumns",{headers:{'Authorization': localStorage.getItem('token'),
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
            async createTask(data,column){
                data.tableColumn = column;
                if(data.text === ""){
                    this.$store.dispatch('showMessage',{messageText:'Cannot create empty task',color:'red'})
                    return;
                }
                await axios.post(this.$store.state.backendLink + "/saveTableTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.getAllColumns();
                data.tableColumn = null;
                data.text = "";
            },
            async updateTask(data){
                await axios.post(this.$store.state.backendLink + "/updateTableTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.getAllColumns();
            },
            async deleteTask(data){
                await axios.post(this.$store.state.backendLink + "/deleteTableTask", data,{headers:{'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')}})
                    .then((response) => {
                        console.log(response);//TODO delete this
                    })
                    .catch(function (error) {
                        console.log(error);
                });
                this.getAllColumns();
            },
            getAllTasks(column,index){
                axios.post(this.$store.state.backendLink + "/getAllTableTasks",column,{headers:{'Authorization': localStorage.getItem('token'),
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
  
<style scoped>
    .task_container{
        display: inline-flex;
        width: 100vw;
        overflow-x:scroll;
        padding: 10px;
    }
    .column{
        background-color: gray;
        width: 300px;
        min-width: 300px;
        margin: 10px;
        text-align: left;
        border-radius: 5px;
        padding: 5px;
    }
    .task_container::-webkit-scrollbar-track
    {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
    }

    .task_container::-webkit-scrollbar
    {
      width: 12px;
      background-color: rgba(16,16,16,0.3);
    }

    .task_container::-webkit-scrollbar-thumb
    {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: #555;
    }
    .task{
        background-color: lightgray;
        width: 290px;
        margin: 5px;
        overflow-wrap: break-word;
        border-radius: 5px;
        padding: 5px;
    }
    .task_template_text{
        
        background-color: lightgray;
        width: 285px;
        margin: 5px;
        resize: none;
        
    }
    #creating_menu{
        position: fixed;
        top: 50%;
        left: 50%;
        width: 300px;
        background-color: grey;
        transform: translate(-50%, -50%);
    }
    
    button {
        margin-top: 5px;
        background: #fff;
        color: #333;
        border: 2px solid #333;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    button:hover {
        background: #333;
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
    }
</style>
  