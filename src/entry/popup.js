import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '../view/popup.vue'

createApp(App)
    .use(createPinia())
    .mount('#app')
