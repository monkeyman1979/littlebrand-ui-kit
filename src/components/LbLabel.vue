<template lang="pug">
label.lb-label(:for="for" :class="rootClasses")
  .lb-label__icon(v-if="$slots.icon")
    slot(name="icon")
  .lb-label__text
    slot
    span.lb-label__hint(v-if="$slots.hint")
      slot(name="hint")
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  for?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

// Computed
const rootClasses = computed(() => ({
  'lb-label--required': props.required
}))

// Slots
defineSlots<{
  default: () => any
  hint?: () => any
  icon?: () => any
}>()
</script>

<style lang="sass" scoped>
@use '../styles/base' as base
@use '../styles/typography' as typography

.lb-label
  display: inline-flex
  align-items: flex-start
  gap: base.$space-2
  font-family: typography.$font-body
  font-weight: typography.$weight-medium
  line-height: typography.$line-normal
  color: var(--color-text)
  cursor: pointer
  
  font-size: typography.$label-size-base
  letter-spacing: typography.$letter-spacing-tight
  
  // Required indicator
  &--required &__text::after
    content: ' *'
    color: var(--color-error)
    font-weight: typography.$weight-normal
  
  // Icon container
  &__icon
    flex-shrink: 0
    display: flex
    align-items: center
    color: var(--color-text-secondary)
    
    width: 1rem // 16px
    height: 1rem
  
  // Text container
  &__text
    flex: 1
  
  // Hint text (inline)
  &__hint
    font-weight: typography.$weight-normal
    color: var(--color-text-secondary)
    margin-left: base.$space-2
    
    font-size: 0.75rem // 12px
</style>