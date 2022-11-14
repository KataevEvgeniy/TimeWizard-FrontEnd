<template>
	<div class="tasks">
        <div class="task_exam" v-for="post in posts" :key="post" :style="styleObject">
                <div class="name">Название: {{post.title}} </div>
                <div class="definition">Описание: {{post.definition}}</div>
        </div>
        <form @submit.prevent class="task_form" >
            <span>Название:</span>
            <input :value="title" @input="title = $event.target.value" class="name_input" type="Name" name="Namespase"><br>
            <span class="def">Описание:</span>
            <input :value="definition" @input="definition = $event.target.value" class="definition_input" type="Definition" name="Definitionspase"><br>
            <button class="button_input" @click="createPost">Новый пост</button>
        </form>
    </div>
</template>

<script>
	export default{
		data() {
            return {
                
                posts: [
                {id: 1, title: 'Javascript 1', definition: 'bad language 1'},
                {id: 2, title: 'Javascript 2', definition: 'bad language 2'},
                {id: 3, title: 'Javascript 3', definition: 'bad language 3'}
                ],
                title: '',
                definition: '',
                color: "red",
                styleObject: {
                    border: '3px solid red',
                    background: "linear-gradient(to right, red 3%, #474B4F 3%)",
                }
            }
        },
        methods: {
            createPost () {
                const newPost = {
                    id: Date.now(),
                    title: this.title,
                    definition: this.definition,
                }
                this.posts.push(newPost);
                this.title = "";
                this.definition = "";
            }
        }
    }
</script>

<style scoped>
	.task_exam,.task_form{
		min-width: 400px;
        
        margin-top: 15px;
	}
	.task_exam{
		border-radius: 14px;
        height: 60px;
        
        /* box-shadow: 0px 0px 4px 4px rgba(71,75,79,1); */
        border: 1px solid;
        border-color: grey;
    }
    .task_exam:hover{
        border: 1px solid;
        border-color: var(--color);
    }
	.task_form{
        text-align: right;
        background-color: #474B4F;
        border-radius: 14px;
    }
    
    .tasks{
        display:inline-block;
        width:60%;
        vertical-align:top;
    }
    
    .name,.definition{
        margin-left: 5%;
        text-align: left;

    }
    
    .definition{
        font-size: 16px;
    }
    
    .definition_input,.name_input,.button_input{
		border: none;
        margin-right: 10px;
        border-radius: 14px;
        background-color: #222629;
    }
    .def{
        font-size: 16px;
    }
</style>