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
            singly: [],
            daily: [],
            weekly: [],
            monthly: [],
            yearly: []
        },
        taskInThisDay: [],
        selectedDay: new Date(),
    },
    mutations: {
        setSelectedDay(state, date) {
            state.selectedDay = date;
        },
        setTaskList(state, array) {
            state.taskList = array;
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

                    this.commit('setTaskList', sort(response.data));
                    //localStorage.setItem("tasks", JSON.stringify(this.TaskListArray));
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);

                });

            function sort(array) {
                let sortedArray = {
                    singly: [],
                    daily: [],
                    weekly: [],
                    monthly: [],
                    yearly: []
                };
                array.forEach(elem => {
                    if (elem.timeUnit == 'never')
                        sortedArray.singly.push(elem);
                    else if (elem.timeUnit == 'day')
                        sortedArray.daily.push(elem);
                    else if (elem.timeUnit == 'week')
                        sortedArray.weekly.push(elem);
                    else if (elem.timeUnit == 'month')
                        sortedArray.monthly.push(elem);
                    else if (elem.timeUnit == 'year')
                        sortedArray.yearly.push(elem);
                });
                return sortedArray;
            }
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
        taskInThisDay(state) {
            return state.taskInThisDay;
        }
    },
    computed: {
        selectedDay() {
            return this.$store.getters.selectedDay;
        },
        taskListArray() {
            return this.$store.getters.taskList;
        },
        taskInThisDay() {
            return this.$store.getters.taskInThisDay;
        }
    }
})


