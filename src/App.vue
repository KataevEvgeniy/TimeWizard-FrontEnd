<template >

    <div :on-loadstart="this.$store.dispatch('checkToken')"></div>
    <div id="load-screen" v-if="this.$store.state.tokenIsTrue == null">
      <div class="spinner"></div>
    </div>

    <dynamic-background></dynamic-background>
    <welcome-form v-if="this.$store.state.tokenIsTrue === false"></welcome-form>
    <work-space v-if="this.$store.state.tokenIsTrue === true"></work-space>

</template>

<script>
    
    import WelcomeForm from "@/components/WelcomeForm.vue";
    import WorkSpace from "@/WorkSpace.vue";
    import DynamicBackground from "@/components/DynamicBackground.vue";
    export default {
        components:{
          DynamicBackground,
          WorkSpace,
          WelcomeForm
        },
        mounted(){

        },
        data(){
            return {

            }
        }
    }
</script>

<style lang="scss">

    body{
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    #load-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
    }

    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50px;
      height: 50px;
      margin-top: -25px;
      margin-left: -25px;
      border-radius: 50%;
      border: 5px solid #fff;
      border-top-color: #222629;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0); }
      100% { transform: rotate(360deg); }
    }
</style>