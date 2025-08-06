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
  span.icon-container(v-if="hasIcon")
    slot(name="icon")
  
  span.label(v-if="hasLabel")
    slot
</template>

<script setup lang="ts">
import { computed, inject, ref, toRef, onMounted, onUnmounted, useSlots } from 'vue'
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
const hasIcon = computed(() => !!slots.icon)
const hasLabel = computed(() => !!slots.default)

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
  if (hasIcon.value) classes.push('has-icon')
  if (hasIcon.value && !hasLabel.value) classes.push('icon-only')
  if (!hasIcon.value && hasLabel.value) classes.push('text-only')
  
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
    border-left: base.$border-sm solid var(--color-border-strong)
  cursor: pointer
  transition: all base.$transition
  color: var(--color-text-secondary)
  font-size: var(--font-size-base)
  font-weight: var(--font-weight-medium)
  line-height: var(--line-height-compact)
  outline: none
  position: relative
  white-space: nowrap
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--color-focus-ring)
    outline-offset: base.$focus-ring-offset
    z-index: 2

  // Hover states for each color variant
  @media (hover: hover)
    &:hover:not(.disabled):not(.active)
      &.color-primary
        background-color: var(--color-primary-3)
      &.color-secondary
        background-color: var(--color-secondary-3)
      &.color-neutral
        background-color: var(--color-neutral-3)


  &.disabled
    opacity: base.$opacity-40
    cursor: not-allowed

  // Active state - Primary color variant (default)
  &.color-primary.active
    background: var(--color-primary-4)
    color: var(--color-primary-11)
    z-index: 1

    @media (hover: hover)
      &:hover:not(.disabled)
        background: var(--color-primary-5)
        
  // Active state - Secondary color variant
  &.color-secondary.active
    background: var(--color-secondary-4)
    color: var(--color-secondary-11)
    z-index: 1

    @media (hover: hover)
      &:hover:not(.disabled)
        background: var(--color-secondary-5)
        
  // Active state - Neutral color variant
  &.color-neutral.active
    background: var(--color-neutral-4)
    color: var(--color-neutral-11)
    z-index: 1

    @media (hover: hover)
      &:hover:not(.disabled)
        background: var(--color-neutral-5)

  // Size variants
  &.size-small
    padding: 0 base.$space-lg // 16px minimum
    font-size: var(--font-size-sm)
    
    .icon-container
      width: base.$size-3xl
      height: base.$size-3xl
      
      :deep(svg)
        width: base.$size-3xl
        height: base.$size-3xl

  &.size-medium
    padding: 0 base.$space-lg // 16px minimum
    font-size: var(--font-size-base)
    
    .icon-container
      width: base.$size-4xl
      height: base.$size-4xl
      
      :deep(svg)
        width: base.$size-4xl
        height: base.$size-4xl


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
    
    &.size-small
      min-width: base.$size-5xl // 32px
      padding: 0
    
    &.size-medium
      min-width: base.$size-6xl // 40px
      padding: 0
    


</style>