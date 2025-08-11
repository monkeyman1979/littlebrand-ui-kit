<template lang="pug">
.lb-input(:class="rootClasses" :data-size="effectiveSize")
  .icon.icon-leading(v-if="$slots['icon-leading']")
    slot(name="icon-leading")
  input(
    ref="inputRef"
    :id="computedId"
    :type="currentType"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled || loading"
    :readonly="readonly"
    :required="required"
    :aria-invalid="invalid || undefined"
    :aria-describedby="computedAriaDescribedby"
    :autofocus="autofocus"
    @input="handleInput"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  )
  //- Trailing icons container
  .trailing-icons(v-if="hasTrailingIcons")
    //- Loading spinner
    .icon.icon-loading(v-if="loading")
      slot(name="icon-loading")
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
      slot(v-if="!showPassword" name="icon-password-show")
        //- Eye open icon (default)
        svg(
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
      slot(v-else name="icon-password-hide")
        //- Eye closed icon (default)
        svg(
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
      slot(name="icon-clear")
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
import { computed, ref, inject, type ComputedRef } from 'vue'

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
  size?: 'medium' | 'large'
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

// Inject form field context if available
const injectedId = inject<ComputedRef<string> | undefined>('formFieldId', undefined)
const injectedAriaDescribedby = inject<ComputedRef<string | undefined> | undefined>('formFieldAriaDescribedby', undefined)

// Inject density context if available
const injectedDensitySize = inject<ComputedRef<'medium' | 'large'> | undefined>('densitySize', undefined)

// Computed
const hasValue = computed(() => props.modelValue !== '' && props.modelValue != null)

// Compute effective size: explicit prop > density > default
const effectiveSize = computed(() => {
  // If size is explicitly set, use it
  if (props.size) return props.size
  // Otherwise use density-based size if available
  if (injectedDensitySize?.value) return injectedDensitySize.value
  // Fall back to default
  return 'medium'
})

const computedId = computed(() => {
  return props.id || injectedId?.value
})

const computedAriaDescribedby = computed(() => {
  return props.ariaDescribedby || injectedAriaDescribedby?.value || undefined
})

const currentType = computed(() => 
  props.type === 'password' && showPassword.value ? 'text' : props.type
)

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
  [`size-${effectiveSize.value}`]: true
}))

// Slots
const slots = defineSlots<{
  'icon-leading'?: () => any
  'icon-trailing'?: () => any
  'icon-password-show'?: () => any
  'icon-password-hide'?: () => any
  'icon-clear'?: () => any
  'icon-loading'?: () => any
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

</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-input
  position: relative
  width: 100%
  
  // Input styles
  input
    width: 100%
    background: var(--lb-background-surface)
    border: base.$input-border-width solid var(--lb-border-neutral-normal)
    border-radius: var(--lb-input-radius)
    font-family: inherit
    color: var(--lb-text-neutral-contrast-high)
    transition: border-color var(--lb-transition)
    box-sizing: border-box
    
    // Placeholder
    &::placeholder
      color: var(--lb-text-neutral-contrast-low)
      opacity: var(--lb-opacity-100) // Firefox fix
    
    // States
    &:hover:not(:disabled):not(:read-only)
      border-color: var(--lb-border-neutral-active)

    &:focus
      outline: base.$input-border-width solid var(--lb-border-primary-active)
    
  
  // Invalid state
  &.invalid input
    border-color: var(--lb-border-error-normal)
  
  // Disabled state
  input:disabled
    background: var(--lb-surface-neutral-subtle)
    color: var(--lb-text-neutral-disabled)
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
    border-color: var(--lb-border-neutral-disabled)
  
  // Readonly state
  input:read-only
    background: var(--lb-surface-neutral-subtle)
    cursor: default
  
  // Size variations
  &.size-medium input
    height: base.$input-height-medium
    padding: 0 base.$input-padding-x-medium
    font-size: var(--lb-input-font-size-medium)
  
  &.size-large input
    height: base.$input-height-large
    padding: 0 base.$input-padding-x-large
    font-size: var(--lb-input-font-size-large)
  
  // Icon padding adjustments
  &.has-leading-icon input
    padding-left: var(--lb-space-4xl) // 40px for medium
    
  &.has-trailing-icons input
    padding-right: var(--lb-space-4xl) // 40px for medium
  
  // Large size with icons
  &.size-large.has-leading-icon input
    padding-left: var(--lb-space-5xl) // 48px for large
    
  &.size-large.has-trailing-icons input
    padding-right: var(--lb-space-5xl) // 48px for large
  
    
  
  // Icon base styles
  .icon
    position: absolute
    top: 50%
    transform: translateY(-50%)
    display: flex
    align-items: center
    justify-content: center
    width: base.$input-height-medium  // Icon area matches input height
    height: base.$input-height-medium
    color: var(--lb-text-neutral-contrast-low)
  
  &.size-large .icon
    width: base.$input-height-large
    height: base.$input-height-large
    
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
      transition: color var(--lb-transition), opacity var(--lb-transition)
      
      &:hover
        color: var(--lb-text-neutral-contrast-high)
      
      &:focus
        outline: var(--lb-focus-ring-width) solid var(--lb-focus-ring-color)
        outline-offset: calc(var(--lb-space-2xs) * -1)
        border-radius: var(--lb-radius-md)
      
      &:active
        opacity: var(--lb-opacity-80)
    
  
  // Icon focus state
  input:focus ~ .trailing-icons .icon
    color: var(--lb-text-neutral-contrast-high)
    
  // Icon states based on parent classes
  &.invalid .icon
    color: var(--lb-text-error-normal)
    
  &.disabled .icon
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
    width: base.$input-height-medium
    height: base.$input-height-medium
    gap: var(--lb-space-2xs)
  
  &.size-large .trailing-icons
    width: base.$input-height-large
    height: base.$input-height-large
  
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