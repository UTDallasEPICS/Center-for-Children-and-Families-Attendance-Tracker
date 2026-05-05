<script setup>
defineProps({
  count:{
    type: Number,
    default: 0
  },
  attType:{
    type: String,
    default: 'present'
  }
})


const getColor = (attType) => {
  if (attType === 'present') return { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }
  if (attType === 'tardy') return { backgroundColor: 'var(--color-warning-bg)',  color: 'var(--color-warning)' }
  if (attType === 'absent') return { backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)'}
  if (attType === 'calledOff') return { backgroundColor: 'var(--color-callOff-bg)', color: 'var(--color-callOff)' }
}
</script>

<template>
  <div
    class="w-[78px] h-[52px] pt-1 rounded-md flex flex-col items-center text-sm"
    :style="getColor(attType)"
  >
    {{ count }}
    <div>{{ attType }}</div>
  </div>
</template>