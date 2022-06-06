import { createPinia } from 'pinia'
import FirebasePlugin from '@/store/plugins/FirebasePlugin'
import NotificationsPlugin from '@/store/plugins/NotificationsPlugin'

const piniaInstance = createPinia()
piniaInstance.use(FirebasePlugin)
piniaInstance.use(NotificationsPlugin)

export { piniaInstance }