<template>
  <div v-if="show" class="fixed top-0 left-0 w-full h-full bg-black/45 flex justify-center items-center z-[999]" @click.self="$emit('cancel')">
    <div class="bg-white p-[22px] rounded-2xl w-[80%] max-w-[340px] text-center">
      <p class="text-base font-semibold">Are you sure you want to check out?</p>
      <div class="flex justify-around mt-[18px]">
        <button @click="$emit('confirm')" class="px-5 py-2.5 rounded-[25px] border-none text-[15px] bg-[#2d8a4b] text-white">Yes</button>
        <button @click="$emit('cancel')" class="px-5 py-2.5 rounded-[25px] border-none text-[15px] bg-[#d9534f] text-white">No</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    show: boolean
  }>()

  defineEmits<{
    confirm: []
    cancel: []
  }>()
</script>
