<template lang="pug">
label.lb-checkbox(:class="rootClasses")
  button.checkbox-button(
    ref="buttonRef"
    type="button"
    role="checkbox"
    :id="id"
    :aria-checked="indeterminate ? 'mixed' : isChecked.toString()"
    :aria-invalid="invalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    :disabled="disabled"
    @click="handleClick"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown.space.prevent="handleClick"
  )
    //- Checkmark icon
    .checkbox-indicator(v-if="!indeterminate && (isChecked || showCheckAnimation)")
      slot(name="icon-check")
        svg(
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        )
          path(
            d="M4 11L8 15L16 5" 
            stroke="currentColor" 
            stroke-width="2.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          )
    //- Indeterminate icon
    .checkbox-indicator(v-else-if="indeterminate")
      slot(name="icon-indeterminate")
        svg(
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        )
          path(
            d="M5 10h10" 
            stroke="currentColor" 
            stroke-width="2.5" 
            stroke-linecap="round"
          )
  span.checkbox-label(v-if="hasLabel")
    slot
  //- Hidden input for form submission
  input(
    v-if="isInForm"
    ref="hiddenInputRef"
    type="checkbox"
    :name="name"
    :value="value"
    :checked="isChecked"
    :disabled="disabled"
    :required="required"
    tabindex="-1"
    aria-hidden="true"
    style="position: absolute; pointer-events: none; opacity: 0; margin: 0"
  )
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect, onMounted, onUnmounted } from 'vue'

// Types
export interface LbCheckboxProps {
  modelValue?: boolean | Array<any>
  value?: any
  id?: string
  name?: string  // For form submission
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  indeterminate?: boolean
  ariaDescribedby?: string
}

// Props
const props = withDefaults(defineProps<LbCheckboxProps>(), {
  modelValue: false,
  disabled: false,
  required: false,
  invalid: false,
  indeterminate: false,
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean | Array<any>]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// Refs
const buttonRef = ref<HTMLButtonElement>()
const hiddenInputRef = ref<HTMLInputElement>()

// Check if component is inside a form
const isInForm = ref(false)

// Computed
const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.value !== undefined && props.modelValue.includes(props.value)
  }
  return !!props.modelValue
})

// Track if we should show the check animation
const showCheckAnimation = ref(false)
const checkAnimationTimer = ref<number>()

const rootClasses = computed(() => ({
  'checked': isChecked.value,
  'indeterminate': props.indeterminate,
  'disabled': props.disabled,
  'invalid': props.invalid
}))

// Check if we're in a form on mount
onMounted(() => {
  if (buttonRef.value) {
    isInForm.value = !!buttonRef.value.closest('form')
  }
})

// Update hidden input indeterminate state if in form
watchEffect(() => {
  if (hiddenInputRef.value) {
    hiddenInputRef.value.indeterminate = props.indeterminate
  }
})

// Handle check animation
watch(isChecked, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    // Clear any existing timer
    if (checkAnimationTimer.value) {
      clearTimeout(checkAnimationTimer.value)
    }
    
    showCheckAnimation.value = true
    checkAnimationTimer.value = window.setTimeout(() => {
      showCheckAnimation.value = false
      checkAnimationTimer.value = undefined
    }, 300)
  }
})

// Methods
const handleClick = (event: MouseEvent | KeyboardEvent) => {
  if (props.disabled) return
  
  if (Array.isArray(props.modelValue) && props.value !== undefined) {
    const newValue = [...props.modelValue]
    const index = newValue.indexOf(props.value)
    
    if (index === -1) {
      newValue.push(props.value)
    } else {
      newValue.splice(index, 1)
    }
    
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', !isChecked.value)
  }
  
  // Create a synthetic change event for compatibility
  const changeEvent = new Event('change', { bubbles: true, cancelable: true })
  emit('change', changeEvent)
}

// Cleanup timer on unmount
onUnmounted(() => {
  if (checkAnimationTimer.value) {
    clearTimeout(checkAnimationTimer.value)
  }
})

// Slots
const slots = defineSlots<{
  'icon-check'?: () => any
  'icon-indeterminate'?: () => any
  default?: () => any
}>()

const hasLabel = computed(() => {
  return !!slots.default
})

// Component options
defineOptions({
  name: 'LbCheckbox',
  inheritAttrs: false
})

// Expose
defineExpose({
  buttonRef,
  focus: () => buttonRef.value?.focus(),
  blur: () => buttonRef.value?.blur()
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/component-variables' as cv
@use '@/styles/typography' as typography

.lb-checkbox
  display: inline-flex
  align-items: center
  gap: base.$space-sm
  
  &.disabled
    cursor: not-allowed
  
  // The checkbox button itself
  .checkbox-button
    position: relative
    display: inline-flex
    align-items: center
    justify-content: center
    width: cv.$checkbox-size  // 20px
    height: cv.$checkbox-size  // 20px
    padding: 0
    margin: 0
    background: var(--lb-background-surface)
    border: cv.$checkbox-border-width solid var(--lb-border-neutral-normal)
    border-radius: cv.$checkbox-border-radius
    cursor: pointer
    transition: all base.$transition
    -webkit-appearance: none
    appearance: none
    
    &:disabled
      cursor: not-allowed
      opacity: base.$opacity-80
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
  
  // Checkbox indicator (checkmark or indeterminate line)
  .checkbox-indicator
    display: flex
    align-items: center
    justify-content: center
    width: var(--lb-icon-size-sm)  // 18px
    height: var(--lb-icon-size-sm)  // 18px
    color: white
    opacity: base.$opacity-0
    transform: scale(0)
    transition: opacity base.$transition, transform base.$transition
    will-change: opacity, transform
    
    svg
      width: 100%
      height: 100%
  
  // States
  &.checked,
  &.indeterminate
    .checkbox-button
      background: var(--lb-fill-primary-normal)
      border-color: var(--lb-fill-primary-normal)
      
    .checkbox-indicator
      opacity: base.$opacity-100
      transform: scale(1)
      
    // Animation
    &:not(.indeterminate) .checkbox-indicator
      animation: lb-check-bounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)
  
  // Hover state
  .checkbox-button:not(:disabled):hover
    border-color: var(--lb-border-neutral-active)
    
  &.checked .checkbox-button:not(:disabled):hover,
  &.indeterminate .checkbox-button:not(:disabled):hover
    background: var(--lb-fill-primary-hover)
    border-color: var(--lb-fill-primary-hover)
  
  // Focus state
  .checkbox-button:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
  
  // Invalid state
  &.invalid
    .checkbox-button
      border-color: var(--lb-border-error-normal)
      
      &:focus-visible
        box-shadow: 0 0 0 calc(#{base.$focus-ring-width} + #{base.$focus-ring-offset}) var(--lb-surface-error-active)
        border-color: var(--lb-border-error-active)
        outline: none
      
    &.checked .checkbox-button,
    &.indeterminate .checkbox-button
      background: var(--lb-fill-error-normal)
      border-color: var(--lb-fill-error-normal)
    
    // Hover states for invalid checkboxes
    .checkbox-button:not(:disabled):hover
      border-color: var(--lb-border-error-active)
      
    &.checked .checkbox-button:not(:disabled):hover,
    &.indeterminate .checkbox-button:not(:disabled):hover
      background: var(--lb-fill-error-hover)
      border-color: var(--lb-fill-error-hover)
  
  // Label styling
  .checkbox-label
    font-size: typography.$font-size-label-small
    font-weight: typography.$font-weight-medium
    line-height: typography.$line-height-normal
    color: var(--lb-text-neutral-normal)
    user-select: none
    
  // Disabled state
  &.disabled
    .checkbox-button
      opacity: base.$opacity-80
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      cursor: not-allowed
      
      &:hover
        border-color: var(--lb-border-neutral-disabled)
      
    &.checked .checkbox-button,
    &.indeterminate .checkbox-button
      background: var(--lb-fill-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      
      .checkbox-indicator
        color: var(--lb-text-neutral-disabled)
      
    .checkbox-label
      color: var(--lb-text-neutral-disabled)

// Animation keyframes
@keyframes lb-check-bounce
  0%
    transform: scale(0)
  50%
    transform: scale(1.2)
  100%
    transform: scale(1)
</style>