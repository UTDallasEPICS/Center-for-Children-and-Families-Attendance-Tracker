<script lang="ts">
  import type { InjectionKey, Ref } from "vue"

  export interface RadioGroupContext {
    modelValue: Readonly<Ref<string | number>>
    name: Readonly<Ref<string>>
    groupDisabled: Readonly<Ref<boolean>>
    onChange: (value: string | number) => void
  }

  export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol("RadioGroup")
</script>

<template>
  <div role="radiogroup" :aria-label="ariaLabel" :aria-labelledby="ariaLabelledby" class="flex flex-col gap-2">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { provide, toRef, computed, readonly } from "vue"

  const props = defineProps<{
    modelValue: string | number
    name: string
    disabled?: boolean
    ariaLabel?: string
    ariaLabelledby?: string
  }>()

  const emit = defineEmits<{
    "update:modelValue": [value: string | number]
  }>()

  provide(RADIO_GROUP_KEY, {
    modelValue: readonly(toRef(props, "modelValue")),
    name: readonly(toRef(props, "name")),
    groupDisabled: readonly(computed(() => props.disabled ?? false)),
    onChange: (value) => emit("update:modelValue", value),
  })
</script>
