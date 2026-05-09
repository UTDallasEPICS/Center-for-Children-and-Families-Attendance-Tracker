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
      class="fixed inset-0 z-[99999] flex h-dvh w-screen flex-col bg-white pointer-events-auto"
      role="dialog"
      aria-modal="true"
    >
      <header class="relative flex min-h-[64px] shrink-0 items-center justify-center px-4">
        <button
          type="button"
          class="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
          aria-label="Go back"
          @click="close"
        >
          <ChevronLeft class="h-6 w-6" />
        </button>

        <h2 class="text-base font-semibold text-black">
          {{ title }}
        </h2>
      </header>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next"

defineProps<{
  title: string
}>()

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