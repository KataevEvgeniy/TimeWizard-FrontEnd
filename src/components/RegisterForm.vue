<template>
    <form @submit.prevent style="margin-top: 100px;">
        <input :value="User.username" @input="User.username = $event.target.value" placeholder="Username" type="text" class="white_input">
        <input :value="User.email" @input="checkEmail($event.target.value)" id="email" placeholder="Email" type="text" class="white_input">
        <input :value="User.password" @input="User.password = $event.target.value" placeholder="Password" type="Password" class="white_input"><br/>
        <input @input="checkPassword($event.target.value)" id="checkerPass" placeholder="Retype password" type="Password" class="white_input"><br/>
        <button @click="register"  class="white_button" >Register</button>
        <div id="errorPlaceholder"></div>
    </form>
</template>

<script>

    import axios from 'axios'



    export default {
        components:{

        },
        data(){
            return {
                EMAIL_REGEXP : /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                User: {
                    username: '',
                    email: '',
                    password: ''
                },
            }
        },
        methods:{
            async register(){
                await axios.post("http://localhost:8081/taskScheduler/register", this.User,{headers:{'Content-Type': 'application/json',}})
                .then((response) => {
                    console.log(response);
                    localStorage.setItem('token',response.headers.authorization);
                    if(response.data == "Login is accept")
                        location.href = 'http://localhost:8080/workspace'
                })
                .catch(function (error) {
                    if(error.response.data == "User already registered"){
                        console.log("уже зареган");
                        document.getElementById('errorPlaceholder').innerHTML = "Вы уже зарегистрированны!";
                    }
                    console.log(error);
                });
            },
            checkEmail(value){
                if(value == "" && this.EMAIL_REGEXP.test(value)){
                    
                    document.getElementById('email').setAttribute("style", "color: black");
                }else if(this.EMAIL_REGEXP.test(value)){
                    this.User.email = value;
                    document.getElementById('email').setAttribute("style", "color: black");
                }else{
                    document.getElementById('email').setAttribute("style", "color: red");
                }
                
            },
            checkPassword(value){
                if(value != this.User.password)
                    document.getElementById('checkerPass').setAttribute("style", "color: red");
                else{
                    document.getElementById('checkerPass').setAttribute("style", "color: black");
                    this.User.password = value;
                }
                    
            }
        }
    }
</script>

<style>

    .white_input{
        margin-bottom: 10px;
        font-size: medium;
        width: 80%;
        max-width: 400px;
        min-width: 250px;
        padding: 6px;
       
        
        border-width: 0px;
        border-color: #CCCCCC;
        background-color: #FFFFFF;
        color: #000000;
        border-style: solid;
        border-radius: 14px;
        box-shadow: 0px 0px 5px rgba(66,66,66,.75);
        /* text-shadow: 0px 0px 5px rgba(66,66,66,.75); */
    }
    .white_button {
        background-color:#c2c2c2;
        border-radius:29px;
        display:inline-block;
        cursor:pointer;
        color:#ffffff;
        font-family:Arial;
        font-size:17px;
        padding:16px 76px;
        text-decoration:none;
        text-shadow:0px 1px 0px #5b8a3c;
    }
    .white_button:hover {
        background-color:#ced1cd;
    }
    .white_button:active {
        position:relative;
        top:1px;
    }
</style>