<script setup lang="ts">
interface Props {
  value: number
  selected?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <option :value="props.value" :selected="props.selected">
    <slot />
  </option>
</template>
