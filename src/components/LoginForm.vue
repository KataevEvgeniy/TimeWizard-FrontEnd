<template>
    <form @submit.prevent style="margin-top: 100px;">
        <input :value="User.email" @input="checkEmail($event.target.value)" id="email" placeholder="Email" type="text" class="white_input">
        <input :value="User.password" @input="checkPassword($event.target.value)" id="password"  placeholder="Password" type="Password" class="white_input"><br/>
        <button @click="login" class="white_button" >Login</button>
    </form>
</template>

<script>

    import axios from 'axios'
    import { useStore } from './store';


    export default {
        components:{

        },
        data(){
            return {
                EMAIL_REGEX : /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
                PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
                emailIsAccept: false,
                passwordIsAccept: false,
                User: {
                    username: '',
                    email: '',
                    password: ''
                },
            }
        },
        methods:{
            async login(){
                if(this.userIsTrue(this.User))
                    await axios.post(this.$store.state.backendLink + "/login", this.User,{headers:{'Content-Type': 'application/json',}})
                    .then((response) => {
                        console.log(response.headers);
                        localStorage.setItem('token',response.headers.authorization);
                        if(response.data == "Login is accept"){
                            useStore.dispatch('showMessage',{messageText:response.data,color:'green'})
                            setTimeout(function() {
                                location.href = this.$store.state.frontendLink + '/workspace'
                            }, 500);
                        }
                    })
                    .catch(function (error) {
                        if(error.response.data == "Login failed")
                            useStore.dispatch('showMessage',{messageText:"Password or login is incorrect",color:'red'})
                        console.log(error);
                    });
            },
            checkEmail(value){
                this.User.email = value;
                if(value == ""){
                    this.emailIsAccept = false;
                    document.getElementById('email').setAttribute("style", "color: black");
                }else if(this.EMAIL_REGEX.test(value)){
                    this.emailIsAccept = true;
                    document.getElementById('email').setAttribute("style", "color: black");
                }else{
                    this.emailIsAccept = false;
                    document.getElementById('email').setAttribute("style", "color: red");
                }
            },
            checkPassword(value){
                this.User.password = value;
                if(value == ""){
                    this.passwordIsAccept = false;
                    document.getElementById('password').setAttribute("style", "color: black");
                }else if(this.PASSWORD_REGEX.test(value)){
                    this.passwordIsAccept = true;
                    document.getElementById('password').setAttribute("style", "color: black");
                }else{
                    this.passwordIsAccept = false;
                    document.getElementById('password').setAttribute("style", "color: red");
                }    
            },
            userIsTrue(){
                if (this.passwordIsAccept && this.emailIsAccept)
                    return true
                else{
                    useStore.dispatch('showMessage',{messageText:'You have entered incorrect data',color:'red'})
                    return false
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