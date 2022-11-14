<template>
    <div style="text-align: center;" class="window">
        <div v-if="dio == true" class="head" >
            <button  @click="brando" >Исчезает</button>
            <button @click="hi">Меняется{{this.$store.state.count}}</button>
        </div>
        <div class="main_container">
            <div class="doughnut_left">
                <mychart/>
            </div>
            <div class="doughnut_right" >
                <mychart/>
            </div>
        </div>
        
        <div >
            <button style="border-top-left-radius: 14px;" class="chose_button" @click="show_me1">#1</button>
            <button  class="chose_button" @click="show_me2">#2</button>
            <button style="border-top-right-radius: 14px;" class="chose_button" @click="show_me3">#3</button>
        </div>
        
        <div class="tasks">
            <mytask v-if="show1"/>
            <mytask v-if="show2"/>
            <mytask v-if="show3"/>
        </div>
    </div>
</template>

<script>
    import  mychart from './components/MyChart'
    import mytask from './components/TaskTable'
    //import axios from 'axios'

    import { useStore } from './components/store'
    //import vuex from 'vuex'

    export default {
        components: {
            mychart,
            mytask,
        },
        data() {
            return {
                show1: true,
                show2: false,
                show3: false,
                User: {
                    username: '',
                    email: '',
                    password: ''
                },
            }
        },
        methods: {
            hi (){
                useStore.commit("increment");
                
            },
            show_me1 () {
                this.show1 = true;
                this.show2 = false;
                this.show3 = false;
            },
            show_me2 () {
                this.show1 = false;
                this.show2 = true;
                this.show3 = false;
            },
            show_me3 () {
                this.show1 = false;
                this.show2 = false;
                this.show3 = true;
            },
            

            
        }
    }
</script>

<style>
    body{

        margin: 0px;
        padding: 0px;
        padding-bottom: 30px;
        background-color: #222629;
    }
    .head{
        text-align: right;
        display: block;
        background-color: #222629;
        position: static;
        height: 100px;
    }
    .main_container{
        border-radius: 10px;
        height: 440px;
        background-image:  url('./assets/doughnut-background.jpg');
        background-repeat: no-repeat;
        background-size: 100%;
        text-align: center;
    }
    .doughnut_left,.doughnut_right{
        position: static;
        height: 93%;
        width: 400px;
        background-image: url('./assets/clock.png');
        background-size: 47.5%;
        background-repeat: no-repeat;
        background-position: center;

    }
    .doughnut_left{
        margin-right: 50px;
        display:inline-block;
    }
    .doughnut_right{
        margin-left: 50px;
        display:inline-block;
    }
    .tasks{
        text-align: center;
        font-size: 20px;
        color: #FFFFFF;
        
        background-color: #222629;
    }
    .chose_button{
        
        border-width: 0px;
        display: inline-block;
        width: 20%;
    }
    .register_form{
        /* box-shadow: 0px 0px 400px 108px rgba(0,0,0,0.75); */
        margin:auto;
        margin-top: 100px;
        
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
    .back{
        top: 0px;

        text-align: center;
        width: 100%;
        height: 100%;
        background-color: rgba(34,34,34,0.8);
        position: fixed;

    }
    
    .register_input{
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
    .register_button {
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
    .register_button:hover {
        background-color:#ced1cd;
    }
    .register_button:active {
        position:relative;
        top:1px;
    }
    .close {
        margin-left: auto;
        margin-right: 10px;
        width: 1.3em;
        height: 1.3em;
        background-color: rgb(133, 133, 133);
        clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
    }
</style>