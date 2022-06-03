<template>
    <button class="inline w-6 h-6 mr-1 rounded-full" :class="getStyles()" @click="setTeamMemberColor(member.id, color)">
    </button>
</template>

<script setup>
import { useTeamStore } from '@/store/teamStore';

const teamStore = useTeamStore()
const { setTeamMemberColor } = teamStore

const props = defineProps({
    member: Object,
    color: String,
})

const getStyles = () => {
    switch (props.color) {
        case 'green':
            return [
                'bg-green-500',
                'shadow',
                'shadow-green-500',
                { 'bg-green-900': props.member.color != 'green' }
            ]
        case 'red':
            return [
                'bg-red-500',
                'shadow',
                'shadow-red-500',
                { 'bg-red-900': props.member.color != 'red' }
            ]
        case 'yellow':
            return [
                'bg-yellow-500',
                'shadow',
                'shadow-yellow-500',
                { 'bg-yellow-900': props.member.color != 'yellow' }
            ]
        case 'away':
            return [
                'bg-slate-500',
                'shadow',
                'shadow-slate-500',
                { 'bg-slate-900': props.member.color != 'away' }
            ]
    }


}

</script>