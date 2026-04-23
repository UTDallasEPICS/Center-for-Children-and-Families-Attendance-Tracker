<template>
  <div
    role="progressbar"
    :aria-valuenow="value"
    :aria-valuemin="0"
    :aria-valuemax="max"
    class="h-1 w-full rounded-full bg-neutral-200 overflow-hidden"
  >
    <div
      class="h-full rounded-full bg-brand-orange transition-[width] duration-300"
      :style="{ width: `${percentage}%` }"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    value: number
    max: number
  }>()

  const percentage = computed(() =>
    props.max > 0 ? Math.min((props.value / props.max) * 100, 100) : 0
  )
</script>
