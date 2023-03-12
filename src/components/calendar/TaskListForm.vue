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
        <input :value="getTime(taskTemplate.startDate)"
               @input="setTime(taskTemplate.startDate, $event.target.value)" type="time">
        &#8212;
        <input :value="getTime(taskTemplate.endDate)"
               @input="setTime(taskTemplate.endDate, $event.target.value)" type="time"><br>
        <input :value="getDate(taskTemplate.startDate)"
               @input="setDate(taskTemplate.startDate, $event.target.value)" type="date"/>
        &#8212;
        <input :value="getDate(taskTemplate.endDate)"
               @input="setDate(taskTemplate.endDate, $event.target.value)" type="date"/>
      </span>
    </form>
    <button v-if="type==='create'" class="create_button" @click="createTask(taskTemplate)"></button>
    <button v-if="type==='change'" class="create_button" @click="updateTask(taskTemplate); hideChangingForm()"></button>
  </span>
</template>

<script>
import axios from "axios";

export default {
  props:{
    type: String,
    task: Object
  },
  data (){
    return{
      taskTemplate: {
        title: '',
        definition: '',
        startDate: new Date(),
        endDate: this.appendHour(new Date(), 1),
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
  watch:{
    task(task){
      this.taskTemplate = {...task};
      this.taskTemplate.startDate = new Date(this.taskTemplate.startDate);
      this.taskTemplate.endDate = new Date(this.taskTemplate.endDate);
    }
  },
  methods:{
    getDate(date){
      return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
    },
    getTime(date){
      return date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
    },
    setTime(date,string){
      let [hours,minutes] = string.split(":")
      date.setHours(hours);
      date.setMinutes(minutes);
    },
    setDate(date,string){
      let [year,month,day] = string.split("-")
      date.setYear(year)
      date.setMonth(month - 1)
      date.setDate(day)
    },
    hideChangingForm(){
      document.getElementById('changing_menu').style.display = 'none';
    },
    async createTask(task) {
      if (task.startDate > task.endDate) {
        this.$store.dispatch('showMessage', {messageText: 'Task cannot end before it starts', color: 'red'})
        return;
      }
      await this.createTaskOnServer(task);
    },
    async createTaskOnServer(data) {
      await axios.post(this.$store.state.backendLink + "/saveCalendarTask", data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then((response) => {
        this.taskTemplate.rollBack();
        this.$store.commit('addTaskToTaskList',response.data)
        console.log(response);//TODO delete this
      }).catch(function (error) {
        console.log(error);
      });
    },
    appendHour(date,appendedHour) {
      date.setHours(date.getHours() + appendedHour);
      return date;
    },
    async updateTask(task) {
      let tempTask = {...task}
      if (tempTask.startDate > tempTask.endDate) {
        this.$store.dispatch('showMessage', {messageText: 'Task cannot end before it starts', color: 'red'})
        return;
      }
      await this.updateTaskOnServer(tempTask);
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
        this.taskTemplate.rollBack()
      });

    },
  }
}
</script>

<style scoped>

textarea {
  resize: none;
}

.task_form {
  padding: 5px 0px;
  padding-left: 5px;
  text-align: left;
  width: 90%;
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