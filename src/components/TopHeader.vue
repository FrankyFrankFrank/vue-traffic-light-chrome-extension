<template>
<h1 class="text-lg text-center font-bold tracking-widest mb-4">
    <span class="text-slate-400">Team</span> {{ loadedTeam }}
    <CopyTeamIdButton />
</h1>
</template>

<script setup>
import { piniaInstance } from '@/store';
import { useTeamStore } from '@/store/teamStore';
import { storeToRefs } from 'pinia';
import CopyTeamIdButton from '../components/CopyTeamIdButton.vue';


const teamStore = useTeamStore(piniaInstance)
const { loadedTeam } = storeToRefs(teamStore)
</script>