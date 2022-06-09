<template>
  <div class="p-4 w-72">
    <TeamFinderVue v-if="!loadedTeam" :loadTeam="loadTeam" :createTeam="createTeam" />

    <div v-if="loadedTeam">
      <h1 class="text-lg text-center font-bold tracking-widest mb-4">
        <span class="text-slate-400">Team</span>
        {{ loadedTeam }}
        <CopyTeamIdButton />
      </h1>
      <div class="mb-4 border-b pb-4">
        <div v-for="member in teamMembers" :key="member" class="mb-2">
          <MemberRow :member="member" />
        </div>
      </div>
      <AddTeamMemberForm />
      <ManageLoadedTeam />
    </div>
    <NotificationsPermissionsButton />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTeamStore } from '@/store/teamStore';
import { piniaInstance } from '@/store';
import TeamFinderVue from "@/components/TeamFinder.vue";
import MemberRow from '@/components/MemberRow.vue';
import AddTeamMemberForm from '@/components/AddTeamMemberForm.vue';
import NotificationsPermissionsButton from '@/components/NotificationsPermissionsButton.vue';
import ManageLoadedTeam from '@/components/ManageLoadedTeam.vue';
import CopyTeamIdButton from '../components/CopyTeamIdButton.vue';

const teamStore = useTeamStore(piniaInstance)
const { loadedTeam, teamMembers } = storeToRefs(teamStore)
const {
  loadTeam,
} = teamStore

onMounted(() => {
  chrome.storage.sync.get(["loadedTeam"], (data) => {
    const loadedTeam = data.loadedTeam;
    if (!loadedTeam) return
    loadTeam(loadedTeam)
  })
  teamStore.askPermission()
})

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
