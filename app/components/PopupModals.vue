<template>
  <div v-if="isOpen">
    <!-- Overlay -->
    <div class="fixed top-0 left-0 w-full h-full bg-black/50 z-[998] animate-[fadeIn_0.3s_ease]" @click="close"></div>
 
    <!-- Popup Content -->
    <div class="fixed top-0 left-0 w-full h-full z-[999] flex justify-center items-center">
      <div class="bg-white rounded-xl p-6 w-[90%] max-w-[400px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-[scaleIn_0.25s_ease]">
        <slot />
      </div>
    </div>
  </div>
</template>
 
<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()
 
const emit = defineEmits(["close"])
 
// Close popup
const close = () => {
  emit("close")
}
 
// Scroll lock
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
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

