<template>
  <div class="main_app">
    <h1>Hello {{ msg }}</h1>
    <label for="team-name">Team Name</label>
    <input type="text" id="team-name" v-model="teamName">
    <button @click="foo">Get {{ teamName }}</button>
    <p v-for="member in teamMembers" :key="member">{{ member }}</p>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";

export default {
  name: 'popupView',
  data() {
    return {
      msg: 'popup',
      teamName: null,
      teamMembers: [],
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
      const teamRef = doc(db, "teams", this.teamName)
      const teamSnap = await getDoc(teamRef);

      const data = teamSnap.data()
      this.msg = data.names[0]
      this.teamMembers = data.names
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
