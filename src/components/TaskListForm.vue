<template>
  <span class="create_form_box">
    <form @submit.prevent class="task_form">
      <textarea
          oninput="this.style.height = (this.scrollHeight - 4) + 'px';"
          :value="taskTemplate.title"
          placeholder="Название"
          @input="taskTemplate.title = $event.target.value"
          maxlength="200"
          class="name_input"></textarea><br>

      <textarea
          oninput="this.style.height = (this.scrollHeight - 4) + 'px';"
          :value="taskTemplate.definition"
          placeholder="Описание"
          @input="taskTemplate.definition = $event.target.value"
          maxlength="500"
          class="definition_input"></textarea><br>
      <input :value="taskTemplate.colorInHex" @input="taskTemplate.colorInHex = $event.target.value"
             type="color"/>
      <input v-show="taskTemplate.timeUnit != 'never'" min=1 :value="taskTemplate.frequency"
             @input="taskTemplate.frequency = $event.target.value" type="number"/>
      <select :value="taskTemplate.timeUnit" @input="taskTemplate.timeUnit = $event.target.value">
        <option value="never">never</option>
        <option value="day">day</option>
        <option value="week">week</option>
        <option value="month">month</option>
        <option value="year">year</option>
      </select><br>
      <span>
        <input :value="taskTemplate.startDate.time"
               @input="taskTemplate.startDate.time = $event.target.value" type="time">
        &#8212;
        <input :value="taskTemplate.endDate.time"
               @input="taskTemplate.endDate.time = $event.target.value" type="time"><br>
        <input :value="taskTemplate.startDate.date"
               @input="taskTemplate.startDate.date = $event.target.value" type="date"/>
        &#8212;
        <input :value="taskTemplate.endDate.date"
               @input="taskTemplate.endDate.date = $event.target.value" type="date"/>
      </span>
    </form>
    <button v-if="type==='create'" class="create_button" @click="createTask"></button>
  </span>
</template>

<script>
import axios from "axios";

export default {
  props:{
    type: String,
  },
  data (){
    return{
      taskTemplate: {
        title: '',
        definition: '',
        startDate: this.getCurrentDate(0),
        endDate: this.getCurrentDate(1),
        completed: null,
        colorInHex: "#FFFFFF",
        frequency: 1,
        timeUnit: "never",


        rollBack() {
          this.title = '';
          this.definition = '';
          this.completed = null;
          this.frequency = 1;
          this.timeUnit = "never";

        }
      },
    }
  },
  methods:{
    async createTask() {
      const newTask = {
        title: this.taskTemplate.title,
        definition: this.taskTemplate.definition,
        startDate: new Date(this.taskTemplate.startDate.date + " " + this.taskTemplate.startDate.time),
        endDate: new Date(this.taskTemplate.endDate.date + " " + this.taskTemplate.endDate.time),
        completed: null,
        colorInHex: this.taskTemplate.colorInHex,
        frequency: this.taskTemplate.frequency,
        timeUnit: this.taskTemplate.timeUnit,
      }
      if (newTask.startDate > newTask.endDate) {
        this.$store.dispatch('showMessage', {messageText: 'Task cannot end before it starts', color: 'red'})
        return;
      }
      await this.createTaskOnServer(newTask);
    },
    async createTaskOnServer(data) {
      await axios.post(this.$store.state.backendLink + "/saveCalendarTask", data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then((response) => {
        this.taskTemplate.rollBack();
        this.$store.dispatch('getAllTasks');
        console.log(response);//TODO delete this
      }).catch(function (error) {
        console.log(error);
      });
    },
    getCurrentDate(appendedHour) {
      let curDate = new Date();
      curDate.setHours(curDate.getHours() + appendedHour);
      return {
        date: curDate.getFullYear() + "-" + (curDate.getMonth() + 1).toString().padStart(2, "0") + "-" + curDate.getDate().toString().padStart(2, "0"),
        time: curDate.getHours().toString().padStart(2, "0") + ":" + curDate.getMinutes().toString().padStart(2, "0")
      };
    },
    async updateTask(task) {
      let tempTask = task
      tempTask.completed = this.taskTemplate.completed;
      await this.updateTaskOnServer(tempTask);
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
      this.taskTemplate.rollBack();
      this.$store.dispatch('getAllTasks')
    },
  }
}
</script>

<style scoped>
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