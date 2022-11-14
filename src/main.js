
import { createApp } from 'vue'
import App from './App.vue'
import {useStore} from './components/store'
import router from './components/router'
createApp(App).use(router).use(useStore).mount('#app')
