<template lang="pug">
button.lb-segment-button-item(
  ref="itemRef"
  :class="itemClasses"
  :disabled="isDisabled"
  :aria-pressed="(segmentButton.allowEmpty.value || segmentButton.multiSelect.value) ? isActive : undefined"
  :aria-label="ariaLabel"
  @click="handleClick"
  type="button"
  :role="(segmentButton.allowEmpty.value || segmentButton.multiSelect.value) ? 'button' : 'radio'"
  :aria-checked="(segmentButton.allowEmpty.value || segmentButton.multiSelect.value) ? undefined : isActive"
)
  span.icon-container(v-if="$slots.icon")
    slot(name="icon")
  
  span.label(v-if="$slots.default")
    slot
</template>

<script setup lang="ts">
import { computed, inject, ref, toRef, onMounted, onUnmounted, useSlots } from 'vue'
import type { VNode } from 'vue'
import type { SegmentButtonContext } from './types'

// Props
const props = withDefaults(defineProps<{
  value: string | number
  disabled?: boolean
  ariaLabel?: string
}>(), {
  disabled: false
})

// Slots
const slots = useSlots()

// Helper to check if slot has actual content
const hasSlotContent = (slotContent: VNode[] | undefined): boolean => {
  if (!slotContent) return false
  return slotContent.some(vnode => {
    // Check if it's a text node with actual content
    if (typeof vnode.children === 'string') {
      return vnode.children.trim().length > 0
    }
    // Check if it has child nodes
    return !!vnode.children
  })
}

// Refs
const itemRef = ref<HTMLButtonElement>()

// Inject context from parent SegmentButton
const injectedContext = inject<SegmentButtonContext>('segmentButton')

// This should never happen in practice since the component is only used inside SegmentButton
if (!injectedContext) {
  throw new Error('LbSegmentButtonItem must be used inside LbSegmentButton')
}

// Now TypeScript knows segmentButton is not null
const segmentButton = injectedContext

// Computed
const isActive = computed(() => {
  const activeValue = segmentButton.activeValue.value
  if (activeValue === undefined) {
    return false
  }
  if (Array.isArray(activeValue)) {
    return (activeValue as (string | number)[]).includes(props.value)
  }
  return activeValue === props.value
})

const isDisabled = computed(() => 
  props.disabled || segmentButton.disabled.value
)

const itemClasses = computed(() => {
  const classes: string[] = [
    `size-${segmentButton.size.value}`,
    `color-${segmentButton.color.value}`
  ]
  
  if (isActive.value) classes.push('active')
  if (isDisabled.value) classes.push('disabled')
  
  // Determine layout type based on slots
  const hasIcon = !!slots.icon
  const hasLabel = hasSlotContent(slots.default?.())
  
  if (hasIcon && !hasLabel) {
    classes.push('icon-only')
  } else if (!hasIcon && hasLabel) {
    classes.push('text-only')
  } else if (hasIcon && hasLabel) {
    classes.push('icon-and-text')
  }
  
  return classes
})

// Methods
const handleClick = () => {
  if (!isDisabled.value) {
    segmentButton.updateActive(props.value)
  }
}

// Register/unregister with parent
onMounted(() => {
  if (itemRef.value) {
    segmentButton.registerSegmentItem(itemRef.value)
  }
})

onUnmounted(() => {
  if (itemRef.value) {
    segmentButton.unregisterSegmentItem(itemRef.value)
  }
})

// Component options
defineOptions({
  name: 'LbSegmentButtonItem',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-segment-button-item
  display: flex
  align-items: center
  justify-content: center
  gap: base.$space-sm // 8px
  height: 100%
  width: 100%
  padding: 0 base.$space-lg // 16px minimum padding
  background: transparent
  border: none
  border-radius: 0
  user-select: none
  
  // Add left border divider for non-first items
  &:not(:first-child)
    border-left: base.$border-sm solid var(--lb-border-neutral-active)
  cursor: pointer
  transition: all base.$transition
  color: var(--lb-text-neutral-contrast-low)
  font-size: typography.$font-size-label-base
  font-weight: typography.$font-weight-medium
  line-height: typography.$line-height-compact
  outline: none
  position: relative
  white-space: nowrap
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
    z-index: 2

  // Hover states for each color variant
  @media (hover: hover)
    &:hover:not(.disabled):not(.active)
      &.color-primary
        background-color: var(--lb-surface-primary-subtle)
      &.color-secondary
        background-color: var(--lb-surface-secondary-subtle)
      &.color-neutral
        background-color: var(--lb-surface-neutral-subtle)


  &.disabled
    opacity: base.$opacity-40
    cursor: not-allowed

  // Active state - Primary color variant (default)
  &.color-primary.active
    background: var(--lb-surface-primary-hover)
    color: var(--lb-text-primary-contrast-low)
    z-index: 1

    @media (hover: hover)
      &:hover:not(.disabled)
        background: var(--lb-surface-primary-active)
        
  // Active state - Secondary color variant
  &.color-secondary.active
    background: var(--lb-surface-secondary-hover)
    color: var(--lb-text-secondary-contrast-low)
    z-index: 1

    @media (hover: hover)
      &:hover:not(.disabled)
        background: var(--lb-surface-secondary-active)
        
  // Active state - Neutral color variant
  &.color-neutral.active
    background: var(--lb-surface-neutral-hover)
    color: var(--lb-text-neutral-contrast-high)
    z-index: 1

    @media (hover: hover)
      &:hover:not(.disabled)
        background: var(--lb-surface-neutral-active)

  // Size variant (only medium now)
  &.size-medium
    padding: 0 base.$space-lg // 16px minimum
    font-size: typography.$font-size-label-base
    
    .icon-container
      width: base.$size-2xl // 18px
      height: base.$size-2xl // 18px
      
      :deep(svg)
        width: base.$size-2xl // 18px
        height: base.$size-2xl // 18px


  // Icon and text layout
  .icon-container
    display: flex
    align-items: center
    justify-content: center
    transition: all base.$transition

  .label
    transition: color base.$transition
    text-overflow: ellipsis
    overflow: hidden

  // Icon-only styling
  &.icon-only
    gap: 0
    padding: 0
    justify-content: center
    align-items: center
    
    // Force hide label even if slot exists
    .label
      display: none
    
    &.size-medium
      min-width: 3.5rem // 56px for better icon spacing
      width: auto // Let it size based on content
  
  // Text-only styling (default behavior)
  &.text-only
    // Uses default padding and gap
  
  // Icon and text styling
  &.icon-and-text
    // Uses default padding and gap
    


</style>