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
  autofocus?: boolean
  rows?: number
  cols?: number
  minlength?: number
  maxlength?: number
  spellcheck?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
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
const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'readonly': props.readonly,
  'invalid': props.invalid,
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
    
    // Focus takes precedence over hover
    &:focus:hover:not(:disabled):not(:read-only)
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