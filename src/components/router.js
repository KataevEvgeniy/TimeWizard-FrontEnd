import { createWebHistory, createRouter } from "vue-router";
import workspace from '../WorkSpace'
import WelcomeForm from './WelcomeForm'


const routes = [
      { path: '/workspace', component: workspace },
      { path: '/', component: WelcomeForm },
      
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  export default router;