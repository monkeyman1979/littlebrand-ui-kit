<template lang="pug">
.lb-radio(:class="rootClasses")
  input(
    ref="inputRef"
    type="radio"
    :id="id"
    :name="name"
    :checked="isChecked"
    :disabled="disabled"
    :required="required"
    :aria-invalid="invalid || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    :value="value"
    @change="handleChange"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  )
  .radio-visual
    .radio-dot(v-if="isChecked")
      slot(name="icon-selected")
        //- Default dot
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'

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
const inputRef = ref<HTMLInputElement>()

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

// Methods
const handleChange = (event: Event) => {
  emit('update:modelValue', props.value)
  emit('change', event)
}

// Use form input composable for consistent attributes

// Cleanup timer on unmount
onUnmounted(() => {
  if (selectionAnimationTimer.value) {
    clearTimeout(selectionAnimationTimer.value)
  }
})

// Slots
defineSlots<{
  'icon-selected'?: () => any
}>()

// Component options
defineOptions({
  name: 'LbRadio',
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

.lb-radio
  position: relative
  display: inline-block
  
  // Hidden native radio
  input[type="radio"]
    position: absolute
    opacity: 0
    width: 100%
    height: 100%
    margin: 0
    cursor: pointer
    z-index: 1
    
    &:disabled
      cursor: not-allowed
  
  // Visual radio
  .radio-visual
    position: relative
    display: flex
    align-items: center
    justify-content: center
    width: base.$size-md // 20px
    height: base.$size-md // 20px
    background: var(--color-input-background)
    border: base.$border-medium solid var(--color-input-border)
    border-radius: base.$radius-full
    transition: background-color base.$transition, border-color base.$transition, box-shadow base.$transition
    will-change: background-color, border-color
    
  
  // Radio dot
  .radio-dot
    display: flex
    align-items: center
    justify-content: center
    width: base.$space-4 // 8px
    height: base.$space-4 // 8px
    background: white
    border-radius: base.$radius-full
    opacity: 0
    transform: scale(0)
    transition: opacity base.$transition, transform base.$transition
    will-change: opacity, transform
    
  
  // Checked state
  &.checked
    .radio-visual
      background: var(--color-primary)
      border-color: var(--color-primary)
      
    .radio-dot
      opacity: 1
      transform: scale(1)
      animation: lb-radio-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)
  
  // Hover state
  input:not(:disabled):hover ~ .radio-visual
    border-color: var(--color-input-border-hover)
    
  &.checked input:not(:disabled):hover ~ .radio-visual
    background: var(--color-primary-hover)
    border-color: var(--color-primary-hover)
  
  // Focus state
  input:focus-visible ~ .radio-visual
    outline: none
    box-shadow: 0 0 0 base.$focus-ring-width var(--color-primary-a5)
    border-color: var(--color-input-border-focus)
  
  // Invalid state
  &.invalid
    .radio-visual
      border-color: var(--color-error-border)
      
    input:focus-visible ~ .radio-visual
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-error-a5)
      border-color: var(--color-error)
      
    &.checked .radio-visual
      background: var(--color-error)
      border-color: var(--color-error)
  
  // Disabled state
  &.disabled
    opacity: 0.6
    
    .radio-visual
      background: var(--color-surface)
      cursor: not-allowed
      
    &.checked .radio-visual
      background: var(--color-text-secondary)
      border-color: var(--color-text-secondary)
      
    input:hover ~ .radio-visual
      border-color: var(--color-input-border)

// Animation keyframes
@keyframes lb-radio-pop
  0%
    transform: scale(0)
  50%
    transform: scale(1.3)
  100%
    transform: scale(1)
</style>