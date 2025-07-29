<template lang="pug">
.lb-input(:class="rootClasses")
  .icon.icon-leading(v-if="$slots['icon-leading']")
    slot(name="icon-leading")
  input(
    ref="inputRef"
    :id="id"
    :type="currentType"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled || loading"
    :readonly="readonly"
    :required="required"
    :aria-invalid="invalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    :autofocus="autofocus"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  )
  //- Trailing icons container
  .trailing-icons(v-if="hasTrailingIcons")
    //- Loading spinner
    .icon.icon-loading(v-if="loading")
      svg.spinner(
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      )
        circle(
          cx="8" 
          cy="8" 
          r="6.67" 
          stroke="currentColor" 
          stroke-width="2.67" 
          fill="none" 
          stroke-linecap="round"
        )
    
    //- Password toggle
    button.icon.icon-password(
      v-else-if="type === 'password' && !disabled && !readonly"
      type="button"
      @click="togglePassword"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
    )
      //- Eye open icon
      svg(
        v-if="!showPassword"
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      )
        path(
          d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z" 
          stroke="currentColor" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        )
        circle(
          cx="8" 
          cy="8" 
          r="2" 
          stroke="currentColor" 
          stroke-width="1.5"
        )
      //- Eye closed icon
      svg(
        v-else
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      )
        path(
          d="M2.42 12.58l11.16-11.16M6.71 6.71a2 2 0 002.83 2.83M14.12 14.12A7.82 7.82 0 018 12.5C3.5 12.5 1 8 1 8a14.25 14.25 0 001.88-2.12M5.6 3.9A7.92 7.92 0 018 3.5C12.5 3.5 15 8 15 8a14.36 14.36 0 01-1.62 2.04" 
          stroke="currentColor" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        )
    
    //- Clear button
    button.icon.icon-clear(
      v-else-if="clearable && hasValue && !disabled && !readonly"
      type="button"
      @click="clearInput"
      aria-label="Clear input"
    )
      svg(
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      )
        circle(cx="8" cy="8" r="8" fill="currentColor" opacity="0.2")
        path(
          d="M10.5 5.5L5.5 10.5M5.5 5.5l5 5" 
          stroke="currentColor" 
          stroke-width="1.5" 
          stroke-linecap="round"
        )
    
    //- Custom trailing icon slot
    .icon(v-else-if="$slots['icon-trailing']")
      slot(name="icon-trailing")
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Props
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  required?: boolean
  id?: string
  ariaDescribedby?: string
  clearable?: boolean
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  invalid: false,
  required: false,
  clearable: false,
  loading: false,
  size: 'medium',
  autofocus: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [event: Event]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}>()

// Refs
const inputRef = ref<HTMLInputElement>()
const showPassword = ref(false)

// Computed
const hasValue = computed(() => {
  return props.modelValue !== '' && props.modelValue != null
})

const currentType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const hasTrailingIcons = computed(() => {
  return props.loading || 
    (props.type === 'password' && !props.disabled && !props.readonly) ||
    (props.clearable && hasValue.value && !props.disabled && !props.readonly) ||
    !!slots['icon-trailing']
})

const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'readonly': props.readonly,
  'invalid': props.invalid,
  'has-leading-icon': !!slots['icon-leading'],
  'has-trailing-icons': hasTrailingIcons.value,
  'loading': props.loading,
  [`size-${props.size}`]: true
}))

// Slots
const slots = defineSlots<{
  'icon-leading'?: () => any
  'icon-trailing'?: () => any
}>()

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value
  // Refocus input after toggle
  inputRef.value?.focus()
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
  // Refocus input after clear
  inputRef.value?.focus()
}

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style lang="sass" scoped>
@use '../styles/base' as base
@use '../styles/typography' as typography

.lb-input
  position: relative
  width: 100%
  
  // Input styles
  input
    // Default size (medium)
    width: 100%
    height: base.$size-2xl // 40px
    padding: 0 base.$space-4
    background: var(--color-input-background)
    border: base.$border-thin solid var(--color-input-border)
    border-radius: base.$radius-md
    font-size: typography.$label-size-base
    font-family: inherit
    color: var(--color-text)
    transition: border-color base.$transition, box-shadow base.$transition
    box-sizing: border-box
    
    // Placeholder
    &::placeholder
      color: var(--color-input-placeholder)
      opacity: 1 // Firefox fix
    
    // States
    &:hover:not(:disabled):not(:read-only)
      border-color: var(--color-input-border-hover)
    
    &:focus
      outline: none
      border-color: var(--color-input-border-focus)
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-primary-a5)
    
    // Focus takes precedence over hover
    &:focus:hover:not(:disabled):not(:read-only)
      border-color: var(--color-input-border-focus)
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-primary-a5)
    
    // Invalid state
    .invalid &
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
    
    // Readonly state
    &:read-only
      background: var(--color-surface)
      cursor: default
      
      &:focus
        border-color: var(--color-input-border)
        box-shadow: none
  
  // Size variations
  &.size-small input
    height: base.$size-xl // 32px
    padding: 0 base.$space-3
    font-size: typography.$label-size-small
    
  &.size-large input
    height: base.$size-3xl // 48px
    padding: 0 base.$space-5
    font-size: typography.$label-size-large
  
  // Icon padding adjustments
  &.has-leading-icon input
    padding-left: base.$space-12 // 40px for medium
    
  &.has-trailing-icons input
    padding-right: base.$space-12 // 40px for medium
  
  // Small size with icons
  &.size-small.has-leading-icon input
    padding-left: base.$space-11 // 32px for small
    
  &.size-small.has-trailing-icons input
    padding-right: base.$space-11 // 32px for small
  
  // Large size with icons
  &.size-large.has-leading-icon input
    padding-left: base.$space-13 // 48px for large
    
  &.size-large.has-trailing-icons input
    padding-right: base.$space-13 // 48px for large
  
  // Icon base styles
  .icon
    position: absolute
    top: 50%
    transform: translateY(-50%)
    display: flex
    align-items: center
    justify-content: center
    width: base.$size-2xl // 40px
    height: base.$size-2xl // 40px
    color: var(--color-text-tertiary)
    
    .size-small &
      width: base.$size-xl // 32px
      height: base.$size-xl // 32px
      
    .size-large &
      width: base.$size-3xl // 48px
      height: base.$size-3xl // 48px
    
    &.icon-leading
      left: 0
      pointer-events: none
    
    // Interactive icons (password toggle, clear)
    &.icon-password,
    &.icon-clear
      pointer-events: auto
      cursor: pointer
      background: none
      border: none
      padding: 0
      transition: color base.$transition, opacity base.$transition
      
      &:hover
        color: var(--color-text-secondary)
      
      &:focus-visible
        outline: base.$focus-ring-width solid var(--color-focus-ring)
        outline-offset: -2px
        border-radius: base.$radius-xs
      
      &:active
        opacity: 0.8
    
    // Icon color states
    input:focus ~ .trailing-icons &
      color: var(--color-text-secondary)
    
    .invalid &
      color: var(--color-error)
    
    .disabled &
      opacity: 0.6
  
  // Trailing icons container
  .trailing-icons
    position: absolute
    right: 0
    top: 50%
    transform: translateY(-50%)
    display: flex
    align-items: center
    justify-content: center
    width: base.$size-2xl // 40px
    height: base.$size-2xl // 40px
    gap: base.$space-1 // 2px
    
    .size-small &
      width: base.$size-xl // 32px
      height: base.$size-xl // 32px
      
    .size-large &
      width: base.$size-3xl// 48px
      height: base.$size-3xl// 48px
  
  // Loading spinner animation
  .spinner
    animation: lb-spin 1s linear infinite
    
    circle
      stroke-dasharray: 41.89
      stroke-dashoffset: 31.42
      animation: lb-spinner-dash 1.5s ease-in-out infinite
      opacity: 0.8
    
@keyframes lb-spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
    
@keyframes lb-spinner-dash
  0%
    stroke-dashoffset: 31.42
  50%
    stroke-dashoffset: 10.47
  100%
    stroke-dashoffset: 31.42
</style>