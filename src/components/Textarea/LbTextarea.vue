<template lang="pug">
.lb-textarea(:class="rootClasses")
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
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  )
</template>

<script setup lang="ts">
import { computed, ref, inject, watch, nextTick, onMounted, type ComputedRef } from 'vue'

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

// Inject form field context if available
const injectedId = inject<ComputedRef<string> | undefined>('formFieldId', undefined)
const injectedAriaDescribedby = inject<ComputedRef<string | undefined> | undefined>('formFieldAriaDescribedby', undefined)

// Computed
const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'readonly': props.readonly,
  'invalid': props.invalid,
  [`resize-${props.resize}`]: true
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
    // Default size (medium)
    width: 100%
    min-height: var(--btn-height-large) // 48px minimum (matches large input)
    padding: var(--space-xs) var(--space-sm)
    background: var(--color-input-background)
    border: var(--border-sm) solid var(--color-input-border)
    border-radius: var(--radius-md)
    font-size: var(--font-size-label-base)
    font-family: inherit
    color: var(--color-text)
    line-height: var(--line-height-relaxed)
    transition: border-color var(--transition), box-shadow var(--transition)
    
    // Placeholder
    &::placeholder
      color: var(--color-input-placeholder)
      opacity: var(--opacity-100) // Firefox fix
    
    // States
    &:hover:not(:disabled):not(:read-only)
      border-color: var(--color-input-border-hover)
    
    &:focus
      outline: none
      border-color: var(--color-input-border-focus)
      box-shadow: 0 0 0 var(--focus-ring-width) var(--color-primary-a5)
    
    // Focus takes precedence over hover
    &:focus:hover:not(:disabled):not(:read-only)
      border-color: var(--color-input-border-focus)
      box-shadow: 0 0 0 var(--focus-ring-width) var(--color-primary-a5)
    
    // Invalid state when parent has .invalid class
    .invalid &
      border-color: var(--color-error-border)
      
      &:focus
        border-color: var(--color-error)
        box-shadow: 0 0 0 var(--focus-ring-width) var(--color-error-a5)
    
    // Disabled state
    &:disabled
      background: var(--color-surface)
      color: var(--color-text-disabled)
      cursor: not-allowed
      opacity: var(--opacity-60)
    
    // Readonly state
    &:read-only
      background: var(--color-surface)
      cursor: default
      
      &:focus
        border-color: var(--color-input-border)
        box-shadow: none
  
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
    border-color: var(--color-error-border)
    
    &:focus
      border-color: var(--color-error)
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-error-a5)
</style>