<template >
    <div :on-loadstart="checkToken()"></div>
    <div  class="main_box">
        <div id="main_text">THE APPLICATION THAT WILL IMPROVE YOUR PRODUCTIVITY</div>
        <div class="white_form">
            <button @click="changeForm"></button>
            <div v-if="isRegister == false">
                <login_form/>
            </div>
            <div v-else>
                <register_form/>
            </div>
            
        </div>  
    </div>
</template>

<script>
    import axios from "axios";
    import login_form from "./LoginForm.vue"
    import register_form from "./RegisterForm.vue"
    

    export default {
        components:{
            login_form,
            register_form
            
        },
        data(){
            return {
                isRegister: false,
                
            }
        },
        methods:{
            changeForm() {
                this.isRegister = this.isRegister == true ? false : true;
                
            },
            async checkToken(){
                await axios.get("http://localhost:8081/taskScheduler/checkToken",{headers:{'Authorization': localStorage.getItem('token'),
                "Access-Control-Allow-Origin": "*"}})
                .then((response) => {
                    console.log(response);
                    if(response.data == "Token is true")
                        location.href = 'http://localhost:8080/workspace'
                })
                .catch(function (error) {
                    console.log(error);
                    
                });
            },
            
        }
    }
</script>

<style>
    
    
    #main_text{
        font-family: "Verdana", Gadget, sans-serif;
        font-weight: 700;
        text-align: center;
        font-size: 50px;
        color: rgb(50, 205, 94);
        display:inline-block;
        text-shadow: rgba(0, 0, 0,0.3) 2px 2px 2px;
        width: 520px;
        margin-top: 100px;
        position:static;
        margin-right: 50px;
    }
    
    .white_form{
        position:static;
        display:inline-block;
        text-align: center;
        width: 90%;
        max-width: 500px;
        min-width: 300px;
        height: 500px;
        position: static;
        background-color: whitesmoke;
        border-radius: 14px;
        padding: 10px;
        box-shadow: 0px 0px 5px rgba(66,66,66,.75);
    }
    .main_box{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>