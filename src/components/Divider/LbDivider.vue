<template lang="pug">
hr.lb-divider(
  :class="dividerClasses"
  role="separator"
  :aria-orientation="orientation"
)
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
type Orientation = 'horizontal' | 'vertical'
type Size = 'thin' | 'medium' | 'thick'

// Props
const props = withDefaults(defineProps<{
  orientation?: Orientation
  size?: Size
  inset?: boolean
  stretch?: boolean  // For vertical dividers to stretch to parent height
}>(), {
  orientation: 'horizontal',
  size: 'thin',
  inset: false,
  stretch: false
})

// Computed
const dividerClasses = computed(() => [
  `orientation-${props.orientation}`,
  `size-${props.size}`,
  { 'inset': props.inset },
  { 'stretch': props.stretch && props.orientation === 'vertical' }
])

// Component options
defineOptions({
  name: 'LbDivider'
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-divider
  border: none
  background-color: var(--lb-border-neutral-line)
  margin: 0
  // Default size
  --divider-size: #{base.$border-sm}
  
  // Size variants using existing border variables
  &.size-thin
    --divider-size: #{base.$border-sm}
    
  &.size-medium
    --divider-size: #{base.$border-md}
    
  &.size-thick
    --divider-size: #{base.$border-md * 2}
  
  // Horizontal divider (default)
  &.orientation-horizontal
    width: 100%
    height: var(--divider-size)
    
    &.inset
      width: calc(100% - #{base.$space-lg * 2})
      margin-inline: base.$space-lg
    
  // Vertical divider
  &.orientation-vertical
    width: var(--divider-size)
    height: base.$space-2xl // Default height of 24px
    min-height: base.$space-lg
    display: inline-block
    vertical-align: middle
    
    // When stretch is true, divider stretches to fill parent height
    &.stretch
      height: auto
      align-self: stretch // Stretch to parent height if in flex container
      
    &.inset
      align-self: center
      height: calc(100% - #{base.$space-lg * 2})
      max-height: calc(#{base.$space-2xl} - #{base.$space-sm})
      
      &.stretch
        height: calc(100% - #{base.$space-lg * 2})
        max-height: none
</style>