import { createApp, markRaw, toRef } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import App from '../view/popup.vue'

function FirebasePlugin() {
    const firebaseConfig = {
        apiKey: process.env.VUE_APP_APIKEY,
        authDomain: process.env.VUE_APP_AUTHDOMAIN,
        projectId: process.env.VUE_APP_PROJECTID,
        storageBucket: process.env.VUE_APP_STORAGEBUCKET,
        messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
        appId: process.env.VUE_APP_APPID,
        measurementId: process.env.VUE_APP_MEASUREMENTID,
    };
    const firebaseApp = initializeApp(firebaseConfig)

    return {
        firebaseApp: markRaw(firebaseApp),
        firebaseDB: markRaw(getFirestore(firebaseApp)),
    }
}

function NotificationsPlugin({ store }) {
    store.$state.permissionStatus = 'default'
    store.permissionStatus = toRef(store.$state, "permissionStatus");
    store.askPermission = () => {
        Notification.requestPermission()
            .then(function (result) {
                store.$state.permissionStatus = result
                console.log(store.$state.permissionStatus);
            });
    }
    store.makeNotification = () => {
        var img = "/to-do-notifications/img/icon-128.png";
        var text = 'HEY! Your task is now overdue.';
        new Notification("To do list", {
          body: text,
          icon: img,
        });
    }
}

const pinia = createPinia()
pinia.use(FirebasePlugin)
pinia.use(NotificationsPlugin)

createApp(App)
    .use(pinia)
    .mount('#app')
