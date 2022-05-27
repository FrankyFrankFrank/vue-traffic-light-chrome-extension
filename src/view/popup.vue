<template>
  <div class="p-4 w-72">
    <div v-if="!loadedTeam">
      <h1 class="text-lg uppercase font-bold tracking-widest">Find a team</h1>

      <label for="team-name" class="w-full uppercase tracking-widest">Team Name</label>
      <input type="text" id="team-name" v-model="teamName" class="border w-full mb-2 px-2 py-1 mr-1" />
      <button @click="loadTeam" :disabled="!teamName"
        class="w-full px-2 py-1 bg-stone-500 text-stone-100 uppercase tracking-widest font-bold">
        {{ teamName ? `Join Team ${teamName}` : 'Enter Team Name' }}
      </button>
    </div>

    <div v-if="loadedTeam">
      <h1 class="text-lg uppercase font-bold tracking-widest">Team {{ loadedTeam }}</h1>
      <div class="mb-4 border-b pb-4">
        <div v-for="member in teamMembers" :key="member">
          <div class="flex items-center justify-between">
            <div>
              <p>{{ member.name }}</p>
              <p>{{ member.color }}</p>
            </div>
            <div>
              <button class="inline w-6 h-6 rounded-full bg-red-500" @click="setColor(member.id, 'red')"></button>
              <button class="inline w-6 h-6 rounded-full bg-yellow-500" @click="setColor(member.id, 'yellow')"></button>
              <button class="inline w-6 h-6 rounded-full bg-green-500" @click="setColor(member.id, 'green')"></button>
            </div>
          </div>
          <button @click="removeTeamMember(member.id)">remove</button>
        </div>
      </div>
      <fieldset class="flex flex-wrap items-center mb-4 pb-4 border-b">
        <label class="w-full uppercase tracking-widest" for="add-team-member">Add Team Member</label>
        <input type="text" id="add-team-member" v-model="newTeamMemberName" class="border flex-grow px-2 py-1 mr-1" />
        <button @click="addTeamMember"
          class="px-2 py-1 bg-blue-800 hover:bg-white text-white hover:text-blue-800 border border-blue-800 font-bold">Add</button>
      </fieldset>
      <div class="flex items-stretch">
        <button @click="disconnectFromTeam"
          class="w-full px-2 py-1 border border-slate-800 bg-slate-800 text-white hover:bg-white hover:text-slate-800 mr-1 font-bold">Disconnect</button>
        <button @click="deleteTeam"
          class="w-full px-2 py-1 border border-red-800 bg-red-800 text-white hover:bg-white hover:text-red-800 font-bold">Delete
          Team</button>
      </div>
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
