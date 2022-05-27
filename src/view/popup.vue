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
        <button @click="removeTeamMember(member.id)">remove</button>
      </div>
      <label for="add-team-member">Add Team Member</label>
      <input type="text" id="add-team-member" v-model="newTeamMemberName" />
      <button @click="addTeamMember">Add</button>
      <button @click="disconnectFromTeam">Disconnect from Team</button>
      <button @click="deleteTeam">Delete Team</button>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, addDoc, deleteDoc, getDocs } from "firebase/firestore";

export default {
  name: 'popupView',
  data() {
    return {
      app: null,
      teamName: null,
      loadedTeam: null,
      teamMembers: [],
      newTeamMemberName: '',
      snapshotListenerUnsubscribe: () => { }
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

    chrome.storage.sync.get(["loadedTeam"], (data) => {
      const loadedTeam = data.loadedTeam;
      if (!loadedTeam) return
      this.teamName = loadedTeam
      this.loadTeam()
    })
  },
  methods: {
    async createTeam() {
      await addDoc(collection(this.db, "teams", this.teamName));
      this.loadTeam()
    },
    async deleteTeam() {
      const membersRef = collection(this.db, "teams", this.loadedTeam, "members")
      const memberSnapshot = await getDocs(membersRef)
      memberSnapshot.forEach(async (member) => {
        await deleteDoc(doc(this.db, "teams", this.loadedTeam, "members", member.id))
      })

      await deleteDoc(doc(this.db, "teams", this.loadedTeam))

      this.loadedTeam = null
      this.teamMembers = null
    },
    async loadTeam() {
      const teamRef = doc(this.db, "teams", this.teamName)
      const teamSnapshot = await getDoc(teamRef)
      if (!teamSnapshot.exists) {
        this.createTeam()
        return
      }
      this.loadedTeam = teamSnapshot.id

      chrome.storage.sync.set({ loadedTeam: this.loadedTeam })

      const membersRef = collection(this.db, "teams", this.loadedTeam, "members")

      // Need to store the return value of the onSnapshot to use later to unsubscribe
      this.snapshotListenerUnsubscribe = onSnapshot(membersRef, (memberSnapshot) => {
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
    disconnectFromTeam() {
      this.snapshotListenerUnsubscribe()
      this.loadedTeam = null
      this.teamName = null
      this.teamMembers = []
      chrome.storage.sync.set({ loadedTeam: this.loadedTeam })
    },
    async addTeamMember() {
      await addDoc(collection(this.db, "teams", this.loadedTeam, "members"), {
        name: this.newTeamMemberName
      })
      this.teamName = null
    },
    async removeTeamMember(memberId) {
      await deleteDoc(doc(this.db, "teams", this.loadedTeam, "members", memberId))
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
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
