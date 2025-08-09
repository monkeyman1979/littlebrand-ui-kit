<template lang="pug">
.lb-popover-arrow(
  v-if="context?.showArrow && context?.open"
  ref="arrowElement"
  :class="arrowClasses"
  :style="arrowStyles"
)
  svg.arrow-svg(
    :width="props.width"
    :height="props.height"
    :viewBox="`0 0 ${props.width} ${props.height}`"
  )
    path.arrow-path(
      :d="arrowPath"
      fill="currentColor"
    )
</template>

<script setup lang="ts">
import { computed, ref, inject, onMounted, onBeforeUnmount } from 'vue'
import type { PopoverContext } from './LbPopover.vue'

// Props
export interface LbPopoverArrowProps {
  width?: number
  height?: number
}

const props = withDefaults(defineProps<LbPopoverArrowProps>(), {
  width: 8, // Matches var(--lb-space-sm)
  height: 8 // Matches var(--lb-space-sm)
})

// Inject popover context
const context = inject<PopoverContext>('popoverContext')

if (!context) {
  throw new Error('LbPopoverArrow must be used within LbPopover')
}

// Refs
const arrowElement = ref<HTMLElement>()

// Computed
const arrowClasses = computed(() => ({
  [`placement-${context.placement}`]: true,
  'is-positioned': context.isPositioned
}))

const arrowStyles = computed(() => ({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 'var(--lb-z-dropdown)'
}))

const arrowPath = computed(() => {
  // Create SVG path for arrow pointing toward trigger based on placement
  const side = context.placement.split('-')[0]
  const halfWidth = props.width / 2
  const halfHeight = props.height / 2
  
  switch (side) {
    case 'top':
      // Arrow pointing down
      return `M0,0 L${halfWidth},${halfHeight} L${props.width},0 Z`
    case 'bottom':
      // Arrow pointing up
      return `M0,${props.height} L${halfWidth},${halfHeight} L${props.width},${props.height} Z`
    case 'left':
      // Arrow pointing right
      return `M${props.width},0 L${halfWidth},${halfHeight} L${props.width},${props.height} Z`
    case 'right':
      // Arrow pointing left
      return `M0,0 L${halfWidth},${halfHeight} L0,${props.height} Z`
    default:
      return `M0,0 L${halfWidth},${halfHeight} L${props.width},0 Z`
  }
})

// Setup arrow reference in context
onMounted(() => {
  if (arrowElement.value && context.arrowRef) {
    context.arrowRef.value = arrowElement.value
  }
})

// Cleanup arrow reference
onBeforeUnmount(() => {
  if (context.arrowRef && context.arrowRef.value === arrowElement.value) {
    context.arrowRef.value = null
  }
})

// Component options
defineOptions({
  name: 'LbPopoverArrow',
  inheritAttrs: false
})

// Expose
defineExpose({
  arrowElement
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-popover-arrow
  position: absolute
  pointer-events: none
  z-index: var(--lb-z-dropdown)
  width: var(--lb-space-sm)
  height: var(--lb-space-sm)
  
  // Arrow positioning based on placement
  &.placement-top,
  &.placement-top-start,
  &.placement-top-end
    bottom: calc(var(--lb-space-xs) * -1)
    
  &.placement-bottom,
  &.placement-bottom-start,
  &.placement-bottom-end
    top: calc(var(--lb-space-xs) * -1)
    
  &.placement-left,
  &.placement-left-start,
  &.placement-left-end
    right: calc(var(--lb-space-xs) * -1)
    
  &.placement-right,
  &.placement-right-start,
  &.placement-right-end
    left: calc(var(--lb-space-xs) * -1)

.arrow-svg
  display: block
  width: 100%
  height: 100%

.arrow-path
  fill: var(--lb-background-surface)
  stroke: var(--lb-border-neutral-line)
  stroke-width: var(--lb-border-sm)
  
  // Filter to handle the border properly
  filter: drop-shadow(0 0 0 var(--lb-border-neutral-line))

// Theme-aware arrow colors
:global([data-theme="dark"]) .arrow-path
  fill: var(--lb-background-surface)
  stroke: var(--lb-border-neutral-line)
</style>