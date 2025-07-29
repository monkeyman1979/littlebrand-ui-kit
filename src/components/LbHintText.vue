<template lang="pug">
.lb-hint-text(:id="id" :class="rootClasses" role="status")
  .lb-hint-text__icon.lb-hint-text__icon--leading(v-if="$slots['icon-leading']")
    slot(name="icon-leading")
  .lb-hint-text__message
    slot
  .lb-hint-text__icon.lb-hint-text__icon--trailing(v-if="$slots['icon-trailing']")
    slot(name="icon-trailing")
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  error?: boolean
  warning?: boolean
  success?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  error: false,
  warning: false,
  success: false
})

// Computed
const rootClasses = computed(() => ({
  'lb-hint-text--error': props.error,
  'lb-hint-text--warning': props.warning,
  'lb-hint-text--success': props.success
}))

// Slots
defineSlots<{
  default: () => any
  'icon-leading'?: () => any
  'icon-trailing'?: () => any
}>()
</script>

<style lang="sass" scoped>
@use '../styles/base' as base
@use '../styles/typography' as typography

.lb-hint-text
  display: flex
  align-items: flex-start
  gap: base.$space-2
  font-size: typography.$label-size-small // 12px
  line-height: typography.$line-normal
  color: var(--color-text-secondary)
  
  // State variations
  &--error
    color: var(--color-error-text)
    
    .lb-hint-text__icon
      color: var(--color-error)
  
  &--warning
    color: var(--color-warning-text)
    
    .lb-hint-text__icon
      color: var(--color-warning)
  
  &--success
    color: var(--color-success-text)
    
    .lb-hint-text__icon
      color: var(--color-success)
  
  // Icon containers
  &__icon
    flex-shrink: 0
    display: flex
    align-items: center
    width: 1rem // 16px
    height: 1.25rem // 20px to align with line height
    color: currentColor
    
  
  // Message text
  &__message
    flex: 1
    
    // Ensure links inherit the state color
    a
      color: inherit
      text-decoration: underline
      
      &:hover
        opacity: 0.8
</style>