import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { markRaw } from "vue";

export default function FirebasePlugin() {
  const firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: process.env.VUE_APP_AUTHDOMAIN,
    projectId: process.env.VUE_APP_PROJECTID,
    storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_APPID,
    measurementId: process.env.VUE_APP_MEASUREMENTID,
  };
  const firebaseApp = initializeApp(firebaseConfig);

  return {
    firebaseApp: markRaw(firebaseApp),
    firebaseDB: markRaw(getFirestore(firebaseApp)),
  };
}
