<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const props = defineProps<{
  current: SelectMenuItem
  items: SelectMenuItem[]
}>()

const emit = defineEmits<{
  (e: 'update:current', value: SelectMenuItem): void
}>()

const selected = computed({
  get: () => props.current,
  set: (val) => emit('update:current', val)
})
</script>

<template>
  <USelectMenu
    v-model="selected"
    :items="items"
    value-key="id"
    placeholder="Select"
    class="w-48"
  />
</template>