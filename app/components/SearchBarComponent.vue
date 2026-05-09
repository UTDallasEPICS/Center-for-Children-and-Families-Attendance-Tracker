<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()
</script>

<template>
  <div class="flex items-center gap-2 px-4 bg-white border border-gray-200 rounded-lg h-8">
    <Search :size="16" class="shrink-0 text-gray-400" />
    <input
      type="text"
      class="flex-1 outline-none bg-transparent text-sm"
      style="color: var(--color-text-main); font-family: 'Roboto', sans-serif; font-weight: 400;"
      :placeholder="placeholder || 'Search child by name, DOB or ID.'"
      @input="emit('search', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>