<template>
  <form @submit.prevent style="margin-top: 100px;">
    <input :value="User.username" @input="User.username = $event.target.value" placeholder="Username" type="text"
           class="white_input">
    <input :value="User.email" @input="checkEmail($event.target.value)" id="email" placeholder="Email" type="text"
           class="white_input">
    <input :value="User.password" @input="checkPassword($event.target.value)" id="password" placeholder="Password"
           type="Password" class="white_input"><br/>
    <button @click="register" class="white_button log_button">Register</button>
    <div id="errorPlaceholder"></div>
  </form>
</template>

<script>

import axios from 'axios'
import {useStore} from './store';


export default {
  components: {},
  data() {
    return {
      EMAIL_REGEX: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
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
  methods: {
    async register() {
      if (this.userIsTrue(this.User))
        await axios.post(this.$store.state.backendLink + "/register", this.User, {headers: {'Content-Type': 'application/json',}})
            .then((response) => {
              console.log(response);
              localStorage.setItem('token', response.headers.authorization);

              if (response.data == "Login is accept") {
                useStore.dispatch('showMessage', {messageText: response.data, color: 'green'})
                setTimeout(function () {
                  useStore.state.frontendLink = true;
                }, 500);
              }

            })
            .catch(function (error) {
              if (error.response.data == "User already registered")
                useStore.dispatch('showMessage', {messageText: error.response.data, color: 'red'})

              console.log(error);
            });
    },
    checkEmail(value) {
      this.User.email = value;
      if (value == "") {
        this.emailIsAccept = false;
        document.getElementById('email').setAttribute("style", "color: black");
      } else if (this.EMAIL_REGEX.test(value)) {
        this.emailIsAccept = true;
        document.getElementById('email').setAttribute("style", "color: black");
      } else {
        this.emailIsAccept = false;
        document.getElementById('email').setAttribute("style", "color: red");
      }
    },
    checkPassword(value) {
      this.User.password = value;
      if (value == "") {
        this.passwordIsAccept = false;
        document.getElementById('password').setAttribute("style", "color: black");
      } else if (this.PASSWORD_REGEX.test(value)) {
        this.passwordIsAccept = true;
        document.getElementById('password').setAttribute("style", "color: black");
      } else {
        this.passwordIsAccept = false;
        document.getElementById('password').setAttribute("style", "color: red");
      }
    },
    userIsTrue() {
      if (this.passwordIsAccept && this.emailIsAccept)
        return true;
      else {
        useStore.dispatch('showMessage', {messageText: 'You have entered incorrect data', color: 'red'})
        return false;
      }
    }
  }
}
</script>

<style>

.white_input {
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
  box-shadow: 0px 0px 5px rgba(66, 66, 66, .75);
  /* text-shadow: 0px 0px 5px rgba(66,66,66,.75); */
}
</style>