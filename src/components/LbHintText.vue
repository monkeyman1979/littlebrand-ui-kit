<template lang="pug">
.lb-hint-text(:id="id" :class="rootClasses" role="status")
  .icon.icon-leading(v-if="$slots['icon-leading']")
    slot(name="icon-leading")
  span
    slot
  .icon.icon-trailing(v-if="$slots['icon-trailing']")
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
  'error': props.error,
  'warning': props.warning,
  'success': props.success
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
  align-items: center
  gap: base.$space-2
  font-size: typography.$label-size-small // 12px
  line-height: typography.$line-normal
  color: var(--color-text-secondary)
  
  // State variations
  &.error
    color: var(--color-error-text)
    
    .icon
      color: var(--color-error)
  
  &.warning
    color: var(--color-warning-text)
    
    .icon
      color: var(--color-warning)
  
  &.success
    color: var(--color-success-text)
    
    .icon
      color: var(--color-success)
  
  // Icons
  .icon
    flex-shrink: 0
    display: flex
    align-items: center
    width: base.$size-2xs // 12px
    height: base.$size-2xs // 12px
    color: currentColor
  
  // Message text wrapper
  > span
    flex: 1
    
    // Ensure links inherit the state color
    a
      color: inherit
      text-decoration: underline
      
      &:hover
        opacity: 0.8
</style>