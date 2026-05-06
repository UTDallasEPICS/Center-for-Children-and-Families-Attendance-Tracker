<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const autoResize = (el) => {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

const onInput = (e) => {
  emit('update:modelValue', e.target.value)
  autoResize(e.target)
}
</script>

<template>
  <div class="flex rounded-md border border-[#737373] bg-white w-[335px]">
    <textarea
      class="w-full min-h-9 font-[var(--font-sans)] focus:outline-none resize-none overflow-hidden justify-center pt-[5px]"
      placeholder="Type here ..."
      :value="modelValue"
      @input="onInput"
      rows="1"
    />
  </div>
</template>