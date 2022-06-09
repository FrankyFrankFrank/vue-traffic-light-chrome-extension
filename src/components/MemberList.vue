<template>
<div class="mb-4 border-b pb-4">
    <div v-for="member in teamMembers" :key="member" class="mb-2">
        <MemberRow :member="member" />
    </div>
</div>
</template>

<script setup>
import { piniaInstance } from '@/store';
import { useTeamStore } from '@/store/teamStore';
import { storeToRefs } from 'pinia';
import MemberRow from './MemberRow.vue';

const teamStore = useTeamStore(piniaInstance)
const { teamMembers } = storeToRefs(teamStore)
</script>