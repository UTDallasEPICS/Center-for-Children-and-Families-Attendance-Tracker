<script setup>
import { Search } from 'lucide-vue-next'

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
  if (attType === 'Present') return { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }
  if (attType === 'Late') return { backgroundColor: 'var(--color-warning-bg)',  color: 'var(--color-warning)' }
  if (attType === 'CalledOff') return { backgroundColor: 'var(--color-callOff-bg)', color: 'var(--color-callOff)' }
  if (attType === 'Absent') return { backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)'}
}
</script>

<template>
<div
  class="w-[142px] h-[98px] rounded-md flex flex-col items-center justify-center text-xl"
  :style="getColor(attType)"
>
  <div>{{ count }}</div>
  <div>{{ attType }}</div>
</div>

</template>