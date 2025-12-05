<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div class="relative inline-block">
    <select
      :class="cn(
        'appearance-none bg-transparent border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        props.class
      )"
    >
      <slot />
    </select>
    <ChevronDown
      data-slot="native-select-icon"
      class="absolute right-2 top-1/2 -translate-y-1/2 size-4 opacity-50 pointer-events-none"
    />
  </div>
</template>
