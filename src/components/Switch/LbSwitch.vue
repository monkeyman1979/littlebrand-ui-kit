<template lang="pug">
div.lb-switch(:class="rootClasses")
  button.switch-track(
    ref="buttonRef"
    type="button"
    role="switch"
    :id="id"
    :aria-checked="modelValue.toString()"
    :aria-invalid="invalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    :disabled="disabled"
    @click="handleClick"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown.space.prevent="handleClick"
  )
    .switch-thumb
  span.switch-label(v-if="hasLabel")
    slot
  //- Hidden input for form submission
  input(
    v-if="isInForm"
    ref="hiddenInputRef"
    type="checkbox"
    :name="name"
    :checked="modelValue"
    :disabled="disabled"
    :required="required"
    tabindex="-1"
    aria-hidden="true"
    style="position: absolute; pointer-events: none; opacity: 0; margin: 0"
  )
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

// Types
export interface LbSwitchProps {
  modelValue?: boolean
  id?: string
  name?: string  // For form submission
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
const buttonRef = ref<HTMLButtonElement>()
const hiddenInputRef = ref<HTMLInputElement>()

// Check if component is inside a form
const isInForm = ref(false)

// Slots
const slots = defineSlots<{
  default?: () => any
}>()

const hasLabel = computed(() => {
  return !!slots.default
})

// Computed
const rootClasses = computed(() => ({
  'checked': props.modelValue,
  'disabled': props.disabled,
  'invalid': props.invalid,
  [`size-${props.size}`]: true
}))

// Check if we're in a form on mount
onMounted(() => {
  if (buttonRef.value) {
    isInForm.value = !!buttonRef.value.closest('form')
  }
})

// Methods
const handleClick = (event: MouseEvent | KeyboardEvent) => {
  if (props.disabled) return
  
  emit('update:modelValue', !props.modelValue)
  
  // Create a synthetic change event for compatibility
  const changeEvent = new Event('change', { bubbles: true, cancelable: true })
  emit('change', changeEvent)
}

// Component options
defineOptions({
  name: 'LbSwitch',
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

.lb-switch
  display: inline-flex
  align-items: center
  gap: base.$space-sm
  
  &.disabled
    cursor: not-allowed
  
  // Switch track (the button)
  .switch-track
    position: relative
    padding: 0
    margin: 0
    background: var(--lb-background-surface)
    border: base.$border-md solid var(--lb-border-neutral-normal)
    border-radius: cv.$switch-border-radius
    cursor: pointer
    transition: all base.$transition
    -webkit-appearance: none
    appearance: none
    
    &:disabled
      cursor: not-allowed
      opacity: base.$opacity-80
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
  
  // Switch thumb
  .switch-thumb
    position: absolute
    top: 50%
    transform: translateY(-50%)
    background: var(--lb-border-neutral-active)
    border-radius: base.$radius-full
    transition: transform base.$transition, background-color base.$transition
    will-change: transform
    pointer-events: none
  
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
  &:not(.checked) .switch-track:not(:disabled):hover
    border-color: var(--lb-border-neutral-active)
    
    .switch-thumb
      background: var(--lb-fill-neutral-normal)
    
  &.checked .switch-track:not(:disabled):hover
    background: var(--lb-fill-primary-hover)
    border-color: var(--lb-fill-primary-hover)
  
  // Focus state
  .switch-track:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
  
  // Invalid state
  &.invalid
    .switch-track
      border-color: var(--lb-border-error-normal)
      
      &:focus-visible
        box-shadow: 0 0 0 calc(#{base.$focus-ring-width} + #{base.$focus-ring-offset}) var(--lb-surface-error-active)
        border-color: var(--lb-border-error-active)
        outline: none
      
    &.checked .switch-track
      background: var(--lb-fill-error-normal)
      border-color: var(--lb-fill-error-normal)
    
    // Hover states for invalid switches
    &:not(.checked) .switch-track:not(:disabled):hover
      border-color: var(--lb-border-error-active)
      
    &.checked .switch-track:not(:disabled):hover
      background: var(--lb-fill-error-hover)
      border-color: var(--lb-fill-error-hover)
  
  // Label styling
  .switch-label
    font-size: typography.$font-size-label-base
    font-weight: typography.$font-weight-medium
    line-height: typography.$line-height-normal
    color: var(--lb-text-neutral-normal)
    user-select: none
    
  // Disabled state
  &.disabled
    .switch-track
      opacity: base.$opacity-80
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      cursor: not-allowed
      
      &:hover
        border-color: var(--lb-border-neutral-disabled)
      
      .switch-thumb
        background: var(--lb-fill-neutral-disabled)
      
    &.checked .switch-track
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      
      .switch-thumb
        background: var(--lb-fill-neutral-disabled)
      
    .switch-label
      color: var(--lb-text-neutral-disabled)
</style>