<script setup lang="ts">
    defineProps({
    avatarUrl: {
        type: String,
        default: null
    },
    initials: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: null
    },
    checkedIn: {
        type: Boolean,
        default: false
    }
    
})

const getAvatarRingStyle = (checkedIn) => {
  return checkedIn ? 'outline: 2.5px solid var(--color-brand-orange); outline-offset: 3px;' : ''

}

const getStatusDotStyle = (status) => {
   if (status === 'green') return 'background: var(--color-success); border: 2px solid white;'
  if (status === 'yellow') return 'background: var(--color-warning); border: 2px solid white;'
  if (status === 'red') return 'background: var(--color-error); border: 2px solid white;'
  return 'background: #d1d5db; border: 2px solid white;'
  }
</script>

<template>
    <div class="relative shrink-0 max-h-[50px] max-w-[50px]">
        <div
            class="rounded-full bg-[#d4d4d4] flex items-center justify-center text-white overflow-hidden"
            style="width: 48px; height: 48px; font-size: 20px;"
            :style="getAvatarRingStyle(checkedIn)">
            <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
            <span v-else>{{ initials }}</span>
        </div>
        <span
            v-if="status"
            class="absolute bottom-0 -right-1 w-3 h-3 rounded-full"
            :style="getStatusDotStyle(status)"
        ></span>
    </div>
</template>