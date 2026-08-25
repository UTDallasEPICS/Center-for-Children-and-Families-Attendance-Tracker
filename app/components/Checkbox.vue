<template>
  <label
    :for="inputId"
    class="flex items-center gap-2"
    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <span class="relative w-[18px] h-[18px] flex-shrink-0">
      <input
        :id="inputId"
        type="checkbox"
        class="peer sr-only"
        :name="name"
        :value="value"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
      />
      <span
        class="absolute inset-0 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-[1px] peer-focus-visible:outline-offset-[1px] peer-focus-visible:outline-brand-orange"
        :class="[
          modelValue && !disabled ? 'bg-brand-orange' : '',
          modelValue &&  disabled ? 'bg-neutral-200' : '',
          !modelValue              ? 'bg-white ring-inset ring-[1px] ring-neutral-200' : '',
        ]"
      >
        <Check
          v-if="modelValue"
          :size="12"
          :stroke-width="2"
          :absolute-stroke-width="true"
          color="#ffffff"
          class="absolute inset-0 m-auto"
        />
      </span>
    </span>

    <span
      v-if="label"
      class="font-sans text-sm leading-[18px] label-optical"
      :class="{
        'text-text-main':      modelValue && !disabled,
        'text-text-sub-light': modelValue &&  disabled,
        'text-text-sub-dark':  !modelValue && !disabled,
        'text-text-disabled':  !modelValue &&  disabled,
      }"
    >
      {{ label }}
    </span>
  </label>
</template>

<script lang="ts">
  let _cbId = 0
</script>

<script setup lang="ts">
  import { Check } from "lucide-vue-next"

  const props = defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
    id?: string
    name?: string
    value?: string
  }>()

  const emit = defineEmits<{
    "update:modelValue": [value: boolean]
  }>()

  const uid = ++_cbId
  const inputId = computed(() => props.id ?? `checkbox-${uid}`)

  function handleChange(event: Event) {
    if (!props.disabled) {
      emit("update:modelValue", (event.target as HTMLInputElement).checked)
    }
  }
</script>
