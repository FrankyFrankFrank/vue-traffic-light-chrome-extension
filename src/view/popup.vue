<template>
  <div class="p-4 w-72">
    <TeamFinderVue v-if="!loadedTeam" :loadTeam="loadTeam" />

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

<script setup>
import { ref, onMounted } from 'vue'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDoc, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import TeamFinderVue from "@/components/TeamFinder.vue";
import { useTeamStore } from '@/store/teamStore';

const app = ref(null)
const db = ref(null)
const teamNameSearch = ref(null)
const loadedTeam = ref(null)
const teamMembers = ref([])
const newTeamMemberName = ref('')
const snapshotListenerUnsubscribe = ref(() => { })

const teamStore = useTeamStore()

onMounted(() => {
  const firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: process.env.VUE_APP_AUTHDOMAIN,
    projectId: process.env.VUE_APP_PROJECTID,
    storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_APPID,
    measurementId: process.env.VUE_APP_MEASUREMENTID,
  };
  app.value = initializeApp(firebaseConfig);
  db.value = getFirestore(app.value);

  console.log(teamStore.team)
  teamStore.team++
  console.log(teamStore.team)


  chrome.storage.sync.get(["loadedTeam"], (data) => {
    const loadedTeam = data.loadedTeam;
    if (!loadedTeam) return
    loadTeam(loadedTeam)
  })
})

async function createTeam(teamName) {
  await addDoc(collection(db.value, "teams", teamName));
  loadTeam(teamName)
}

async function loadTeam(teamName) {
  const teamRef = doc(db.value, "teams", teamName)
  const teamSnapshot = await getDoc(teamRef)
  if (!teamSnapshot.exists) {
    createTeam(teamName)
    return
  }
  loadedTeam.value = teamSnapshot.id

  chrome.storage.sync.set({ loadedTeam: loadedTeam.value })

  const membersRef = collection(db.value, "teams", loadedTeam.value, "members")

  // Need to store the return value of the onSnapshot to use later to unsubscribe
  snapshotListenerUnsubscribe.value = onSnapshot(membersRef, (memberSnapshot) => {
    teamMembers.value = []
    memberSnapshot.forEach((doc) => {
      const { name, color } = doc.data()
      const id = doc.id
      teamMembers.value.push({
        id,
        name,
        color
      })
    })
  })
}

async function deleteTeam() {
  const membersRef = collection(db.value, "teams", loadedTeam.value, "members")
  const memberSnapshot = await getDocs(membersRef)
  memberSnapshot.forEach(async (member) => {
    await deleteDoc(doc(db.value, "teams", loadedTeam.value, "members", member.id))
  })

  await deleteDoc(doc(db.value, "teams", loadedTeam.value))

  loadedTeam.value = null
  teamMembers.value = null
}

function disconnectFromTeam() {
  snapshotListenerUnsubscribe.value()
  loadedTeam.value = null
  teamNameSearch.value = null
  teamMembers.value = []
  chrome.storage.sync.set({ loadedTeam: loadedTeam.value })
}

async function addTeamMember() {
  await addDoc(collection(db.value, "teams", loadedTeam.value, "members"), {
    name: newTeamMemberName.value
  })
  newTeamMemberName.value = null
}

async function removeTeamMember(memberId) {
  await deleteDoc(doc(db.value, "teams", loadedTeam.value, "members", memberId))
}

function setColor(memberId, color) {
  const memberRef = doc(db.value, "teams", loadedTeam.value, "members", memberId)

  updateDoc(memberRef, {
    color
  })
}

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
