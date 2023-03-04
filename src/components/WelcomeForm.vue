<template>
  <div class="container">
    <div id="welcome_text">THE APPLICATION THAT WILL IMPROVE YOUR PRODUCTIVITY</div>
    <div class="form">
      <button class="white_button" :style="{backgroundColor:typeMenu === 'Login'?'#333':'#fff'}"
              @click="typeMenu='Login'">Login
      </button>
      <button class="white_button" :style="{backgroundColor:typeMenu === 'Register'?'#333':'#fff'}"
              @click="typeMenu='Register'">Register
      </button>
      <div v-if="typeMenu === 'Login'">
        <login_form/>
      </div>
      <div v-if="typeMenu==='Register'">
        <register_form/>
      </div>
    </div>
  </div>
</template>

<script>
import login_form from "./LoginForm.vue"
import register_form from "./RegisterForm.vue"

export default {
  components: {
    login_form,
    register_form
  },
  data() {
    return {
      typeMenu: "Login",
    }
  }
}
</script>

<style scoped>


#welcome_text {
  font-weight: 700;
  text-align: center;
  font-size: 50px;
  color: rgb(50, 205, 94);
  text-shadow: rgba(0, 0, 0, 0.3) 2px 2px 2px;
  width: 520px;
  height: initial;
  min-width: 320px;
  margin: auto;
}

.form {
  text-align: center;
  max-width: 500px;
  min-width: 300px;
  height: 500px;
  background-color: rgb(256, 256, 256, 0.7);
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0px 0px 5px rgba(66, 66, 66, .75);
  margin: auto;
}

.container {
  padding-top: 1vw;
  display: flex;
  flex-direction: row;
  justify-content: center;

  width: 100vw;
  margin: auto;
}

@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;

  }
}

</style>

<style>
.white_button {
  margin-top: 5px;
  background: #fff;
  color: #333;
  border: 2px solid #333;
  padding: 15px 60px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.white_button:hover {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}
</style>