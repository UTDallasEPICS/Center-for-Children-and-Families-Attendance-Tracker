<script setup>
defineProps({
  textColor: {
    type: String,
    default: 'var(--color-success)'
  },
  bgColor: {
    type: String,
    default: 'var(--color-success-bg)'
  },
  count:{
    type: Number,
    default: 0
  },
  attType:{
    type: String,
    default: 'present'
  }
})
</script>

<template>
  <div
    class="w-[78px] h-[52px] pt-1 rounded-md flex flex-col items-center text-sm"
    :style="{ backgroundColor: bgColor, color: textColor }"
  >
    {{ count }}
    <div>{{ attType }}</div>
  </div>
</template>