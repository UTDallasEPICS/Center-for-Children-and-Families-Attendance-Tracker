<template>
  <div 
    v-if="show"
    class="fixed top-0 left-0 w-full h-full bg-black/45 flex justify-center items-center z-[999]"
    @click.self="$emit('cancel')"
  >
    <div class="bg-white p-[22px] rounded-2xl w-[80%] max-w-[340px] text-center">
      <p class="text-base font-semibold mb-4">
        Enter your 4-digit PIN to check in
      </p>
      
      <div class="flex justify-center gap-2 mb-4">
        <input
          v-for="(digit, index) in pinDigits"
          :key="index"
          :ref="el => inputRefs[index] = el as HTMLInputElement"
          v-model="pinDigits[index]"
          @input="handleInput(index, $event)"
          @keydown="handleKeydown(index, $event)"
          @paste="handlePaste"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:border-[#2d8a4b]"
          :class="pinDigits[index] ? 'border-[#2d8a4b]' : 'border-gray-300'"
        />
      </div>

      <p v-if="errorMessage" class="text-sm text-red-500 mb-3">
        {{ errorMessage }}
      </p>

      <div class="flex justify-around mt-[18px]">
        <button 
          @click="handleConfirm"
          :disabled="!isPinComplete"
          class="px-5 py-2.5 rounded-[25px] border-none text-[15px] bg-[#2d8a4b] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
        <button 
          @click="handleCancel"
          class="px-5 py-2.5 rounded-[25px] border-none text-[15px] bg-[#d9534f] text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  confirm: [pin: string]
  cancel: []
}>()

const pinDigits = ref<string[]>(['', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const errorMessage = ref('')

const isPinComplete = computed(() => {
  return pinDigits.value.every(digit => digit !== '')
})

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Only allow digits
  
  if (value) {
    pinDigits.value[index] = value.slice(-1) // Only take the last character
    
    // Move to next input if available
    if (index < 3 && inputRefs.value[index + 1]) {
      nextTick(() => {
        inputRefs.value[index + 1]?.focus()
      })
    }
  } else {
    pinDigits.value[index] = ''
  }
  
  errorMessage.value = ''
}

function handleKeydown(index: number, event: KeyboardEvent) {
  // Handle backspace
  if (event.key === 'Backspace' && !pinDigits.value[index] && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  }
  
  // Prevent non-numeric input
  if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
    event.preventDefault()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('')
  
  digits.forEach((digit, index) => {
    if (index < 4) {
      pinDigits.value[index] = digit
    }
  })
  
  // Focus the last filled input or the first empty one
  const lastFilledIndex = digits.length - 1
  const focusIndex = lastFilledIndex < 3 ? lastFilledIndex + 1 : 3
  nextTick(() => {
    inputRefs.value[focusIndex]?.focus()
  })
}

function handleConfirm() {
  if (isPinComplete.value) {
    const pin = pinDigits.value.join('')
    emit('confirm', pin)
    resetModal()
  }
}

function handleCancel() {
  resetModal()
  emit('cancel')
}

function resetModal() {
  pinDigits.value = ['', '', '', '']
  errorMessage.value = ''
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
}

// Watch for show prop changes to reset and focus
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetModal()
    nextTick(() => {
      inputRefs.value[0]?.focus()
    })
  }
})
</script>

