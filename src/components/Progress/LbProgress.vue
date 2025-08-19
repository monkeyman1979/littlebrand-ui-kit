<template lang="pug">
div.lb-progress(
  :class="progressClasses"
  role="progressbar"
  :aria-valuenow="indeterminate ? null : value"
  :aria-valuemin="indeterminate ? null : 0"
  :aria-valuemax="indeterminate ? null : 100"
  :aria-label="indeterminate ? 'Loading...' : `${value}% complete`"
)
  //- Linear progress bar
  div.progress-container(v-if="type === 'linear'")
    div.progress-fill(:style="progressFillStyle")
  
  //- Circular progress indicator
  svg.progress-circle(
    v-else-if="type === 'circular'"
    :viewBox="`0 0 ${circleSize} ${circleSize}`"
    xmlns="http://www.w3.org/2000/svg"
  )
    //- Background track circle
    circle.progress-track-circle(
      :cx="circleSize / 2"
      :cy="circleSize / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      fill="transparent"
    )
    //- Progress circle
    circle.progress-fill-circle(
      :cx="circleSize / 2"
      :cy="circleSize / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      :stroke-dasharray="strokeDasharray"
      :stroke-dashoffset="strokeDashoffset"
      fill="transparent"
    )
    
    //- Optional centered percentage text
    text.progress-text(
      v-if="showValue && !indeterminate"
      :x="circleSize / 2"
      :y="circleSize / 2"
      text-anchor="middle"
      dominant-baseline="central"
    ) {{ Math.round(value) }}%
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
type ProgressType = 'linear' | 'circular'
type ProgressSize = 'thin' | 'normal' | 'thick'
type CircularSize = 'xs' | 'sm' | 'md' | 'lg'

// Props
const props = withDefaults(defineProps<{
  value?: number
  type?: ProgressType
  size?: ProgressSize
  circularSize?: CircularSize
  showValue?: boolean
  indeterminate?: boolean
}>(), {
  value: 0,
  type: 'linear',
  size: 'normal',
  circularSize: 'sm',
  showValue: false,
  indeterminate: false
})

// Computed
const progressClasses = computed(() => [
  `type-${props.type}`,
  `size-${props.size}`,
  props.type === 'circular' ? `circular-size-${props.circularSize}` : null,
  {
    'indeterminate': props.indeterminate,
    'show-value': props.showValue
  }
].filter(Boolean))

// Circular progress calculations
const circleSize = computed(() => {
  switch (props.circularSize) {
    case 'xs': return 24
    case 'sm': return 32
    case 'md': return 40
    case 'lg': return 48
    default: return 32
  }
})

const strokeWidth = computed(() => {
  switch (props.size) {
    case 'thin': return 2
    case 'normal': return 4
    case 'thick': return 8
    default: return 4
  }
})

const radius = computed(() => {
  return (circleSize.value - strokeWidth.value) / 2
})

const circumference = computed(() => {
  return 2 * Math.PI * radius.value
})

const strokeDashoffset = computed(() => {
  if (props.indeterminate) {
    return 0
  }
  const progress = Math.min(Math.max(props.value, 0), 100)
  return circumference.value - (progress / 100) * circumference.value
})

// For indeterminate mode, create a partial arc
const strokeDasharray = computed(() => {
  if (props.indeterminate) {
    // Create a 25% arc with 75% gap
    const arcLength = circumference.value * 0.25
    const gapLength = circumference.value * 0.75
    return `${arcLength} ${gapLength}`
  }
  return circumference.value
})

// Linear progress styles
const progressFillStyle = computed(() => {
  if (props.indeterminate) {
    return {}
  }
  return {
    width: `${Math.min(Math.max(props.value, 0), 100)}%`
  }
})

// Component options
defineOptions({
  name: 'LbProgress'
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-progress
  display: inline-block
  
  // Linear progress styles
  &.type-linear
    width: 100%
    
    .progress-container
      position: relative
      width: 100%
      background-color: var(--lb-surface-neutral-normal)
      border-radius: base.$radius-full
      overflow: hidden
        
      .progress-fill
        position: absolute
        top: 0
        height: 100%
        background-color: var(--lb-fill-primary-normal)
        border-radius: base.$radius-full
        transition: width base.$transition
    
    // Indeterminate linear animation
    &.indeterminate
      .progress-fill
        width: auto
        animation: lb-linear-indeterminate 2s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite
    
    // Size variants for linear (heights match stroke widths)
    &.size-thin
      .progress-container
        height: 0.125rem // 2px
      
    &.size-normal
      .progress-container
        height: 0.25rem // 4px
      
    &.size-thick
      .progress-container
        height: 0.5rem // 8px
      
  // Circular progress styles
  &.type-circular
    display: inline-flex
    align-items: center
    justify-content: center
    
    .progress-circle
      transform: rotate(-90deg)
      
      .progress-track-circle
        stroke: var(--lb-surface-neutral-normal)
        stroke-linecap: round
        
      .progress-fill-circle
        stroke: var(--lb-fill-primary-normal)
        stroke-linecap: round
        transition: stroke-dashoffset base.$transition
        
      .progress-text
        transform: rotate(90deg)
        font-family: var(--lb-font-body)
        font-weight: typography.$font-weight-medium
        fill: var(--lb-text-neutral-contrast-high)
        font-size: typography.$font-size-label-small
    
    // Circular size variants (dimensions)
    &.circular-size-xs
      width: 1.5rem // 24px
      height: 1.5rem
      
      .progress-text
        font-size: typography.$font-size-label-small
        
    &.circular-size-sm
      width: 2rem // 32px
      height: 2rem
      
      .progress-text
        font-size: typography.$font-size-label-small
        
    &.circular-size-md
      width: 2.5rem // 40px
      height: 2.5rem
      
      .progress-text
        font-size: typography.$font-size-label-base
        
    &.circular-size-lg
      width: 3rem // 48px
      height: 3rem
      
      .progress-text
        font-size: typography.$font-size-label-base
    
    // Indeterminate animation for circular
    &.indeterminate
      .progress-circle
        animation: lb-circular-indeterminate 1.5s linear infinite

// Linear indeterminate animation
@keyframes lb-linear-indeterminate
  0%
    left: -35%
    right: 100%
  60%
    left: 100%
    right: -90%
  100%
    left: 100%
    right: -90%

// Circular indeterminate animation
@keyframes lb-circular-indeterminate
  0%
    transform: rotate(-90deg)
  100%
    transform: rotate(270deg)
</style>