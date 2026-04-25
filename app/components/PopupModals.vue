<template>
  <div v-if="isOpen">
    <!-- Overlay -->
    <div class="popup-overlay" @click="close"></div>

    <!-- Popup Content -->
    <div class="popup-container">
      <div class="popup-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue"

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
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;

  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.25s ease;
}

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