<template>

  <div @submit.prevent class="tasks_box">
    <div
        :id="task.id"
        class="task"
        :style="{background: getMainGradient(task.colorInHex)}"
        v-for="task in tasks"
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
import taskListForm from "@/components/TaskListForm.vue";

export default {
  components:{
    taskListForm
  },
  data() {
    return {
      tasks: [],
      changingTask:null,
    }
  },
  mounted() {
    this.defineTasksOfDay(this.$store.getters.selectedDay);
  },
  computed: {
    ...mapGetters(['selectedDay']),
    ...mapGetters(['taskList']),

  },
  watch: {
    selectedDay() {
      this.defineTasksOfDay(this.$store.getters.selectedDay);
    },
    taskList() {
      this.defineTasksOfDay(this.$store.getters.selectedDay);
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
    defineTasksOfDay(selectedDate) {
      let singlyTasks = this.$store.getters.taskList.singly;
      let dailyTasks = this.$store.getters.taskList.daily;
      let weeklyTasks = this.$store.getters.taskList.weekly;
      let monthlyTasks = this.$store.getters.taskList.monthly;
      let yearlyTasks = this.$store.getters.taskList.yearly;

      let taskInThisDay = [];
      singlyTasks.forEach((item) => {
        if (roundDate(item.startDate) <= selectedDate.startDateTime.getTime() && selectedDate.startDateTime.getTime() <= roundDate(item.endDate))
          taskInThisDay.push(item);
      });
      dailyTasks.forEach((item) => {
        let dayInMillis = 86400000;
        let deltaDays = Math.round((selectedDate.startDateTime.getTime() - item.startDate) / dayInMillis) + 1;
        if ((deltaDays % item.frequency == 0 || deltaDays == 0) && deltaDays >= 0) {
          let cloneItem = {...item}
          cloneItem.startDate += dayInMillis * deltaDays;
          cloneItem.endDate += dayInMillis * deltaDays;
          taskInThisDay.push(cloneItem);
        }
      });
      weeklyTasks.forEach((item) => {
        let weekInMillis = 604800000;
        let deltaWeeks = Math.round((selectedDate.endDateTime.getTime() - item.startDate) / weekInMillis);
        if (selectedDate.startDateTime.getDay() == new Date(item.startDate).getDay() && deltaWeeks >= 0 && deltaWeeks % item.frequency == 0) {
          let cloneItem = {...item}
          cloneItem.startDate += weekInMillis * deltaWeeks;
          cloneItem.endDate += weekInMillis * deltaWeeks;
          taskInThisDay.push(cloneItem);
        }
      });
      monthlyTasks.forEach((item) => {
        let localSelectedDate = selectedDate.endDateTime;
        let localStartDate = new Date(item.startDate)
        let deltaMonthInMonth = (localSelectedDate.getFullYear() - localStartDate.getFullYear()) * 12 + (localSelectedDate.getMonth() - localStartDate.getMonth());
        if (selectedDate.startDateTime.getDate() == new Date(item.startDate).getDate() && deltaMonthInMonth >= 0 && deltaMonthInMonth % item.frequency == 0) {
          let cloneItem = {...item}
          cloneItem.startDate = new Date(cloneItem.startDate).setMonth(new Date(cloneItem.startDate).getMonth() + deltaMonthInMonth);
          cloneItem.endDate = new Date(cloneItem.endDate).setMonth(new Date(cloneItem.endDate).getMonth() + deltaMonthInMonth);
          taskInThisDay.push(cloneItem);
        }
      });
      yearlyTasks.forEach((item) => {
        let localSelectedDate = selectedDate.startDateTime;
        let localStartDate = new Date(item.startDate);
        let deltaYears = localSelectedDate.getFullYear() - localStartDate.getFullYear();
        if (localSelectedDate.getDate() == localStartDate.getDate() && localSelectedDate.getMonth() == localStartDate.getMonth() && deltaYears >= 0 && deltaYears % item.frequency == 0) {
          let cloneItem = {...item}
          cloneItem.startDate = new Date(cloneItem.startDate).setFullYear(new Date(cloneItem.startDate).getFullYear() + deltaYears);
          cloneItem.endDate = new Date(cloneItem.endDate).setFullYear(new Date(cloneItem.endDate).getFullYear() + deltaYears);
          taskInThisDay.push(cloneItem);
        }
      });
      taskInThisDay.sort((a, b) => (a.startDate - b.startDate));
      this.$store.commit('taskInThisDay', taskInThisDay);
      this.tasks = this.$store.getters.taskInThisDay;

      function roundDate(dateInMillis) {
        let d = new Date(dateInMillis);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate())
      }
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
        console.log(response);//TODO delete this
      }).catch(function (error) {
        console.log(error);
      });
      this.$store.dispatch('getAllTasks')
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
        console.log(response);//TODO delete this
      }).catch(function (error) {
        console.log(error);
      });
      this.$store.dispatch('getAllTasks');
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