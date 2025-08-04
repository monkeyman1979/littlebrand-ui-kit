<template lang="pug">
button.lb-navigation-bar-item(
  :class="itemClasses"
  :disabled="disabled"
  @click="handleClick"
  :aria-pressed="isActive"
  :aria-label="label"
)
  span.icon-container
    slot(v-if="!isActive" name="icon")
    slot(v-else-if="slots.activeIcon" name="activeIcon")
    slot(v-else name="icon")
  
  span.label(v-if="showLabels && label") {{ label }}
</template>

<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'

// Props
const props = withDefaults(defineProps<{
  value: string | number
  label?: string
  disabled?: boolean
}>(), {
  disabled: false
})

// Slots
const slots = useSlots()

// Type for injected navigation bar context
interface NavigationBarContext {
  activeValue: { value: string | number | null }
  showLabels: { value: boolean }
  activeColor: { value: string }
  noActiveBackground: { value: boolean }
  updateActive: (value: string | number) => void
}

// Inject context from parent NavigationBar
const navigationBar = inject<NavigationBarContext>('navigationBar', {
  activeValue: { value: null },
  showLabels: { value: true },
  activeColor: { value: 'primary' },
  noActiveBackground: { value: false },
  updateActive: () => {}
})

// Computed
const isActive = computed(() => 
  navigationBar.activeValue.value === props.value
)

const showLabels = computed(() => 
  navigationBar.showLabels.value
)

const activeColor = computed(() => 
  navigationBar.activeColor.value
)

const noActiveBackground = computed(() =>
  navigationBar.noActiveBackground.value
)

const itemClasses = computed(() => [
  `color-${activeColor.value}`,
  {
    'active': isActive.value,
    'disabled': props.disabled,
    'no-label': !showLabels.value || !props.label,
    'no-active-background': noActiveBackground.value
  }
])

// Methods
const handleClick = () => {
  if (!props.disabled) {
    navigationBar.updateActive(props.value)
  }
}

// Component options
defineOptions({
  name: 'LbNavigationBarItem',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-navigation-bar-item
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: var(--space-xs)
  padding: 0
  min-height: var(--size-2xl) // 48px minimum touch target
  height: 100%
  background: none
  border: none
  border-radius: 0
  cursor: pointer
  transition: all var(--transition-fast)
  color: var(--color-text-tertiary)
  outline: none
  position: relative
  width: 100%
  
  &:focus-visible
    outline: var(--focus-ring-width) solid var(--color-focus-ring)
    outline-offset: var(--focus-ring-offset)
  
  &:hover:not(.disabled):not(.no-active-background)
    background-color: var(--color-surface-overlay)
  
  &.no-active-background:hover:not(.disabled)
    background-color: transparent
  
  &:active:not(.disabled)
    transform: scale(0.98)
  
  &.disabled
    opacity: var(--opacity-40)
    cursor: not-allowed
  
  &.no-label
    gap: 0
  
  .icon-container
    display: flex
    align-items: center
    justify-content: center
    width: var(--icon-size-lg)
    height: var(--icon-size-lg)
    transition: all var(--transition-fast)
    
    :deep(svg)
      width: var(--icon-size-lg)
      height: var(--icon-size-lg)
      transition: all var(--transition-fast)
  
  .label
    font-size: var(--font-size-label-small)
    font-weight: var(--font-weight-medium)
    line-height: var(--line-height-compact)
    text-align: center
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    max-width: 100%
    transition: color var(--transition-fast)

// Color variants - Active states
.lb-navigation-bar-item
  &.active.color-primary
    color: var(--color-primary)
  
  &.active.color-secondary
    color: var(--color-secondary)
  
  &.active.color-success
    color: var(--color-success)
  
  &.active.color-warning
    color: var(--color-warning)
  
  &.active.color-error
    color: var(--color-error)
  
  &.active.color-info
    color: var(--color-info)

// Hover states for each color
.lb-navigation-bar-item
  &.color-primary:hover:not(.disabled):not(.active)
    color: var(--color-primary-hover)
    background-color: var(--color-primary-a3)
  
  &.color-secondary:hover:not(.disabled):not(.active)
    color: var(--color-secondary-hover)
    background-color: var(--color-secondary-a3)
  
  &.color-success:hover:not(.disabled):not(.active)
    color: var(--color-success-hover)
    background-color: var(--color-success-a3)
  
  &.color-warning:hover:not(.disabled):not(.active)
    color: var(--color-warning-hover)
    background-color: var(--color-warning-a3)
  
  &.color-error:hover:not(.disabled):not(.active)
    color: var(--color-error-hover)
    background-color: var(--color-error-a3)
  
  &.color-info:hover:not(.disabled):not(.active)
    color: var(--color-info-hover)
    background-color: var(--color-info-a3)

// Active state background colors (only when not using no-active-background)
.lb-navigation-bar-item:not(.no-active-background)
  &.active.color-primary
    background-color: var(--color-primary-a4)
    
    &:hover:not(.disabled)
      background-color: var(--color-primary-a5)
  
  &.active.color-secondary
    background-color: var(--color-secondary-a4)
    
    &:hover:not(.disabled)
      background-color: var(--color-secondary-a5)
  
  &.active.color-success
    background-color: var(--color-success-a4)
    
    &:hover:not(.disabled)
      background-color: var(--color-success-a5)
  
  &.active.color-warning
    background-color: var(--color-warning-a4)
    
    &:hover:not(.disabled)
      background-color: var(--color-warning-a5)
  
  &.active.color-error
    background-color: var(--color-error-a4)
    
    &:hover:not(.disabled)
      background-color: var(--color-error-a5)
  
  &.active.color-info
    background-color: var(--color-info-a4)
    
    &:hover:not(.disabled)
      background-color: var(--color-info-a5)
</style>