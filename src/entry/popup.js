import { piniaInstance } from '@/store'
import { createApp } from 'vue'
import App from '../view/popup.vue'
import '../index.css'

const app = createApp(App)
piniaInstance.install(app)
app.mount('#app')
