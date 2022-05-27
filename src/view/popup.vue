<template>
  <div class="main_app">
    <div v-if="!loadedTeam">
      <h1>Find a team</h1>
      <label for="team-name">Team Name</label>
      <input type="text" id="team-name" v-model="teamName" />
      <button @click="loadTeam">Get {{ teamName }}</button>
    </div>

    <div v-if="loadedTeam">
      <h1>Team {{ loadedTeam }}</h1>
      <div v-for="member in teamMembers" :key="member">
        <p>{{ member.name }}</p>
        <p>{{ member.color }}</p>
        <button @click="setColor(member.id, 'yellow')">Yellow</button>
        <button @click="setColor(member.id, 'red')">red</button>
        <button @click="setColor(member.id, 'green')">green</button>
      </div>
      <label for="add-team-member">Add Team Member</label>
      <input type="text" id="add-team-member" v-model="newTeamMemberName" />
      <button @click="addTeamMember">Add</button>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, addDoc } from "firebase/firestore";

export default {
  name: 'popupView',
  data() {
    return {
      app: null,
      teamName: null,
      loadedTeam: null,
      teamMembers: [],
      newTeamMemberName: ''
    }
  },
  mounted() {
    const firebaseConfig = {
      apiKey: process.env.VUE_APP_APIKEY,
      authDomain: process.env.VUE_APP_AUTHDOMAIN,
      projectId: process.env.VUE_APP_PROJECTID,
      storageBucket: process.env.VUE_APP_STORAGEBUCKET,
      messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
      appId: process.env.VUE_APP_APPID,
      measurementId: process.env.VUE_APP_MEASUREMENTID,
    };
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  },
  methods: {
    async loadTeam() {
      const teamRef = doc(this.db, "teams", this.teamName)
      const teamSnapshot = await getDoc(teamRef)
      if (!teamSnapshot.exists) {
        return
      }
      this.loadedTeam = teamSnapshot.id
      const membersRef = collection(this.db, "teams", this.loadedTeam, "members")

      onSnapshot(membersRef, (memberSnapshot) => {
        this.teamMembers = []
        memberSnapshot.forEach((doc) => {
          const { name, color } = doc.data()
          const id = doc.id
          this.teamMembers.push({
            id,
            name,
            color
          })
        })
      })
    },
    async addTeamMember() {
      await addDoc(collection(this.db, "teams", this.loadedTeam, "members"), {
        name: this.newTeamMemberName
      })
    },
    setColor(memberId, color) {
      const memberRef = doc(this.db, "teams", this.loadedTeam, "members", memberId)

      updateDoc(memberRef, {
        color
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
  color: #2c3e50;
  padding: 2rem;
}
</style>
