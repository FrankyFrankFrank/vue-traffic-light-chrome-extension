import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { markRaw } from "vue";

export default function FirebasePlugin() {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID,
  };
  const firebaseApp = initializeApp(firebaseConfig);

  return {
    firebaseApp: markRaw(firebaseApp),
    firebaseDB: markRaw(getFirestore(firebaseApp)),
  };
}
