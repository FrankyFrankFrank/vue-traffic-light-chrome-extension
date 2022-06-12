<template>
    <button @click="deleteTeam"
        class="w-full px-2 py-1 border border-red-800 bg-red-800 text-white hover:bg-white hover:text-red-800 font-bold">
        Delete Team
    </button>
</template>

<script setup>
import { piniaInstance } from '@/store';
import { useTeamStore } from '@/store/teamStore';

const teamStore = useTeamStore(piniaInstance)
const { deleteTeam } = teamStore
</script>
