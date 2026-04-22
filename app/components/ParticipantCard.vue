<script setup lang="ts">
  const props = defineProps<{
    recordId: string
    name: string
    dob: string
    phone: string
    email?: string
    status: "checked-in" | "pending" | "unknown"
  }>()

  const emit = defineEmits<{
    (e: "select", recordId: string): void
  }>()

  const handleClick = () => {
    emit("select", props.recordId)
  }
</script>

<template>
  <div class="border border-[#28B357] rounded-[12px] bg-[rgba(108,194,138,0.29)] px-4 py-3 flex justify-between items-center" @click="handleClick">
    <!-- left side: name, id, dob, phone/email -->
    <div class="space-y-1">
      <p class="text-[13px] font-semibold text-black">
        {{ name }}
      </p>

      <div class="flex items-center gap-2 text-[12px]">
        <span class="border-2 border-black w-[17px] h-[17px] flex items-center justify-center text-[10px]"> # </span>
        <span class="font-semibold"> ID: {{ recordId }} </span>
      </div>

      <div class="flex items-center gap-2 text-[12px]">
        <span>📅</span>
        <span>DOB: {{ dob || "—" }}</span>
      </div>

      <div class="flex items-center gap-2 text-[12px]">
        <span>📞</span>
        <span>Contact: {{ phone || "—" }}</span>
      </div>

      <div v-if="email" class="flex items-center gap-2 text-[12px]">
        <span>✉️</span>
        <span>{{ email }}</span>
      </div>
    </div>

    <!-- Right side: status box -->
    <div class="w-[75px] h-[55px] bg-[#D9D9D9] border border-[#48C596] rounded-[7px] flex items-center justify-center">
      <span
        class="text-[11px] font-semibold"
        :class="{
          'text-green-700': status === 'checked-in',
          'text-yellow-700': status === 'pending',
          'text-gray-700': status === 'unknown',
        }"
      >
        {{ status }}
      </span>
    </div>
  </div>
</template>
