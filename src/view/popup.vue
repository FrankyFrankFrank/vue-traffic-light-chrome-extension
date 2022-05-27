<template>
  <div class="main_app">
    <h1>Team {{ teamName }}</h1>
    <label for="team-name">Team Name</label>
    <input type="text" id="team-name" v-model="teamName">
    <button @click="foo">Get {{ teamName }}</button>
    <div v-for="member in teamMembers" :key="member">
      <p>{{ member.name }}</p>
      <p>{{ member.color }}</p>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export default {
  name: 'popupView',
  data() {
    return {
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
      const membersRef = collection(db, "teams", this.teamName, "members")

      onSnapshot(membersRef, (memberSnapshot) => {
        this.teamMembers = []
        memberSnapshot.forEach((doc) => {
          this.teamMembers.push(doc.data())
        })
      })
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
