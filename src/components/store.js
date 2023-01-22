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


