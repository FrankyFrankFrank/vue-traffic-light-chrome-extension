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
    async foo() {
      const firebaseConfig = {
        apiKey: process.env.VUE_APP_APIKEY,
        authDomain: process.env.VUE_APP_AUTHDOMAIN,
        projectId: process.env.VUE_APP_PROJECTID,
        storageBucket: process.env.VUE_APP_STORAGEBUCKET,
        messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
        appId: process.env.VUE_APP_APPID,
        measurementId: process.env.VUE_APP_MEASUREMENTID,
      };
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      const querySnapshot = await getDocs(collection(db, "teams"));
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        this.msg = data.teamName
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
