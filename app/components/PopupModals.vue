<template>
  <div v-if="modelValue">
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black/50 z-[998] animate-[fadeIn_0.3s_ease]"
      @click="close"
    ></div>

    <!-- Popup Container -->
    <div class="fixed inset-0 z-[999] flex justify-center items-center pointer-events-none">
      <div
        class="bg-white rounded-xl p-6 w-[25vw] min-w-[300px] max-w-[500px]
               shadow-[0_4px_20px_rgba(0,0,0,0.2)]
               animate-[scaleIn_0.25s_ease]
               pointer-events-auto"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue"

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

// Close popup
const close = () => {
  emit("update:modelValue", false)
}

// Scroll lock
watch(
  () => props.modelValue,
  (val) => {
    document.body.style.overflow = val ? "hidden" : ""
  }
)
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

