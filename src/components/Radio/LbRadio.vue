<template lang="pug">
div.lb-radio(:class="rootClasses")
  button.radio-button(
    ref="buttonRef"
    type="button"
    role="radio"
    :id="id"
    :aria-checked="isChecked.toString()"
    :aria-invalid="invalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    :disabled="disabled"
    @click="handleClick"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown.space.prevent="handleClick"
  )
    .radio-indicator(v-if="isChecked")
      slot(name="icon-selected")
        //- Default dot indicator
  span.radio-label(v-if="hasLabel")
    slot
  //- Hidden input for form submission
  input(
    v-if="isInForm"
    ref="hiddenInputRef"
    type="radio"
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
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

// Types
export interface LbRadioProps {
  modelValue?: any
  value: any
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  ariaDescribedby?: string
}

// Props
const props = withDefaults(defineProps<LbRadioProps>(), {
  disabled: false,
  required: false,
  invalid: false,
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// Refs
const buttonRef = ref<HTMLButtonElement>()
const hiddenInputRef = ref<HTMLInputElement>()

// Check if component is inside a form
const isInForm = ref(false)

// Track if we should show the selection animation
const showSelectionAnimation = ref(false)
const selectionAnimationTimer = ref<number>()

// Computed
const isChecked = computed(() => {
  return props.modelValue === props.value
})

const rootClasses = computed(() => ({
  'checked': isChecked.value,
  'disabled': props.disabled,
  'invalid': props.invalid
}))

// Handle selection animation
watch(isChecked, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    // Clear any existing timer
    if (selectionAnimationTimer.value) {
      clearTimeout(selectionAnimationTimer.value)
    }
    
    showSelectionAnimation.value = true
    selectionAnimationTimer.value = window.setTimeout(() => {
      showSelectionAnimation.value = false
      selectionAnimationTimer.value = undefined
    }, 300)
  }
})

// Check if we're in a form on mount
onMounted(() => {
  if (buttonRef.value) {
    isInForm.value = !!buttonRef.value.closest('form')
  }
})

// Methods
const handleClick = (event: MouseEvent | KeyboardEvent) => {
  if (props.disabled || isChecked.value) return
  
  emit('update:modelValue', props.value)
  
  // Create a synthetic change event for compatibility
  const changeEvent = new Event('change', { bubbles: true, cancelable: true })
  emit('change', changeEvent)
}

// Use form input composable for consistent attributes

// Cleanup timer on unmount
onUnmounted(() => {
  if (selectionAnimationTimer.value) {
    clearTimeout(selectionAnimationTimer.value)
  }
})

// Slots
const slots = defineSlots<{
  'icon-selected'?: () => any
  default?: () => any
}>()

const hasLabel = computed(() => {
  return !!slots.default
})

// Component options
defineOptions({
  name: 'LbRadio',
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

.lb-radio
  display: inline-flex
  align-items: center
  gap: base.$space-sm
  
  &.disabled
    cursor: not-allowed
  
  // The radio button itself
  .radio-button
    position: relative
    display: inline-flex
    align-items: center
    justify-content: center
    width: cv.$radio-size  // 20px
    height: cv.$radio-size  // 20px
    padding: 0
    margin: 0
    background: var(--lb-surface-subtle)
    border: cv.$radio-border-width solid var(--lb-border-neutral-normal)
    border-radius: base.$radius-full
    cursor: pointer
    transition: background-color base.$transition, border-color base.$transition, opacity base.$transition
    -webkit-appearance: none
    appearance: none
    
    &:disabled
      cursor: not-allowed
      opacity: base.$opacity-80
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
  
  // Radio indicator (the dot)
  .radio-indicator
    display: flex
    align-items: center
    justify-content: center
    width: base.$space-sm  // 8px
    height: base.$space-sm  // 8px
    background: white
    border-radius: base.$radius-full
    opacity: base.$opacity-0
    transform: scale(0)
    transition: opacity base.$transition, transform base.$transition
    will-change: opacity, transform
    pointer-events: none
    
  
  // Checked state
  &.checked
    .radio-button
      background: var(--lb-fill-primary-normal)
      border-color: var(--lb-fill-primary-normal)
      
    .radio-indicator
      opacity: base.$opacity-100
      transform: scale(1)
  
  // Hover state
  .radio-button:not(:disabled):hover
    border-color: var(--lb-border-neutral-active)
    
  &.checked .radio-button:not(:disabled):hover
    background: var(--lb-fill-primary-hover)
    border-color: var(--lb-fill-primary-hover)
  
  // Focus state
  .radio-button:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
  
  // Invalid state
  &.invalid
    .radio-button
      border-color: var(--lb-border-error-normal)
      
      &:focus-visible
        box-shadow: 0 0 0 calc(#{base.$focus-ring-width} + #{base.$focus-ring-offset}) var(--lb-surface-error-active)
        border-color: var(--lb-border-error-active)
        outline: none
      
    &.checked .radio-button
      background: var(--lb-fill-error-normal)
      border-color: var(--lb-fill-error-normal)
    
    // Hover states for invalid radios
    .radio-button:not(:disabled):hover
      border-color: var(--lb-border-error-active)
      
    &.checked .radio-button:not(:disabled):hover
      background: var(--lb-fill-error-hover)
      border-color: var(--lb-fill-error-hover)
  
  // Label styling
  .radio-label
    font-size: typography.$font-size-label-base
    font-weight: var(--lb-font-weight-label)
    line-height: typography.$line-height-normal
    color: var(--lb-text-neutral-normal)
    user-select: none
    
  // Disabled state
  &.disabled
    .radio-button
      opacity: base.$opacity-80
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      cursor: not-allowed
      
      &:hover
        border-color: var(--lb-border-neutral-disabled)
      
    &.checked .radio-button
      background: var(--lb-fill-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      
    .radio-label
      color: var(--lb-text-neutral-disabled)

</style>