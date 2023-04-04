import {createStore} from 'vuex'
import axios from 'axios'

// eslint-disable-next-line
export const useStore = createStore({
    state: {
        tokenIsTrue: null,
        backendLink: 'https://backatevg.site/timewizard',
        visible: true,
        count: 0,
        taskList: {
            unsorted:[],
            singly: [],
            daily: [],
            weekly: [],
            monthly: [],
            yearly: [],

            sortTasks() {
                this.singly = [];
                this.daily = [];
                this.weekly = [];
                this.monthly = [];
                this.yearly = [];
                this.unsorted.forEach(elem => {
                    if (elem.timeUnit === 'never')
                        this.singly.push(elem);
                    else if (elem.timeUnit === 'day')
                        this.daily.push(elem);
                    else if (elem.timeUnit === 'week')
                        this.weekly.push(elem);
                    else if (elem.timeUnit === 'month')
                        this.monthly.push(elem);
                    else if (elem.timeUnit === 'year')
                        this.yearly.push(elem);
                });
            }
        },
        taskInThisDay: [],
        selectedDay: new Date(),
    },
    mutations: {
        setSelectedDay(state, date) {
            state.selectedDay = date;
        },
        addTaskToTaskList(state,task){
            state.taskList.unsorted.push(task);
            state.taskList.sortTasks();
            useStore.dispatch('defineTasksOfDay');
        },
        updateTaskOnTaskList(state,updatedTask){
            let tasks = state.taskList.unsorted
            const index = tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                tasks[index] = updatedTask;
                state.taskList.sortTasks();
                useStore.dispatch('defineTasksOfDay');
            }
        },
        deleteTaskOnTaskList(state,deletedTask){
            let tasks = state.taskList.unsorted
            let index = tasks.findIndex(task => task.id === deletedTask.id);
            if (index !== -1) {
                tasks.splice(index, 1);
                state.taskList.sortTasks();
                useStore.dispatch('defineTasksOfDay')
            }
        },
        setTaskList(state, unsortedArray) {
            state.taskList.unsorted = unsortedArray;
            state.taskList.sortTasks();

        },
        taskInThisDay(state, tasks) {
            state.taskInThisDay = tasks;
        }
    },
    actions: {
        async getAllTasks() {
            await axios.get(this.state.backendLink + "/getAllCalendarTasks", {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    "Access-Control-Allow-Origin": "*"
                }
            })
                .then((response) => {
                    this.commit('setTaskList', response.data);
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        showMessage(state, {messageText, color}) {
            var errorMessage = document.createElement("div");
            errorMessage.style.backgroundColor = color;
            errorMessage.style.padding = "10px";
            errorMessage.style.color = "black";
            errorMessage.style.position = "fixed";
            errorMessage.style.top = "10px";
            errorMessage.style.right = "10px";
            errorMessage.style.borderRadius = "20px";
            errorMessage.style.transition = "opacity 2.5s ease-in-out";
            errorMessage.style.opacity = "1";

            errorMessage.innerHTML = messageText;

            document.body.appendChild(errorMessage);
            setTimeout(function () {
                errorMessage.style.opacity = "0";
            }, 1);
            setTimeout(function () {
                errorMessage.remove();
            }, 2500);
        },
        checkToken() {
            axios.get(this.state.backendLink + "/checkToken", {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    "Access-Control-Allow-Origin": "*"
                }
            })
                .then((response) => {
                    console.log(response);
                    if (response.data == "Token is true") {
                        useStore.state.tokenIsTrue = true;
                    }
                })
                .catch(function (error) {
                    useStore.state.tokenIsTrue = false;
                    console.log(error);
                })
        },
        defineTasksOfDay() {

            let selectedDate = useStore.getters.selectedDay;
            let singlyTasks = useStore.getters.taskList.singly;

            let dailyTasks = useStore.getters.taskList.daily;
            let weeklyTasks = useStore.getters.taskList.weekly;
            let monthlyTasks = useStore.getters.taskList.monthly;
            let yearlyTasks = useStore.getters.taskList.yearly;


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
            useStore.commit('taskInThisDay', taskInThisDay);

            function roundDate(dateInMillis) {
                let d = new Date(dateInMillis);
                return new Date(d.getFullYear(), d.getMonth(), d.getDate())
            }
        },
    },
    getters: {
        selectedDay(state) {
            return state.selectedDay;
        },
        taskList(state) {
            return state.taskList;
        },
        unsortedTaskList(state){
          return state.taskList.unsorted
        },
        taskInThisDay(state) {
            return state.taskInThisDay;
        }
    },
    computed: {
        selectedDay() {
            return this.$store.getters.selectedDay;
        },
        unsortedTaskList(getters){
          return  getters.unsortedTaskList;
        },
        taskList() {
            return this.$store.taskList;
        },
        taskInThisDay() {
            return this.$store.getters.taskInThisDay;
        }
    },


})


