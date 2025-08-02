<template lang="pug">
.lb-select(:class="rootClasses")
  select(
    ref="selectRef"
    :id="computedId"
    :name="name"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="computedAriaDescribedby"
    @input="handleInput"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  )
    option(
      v-if="placeholder"
      value=""
      disabled
      :selected="!modelValue"
    ) {{ placeholder }}
    option(
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    ) {{ option.label }}
  .select-icon
    slot(name="icon")
      svg(
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      )
        path(
          d="M4 6L8 10L12 6" 
          stroke="currentColor" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        )
</template>

<script setup lang="ts">
import { computed, ref, inject, type ComputedRef } from 'vue'

// Types
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface LbSelectProps {
  modelValue?: string | number | null
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  id?: string
  ariaDescribedby?: string
  size?: 'small' | 'medium' | 'large'
}

// Props
const props = withDefaults(defineProps<LbSelectProps>(), {
  modelValue: null,
  disabled: false,
  required: false,
  invalid: false,
  size: 'medium'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  'input': [event: Event]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// Refs
const selectRef = ref<HTMLSelectElement>()

// Inject form field context if available
const injectedId = inject<ComputedRef<string> | undefined>('formFieldId', undefined)
const injectedAriaDescribedby = inject<ComputedRef<string | undefined> | undefined>('formFieldAriaDescribedby', undefined)

// Computed
const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'invalid': props.invalid,
  'has-placeholder': !!props.placeholder && !props.modelValue,
  [`size-${props.size}`]: true
}))

const computedId = computed(() => {
  return props.id || injectedId?.value
})

const computedAriaDescribedby = computed(() => {
  return props.ariaDescribedby || injectedAriaDescribedby?.value || undefined
})

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value === '' ? null : target.value
  emit('update:modelValue', value)
  emit('input', event)
}

// Slots
defineSlots<{
  icon?: () => any
}>()

// Component options
defineOptions({
  name: 'LbSelect',
  inheritAttrs: false
})

// Expose
defineExpose({
  selectRef
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-select
  position: relative
  width: 100%
  height: var(--input-height-medium) // 40px - medium size default
  
  // Select element styles
  select
    width: 100%
    height: 100%
    padding: 0 var(--space-10) 0 var(--space-4) // Right padding for icon
    background: var(--color-input-background)
    border: var(--border-thin) solid var(--color-input-border)
    border-radius: var(--radius-md)
    font-size: var(--font-size-label-base)
    font-family: inherit
    color: var(--color-text)
    transition: border-color var(--transition), box-shadow var(--transition)
    box-sizing: border-box
    cursor: pointer
    
    // Remove default arrow
    appearance: none
    -webkit-appearance: none
    -moz-appearance: none
    
    // States
    &:hover:not(:disabled)
      border-color: var(--color-input-border-hover)
    
    &:focus
      outline: none
      border-color: var(--color-input-border-focus)
      box-shadow: 0 0 0 var(--focus-ring-width) var(--color-primary-a5)
    
    // Focus takes precedence over hover
    &:focus:hover:not(:disabled)
      border-color: var(--color-input-border-focus)
      box-shadow: 0 0 0 var(--focus-ring-width) var(--color-primary-a5)
    
  &.invalid select
    border-color: var(--color-error-border)
    
    &:focus
      border-color: var(--color-error)
      box-shadow: 0 0 0 var(--focus-ring-width) var(--color-error-a5)
    
    // Disabled state
    &:disabled
      background: var(--color-surface)
      color: var(--color-text-disabled)
      cursor: not-allowed
      opacity: 0.6
  
  // Placeholder style
  &.has-placeholder select
    color: var(--color-input-placeholder)
  
  // Size variations
  &.size-small
    height: var(--input-height-small) // 32px
    
    select
      padding: 0 var(--space-9) 0 var(--space-3)
      font-size: var(--font-size-label-small)
    
  &.size-large
    height: var(--input-height-large) // 48px
    
    select
      padding: 0 var(--space-12) 0 var(--space-5)
      font-size: var(--font-size-label-large)
  
  // Disabled state
  &.disabled .select-icon
    opacity: 0.6
  
  // Select icon
  .select-icon
    position: absolute
    top: 50%
    right: var(--space-4)
    transform: translateY(-50%)
    display: flex
    align-items: center
    justify-content: center
    color: var(--color-text-tertiary)
    pointer-events: none
    transition: color var(--transition)
    
    svg
      width: 1rem // 16px
      height: 1rem // 16px
    
  &.size-small .select-icon
    right: var(--space-3)
    
    svg
      width: 0.875rem // 14px - no exact size variable for 14px
      height: 0.875rem // 14px
      
  &.size-large .select-icon
    right: var(--space-5)
    
    svg
      width: 1.125rem // 18px
      height: 1.125rem // 18px
    
  // Icon hover and focus states
  select:hover:not(:disabled) ~ .select-icon
    color: var(--color-text-secondary)
    
  select:focus ~ .select-icon
    color: var(--color-text-secondary)
  
  // Icon states based on parent classes
  &.invalid .select-icon
    color: var(--color-error)
</style>