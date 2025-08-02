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
    opacity: var(--opacity-0)
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
    width: var(--space-6xl) // 56px
    height: var(--btn-height-small) // 32px
    background: var(--color-input-background)
    border: var(--border-md) solid var(--color-input-border)
    border-radius: var(--radius-full)
    transition: background-color var(--transition), border-color var(--transition), box-shadow var(--transition)
  
  // Switch thumb
  .switch-thumb
    position: absolute
    top: 50%
    left: var(--space-2xs)
    transform: translateY(-50%)
    width: var(--icon-size-lg) // 24px
    height: var(--icon-size-lg) // 24px
    background: var(--color-input-border)
    border-radius: var(--radius-full)
    transition: transform var(--transition), background-color var(--transition)
    will-change: transform
  
  // Checked state
  &.checked
    .switch-track
      background: var(--color-primary)
      border-color: var(--color-primary)
      
    .switch-thumb
      background: white
      transform: translateY(-50%) translateX(calc(var(--space-xl) + var(--space-xs))) // Move 24px to right (20px + 4px)
      
  // Add smooth spring animation for the toggle
  &:not(.disabled) .switch-thumb
    transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), background-color var(--transition)
  
  // Hover state
  &:not(.checked) input:not(:disabled):hover ~ .switch-track
    border-color: var(--color-input-border-hover)
    
    .switch-thumb
      background: var(--color-text-secondary)
    
  &.checked input:not(:disabled):hover ~ .switch-track
    background: var(--color-primary-hover)
    border-color: var(--color-primary-hover)
  
  // Focus state
  input:focus-visible ~ .switch-track
    outline: none
    box-shadow: 0 0 0 var(--focus-ring-width) var(--color-primary-a5)
    border-color: var(--color-input-border-focus)
  
  // Invalid state
  &.invalid
    .switch-track
      border-color: var(--color-error-border)
      
    input:focus-visible ~ .switch-track
      box-shadow: 0 0 0 var(--focus-ring-width) var(--color-error-a5)
      border-color: var(--color-error)
      
    &.checked .switch-track
      background: var(--color-error)
      border-color: var(--color-error)
  
  // Disabled state
  &.disabled
    opacity: var(--opacity-60)
    
    .switch-track
      background: var(--color-surface)
      cursor: not-allowed
      
      .switch-thumb
        background: var(--color-text-tertiary)
      
    &.checked .switch-track
      background: var(--color-text-secondary)
      border-color: var(--color-text-secondary)
      
      .switch-thumb
        background: var(--color-surface)
      
    input:hover ~ .switch-track
      border-color: var(--color-input-border)
</style>