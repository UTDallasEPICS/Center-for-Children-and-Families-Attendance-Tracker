<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
      @click="close"
    >
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="scale-90 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-90 opacity-0"
      >
        <div
          class="w-[25vw] min-w-[300px] max-w-[500px] rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          @click.stop
        >
          <slot />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })

const close = () => {
  isOpen.value = false
}

watch(isOpen, (val) => {
  document.body.style.overflow = val ? "hidden" : ""
})

onUnmounted(() => {
  document.body.style.overflow = ""
})
</script>
