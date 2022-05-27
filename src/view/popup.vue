<template>
  <div class="p-4 w-72">
    <div v-if="!loadedTeam">
      <h1 class="text-lg text-center uppercase font-bold tracking-widest">Find a team</h1>

      <label for="team-name" class="w-full uppercase tracking-widest">Team Name</label>
      <input type="text" id="team-name" v-model="teamNameSearch" class="border w-full mb-2 px-2 py-1 mr-1" />
      <button @click="loadTeam" :disabled="!teamNameSearch"
        class="w-full px-2 py-1 uppercase tracking-widest bg-blue-800 hover:bg-white text-white hover:text-blue-800 border border-blue-800 font-bold"
        :class="{ 'opacity-20': !teamNameSearch, 'cursor-not-allowed': !teamNameSearch }">
        {{ teamNameSearch ? `Join Team ${teamNameSearch}` : 'Enter Team Name' }}
      </button>
    </div>

    <div v-if="loadedTeam">
      <h1 class="text-lg text-center uppercase font-bold tracking-widest mb-4">Team {{ loadedTeam }}</h1>
      <div class="mb-4 border-b pb-4">
        <div v-for="member in teamMembers" :key="member" class="mb-2">
          <div class="flex items-center justify-between">
            <div class="group flex flex-grow justify-between items-center mr-2">
              <p class="uppercase">{{ member.name }}</p>
              <button @click="removeTeamMember(member.id)"
                class="invisible group-hover:visible text-xs border border-red-700 text-red-700 uppercase px-1 py-0.5 rounded">Remove</button>
            </div>
            <div>
              <button class="inline w-6 h-6 mr-1 rounded-full bg-green-500"
                :class="{ 'bg-green-500': member.color == 'green', 'shadow': member.color == 'green', 'shadow-green-500': member.color == 'green', 'bg-green-900': member.color != 'green' }"
                @click="setColor(member.id, 'green')"></button>
              <button class="inline w-6 h-6 mr-1 rounded-full bg-yellow-500"
                :class="{ 'bg-yellow-500': member.color == 'yellow', 'shadow': member.color == 'yellow', 'shadow-yellow-500': member.color == 'yellow', 'bg-yellow-900': member.color != 'yellow' }"
                @click="setColor(member.id, 'yellow')"></button>
              <button class="inline w-6 h-6 mr-1 rounded-full bg-red-500"
                :class="{ 'bg-red-500': member.color == 'red', 'shadow': member.color == 'red', 'shadow-red-500': member.color == 'red', 'bg-red-900': member.color != 'red' }"
                @click="setColor(member.id, 'red')"></button>
            </div>
          </div>
        </div>
      </div>
      <form v-on:submit.prevent="addTeamMember">
        <fieldset class="flex flex-wrap items-center mb-4 pb-4 border-b">
          <label class="w-full uppercase tracking-widest" for="add-team-member">Add Team Member</label>
          <input type="text" id="add-team-member" v-model="newTeamMemberName" class="border flex-grow px-2 py-1 mr-1" />
          <input type="submit"
            class="px-2 py-1 bg-blue-800 hover:bg-white text-white hover:text-blue-800 border border-blue-800 font-bold"
            value="Add">
        </fieldset>
      </form>
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
      teamNameSearch: null,
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
      this.teamNameSearch = loadedTeam
      this.loadTeam()
    })
  },
  methods: {
    async createTeam() {
      await addDoc(collection(this.db, "teams", this.teamNameSearch));
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
      const teamRef = doc(this.db, "teams", this.teamNameSearch)
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
      this.teamNameSearch = null
      this.teamMembers = []
      chrome.storage.sync.set({ loadedTeam: this.loadedTeam })
    },
    async addTeamMember() {
      await addDoc(collection(this.db, "teams", this.loadedTeam, "members"), {
        name: this.newTeamMemberName
      })
      this.newTeamMemberName = null
    },
    async removeTeamMember(memberId) {
      await deleteDoc(doc(this.db, "teams", this.loadedTeam, "members", memberId))
    },
    setColor(memberId, color) {
      const memberRef = doc(this.db, "teams", this.loadedTeam, "members", memberId)

      updateDoc(memberRef, {
        color
      })
    },
    getBgColor(color) {
      return {
        'bg-red-500': color == 'red',
        'bg-yellow-500': color == 'yellow',
        'bg-green-500': color == 'green',
      }
    }
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
