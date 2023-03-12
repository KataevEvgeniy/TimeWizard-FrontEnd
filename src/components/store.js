import {createStore} from 'vuex'
import axios from 'axios'

// eslint-disable-next-line
export const useStore = createStore({
    state: {
        tokenIsTrue: null,
        backendLink: 'http://localhost:8081/taskScheduler',
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
            await axios.get(this.state.backendLink + "/getAllCallendarTasks", {
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
        }
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
    }
})


