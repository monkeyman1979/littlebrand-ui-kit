<template lang="pug">
.lb-select(:class="rootClasses")
  select(
    ref="selectRef"
    :id="id"
    :name="name"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="ariaDescribedby || undefined"
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
import { computed, ref } from 'vue'

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

// Computed
const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'invalid': props.invalid,
  'has-placeholder': !!props.placeholder && !props.modelValue,
  [`size-${props.size}`]: true
}))

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
  height: base.$size-2xl // 40px - medium size default
  
  // Select element styles
  select
    width: 100%
    height: 100%
    padding: 0 base.$space-10 0 base.$space-4 // Right padding for icon
    background: var(--color-input-background)
    border: base.$border-thin solid var(--color-input-border)
    border-radius: base.$radius-md
    font-size: typography.$label-size-base
    font-family: inherit
    color: var(--color-text)
    transition: border-color base.$transition, box-shadow base.$transition
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
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-primary-a5)
    
    // Focus takes precedence over hover
    &:focus:hover:not(:disabled)
      border-color: var(--color-input-border-focus)
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-primary-a5)
    
  &.invalid select
    border-color: var(--color-error-border)
    
    &:focus
      border-color: var(--color-error)
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-error-a5)
    
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
    height: base.$size-xl // 32px
    
    select
      padding: 0 base.$space-9 0 base.$space-3
      font-size: typography.$label-size-small
    
  &.size-large
    height: base.$size-3xl // 48px
    
    select
      padding: 0 base.$space-12 0 base.$space-5
      font-size: typography.$label-size-large
  
  // Disabled state
  &.disabled .select-icon
    opacity: 0.6
  
  // Select icon
  .select-icon
    position: absolute
    top: 50%
    right: base.$space-4
    transform: translateY(-50%)
    display: flex
    align-items: center
    justify-content: center
    color: var(--color-text-tertiary)
    pointer-events: none
    transition: color base.$transition
    
    svg
      width: base.$size-xs // 16px
      height: base.$size-xs // 16px
    
  &.size-small .select-icon
    right: base.$space-3
    
    svg
      width: 0.875rem // 14px - no exact size variable for 14px
      height: 0.875rem // 14px
      
  &.size-large .select-icon
    right: base.$space-5
    
    svg
      width: base.$size-sm // 18px
      height: base.$size-sm // 18px
    
  // Icon hover and focus states
  select:hover:not(:disabled) ~ .select-icon
    color: var(--color-text-secondary)
    
  select:focus ~ .select-icon
    color: var(--color-text-secondary)
  
  // Icon states based on parent classes
  &.invalid .select-icon
    color: var(--color-error)
</style>