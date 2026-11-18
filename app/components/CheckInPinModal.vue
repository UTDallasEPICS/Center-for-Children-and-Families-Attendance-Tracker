<template>
  <div class="px-2 pb-2 pt-6 text-center">
    <p class="mb-10 text-2xl font-medium text-[#1a1a1a]">
      Enter 4-digit PIN to check {{ checkedIn ? "out" : "in" }}
    </p>

    <div class="mb-10 flex justify-center gap-3">
      <input
        v-for="(digit, index) in pinDigits"
        :key="index"
        :ref="(el) => (inputRefs[index] = el as HTMLInputElement)"
        v-model="pinDigits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="h-[72px] w-14 rounded-xl border-2 bg-white text-center text-3xl font-medium text-[#1a1a1a] transition-all duration-200 focus:outline-none focus:border-[#E87500]"
        :class="
          pinDigits[index]
            ? 'border-[#E87500] shadow-[0_4px_14px_rgba(232,117,0,0.25)]'
            : 'border-[#E5E5E5]'
        "
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
      />
    </div>

    <p v-if="errorMessage" class="mb-4 -mt-6 text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <button
      type="button"
      :disabled="!isPinComplete"
      class="flex h-14 w-full items-center justify-center rounded-xl bg-[#E87500] text-lg font-medium text-white transition-colors duration-300 hover:bg-[#d06a00] disabled:cursor-not-allowed disabled:opacity-50"
      @click="handleConfirm"
    >
      {{ checkedIn ? "Check Out" : "Check In" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue"

defineProps<{
  checkedIn?: boolean
}>()

const emit = defineEmits<{
  confirm: [pin: string]
  cancel: []
}>()

const pinDigits = ref<string[]>(["", "", "", ""])
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const errorMessage = ref("")

const isPinComplete = computed(() => pinDigits.value.every((digit) => digit !== ""))

function handleInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, "")

  if (value) {
    pinDigits.value[index] = value.slice(-1)
    if (index < 3) {
      nextTick(() => inputRefs.value[index + 1]?.focus())
    }
  } else {
    pinDigits.value[index] = ""
  }

  errorMessage.value = ""
}

function handleKeydown(index: number, event: KeyboardEvent) {
  if (event.key === "Backspace" && !pinDigits.value[index] && index > 0) {
    nextTick(() => inputRefs.value[index - 1]?.focus())
  }

  if (event.key === "Enter" && isPinComplete.value) {
    handleConfirm()
    return
  }

  if (
    !/[0-9]/.test(event.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(event.key)
  ) {
    event.preventDefault()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData("text") || ""
  const digits = pasted.replace(/\D/g, "").slice(0, 4).split("")

  digits.forEach((digit, i) => (pinDigits.value[i] = digit))

  const focusIndex = Math.min(digits.length, 3)
  nextTick(() => inputRefs.value[focusIndex]?.focus())
}

function handleConfirm() {
  if (!isPinComplete.value) return
  emit("confirm", pinDigits.value.join(""))
}

// PopupModals mounts its slot fresh on each open, so this focuses the first box every time
onMounted(() => {
  nextTick(() => inputRefs.value[0]?.focus())
})
</script>
