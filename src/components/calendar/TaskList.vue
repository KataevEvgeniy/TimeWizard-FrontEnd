<template>

  <div @submit.prevent class="tasks_box">
    <div
        :id="task.id"
        class="task"
        :style="{background: getMainGradient(task.colorInHex)}"
        v-for="task in this.$store.getters.taskInThisDay"
        :key="task"
    >
      <div class="task_body">
        <div class="name">> {{ task.title }}</div>
        <div class="definition">> {{ task.definition }}</div>
        <div class="date">>
          {{
            task.startDate < this.$store.state.selectedDay.startDateTime ? new Date(task.startDate).toDateString().slice(3, 10) : ""
          }}
          {{ new Date(task.startDate).toTimeString().slice(0, 5) }} -
          {{
            (task.endDate - this.$store.state.selectedDay.startDateTime) > 86400000 ? new Date(task.endDate).toDateString().slice(3, 10) : ""
          }}
          {{ new Date(task.endDate).toTimeString().slice(0, 5) }}
        </div>
        <div class="tags">
          <span class="tag">&#8634; {{task.frequency + " " +  task.timeUnit}}</span>
        </div>
      </div>
      <div class="task_menu">
        <div class="task_menu_change_btn_box" v-if="task.completed == null && task.endDate < Date.now()">
          <button class="task_menu_btn" @click="updateTaskCompletion(task,true)" style="background-color: greenyellow">✔</button>
          <button class="task_menu_btn" @click="updateTaskCompletion(task,false)" style="background-color: red">✘</button>
        </div>
        <div v-else class="task_menu_change_btn_box">
          <button class="task_menu_btn"  @click="showChangeMenu(task)">✄</button>
        </div>
        <div class="task_menu_change_btn_box">
          <button class="task_menu_btn" @click="deleteTaskOnServer(task)">🗑</button>
        </div>
      </div>
    </div>
    <button @click="this.$store.dispatch('showMessage',{messageText:'hell',color:'red'})">click</button>
    <task-list-form :type="'create'"></task-list-form>
    <div style="display: none" id="changing_menu">
      <task-list-form ref="changingForm" id="changeForm" :type="'change'" :task="changingTask"></task-list-form>
    </div>
  </div>
</template>

<script>
//import { useStore } from './store'
import axios from 'axios'
import {mapGetters} from 'vuex';
import taskListForm from "@/components/calendar/TaskListForm.vue";

export default {
  components:{
    taskListForm
  },
  data() {
    return {
      changingTask:null,
    }
  },
  mounted() {
    this.$store.dispatch('defineTasksOfDay');
  },
  computed: {
    ...mapGetters(['selectedDay']),
    ...mapGetters(['taskList']),
    ...mapGetters(['unsortedTaskList']),
  },
  watch: {
    selectedDay() {

      this.$store.dispatch('defineTasksOfDay');
    },
    taskList() {

      this.$store.dispatch('defineTasksOfDay');
    },
    unsortedTaskList(){

      this.$store.dispatch('defineTasksOfDay');
    },
  },
  methods: {
    showChangeMenu(task){
      this.changingTask = task;
      document.getElementById('changing_menu').style.display = 'block';
    },
    getMainGradient(color) {
      return `linear-gradient(114deg, #222629 60%, ${color} 95%)`;
    },

    async updateTaskCompletion(task,result) {
      task.completed = result;
      await this.updateTaskOnServer(task);
    },
    async updateTaskOnServer(data) {
      await axios.post(this.$store.state.backendLink + "/updateCalendarTask", data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then((response) => {
        this.$store.commit('updateTaskOnTaskList',response.data)
        console.log(response);//TODO delete this
      }).catch(function (error) {
        console.log(error);
      });

    },
    deleteTask(task) {
      this.deleteTaskOnServer(task);
    },
    async deleteTaskOnServer(data) {
      await axios.post(this.$store.state.backendLink + "/deleteCalendarTask", data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then((response) => {
        this.$store.commit('deleteTaskOnTaskList',data)
        console.log(response);//TODO delete this
      }).catch(function (error) {
        console.log(error);
      });
    },
  }
}
</script>

<style scoped>
#changing_menu{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.tag{
  border-radius: 15px;
  background-color: green;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 0px 6px;
}

.tags{
  display: flex;
  flex-direction: row;
}

textarea {
  resize: none;
}
.tasks_box{
  display: flex;
  flex-direction: column;
  width: 90vw;
  background-color: grey;
  padding: 1vw;
}

.task{
  border-bottom: 2px solid;
  border-image: linear-gradient(to left, rgba(0,0,0,0) 1%, darkgrey 50%, rgba(0,0,0,0) 100%)
  100% 0 100% ;
  padding: 1vw;
  display: flex;
  flex-direction: row;
}

.task_body{
  width: 90%;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.task_menu{
  width: 10%;
  display: flex;
  flex-direction: column;

}

.task_menu_change_btn_box{
  display: flex;
  flex-direction: row;

}

.task_menu_btn{
  border-radius: 10px;
  flex-grow: 1;
  align-self: flex-start;

}

.task_menu_btn:hover{
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}

</style>