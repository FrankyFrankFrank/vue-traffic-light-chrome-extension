<template>
  <div class="main_app">
    <h1>Hello {{ msg }}</h1>
    <button @click="foo">Foo</button>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";

export default {
  name: 'popupView',
  data() {
    return {
      msg: 'popup'
    }
  },
  methods: {
    foo: async () => {
      const firebaseConfig = {
        apiKey: process.env.APIKEY,
        authDomain: process.env.AUTHDOMAIN,
        projectId: process.env.PROJECTID,
        storageBucket: process.env.STORAGEBUCKET,
        messagingSenderId: process.env.MESSAGINGSENDERID,
        appId: process.env.APPID,
        measurementId: process.env.MEASUREMENTID,
      };
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      const querySnapshot = await getDocs(collection(db, "teams"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
    }
  }
}
</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
