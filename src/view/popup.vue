<template>
  <div class="p-4 w-72">
    <TeamFinderVue v-if="!loadedTeam" :loadTeam="loadTeam" :createTeam="createTeam" />

    <div v-if="loadedTeam">
      <h1 class="text-lg text-center font-bold tracking-widest mb-4">
        <span class="text-slate-400">Team</span>
        {{ loadedTeam }}
        <button @click="copyTeamNameToClipboard(loadedTeam)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </h1>
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
              <button class="inline w-6 h-6 mr-1 rounded-full bg-gray-500"
                :class="{ 'bg-gray-500': member.color == 'away', 'shadow': member.color == 'away', 'shadow-gray-500': member.color == 'away', 'bg-gray-900': member.color != 'away' }"
                @click="setColor(member.id, 'away')"></button>
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
import { storeToRefs } from 'pinia'
import { collection, onSnapshot, doc, updateDoc, getDoc, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import TeamFinderVue from "@/components/TeamFinder.vue";
import { useTeamStore } from '@/store/teamStore';
import { v4 as uuid } from 'uuid'

const newTeamMemberName = ref('')

const teamStore = useTeamStore()
const { loadedTeam, teamMembers } = storeToRefs(teamStore)
const { firebaseDB } = teamStore

onMounted(() => {
  chrome.storage.sync.get(["loadedTeam"], (data) => {
    const loadedTeam = data.loadedTeam;
    if (!loadedTeam) return
    loadTeam(loadedTeam)
  })
})

async function createTeam() {
  const teamDocId = btoa(uuid()).substring(0, 8);
  await getTeamById(teamDocId)
  storeTeamInChrome()
  watchForMemberChanges()
}

async function loadTeam(teamDocId) {
  await getTeamById(teamDocId);
  storeTeamInChrome()
  watchForMemberChanges()
}

async function getTeamById(teamDocId) {
  const teamRef = doc(firebaseDB, "teams", teamDocId);
  const teamSnapshot = await getDoc(teamRef);
  teamStore.setLoadedTeam(teamSnapshot.id);
}

function storeTeamInChrome() {
  chrome.storage.sync.set({ loadedTeam: loadedTeam.value })
}

function watchForMemberChanges() {
  const membersRef = collection(firebaseDB, "teams", loadedTeam.value, "members")
  teamStore.snapshotListenerUnsubscribe = onSnapshot(membersRef, teamStore.setTeamMembers)
}

async function deleteTeam() {
  const membersRef = collection(firebaseDB, "teams", loadedTeam.value, "members")
  const memberSnapshot = await getDocs(membersRef)
  memberSnapshot.forEach(async (member) => {
    await deleteDoc(doc(firebaseDB, "teams", loadedTeam.value, "members", member.id))
  })

  await deleteDoc(doc(firebaseDB, "teams", loadedTeam.value))

  loadedTeam.value = null
  teamStore.teamMembers = null
}

function disconnectFromTeam() {
  teamStore.disconnectFromTeam()
}

async function addTeamMember() {
  await addDoc(collection(firebaseDB, "teams", loadedTeam.value, "members"), {
    name: newTeamMemberName.value
  })
  newTeamMemberName.value = null
}

async function removeTeamMember(memberId) {
  await deleteDoc(doc(firebaseDB, "teams", loadedTeam.value, "members", memberId))
}

function setColor(memberId, color) {
  const memberRef = doc(firebaseDB, "teams", loadedTeam.value, "members", memberId)

  updateDoc(memberRef, {
    color
  })
}

function copyTeamNameToClipboard(teamName) {
  navigator.clipboard.writeText(teamName);
}

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
