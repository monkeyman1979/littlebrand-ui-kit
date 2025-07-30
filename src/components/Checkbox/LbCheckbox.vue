<template lang="pug">
.lb-checkbox(:class="rootClasses")
  input(
    ref="inputRef"
    type="checkbox"
    :id="id"
    :checked="isChecked"
    :indeterminate="indeterminate"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    :value="value"
    @change="handleChange"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  )
  .checkbox-visual
    //- Checkmark icon
    .icon(v-if="!indeterminate && (isChecked || showCheckAnimation)")
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
    .icon(v-else-if="indeterminate")
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
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect, onUnmounted } from 'vue'

// Types
export interface LbCheckboxProps {
  modelValue?: boolean | Array<any>
  value?: any
  id?: string
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
const inputRef = ref<HTMLInputElement>()

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

// Update indeterminate state on input element
watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
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
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  
  if (Array.isArray(props.modelValue) && props.value !== undefined) {
    const newValue = [...props.modelValue]
    const index = newValue.indexOf(props.value)
    
    if (target.checked && index === -1) {
      newValue.push(props.value)
    } else if (!target.checked && index > -1) {
      newValue.splice(index, 1)
    }
    
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', target.checked)
  }
  
  emit('change', event)
}

// Cleanup timer on unmount
onUnmounted(() => {
  if (checkAnimationTimer.value) {
    clearTimeout(checkAnimationTimer.value)
  }
})

// Slots
defineSlots<{
  'icon-check'?: () => any
  'icon-indeterminate'?: () => any
}>()

// Component options
defineOptions({
  name: 'LbCheckbox',
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

.lb-checkbox
  position: relative
  display: inline-block
  
  // Hidden native checkbox
  input[type="checkbox"]
    position: absolute
    opacity: 0
    width: 100%
    height: 100%
    margin: 0
    cursor: pointer
    z-index: 1
    
    &:disabled
      cursor: not-allowed
  
  // Visual checkbox
  .checkbox-visual
    position: relative
    display: flex
    align-items: center
    justify-content: center
    width: base.$size-md // 20px
    height: base.$size-md // 20px
    background: var(--color-input-background)
    border: base.$border-medium solid var(--color-input-border)
    border-radius: base.$radius-sm
    transition: background-color base.$transition, border-color base.$transition, box-shadow base.$transition
    will-change: background-color, border-color
    
  
  // Icon
  .icon
    display: flex
    align-items: center
    justify-content: center
    color: white
    opacity: 0
    transform: scale(0)
    transition: opacity base.$transition, transform base.$transition
    will-change: opacity, transform
    
    svg
      width: 100%
      height: 100%
  
  // States
  &.checked,
  &.indeterminate
    .checkbox-visual
      background: var(--color-primary)
      border-color: var(--color-primary)
      
    .icon
      opacity: 1
      transform: scale(1)
      
    // Animation
    &:not(.indeterminate) .icon
      animation: lb-check-bounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)
  
  // Hover state
  input:not(:disabled):hover ~ .checkbox-visual
    border-color: var(--color-input-border-hover)
    
  &.checked input:not(:disabled):hover ~ .checkbox-visual,
  &.indeterminate input:not(:disabled):hover ~ .checkbox-visual
    background: var(--color-primary-hover)
    border-color: var(--color-primary-hover)
  
  // Focus state
  input:focus-visible ~ .checkbox-visual
    outline: none
    box-shadow: 0 0 0 base.$focus-ring-width var(--color-primary-a5)
    border-color: var(--color-input-border-focus)
  
  // Invalid state
  &.invalid
    .checkbox-visual
      border-color: var(--color-error-border)
      
    input:focus-visible ~ .checkbox-visual
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-error-a5)
      border-color: var(--color-error)
      
    &.checked .checkbox-visual,
    &.indeterminate .checkbox-visual
      background: var(--color-error)
      border-color: var(--color-error)
  
  // Disabled state
  &.disabled
    opacity: 0.6
    
    .checkbox-visual
      background: var(--color-surface)
      cursor: not-allowed
      
    &.checked .checkbox-visual,
    &.indeterminate .checkbox-visual
      background: var(--color-text-secondary)
      border-color: var(--color-text-secondary)
      
    input:hover ~ .checkbox-visual
      border-color: var(--color-input-border)

// Animation keyframes
@keyframes lb-check-bounce
  0%
    transform: scale(0)
  50%
    transform: scale(1.2)
  100%
    transform: scale(1)
</style>