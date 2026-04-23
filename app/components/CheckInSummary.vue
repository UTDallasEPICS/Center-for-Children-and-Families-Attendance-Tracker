<template>
  <div class="space-y-2">
    <div class="flex items-baseline gap-1 leading-none">
      <span class="text-[40px] font-normal text-brand-orange">{{ checkedIn }}</span>
      <span class="text-sm font-normal text-text-sub-light">of {{ total }} checked in</span>
    </div>
    <ProgressBar :value="checkedIn" :max="total" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    checkedIn: number
    total: number
  }>()
</script>
