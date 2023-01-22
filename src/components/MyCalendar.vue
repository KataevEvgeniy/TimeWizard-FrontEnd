<template >
  <div id="calendar">
    <div id="date_widget">
      <div style="font-size: 90px;">{{ new Date(this.$store.state.selectedDay.date).getDate() }}</div>
      <div style="font-size: 40px;">{{ this.$store.state.selectedDay.monthName }}</div>
    </div>
    <div id="calendar_box">
      <div id="monthYear">
        <button id="prev_button" @click="prevMonth()"><i class="fas fa-arrow-left arrow"></i></button>
        <div id="year_date_span">{{ getMonthName() + " " + getYear() }}</div>
        <button id="next_button" @click="nextMonth()"><i class="fas fa-arrow-right arrow"></i></button>
      </div>
      <table id="calendar_table">
        <tr>
          <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
        </tr>
        <tr v-for="(week, index) in calendar" :key="index">
          <td @click="setSelectedDate(day)" v-for="day in week" :key="day.date.getDate()" >{{ day.date.getDate() }}</td> 
          <!-- :class="{ 'today': day.isToday }" -->
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import { useStore } from './store';
  export default {
    data() {
      return {
        
        selectedMonthAndYear: new Date((new Date()).getFullYear(), (new Date()).getMonth()),
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        daysOfWeek: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',],
        calendar: [],
      }
    },
    mounted() {
      this.generateCalendar();
      this.$store.state.selectedDay = {
          date: new Date(this.getYear(),this.getMonth(),new Date().getDate()),
          monthName: this.months[(new Date()).getMonth()],
        }
    },
    methods: {
      generateCalendar() {
        let firstDayOfWeekInMonth = (new Date(this.getYear(), this.getMonth(),1)).getDay()
        let dayOfWeek = firstDayOfWeekInMonth == 0 ? 6 : firstDayOfWeekInMonth - 1;

        var firstDay = new Date(this.getYear(), this.getMonth(),1 - dayOfWeek);
        var lastDay = new Date(this.getYear(), this.getMonth() + 1,0);

        let dayInMillis = 86400000;
        this.calendar = [];

        while(firstDay <= lastDay){
          let week = [];
          for(let i = 1; i <= 7; i++){
            week.push({
              date: firstDay,
              monthName: this.months[firstDay.getMonth()], 
            });
            firstDay = new Date(firstDay.getTime() + dayInMillis);
          } 
          this.calendar.push(week);
        }
        
      },
      getMonth() {
        return this.selectedMonthAndYear.getMonth();
      },
      getYear() {
        return this.selectedMonthAndYear.getFullYear();
      },
      getMonthName() {
        return this.months[this.getMonth()];
      },
      prevMonth(){
        this.selectedMonthAndYear.setMonth(this.selectedMonthAndYear.getMonth() - 1);
        this.generateCalendar();
      },
      nextMonth(){
        this.selectedMonthAndYear.setMonth(this.selectedMonthAndYear.getMonth() + 1);
        this.generateCalendar();
      },
      setSelectedDate(date){
        useStore.commit("setSelectedDay",date);
      }
    }
  }
</script>

<style>
  table {
    border-collapse: separate;
    border: 2px solid black;
    font-size: 18px;
    font-family: Arial, sans-serif;
    color: #333;
  }
  th, td {
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    text-align: center;
    
    width: 38px;
    height: 38px;
  }
  th {
    background-color: #333;
    color: #fff;
    
  }
  td:hover{
    background-color: #ccc;
    cursor: default;
  }
  #calendar{
    display: flex;
    justify-content: center;
  }
  #calendar_table{
    margin: auto;
  }
  #monthYear{
    font-size: 18px;
    display: flex;
    justify-content: center;
  }
  #year_date_span{
    width: 200px;
    
    background-color: #ddd;
  }
  #date_widget{
    width:310px; 
    background-color: darkgrey;
    border-radius: 10px;
  }
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
  .arrow {
    font-size: 24px;
    color:black;
  }

</style>

  