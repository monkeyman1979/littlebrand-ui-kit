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
  size?: 'small' | 'medium'
}

// Props
const props = withDefaults(defineProps<LbSwitchProps>(), {
  modelValue: false,
  disabled: false,
  required: false,
  invalid: false,
  size: 'small'
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
  'invalid': props.invalid,
  [`size-${props.size}`]: true
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
@use '@/styles/component-variables' as cv
@use '@/styles/typography' as typography

.lb-switch
  position: relative
  display: inline-block
  
  // Hidden native checkbox
  input[type="checkbox"]
    position: absolute
    opacity: base.$opacity-0
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
    background: var(--lb-background-surface)
    border: base.$border-md solid var(--lb-border-neutral-normal)
    border-radius: cv.$switch-border-radius
    transition: background-color base.$transition, border-color base.$transition, box-shadow base.$transition
  
  // Switch thumb
  .switch-thumb
    position: absolute
    top: 50%
    transform: translateY(-50%)
    background: var(--lb-border-neutral-active)
    border-radius: base.$radius-full
    transition: transform base.$transition, background-color base.$transition
    will-change: transform
  
  // Size variations
  &.size-small
    .switch-track
      width: cv.$switch-width-small  // 44px
      height: cv.$switch-height-small  // 24px
    
    .switch-thumb
      left: base.$space-2xs  // 2px from left edge
      width: cv.$switch-thumb-size-small  // 18px
      height: cv.$switch-thumb-size-small  // 18px
    
    &.checked .switch-thumb
      // 44px - 18px - 2px (left) - 6px (right) = 18px translation
      transform: translateY(-50%) translateX(calc(#{cv.$switch-width-small} - #{cv.$switch-thumb-size-small} - #{base.$space-2xs} - 6px))
  
  &.size-medium
    .switch-track
      width: cv.$switch-width-medium  // 56px
      height: cv.$switch-height-medium  // 32px
    
    .switch-thumb
      left: 3px  // 3px from left edge (moved closer to the left)
      width: cv.$switch-thumb-size-medium  // 24px
      height: cv.$switch-thumb-size-medium  // 24px
    
    &.checked .switch-thumb
      // 56px - 24px - 3px (left) - 7px (right) = 22px translation
      transform: translateY(-50%) translateX(calc(#{cv.$switch-width-medium} - #{cv.$switch-thumb-size-medium} - 3px - 7px))
  
  // Checked state
  &.checked
    .switch-track
      background: var(--lb-fill-primary-normal)
      border-color: var(--lb-fill-primary-normal)
      
    .switch-thumb
      background: white
      
  // Add smooth spring animation for the toggle
  &:not(.disabled) .switch-thumb
    transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), background-color base.$transition
  
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
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
  
  // Invalid state
  &.invalid
    .switch-track
      border-color: var(--lb-border-error-normal)
      
    input:focus-visible ~ .switch-track
      box-shadow: 0 0 0 calc(#{base.$focus-ring-width} + #{base.$focus-ring-offset}) var(--lb-surface-error-active)
      border-color: var(--lb-border-error-active)
      
    &.checked .switch-track
      background: var(--lb-fill-error-normal)
      border-color: var(--lb-fill-error-normal)
  
  // Disabled state
  &.disabled
    opacity: base.$opacity-80
    
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