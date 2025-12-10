import { createApp } from 'vue'
import './styles/main.scss'
import App from './App.vue'
import pinia from './store'
import router from './router'
import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Toast, {
  position: 'top-right',
  duration: 3000,
})
app.mount('#app')
