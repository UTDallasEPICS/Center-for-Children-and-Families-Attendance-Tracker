<template>
  <label
    :for="inputId"
    class="flex items-center gap-2"
    :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <span class="relative w-[18px] h-[18px] flex-shrink-0">
      <input
        :id="inputId"
        type="radio"
        class="peer sr-only"
        :name="group?.name.value ?? name"
        :value="value"
        :checked="isChecked"
        :disabled="isDisabled"
        @change="handleChange"
      />
      <span
        class="absolute inset-0 rounded-full bg-white transition-colors peer-focus-visible:outline peer-focus-visible:outline-[1px] peer-focus-visible:outline-offset-[1px] peer-focus-visible:outline-brand-orange"
        :class="[
          isChecked && !isDisabled ? 'ring-inset ring-[5px] ring-brand-orange' : '',
          isChecked &&  isDisabled ? 'ring-inset ring-[5px] ring-neutral-200' : '',
          !isChecked               ? 'ring-inset ring-[1px] ring-neutral-200' : '',
        ]"
      />
    </span>

    <span
      v-if="label"
      class="font-sans text-sm leading-[18px] label-optical"
      :class="{
        'text-text-main':      isChecked && !isDisabled,
        'text-text-sub-light': isChecked &&  isDisabled,
        'text-text-sub-dark':  !isChecked && !isDisabled,
        'text-text-disabled':  !isChecked &&  isDisabled,
      }"
    >
      {{ label }}
    </span>
  </label>
</template>

<script lang="ts">
  let _radioId = 0
</script>

<script setup lang="ts">
  import { RADIO_GROUP_KEY } from "./RadioGroup.vue"

  const props = defineProps<{
    value: string | number
    label?: string
    disabled?: boolean
    id?: string
    name?: string
  }>()

  const group = inject(RADIO_GROUP_KEY, null)

  if (!group) {
    console.warn("[Radio] Radio must be used inside RadioGroup.")
  }

  const uid = ++_radioId
  const inputId = computed(() => props.id ?? `radio-${uid}`)
  const isChecked = computed(() => group ? group.modelValue.value === props.value : false)
  const isDisabled = computed(() => Boolean(group?.groupDisabled.value || props.disabled))

  function handleChange() {
    if (!isDisabled.value) {
      group?.onChange(props.value)
    }
  }
</script>
