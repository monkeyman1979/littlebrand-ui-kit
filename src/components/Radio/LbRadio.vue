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
@use '@/styles/component-variables' as cv
@use '@/styles/typography' as typography

.lb-radio
  position: relative
  display: inline-block
  
  // Hidden native radio
  input[type="radio"]
    position: absolute
    opacity: base.$opacity-0
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
    width: cv.$radio-size  // 20px
    height: cv.$radio-size  // 20px
    background: var(--lb-background-surface)
    border: cv.$radio-border-width solid var(--lb-border-neutral-normal)
    border-radius: base.$radius-full
    transition: background-color base.$transition, border-color base.$transition, box-shadow base.$transition
    will-change: background-color, border-color
    
  
  // Radio dot
  .radio-dot
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
    
  
  // Checked state
  &.checked
    .radio-visual
      background: var(--lb-fill-primary-normal)
      border-color: var(--lb-fill-primary-normal)
      
    .radio-dot
      opacity: base.$opacity-100
      transform: scale(1)
  
  // Hover state
  input:not(:disabled):hover ~ .radio-visual
    border-color: var(--lb-border-neutral-active)
    
  &.checked input:not(:disabled):hover ~ .radio-visual
    background: var(--lb-fill-primary-hover)
    border-color: var(--lb-fill-primary-hover)
  
  // Focus state
  input:focus-visible ~ .radio-visual
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
  
  // Invalid state
  &.invalid
    .radio-visual
      border-color: var(--lb-border-error-normal)
      
    input:focus-visible ~ .radio-visual
      box-shadow: 0 0 0 calc(#{base.$focus-ring-width} + #{base.$focus-ring-offset}) var(--lb-surface-error-active)
      border-color: var(--lb-border-error-active)
      
    &.checked .radio-visual
      background: var(--lb-fill-error-normal)
      border-color: var(--lb-fill-error-normal)
    
    // Hover states for invalid radios (must override default hover)
    input:not(:disabled):hover ~ .radio-visual
      border-color: var(--lb-border-error-active)
      
    &.checked input:not(:disabled):hover ~ .radio-visual
      background: var(--lb-fill-error-hover)
      border-color: var(--lb-fill-error-hover)
  
  // Disabled state
  &.disabled
    opacity: base.$opacity-80
    
    .radio-visual
      background: var(--lb-surface-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      cursor: not-allowed
      
    &.checked .radio-visual
      background: var(--lb-fill-neutral-disabled)
      border-color: var(--lb-border-neutral-disabled)
      
    input:hover ~ .radio-visual
      border-color: var(--lb-border-neutral-normal)

</style>