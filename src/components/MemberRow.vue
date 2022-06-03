<template>
    <div class="flex items-center justify-between">
        <div class="group flex flex-grow justify-between items-center mr-2">
            <p class="uppercase">{{ member.name }}</p>
            <button @click="removeTeamMember(member.id)"
                class="invisible group-hover:visible text-xs border border-red-700 text-red-700 uppercase px-1 py-0.5 rounded">Remove</button>
        </div>
        <div>
            <TrafficLightButton :member="member" color="green"></TrafficLightButton>
            <TrafficLightButton :member="member" color="yellow"></TrafficLightButton>
            <TrafficLightButton :member="member" color="red"></TrafficLightButton>
            <TrafficLightButton :member="member" color="away"></TrafficLightButton>
        </div>
    </div>
</template>

<script setup>
import { useTeamStore } from '@/store/teamStore';
import TrafficLightButton from './TrafficLightButton.vue';

const teamStore = useTeamStore()
const { removeTeamMember } = teamStore

defineProps({
    member: Object,
})
</script>