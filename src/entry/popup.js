import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FirebasePlugin from '@/store/plugins/FirebasePlugin'
import NotificationsPlugin from '@/store/plugins/NotificationsPlugin'
import App from '../view/popup.vue'

const pinia = createPinia()
pinia.use(FirebasePlugin)
pinia.use(NotificationsPlugin)

createApp(App)
    .use(pinia)
    .mount('#app')
