<template>
    
    <RouterView></RouterView>
        
        
</template>

<script>
    
    import axios from "axios";

    export default {
        components:{
            
            
        },
        data(){
            return {
                
                
            }
        },
        methods:{
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
            }
        }
    }
</script>

<style>
    
</style>