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
type Variant = 'default' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
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
  font-family: var(--lb-font-body)
  font-weight: var(--lb-font-weight-semibold)
  line-height: 1
  letter-spacing: var(--lb-letter-spacing-tight)
  border-radius: var(--lb-badge-radius)
  white-space: nowrap
  user-select: none
  vertical-align: top
  animation: lb-badge-appear 0.2s ease-out
  box-shadow: var(--lb-shadow-sm)
  
  // Base sizing for medium (default)
  min-width: base.$badge-height-medium  // 20px
  height: base.$badge-height-medium  // 20px
  padding: 0 base.$badge-padding-x-medium  // 0 8px
  font-size: base.$badge-font-size-medium  // 12px
  
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
    min-width: base.$badge-height-small  // 18px
    height: base.$badge-height-small  // 18px
    padding: 0 base.$badge-padding-x-small  // 0 4px
    font-size: base.$badge-font-size-small  // 10px
    
  &.size-large
    min-width: base.$badge-height-large  // 24px
    height: base.$badge-height-large  // 24px
    padding: 0 base.$badge-padding-x-large  // 0 8px
    font-size: base.$badge-font-size-large  // 14px
  
  // Dot variant overrides
  &.is-dot
    min-width: base.$unit-8  // 8px
    width: base.$unit-8  // 8px
    height: base.$unit-8  // 8px
    padding: 0
    border-radius: base.$radius-full
    
    &.size-small
      width: base.$unit-6  // 6px
      height: base.$unit-6  // 6px
      min-width: base.$unit-6
      
    &.size-large
      width: base.$unit-10  // 10px
      height: base.$unit-10  // 10px
      min-width: base.$unit-10

// Variant styles - notification bubble appearance
.lb-badge.variant-default
  background-color: var(--lb-fill-neutral-normal)
  color: var(--lb-text-on-variant-light)

.lb-badge.variant-neutral
  background-color: var(--lb-fill-neutral-normal)
  color: var(--lb-text-on-variant-light)

.lb-badge.variant-primary
  background-color: var(--lb-fill-primary-normal)
  color: var(--lb-text-on-variant-light)

.lb-badge.variant-secondary
  background-color: var(--lb-fill-secondary-normal)
  color: var(--lb-text-on-variant-light)

.lb-badge.variant-success
  background-color: var(--lb-fill-success-normal)
  color: var(--lb-text-on-variant-light)

.lb-badge.variant-warning
  background-color: var(--lb-fill-warning-normal)
  color: var(--lb-text-neutral-contrast-high)

.lb-badge.variant-error
  background-color: var(--lb-fill-error-normal)
  color: var(--lb-text-on-variant-light)

.lb-badge.variant-info
  background-color: var(--lb-fill-info-normal)
  color: var(--lb-text-on-variant-light)

// Appearance animation
@keyframes lb-badge-appear
  from
    opacity: var(--lb-opacity-0)
    transform: scale(0.8)
  to
    opacity: var(--lb-opacity-100)
    transform: scale(1)
</style>