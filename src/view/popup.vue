<template>
  <div class="p-4 w-72">
    <TeamFinderVue v-if="!loadedTeam" :loadTeam="loadTeam" :createTeam="createTeam" />

    <div v-if="loadedTeam">
      <h1 class="text-lg text-center font-bold tracking-widest mb-4">
        <span class="text-slate-400">Team</span>
        {{ loadedTeam }}
        <CopyTeamIdButton />
      </h1>
      <MemberList />
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
import MemberList from "@/components/MemberList.vue";
import AddTeamMemberForm from '@/components/AddTeamMemberForm.vue';
import NotificationsPermissionsButton from '@/components/NotificationsPermissionsButton.vue';
import ManageLoadedTeam from '@/components/ManageLoadedTeam.vue';
import CopyTeamIdButton from '../components/CopyTeamIdButton.vue';

const teamStore = useTeamStore(piniaInstance)
const { loadedTeam } = storeToRefs(teamStore)
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
