import { piniaInstance } from '@/store'
import { createApp } from 'vue'
import App from '../view/options.vue'

const app = createApp(App)
piniaInstance.install(app)
app.mount('#app')
