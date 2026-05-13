<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const props = defineProps<{
  current: SelectMenuItem
  items: SelectMenuItem[]
  widthClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:current', value: SelectMenuItem): void
}>()

const selected = computed({
  get: () => props.current,
  set: (value) => emit('update:current', value)
})
</script>

<template>
  <USelectMenu
    v-model="selected"
    :items="items"
    :class="widthClass"
  />
</template>