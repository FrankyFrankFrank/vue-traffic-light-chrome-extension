<template>
  <div class="main_app">
    <h1>Hello {{ msg }}</h1>
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
import { getFirestore, getDocs, collection } from "firebase/firestore";

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
      const membersRef = collection(db, "teams", this.teamName, "members")
      const memberDocs = await getDocs(membersRef);

      if (memberDocs.empty) {
        console.log('WJAT?!')
        return
      }
      memberDocs.forEach((doc) => {
        console.log('foo')
        console.log(JSON.stringify(doc.data()))
        this.teamMembers.push(doc.data())
      })
      // this.msg = this.teamMembers[0].name
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
