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
  updateActive: (value: string | number) => void
}

// Inject context from parent NavigationBar
const navigationBar = inject<NavigationBarContext>('navigationBar', {
  activeValue: { value: null },
  showLabels: { value: true },
  activeColor: { value: 'primary' },
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

const itemClasses = computed(() => [
  `color-${activeColor.value}`,
  {
    'active': isActive.value,
    'disabled': props.disabled,
    'no-label': !showLabels.value || !props.label
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
@use '@/styles/typography' as typography

.lb-navigation-bar-item
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: base.$space-xs
  padding: 0
  min-height: base.$unit-48 // 48px minimum touch target
  height: 100%
  background: none
  border: none
  border-radius: 0
  cursor: pointer
  transition: all base.$transition
  color: var(--lb-text-neutral-normal)  // Default and hover: text-neutral-normal
  outline: none
  position: relative
  width: 100%
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
  
  // Only apply hover styles on devices that support hover (non-touch)
  @media (hover: hover)
    &:hover:not(.disabled):not(.active)
      background-color: var(--lb-surface-neutral-normal-alpha)
  
  &:active:not(.disabled)
    transform: scale(0.98)
  
  &.disabled
    opacity: base.$opacity-40
    cursor: not-allowed
  
  &.no-label
    gap: 0
  
  .icon-container
    display: flex
    align-items: center
    justify-content: center
    width: base.$unit-24  // 24px icon size
    height: base.$unit-24  // 24px icon size
    transition: all base.$transition
    
    :deep(svg)
      width: base.$unit-24  // 24px icon size
      height: base.$unit-24  // 24px icon size
      transition: all base.$transition
  
  .label
    font-size: typography.$font-size-label-small
    font-weight: var(--lb-font-weight-label)
    line-height: typography.$line-height-compact
    text-align: center
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    max-width: 100%
    transition: color base.$transition

// Color variants - Active states with backgrounds (alpha-4)
.lb-navigation-bar-item
  &.active.color-neutral
    background-color: var(--lb-surface-neutral-hover-alpha)
    color: var(--lb-text-neutral-contrast-high)  // Active: text-neutral-contrast-high

  &.active.color-primary
    background-color: var(--lb-surface-primary-hover-alpha)
    color: var(--lb-text-primary-contrast-high)  // Active: text-primary-contrast-high
</style>