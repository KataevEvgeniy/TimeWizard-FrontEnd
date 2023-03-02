<template >
    <div  class="container">
        <div id="welcome_text">THE APPLICATION THAT WILL IMPROVE YOUR PRODUCTIVITY</div>
        <div class="form">
            <button @click="changeForm">{{ typeMenu == "login" ? "Register" : "Login" }}</button>
            <div v-if="typeMenu == 'login'">
                <login_form/>
            </div>
            <div v-if="typeMenu=='register'">
                <register_form/>
            </div>
            
        </div>  
    </div>
</template>

<script>
    

    import login_form from "./LoginForm.vue"
    import register_form from "./RegisterForm.vue"
    


    export default {
        components:{
            login_form,
            register_form
            
        },
        data(){
            return {
                typeMenu: "login",
                
            }
        },
        methods:{
            changeForm() {
                this.typeMenu = this.typeMenu == "register" ? "login" : "register";
                
            }, 
        }
    }
</script>

<style scoped>
    
    
    #welcome_text{
        font-weight: 700;
        text-align: center;
        font-size: 50px;
        color: rgb(50, 205, 94);
        text-shadow: rgba(0, 0, 0,0.3) 2px 2px 2px;
        width: 520px;
        display:inline-block;
        margin-top: 100px;
        position:static;
        margin-right: 50px;
    }
    
    .form{
        position:static;
        display:inline-block;
        text-align: center;
        max-width: 500px;
        min-width: 300px;
        height: 500px;
        position: static;
        background-color: whitesmoke;
        border-radius: 14px;
        padding: 10px;
        box-shadow: 0px 0px 5px rgba(66,66,66,.75);
    }
    .container{
        padding:1vw;
        display: flex;
        flex-direction: row;
        justify-content: center;

    }
</style>