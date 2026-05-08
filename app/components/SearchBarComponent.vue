<script setup lang="ts">
defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()
</script>

<template>
  <div
    class="flex items-center gap-2 px-4 bg-white"
    style="height: 32px; border: 1px solid #e5e7eb; border-radius: 16px;"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="shrink-0"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>

    <input
      type="text"
      class="flex-1 outline-none bg-transparent text-sm"
      style="color: var(--color-text-main); font-family: 'Roboto', sans-serif; font-weight: 400;"
      :placeholder="placeholder || 'Search child by name, DOB or ID.'"
      @input="emit('search', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>