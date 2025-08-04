<template lang="pug">
span.lb-badge(
  :class="badgeClasses"
  :aria-label="ariaLabel"
  role="status"
)
  | {{ !dot ? displayValue : '' }}
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
type Size = 'small' | 'medium' | 'large'
type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline'

// Props
const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  dot?: boolean
  max?: number
  position?: Position
}>(), {
  variant: 'error',
  size: 'medium',
  dot: false,
  max: 999,
  position: 'inline'
})

// Slots
const slots = defineSlots<{
  default(): any
}>()

// Computed
const badgeClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
  `position-${props.position}`,
  {
    'is-dot': props.dot
  }
])

const displayValue = computed(() => {
  if (props.dot) return ''
  
  const slotContent = slots.default?.()
  if (!slotContent || slotContent.length === 0) return ''
  
  // Extract text content from slot
  const textContent = slotContent
    .map(node => {
      if (typeof node.children === 'string') return node.children
      if (typeof node.children === 'number') return node.children.toString()
      return ''
    })
    .join('')
    .trim()
  
  // If it's a number and exceeds max, show max+
  const numValue = parseInt(textContent, 10)
  if (!isNaN(numValue) && numValue > props.max) {
    return `${props.max}+`
  }
  
  return textContent
})

const ariaLabel = computed(() => {
  if (props.dot) {
    return 'Notification indicator'
  }
  
  const value = displayValue.value
  if (!value) return 'Badge'
  
  const numValue = parseInt(value.replace('+', ''), 10)
  if (!isNaN(numValue)) {
    if (value.includes('+')) {
      return `${numValue} or more notifications`
    }
    return `${numValue} notification${numValue === 1 ? '' : 's'}`
  }
  
  return `Badge: ${value}`
})

// Component options
defineOptions({
  name: 'LbBadge'
})
</script>

<style lang="sass" scoped>
@use '@/styles/colors' as colors
@use '@/styles/base' as base

.lb-badge
  display: inline-flex
  align-items: center
  justify-content: center
  font-family: var(--font-body)
  font-weight: var(--font-weight-semibold)
  line-height: 1
  letter-spacing: var(--letter-spacing-tight)
  border-radius: var(--radius-lg)
  white-space: nowrap
  user-select: none
  vertical-align: top
  animation: lb-badge-appear 0.2s ease-out
  box-shadow: var(--shadow-sm)
  
  // Base sizing for medium (default)
  min-width: 1.25rem // 20px
  height: 1.25rem // 20px
  padding: 0 0.375rem // 6px
  font-size: 0.75rem // 12px
  
  // Position variants
  &.position-top-right
    position: absolute
    top: 0
    right: 0
    transform: translate(25%, -25%)
    
  &.position-top-left
    position: absolute
    top: 0
    left: 0
    transform: translate(-25%, -25%)
    
  &.position-bottom-right
    position: absolute
    bottom: 0
    right: 0
    transform: translate(25%, 25%)
    
  &.position-bottom-left
    position: absolute
    bottom: 0
    left: 0
    transform: translate(-25%, 25%)
    
  &.position-inline
    position: relative
  
  // Size variants
  &.size-small
    min-width: 1rem // 16px
    height: 1rem // 16px
    padding: 0 0.25rem // 4px
    font-size: 0.625rem // 10px
    
  &.size-large
    min-width: 1.5rem // 24px
    height: 1.5rem // 24px
    padding: 0 0.5rem // 8px
    font-size: 0.875rem // 14px
  
  // Dot variant overrides
  &.is-dot
    min-width: 0.5rem // 8px
    width: 0.5rem // 8px
    height: 0.5rem // 8px
    padding: 0
    border-radius: var(--radius-full)
    
    &.size-small
      width: 0.375rem // 6px
      height: 0.375rem // 6px
      min-width: 0.375rem
      
    &.size-large
      width: 0.625rem // 10px
      height: 0.625rem // 10px
      min-width: 0.625rem

// Variant styles - notification bubble appearance
.lb-badge.variant-default
  background-color: var(--color-text-secondary)
  color: white

.lb-badge.variant-primary
  background-color: var(--color-primary)
  color: white

.lb-badge.variant-secondary
  background-color: var(--color-secondary)
  color: white

.lb-badge.variant-success
  background-color: var(--color-success)
  color: white

.lb-badge.variant-warning
  background-color: var(--color-warning)
  color: var(--color-warning-contrast-text)

.lb-badge.variant-error
  background-color: var(--color-error)
  color: white

.lb-badge.variant-info
  background-color: var(--color-info)
  color: white

// Appearance animation
@keyframes lb-badge-appear
  from
    opacity: var(--opacity-0)
    transform: scale(0.8)
  to
    opacity: var(--opacity-100)
    transform: scale(1)
</style>