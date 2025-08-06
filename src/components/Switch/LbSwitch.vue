<template lang="pug">
.lb-switch(:class="rootClasses")
  input(
    ref="inputRef"
    type="checkbox"
    role="switch"
    :id="id"
    :checked="modelValue"
    :disabled="disabled"
    :required="required"
    :aria-checked="modelValue"
    :aria-invalid="invalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    @change="handleChange"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  )
  .switch-track
    .switch-thumb
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Types
export interface LbSwitchProps {
  modelValue?: boolean
  id?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  ariaDescribedby?: string
}

// Props
const props = withDefaults(defineProps<LbSwitchProps>(), {
  modelValue: false,
  disabled: false,
  required: false,
  invalid: false,
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// Refs
const inputRef = ref<HTMLInputElement>()

// Computed
const rootClasses = computed(() => ({
  'checked': props.modelValue,
  'disabled': props.disabled,
  'invalid': props.invalid
}))

// Methods
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', event)
}

// Component options
defineOptions({
  name: 'LbSwitch',
  inheritAttrs: false
})

// Expose
defineExpose({
  inputRef
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-switch
  position: relative
  display: inline-block
  
  // Hidden native checkbox
  input[type="checkbox"]
    position: absolute
    opacity: var(--lb-opacity-0)
    width: 100%
    height: 100%
    margin: 0
    cursor: pointer
    z-index: 1
    
    &:disabled
      cursor: not-allowed
  
  // Switch track
  .switch-track
    position: relative
    width: var(--lb-space-6xl) // 56px
    height: var(--lb-btn-height-small) // 32px
    background: var(--lb-background-surface)
    border: var(--lb-border-md) solid var(--lb-border-neutral-normal)
    border-radius: var(--lb-radius-full)
    transition: background-color var(--lb-transition), border-color var(--lb-transition), box-shadow var(--lb-transition)
  
  // Switch thumb
  .switch-thumb
    position: absolute
    top: 50%
    left: var(--lb-space-2xs)
    transform: translateY(-50%)
    width: var(--lb-icon-size-lg) // 24px
    height: var(--lb-icon-size-lg) // 24px
    background: var(--lb-border-neutral-active)
    border-radius: var(--lb-radius-full)
    transition: transform var(--lb-transition), background-color var(--lb-transition)
    will-change: transform
  
  // Checked state
  &.checked
    .switch-track
      background: var(--lb-fill-primary-normal)
      border-color: var(--lb-fill-primary-normal)
      
    .switch-thumb
      background: white
      transform: translateY(-50%) translateX(calc(var(--lb-space-xl) + var(--lb-space-xs))) // Move 24px to right (20px + 4px)
      
  // Add smooth spring animation for the toggle
  &:not(.disabled) .switch-thumb
    transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), background-color var(--lb-transition)
  
  // Hover state
  &:not(.checked) input:not(:disabled):hover ~ .switch-track
    border-color: var(--lb-border-neutral-active)
    
    .switch-thumb
      background: var(--lb-fill-neutral-normal)
    
  &.checked input:not(:disabled):hover ~ .switch-track
    background: var(--lb-fill-primary-hover)
    border-color: var(--lb-fill-primary-hover)
  
  // Focus state
  input:focus-visible ~ .switch-track
    outline: none
    box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-primary-active)
    border-color: var(--lb-border-primary-normal)
  
  // Invalid state
  &.invalid
    .switch-track
      border-color: var(--lb-border-error-normal)
      
    input:focus-visible ~ .switch-track
      box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-error-active)
      border-color: var(--lb-border-error-active)
      
    &.checked .switch-track
      background: var(--lb-fill-error-normal)
      border-color: var(--lb-fill-error-normal)
  
  // Disabled state
  &.disabled
    opacity: var(--lb-opacity-80)
    
    .switch-track
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      cursor: not-allowed
      
      .switch-thumb
        background: var(--lb-fill-neutral-disabled)
      
    &.checked .switch-track
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      
      .switch-thumb
        background: var(--lb-fill-neutral-disabled)
      
    input:hover ~ .switch-track
      border-color: var(--lb-border-neutral-normal)
</style>