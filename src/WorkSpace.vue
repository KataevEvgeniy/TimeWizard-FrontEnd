<template>
  <div style="text-align: center;" class="window">
    <div class="head">
      <button class="change_page_button" @click="selectedPageName = 'Calendar'">Calendar</button>
      <button class="change_page_button" @click="selectedPageName = 'Table'">Table</button>
      <button class="change_page_button" @click="logout()">Exit</button>
    </div>
    <div v-if="selectedPageName == 'Table'">
      <task_table></task_table>
    </div>
    <div class="calendar_container" v-if="selectedPageName == 'Calendar'">
      <clock_donut class="clock_donut"></clock_donut>
      <calendar class="calendar"></calendar>
      <task_list class="task_list"></task_list>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import task_list from './components/TaskList'
import calendar from "./components/MyCalendar.vue"
import clock_donut from './components/ClockDonut.vue'
import task_table from './components/TaskTable.vue'

export default {
  components: {
    task_table,
    task_list,
    calendar,
    clock_donut
  },
  data() {
    return {
      selectedPageName: "Calendar",
    }
  },
  mounted() {
    this.$store.dispatch('getAllTasks')
  },
  methods: {
    logout() {
      this.$store.state.tokenIsTrue = false;
      localStorage.removeItem('token')
    },
  }
}
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
  padding-bottom: 30px;
  background-color: #222629;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

}

.head {
  text-align: left;
  display: block;
  position: static;
  height: 100px;
}

.calendar_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.calendar {
  margin: auto;
}

.clock_donut {
  margin: auto;
}

.task_list {
  text-align: center;
  font-size: 20px;
  color: #FFFFFF;
  margin: auto;
}

.change_page_button {
  background: #fff;
  color: #333;
  border: 2px solid #333;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

}

.change_page_button:hover {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}


</style>