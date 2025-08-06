<template lang="pug">
.lb-form-field
  LbLabel(
    v-if="label || $slots['label-icon']"
    :for="computedLabelFor"
    :required="required"
  )
    template(v-if="$slots['label-icon']" #icon)
      slot(name="label-icon")
    | {{ label }}
  slot(:id="computedId" :aria-describedby="computedAriaDescribedby")
  LbHintText(
    v-if="shouldShowHint"
    :id="computedHintId"
    :error="!!error"
    :warning="!!warning"
    :success="!!success"
  )
    | {{ hintMessage }}
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import type { VNode } from 'vue'
import LbLabel from '../Label'
import LbHintText from '../HintText'

// Types
export interface LbFormFieldProps {
  label?: string
  hint?: string
  required?: boolean
  error?: string
  warning?: string
  success?: string
  id?: string
  labelFor?: string
}

const props = withDefaults(defineProps<LbFormFieldProps>(), {
  required: false
})

// Generate unique IDs
const generateId = () => `form-field-${Math.random().toString(36).substr(2, 9)}`

// Computed properties
const computedId = computed(() => props.id || generateId())
const computedLabelFor = computed(() => props.labelFor || computedId.value)
const computedHintId = computed(() => `${computedId.value}-hint`)

// Determine which hint message to show
const hintMessage = computed(() => {
  if (props.error) return props.error
  if (props.warning) return props.warning
  if (props.success) return props.success
  return props.hint || ''
})

const shouldShowHint = computed(() => {
  return !!(props.error || props.warning || props.success || props.hint)
})

// Compute aria-describedby for accessibility
const computedAriaDescribedby = computed(() => {
  return shouldShowHint.value ? computedHintId.value : undefined
})

// Provide the computed ID and aria-describedby to child components
provide('formFieldId', computedId)
provide('formFieldAriaDescribedby', computedAriaDescribedby)

// Slots
defineSlots<{
  default: (props: { id: string; 'aria-describedby'?: string }) => VNode[]
  'label-icon'?: () => any
}>()

// Component options
defineOptions({
  name: 'LbFormField',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-form-field
  display: grid
  gap: var(--lb-space-xs)  // 4px gap between form field elements
  width: 100%
  align-self: start
</style>