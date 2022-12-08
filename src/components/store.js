import {createStore} from 'vuex'
// eslint-disable-next-line
export const useStore = createStore({
    state: {
        visible: true,
        count: 0,
        taskTableArray: JSON.parse(localStorage.getItem("tasks")) ?? [[],[],[]]
    },
    mutations:{
        increment (state) {
            state.count++
        },
    },
    actions:{

    },
    getters:{
        
    },
    computed:{
        getF(state){
            return state.count
        }
    }
})


