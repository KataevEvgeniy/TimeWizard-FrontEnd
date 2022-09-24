<template>
    <div style="text-align: center;" class="window">
        
        <div v-if="dio == true" class="head" >
            <button  @click="brando" >Исчезает</button>
            <button  >Меняется</button>
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
            <button class="chose_button" @click="show_me1">#1</button>
            <button class="chose_button" @click="show_me2">#2</button>
            <button class="chose_button" @click="show_me3">#3</button>
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

    export default {
        components: {
            mychart,
            mytask
        },
        data() {
            return {
                dio: true,
                show1: true,
                show2: false,
                show3: false,
                number: 3,

            }
        },
        methods: {
            brando() {
                this.dio = this.dio ? false : true;
            },
            da () {
                this.style.fontSize = "36px";
                this.style.color = "red";
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
            }

            
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
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        border-width: 0px;
        display: inline-block;
        width: 20%;
    }
</style>