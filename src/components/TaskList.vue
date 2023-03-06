<template>

  <div @submit.prevent class="tasks">
    <div
        :id="task.id"
        class="task_exam"
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
        <div v-if="task.completed == null && task.endDate < Date.now()">
        <button class="task_menu_btn" @click="updateTaskCompletion(task,true) ">Выполнено</button>
        <button class="task_menu_btn" @click="updateTaskCompletion(task,false)">Провалено</button>
        </div>
        <button class="task_menu_btn" v-else @click="showChangeMenu(task)">Change</button>
        <button class="task_menu_btn" @click="deleteTaskOnServer(task)">Удалить</button>
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

.task_exam, .create_form_box {
  min-width: 400px;
  margin-top: 15px;
}

.task_exam {
  border-radius: 14px;
  user-select: contain;
  border: 1px solid;
  border-color: grey;
  display: flex;
  flex-direction: row;
}

.task_body {
  display: flex;
  flex-direction: column;
  width: 85%;
}

.task_menu {

  display: flex;
  flex-direction: column;
  width: 15%;
}

.task_menu_btn {
  height: 33.33%;
  border: none;
  background: none;
  border-bottom-right-radius: 14px;
  border-top-right-radius: 14px;
  background: rgb(230, 190, 8);
  background: radial-gradient(circle, rgba(230, 190, 8, 1) 7%, rgba(73, 78, 78, 0) 56%);
}

.task_menu_btn:hover {
  transform: translateY(-2px);
  background: rgb(230, 190, 8);
  background: radial-gradient(circle, rgba(230, 190, 8, 1) 20%, rgba(73, 78, 78, 0) 70%);
}

.task_exam:hover {
  border-color: red;
  transform: scale(1.05);

}

.task_form {
  padding: 5px 0px;
  padding-left: 5px;
  text-align: left;
  width: 90%;
}

.tasks {
  display: inline-block;
  width: 60%;
  vertical-align: top;
}


.name, .definition, .date {
  margin-left: 5%;
  text-align: left;
  word-wrap: break-word;
}

.definition, .date {
  font-size: 16px;
}

.create_form_box {
  display: flex;


  flex-direction: row;
  border-radius: 14px;
  background-color: #474B4F;
}

.definition_input, .name_input {
  border: none;
  border-radius: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
  color: white;
  background-color: #222629;
  width: 90%;
}

.create_button {
  background: linear-gradient(#474B4F, #474B4F),
  linear-gradient(#474B4F, #474B4F);
  background-position: center;
  background-repeat: no-repeat;
  background-color: #222629;
  background-size: 50% 3px, 3px 50%;
  border: none;
  color: white;
  width: 10%;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}

.create_button:hover {
  outline: 4px solid #474B4F;
  outline-offset: -4px;
}

input[type="color"] {
  width: 30px;
  height: 30px;
  border: none;
  background-color: rgba(0, 0, 0, 0);

}

input[type="time"], input[type="date"] {
  border: none;
  color: #d4d4d4;
  font-size: 14px;
  font-family: helvetica;
  width: 87px;
  height: 18px;
  background-color: rgba(0, 0, 0, 0);
}

input[type="time"]::-webkit-datetime-edit-fields-wrapper {
  display: flex;

}

input[type="time"]::-webkit-datetime-edit-text {
  padding: 19px 4px;
}

input[type="time"]::-webkit-datetime-edit-hour-field {
  /* background-color: #f2f4f5; */
  border-radius: 15%;
  padding: 19px 5px;
}

input[type="time"]::-webkit-datetime-edit-minute-field {
  /* background-color: #f2f4f5; */
  border-radius: 15%;
  padding: 19px 5px;
}

input[type="time"]::-webkit-datetime-edit-ampm-field {
  display: none;
}

input[type="time"]::-webkit-clear-button {
  display: none;
}

input[type="time"]::-webkit-inner-spin-button {
  display: none;
}

input[type="time"]::-webkit-calendar-picker-indicator {

}

input[type="date"] {
  width: 95px;
}
</style>