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
          <MemberRow :member="member" />
        </div>
      </div>
      <AddTeamMemberForm />
      <div class="flex items-stretch">
        <button @click="disconnectFromTeam"
          class="w-full px-2 py-1 border border-slate-800 bg-slate-800 text-white hover:bg-white hover:text-slate-800 mr-1 font-bold">
          Disconnect
        </button>
        <button @click="deleteTeam"
          class="w-full px-2 py-1 border border-red-800 bg-red-800 text-white hover:bg-white hover:text-red-800 font-bold">Delete
          Team</button>
      </div>
    </div>
    <NotificationsPermissionsButton />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { deleteDoc, getDocs } from "firebase/firestore";
import { useTeamStore } from '@/store/teamStore';
import { piniaInstance } from '@/store';
import { v4 as uuid } from 'uuid'
import TeamFinderVue from "@/components/TeamFinder.vue";
import MemberRow from '@/components/MemberRow.vue';
import AddTeamMemberForm from '@/components/AddTeamMemberForm.vue';
import NotificationsPermissionsButton from '@/components/NotificationsPermissionsButton.vue';

const teamStore = useTeamStore(piniaInstance)
const { loadedTeam, teamMembers } = storeToRefs(teamStore)
const { getTeamById, getTeamRef, getMemberRef, getTeamMembersRef, watchForMemberChanges, disconnectFromTeam } = teamStore

onMounted(() => {
  chrome.storage.sync.get(["loadedTeam"], (data) => {
    const loadedTeam = data.loadedTeam;
    if (!loadedTeam) return
    loadTeam(loadedTeam)
  })
  teamStore.askPermission()
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

function storeTeamInChrome() {
  chrome.storage.sync.set({ loadedTeam: loadedTeam.value })
  console.log(chrome.storage.sync.get(['loadedTeam']))

}

async function deleteTeam() {
  const membersRef = getTeamMembersRef()
  const memberSnapshot = await getDocs(membersRef)
  memberSnapshot.forEach(async (member) => {
    await deleteDoc(getMemberRef(member.id))
  })

  await deleteDoc(getTeamRef(loadedTeam.value))

  loadedTeam.value = null
  teamStore.teamMembers = null
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
