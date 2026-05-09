<script setup>

import { computed, toRef } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: null
  }
})
const onBeforeInput = (e) => {
  if (props.maxLength === null) return

  const current = props.modelValue || ''
  const incoming = e.data

  if (!incoming) return

  if (current.length >= props.maxLength) {
    e.preventDefault() 
  }
}

const charCount = computed(() => props.modelValue.length)


const emit = defineEmits(['update:modelValue'])

const autoResize = (el) => {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

const onInput = (e) => {
  let value = e.target.value

  
  emit('update:modelValue', value)
  
  if (props.maxLength !== null) {
    value = value.slice(0, props.maxLength)
  }

  emit('update:modelValue', value)

  autoResize(e.target)
}


</script>

<template>
<div class="relative flex rounded-md border border-neutral-200 pr-[5px]pl-[5px] pb-5  bg-white w-full max-w-full min-h-[40px]">    
   <textarea
    class="w-full min-h-9 font-[var(--font-sans)] focus:outline-none resize-none overflow-hidden pt-[5px] px-2"
    placeholder="Type here..."
    :value="modelValue"
    @beforeinput="onBeforeInput"
    @input="onInput"
    rows="1"
  />

  <div class="absolute bottom-1 right-1 text-xs text-neutral-400 px-2 pb-1">
    <span v-if="props.maxLength !== null">{{ charCount }} / {{ props.maxLength }}</span>
  </div>

</div>

</template>