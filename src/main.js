import { createApp } from 'vue'
import App from './App.vue'
import {useStore} from './components/store'


createApp(App).use(useStore).mount('#app')
