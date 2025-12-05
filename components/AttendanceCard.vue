<template>
  <div class="bg-[#e6e6e6] p-5 rounded-[20px] max-w-[420px] mx-auto mb-6 text-center">
    <h3 class="mb-3 text-[17px] font-bold">
      Mark your attendance for today
    </h3>

    <div class="flex justify-center items-center gap-1.5">
      <span class="text-xl">🕒</span>
      <p class="text-[15px] font-semibold">{{ formattedDate }}</p>
    </div>

    <span 
      :class="[
        'inline-block px-3.5 py-1.5 rounded-[20px] text-xs mt-2.5',
        status === 'checked' ? 'bg-[#2d8a4b] text-white' : 
        status === 'checked-out' ? 'bg-[#b5b5b5] text-white' : 
        'bg-[#b5b5b5] text-white'
      ]"
    >
      {{ statusText }}
    </span>
    
    <p 
      v-if="checkinTime" 
      class="mt-2.5 font-medium"
    >
      Checked in at: {{ checkinTime }}
    </p>
    
    <p 
      v-if="elapsedTime" 
      class="mt-1.5 text-sm font-semibold text-[#444]"
    >
      {{ elapsedTime }}
    </p>

    <button 
      @click="handleCheckIn"
      :disabled="status !== 'not-checked'"
      class="w-full py-3 rounded-[30px] border-none text-base mt-3 bg-black text-white disabled:opacity-50"
    >
      Check In
    </button>
    
    <button 
      @click="handleCheckOutClick"
      :disabled="status !== 'checked'"
      class="w-full py-3 rounded-[30px] border border-[#ccc] text-base mt-3 bg-white disabled:opacity-50"
    >
      Check Out
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  checkout: []
  showModal: []
}>()

const status = ref<'not-checked' | 'checked' | 'checked-out'>('not-checked')
const checkInTimestamp = ref<number | null>(null)
const checkinTime = ref<string>('')
const elapsedTime = ref<string>('')
let elapsedInterval: ReturnType<typeof setInterval> | null = null

const formattedDate = ref('')

const statusText = computed(() => {
  switch (status.value) {
    case 'checked':
      return 'Checked In'
    case 'checked-out':
      return 'Checked Out'
    default:
      return 'Not Checked In'
  }
})

function updateLiveDate() {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }
  formattedDate.value = now.toLocaleDateString('en-US', options)
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function startElapsedTimer() {
  if (!checkInTimestamp.value) return
  
  elapsedInterval = setInterval(() => {
    if (checkInTimestamp.value) {
      const diff = Date.now() - checkInTimestamp.value
      elapsedTime.value = `Elapsed: ${formatElapsed(diff)}`
    }
  }, 1000)
}

function handleCheckIn() {
  checkInTimestamp.value = Date.now()
  
  const now = new Date()
  checkinTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })
  
  status.value = 'checked'
  startElapsedTimer()
}

function handleCheckOutClick() {
  emit('showModal')
}

function handleCheckout() {
  if (elapsedInterval) {
    clearInterval(elapsedInterval)
    elapsedInterval = null
  }
  
  if (checkInTimestamp.value) {
    const diff = Date.now() - checkInTimestamp.value
    elapsedTime.value = `Total Time Worked: ${formatElapsed(diff)}`
  }
  
  status.value = 'checked-out'
  emit('checkout')
}

onMounted(() => {
  updateLiveDate()
})

onUnmounted(() => {
  if (elapsedInterval) {
    clearInterval(elapsedInterval)
  }
})

// Expose checkout function to parent
defineExpose({
  handleCheckout
})
</script>

