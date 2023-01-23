import {createStore} from 'vuex'
import axios from 'axios'
// eslint-disable-next-line
export const useStore = createStore({
    state: {
        visible: true,
        count: 0,
        taskTableArray: [],
        taskInThisDay: [],
        selectedDay: new Date(), 
    },
    mutations:{
        increment (state) {
            state.count++
        },
        setSelectedDay(state, date){
            state.selectedDay = date;
        },
        setTaskTableArray(state,array){
            state.taskTableArray = array;
        },
        taskInThisDay(state,tasks){
            state.taskInThisDay = tasks;
        }
    },
    actions:{
        async getAllTasks(){
            await axios.get("http://localhost:8081/taskScheduler/getAllTasks",{headers:{'Authorization': localStorage.getItem('token'),
            "Access-Control-Allow-Origin": "*"}})
            .then((response) => {
                
                this.commit('setTaskTableArray',response.data);
                //localStorage.setItem("tasks", JSON.stringify(this.taskTableArray));
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
                
            });
            
        },
        showMessage(state,{messageText,color}){
            var errorMessage = document.createElement("div");
            errorMessage.style.backgroundColor = color;
            errorMessage.style.padding = "10px";
            errorMessage.style.color = "black";
            errorMessage.style.position = "fixed";
            errorMessage.style.top = "10px";
            errorMessage.style.right = "10px";
            errorMessage.style.borderRadius = "20px";
            errorMessage.style.transition = "opacity 10s ease-in-out";
            errorMessage.style.opacity = "1";

            errorMessage.innerHTML = messageText;
            
            document.body.appendChild(errorMessage);
            setTimeout(function(){
                errorMessage.style.opacity = "0";
            },1);
            setTimeout(function() {
                errorMessage.remove();
            }, 10000); 
        },
    },
    getters:{
        selectedDay(state) {
            return state.selectedDay;
        },
        taskTableArray(state){
            return state.taskTableArray;
        },
        taskInThisDay(state){
            return state.taskInThisDay;
        }
    },
    computed:{
        selectedDay(){
            return this.$store.getters.selectedDay;
        },
        taskTableArray(){
            return this.$store.getters.taskTableArray;
        },
        taskInThisDay(){
            return this.$store.getters.taskInThisDay;
        }
    }
})


