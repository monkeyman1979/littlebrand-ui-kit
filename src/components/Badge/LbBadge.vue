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

// Props
const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  dot?: boolean
  max?: number
}>(), {
  variant: 'default',
  size: 'medium',
  dot: false,
  max: 99
})

// Slots
const slots = defineSlots<{
  default(): any
}>()

// Computed
const badgeClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
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
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  font-family: var(--font-body)
  font-weight: var(--font-weight-medium)
  line-height: var(--line-height-compact)
  letter-spacing: var(--letter-spacing-tight)
  border-radius: var(--radius-full)
  white-space: nowrap
  user-select: none
  vertical-align: top
  animation: lb-badge-appear 0.2s ease-out
  
  // Base sizing for medium (default)
  min-width: var(--size-3xl)
  height: var(--size-3xl)
  padding: 0 var(--space-xs)
  font-size: var(--font-size-label-small)
  
  // Size variants
  &.size-small
    min-width: var(--size-2xl)
    height: var(--size-2xl)
    padding: 0 var(--space-2xs)
    font-size: 0.625rem
    
  &.size-large
    min-width: var(--size-4xl)
    height: var(--size-4xl)
    padding: 0 var(--space-sm)
    font-size: var(--font-size-label-base)
  
  // Dot variant overrides
  &.is-dot
    min-width: var(--space-sm)
    width: var(--space-sm)
    height: var(--space-sm)
    padding: 0
    border-radius: var(--radius-full)
    
    &.size-small
      width: var(--space-xs)
      height: var(--space-xs)
      min-width: var(--space-xs)
      
    &.size-large
      width: var(--space-md)
      height: var(--space-md)
      min-width: var(--space-md)

// Variant styles
.lb-badge.variant-default
  background-color: var(--color-border-strong)
  color: var(--color-surface)

.lb-badge.variant-primary
  background-color: var(--color-primary)
  color: var(--color-primary-text)

.lb-badge.variant-secondary
  background-color: var(--color-secondary)
  color: var(--color-secondary-text)

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