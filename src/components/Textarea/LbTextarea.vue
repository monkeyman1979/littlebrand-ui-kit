<template lang="pug">
.lb-textarea(:class="rootClasses")
  textarea(
    ref="textareaRef"
    :id="id"
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
    :aria-describedby="ariaDescribedby || undefined"
    :autofocus="autofocus"
    :spellcheck="spellcheck"
    @input="handleInput"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  )
  //- Character count at bottom
  .bottom-info(v-if="showCharacterCount && maxlength")
    .character-count
      span {{ characterCount }} / {{ maxlength }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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
  size?: 'small' | 'medium' | 'large'
  autofocus?: boolean
  rows?: number
  cols?: number
  minlength?: number
  maxlength?: number
  spellcheck?: boolean
  showCharacterCount?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  invalid: false,
  required: false,
  size: 'medium',
  autofocus: false,
  rows: 4,
  spellcheck: true,
  showCharacterCount: false,
  resize: 'vertical'
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

// Computed
const characterCount = computed(() => props.modelValue?.length || 0)

const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'readonly': props.readonly,
  'invalid': props.invalid,
  'has-character-count': props.showCharacterCount && props.maxlength,
  [`size-${props.size}`]: true,
  [`resize-${props.resize}`]: true
}))

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

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
  isolation: isolate
  overflow: visible
  contain: layout
  
  // Textarea styles
  textarea
    // Default size (medium)
    width: 100%
    min-height: base.$size-9xl // 96px for 4 rows
    padding: base.$space-3 base.$space-4
    background: var(--color-input-background)
    border: base.$border-thin solid var(--color-input-border)
    border-radius: base.$radius-md
    font-size: typography.$label-size-base
    font-family: inherit
    color: var(--color-text)
    line-height: typography.$line-relaxed
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
    
    
    // Invalid state when parent has .invalid class
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
  &.size-small textarea
    min-height: base.$size-7xl // 80px for small
    padding: base.$space-2 base.$space-3
    font-size: typography.$label-size-small
    
  &.size-large textarea
    min-height: base.$size-11xl // 112px for large
    padding: base.$space-4 base.$space-5
    font-size: typography.$label-size-large
  
  // Resize controls
  &.resize-none textarea
    resize: none
    
  &.resize-vertical textarea
    resize: vertical
    
  &.resize-horizontal textarea
    resize: horizontal
    
  &.resize-both textarea
    resize: both
  
  // Add padding when character count is shown
  &.has-character-count textarea
    padding-bottom: base.$space-10 // Make room for character count inside textarea
  
  // Invalid state for textarea
  &.invalid textarea
    border-color: var(--color-error-border)
    
    &:focus
      border-color: var(--color-error)
      box-shadow: 0 0 0 base.$focus-ring-width var(--color-error-a5)
  
  // Bottom info container for character count
  .bottom-info
    position: absolute
    right: base.$space-4
    bottom: base.$space-4
    pointer-events: none
    z-index: 1
    
    .size-small &
      right: base.$space-3
      bottom: base.$space-3
      
    .size-large &
      right: base.$space-5
      bottom: base.$space-5
  
  // Character count
  .character-count
    font-size: typography.$label-size-small
    color: var(--color-text-tertiary)
    white-space: nowrap
    background: var(--color-input-background)
    padding: base.$space-1 base.$space-2
    border-radius: base.$radius-xs
    
    // When focused, make it more visible
    textarea:focus ~ .bottom-info &
      color: var(--color-text-secondary)
    
    // When at or over limit
    .invalid &
      color: var(--color-error)
</style>