<template lang="pug">
.lb-textarea(:class="rootClasses" :data-size="effectiveSize")
  textarea(
    ref="textareaRef"
    :id="computedId"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :rows="rows"
    :cols="cols"
    :minlength="minlength"
    :maxlength="maxlength"
    :aria-invalid="invalid || undefined"
    :aria-describedby="computedAriaDescribedby"
    :autofocus="autofocus"
    :spellcheck="spellcheck"
    @input="handleInput"
    @change="$emit('change', $event)"
    @focus="handleFocus"
    @blur="handleBlur"
  )
</template>

<script setup lang="ts">
import { computed, ref, inject, watch, nextTick, onMounted, onUnmounted, type ComputedRef } from 'vue'

// Props
interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  required?: boolean
  id?: string
  ariaDescribedby?: string
  autofocus?: boolean
  rows?: number
  cols?: number
  minlength?: number
  maxlength?: number
  spellcheck?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  autoResize?: boolean
  maxRows?: number
  size?: 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  invalid: false,
  required: false,
  autofocus: false,
  rows: 4,
  spellcheck: true,
  resize: 'vertical',
  autoResize: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [event: Event]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// Refs
const textareaRef = ref<HTMLTextAreaElement>()
const lineHeight = ref<number>(0)
const isKeyboardFocus = ref(false)

// Inject form field context if available
const injectedId = inject<ComputedRef<string> | undefined>('formFieldId', undefined)
const injectedAriaDescribedby = inject<ComputedRef<string | undefined> | undefined>('formFieldAriaDescribedby', undefined)

// Inject density context if available
const injectedDensitySize = inject<ComputedRef<'medium' | 'large'> | undefined>('densitySize', undefined)

// Computed
// Compute effective size: explicit prop > density > default
const effectiveSize = computed(() => {
  // If size is explicitly set, use it
  if (props.size) return props.size
  // Otherwise use density-based size if available
  if (injectedDensitySize?.value) return injectedDensitySize.value
  // Fall back to default
  return 'medium'
})

const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'readonly': props.readonly,
  'invalid': props.invalid,
  'keyboard-focus': isKeyboardFocus.value,
  [`resize-${props.resize}`]: true,
  [`size-${effectiveSize.value}`]: true
}))

const computedId = computed(() => {
  return props.id || injectedId?.value
})

const computedAriaDescribedby = computed(() => {
  return props.ariaDescribedby || injectedAriaDescribedby?.value || undefined
})

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

// Track keyboard vs mouse focus
let lastInteractionWasKeyboard = false

const handleKeyDown = () => {
  lastInteractionWasKeyboard = true
}

const handleMouseDown = () => {
  lastInteractionWasKeyboard = false
}

const handleFocus = (event: FocusEvent) => {
  isKeyboardFocus.value = lastInteractionWasKeyboard
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isKeyboardFocus.value = false
  emit('blur', event)
}

// Auto-resize functionality
const adjustHeight = () => {
  if (!props.autoResize || !textareaRef.value) return
  
  const textarea = textareaRef.value
  
  // Reset height to get accurate scrollHeight
  textarea.style.height = 'auto'
  
  // Calculate the height needed for content
  const scrollHeight = textarea.scrollHeight
  
  // Calculate max height if maxRows is set
  let maxHeight = Infinity
  if (props.maxRows && lineHeight.value) {
    // Get computed styles to calculate padding
    const computedStyle = window.getComputedStyle(textarea)
    const paddingTop = parseFloat(computedStyle.paddingTop)
    const paddingBottom = parseFloat(computedStyle.paddingBottom)
    const borderTop = parseFloat(computedStyle.borderTopWidth)
    const borderBottom = parseFloat(computedStyle.borderBottomWidth)
    
    // Calculate max height based on maxRows
    maxHeight = (lineHeight.value * props.maxRows) + paddingTop + paddingBottom + borderTop + borderBottom
  }
  
  // Set the new height, respecting maxHeight
  textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
}

// Watch for content changes
watch(() => props.modelValue, () => {
  if (props.autoResize) {
    nextTick(() => {
      adjustHeight()
    })
  }
})

// Initialize on mount
onMounted(() => {
  if (props.autoResize && textareaRef.value) {
    // Calculate line height for maxRows calculation
    const computedStyle = window.getComputedStyle(textareaRef.value)
    lineHeight.value = parseFloat(computedStyle.lineHeight)
    
    // Initial height adjustment
    adjustHeight()
  }
  
  // Set up global listeners for keyboard/mouse detection
  document.addEventListener('keydown', handleKeyDown, true)
  document.addEventListener('mousedown', handleMouseDown, true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown, true)
  document.removeEventListener('mousedown', handleMouseDown, true)
})

// Expose refs for parent access
defineExpose({
  textareaRef
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-textarea
  position: relative
  width: 100%
  
  // Textarea styles
  textarea
    width: 100%
    min-height: base.$textarea-min-height-medium // 96px minimum
    background: var(--lb-background-surface)
    border: base.$textarea-border-width solid var(--lb-border-neutral-normal)
    border-radius: var(--lb-textarea-radius)
    font-family: inherit
    font-size: var(--lb-textarea-font-size-medium)  // Default to 14px
    color: var(--lb-text-neutral-contrast-high)
    line-height: var(--lb-line-height-relaxed)
    transition: border-color var(--lb-transition), box-shadow var(--lb-transition)

    // Placeholder
    &::placeholder
      color: var(--lb-text-neutral-contrast-low)
      opacity: var(--lb-opacity-100) // Firefox fix
    
    // States
    &:hover:not(:disabled):not(:read-only)
      border-color: var(--lb-border-neutral-active)
    
    &:focus
      outline: base.$textarea-border-width solid var(--lb-border-primary-active)
  
  // Invalid state
  &.invalid textarea
    border-color: var(--lb-border-error-normal)
    
    // Maintain error border on hover
    &:hover:not(:disabled):not(:read-only)
      border-color: var(--lb-border-error-normal)
    
    &:focus
      outline: base.$textarea-border-width solid var(--lb-border-error-active)
    
    // Disabled state
    &:disabled
      background: var(--lb-surface-neutral-subtle)
      color: var(--lb-text-neutral-disabled)
      cursor: not-allowed
      opacity: var(--lb-opacity-60)
      border-color: var(--lb-border-neutral-disabled)
    
    // Readonly state
    &:read-only
      background: var(--lb-surface-neutral-subtle)
      cursor: default
  
  // Size variants - moved outside of textarea to increase specificity
  &.size-medium textarea
    min-height: base.$textarea-min-height-medium  // 96px
    font-size: var(--lb-textarea-font-size-medium)  // 14px
    padding: base.$textarea-padding-y base.$textarea-padding-x
  
  &.size-large textarea
    min-height: base.$textarea-min-height-large  // 120px
    font-size: var(--lb-textarea-font-size-large)  // 16px
    padding: base.$textarea-padding-y base.$textarea-padding-x  // 8px 12px
  
  
  // Resize controls
  &.resize-none textarea
    resize: none
    
  &.resize-vertical textarea
    resize: vertical
    
  &.resize-horizontal textarea
    resize: horizontal
    
  &.resize-both textarea
    resize: both
  
  // Invalid state for textarea
  &.invalid textarea
    border-color: var(--lb-border-error-normal)
    
    &:focus
      border-color: var(--lb-border-error-active)
  
</style>