<template lang="pug">
component.lb-button(
  :is="computedTag"
  :class="buttonClasses"
  v-bind="computedProps"
  :disabled="disabled || loading"
  @click="handleClick"
)
  //- Leading icon
  span.icon-leading(v-if="$slots['icon-leading'] || (loading && iconPosition === 'leading')")
    transition(name="lb-fade" mode="out-in")
      .spinner(v-if="loading && iconPosition === 'leading'" key="spinner")
        svg(viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
          circle(cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round")
      slot(v-else name="icon-leading")
  
  span.content(v-if="!iconOnly")
    slot
  
  span.icon-trailing(v-if="!iconOnly && ($slots['icon-trailing'] || (loading && iconPosition === 'trailing'))")
    transition(name="lb-fade" mode="out-in")
      .spinner(v-if="loading && iconPosition === 'trailing'" key="spinner")
        svg(viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
          circle(cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round")
      slot(v-else name="icon-trailing")
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

// Types
type Variant = 'filled' | 'tonal' | 'outline' | 'ghost' | 'link'
type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
type Size = 'small' | 'medium' | 'large'
type ButtonType = 'button' | 'submit' | 'reset'

// Props
const props = withDefaults(defineProps<{
  variant?: Variant
  color?: Color
  size?: Size
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconPosition?: 'leading' | 'trailing'
  iconOnly?: boolean
  href?: string
  to?: string | object
  target?: string
  rel?: string
}>(), {
  variant: 'filled',
  color: 'primary',
  size: 'medium',
  type: 'button',
  iconPosition: 'leading'
})

// Emits
const emit = defineEmits<{
  click: [event: Event]
}>()

// Attrs
const attrs = useAttrs()

// Computed
const buttonClasses = computed(() => [
  `${props.variant}-${props.color}`,
  props.size,
  {
    'full-width': props.fullWidth,
    'loading': props.loading,
    'disabled': props.disabled,
    'icon-only': props.iconOnly
  }
])

const computedTag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const computedProps = computed(() => {
  const baseProps = { ...attrs }
  
  if (computedTag.value === 'router-link' && props.to) {
    baseProps.to = props.to
  } else if (computedTag.value === 'a') {
    if (props.href) baseProps.href = props.href
    if (props.target) baseProps.target = props.target
    if (props.rel) baseProps.rel = props.rel
    // Disabled links
    if (props.disabled || props.loading) {
      baseProps.href = undefined
      baseProps.role = 'button'
      baseProps['aria-disabled'] = 'true'
    }
  } else {
    baseProps.type = props.type
  }
  
  return baseProps
})

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  } else if (computedTag.value === 'a') {
    event.preventDefault()
  }
}

// Component options
defineOptions({
  name: 'LbButton',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/colors' as colors
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-button
  position: relative
  display: inline-grid
  grid-auto-flow: column
  align-items: center
  gap: base.$space-1
  padding: 0 base.$space-9
  height: base.$size-2xl
  border: none
  border-radius: base.$radius-md
  font-family: typography.$font-body
  font-size: typography.$label-size-base
  font-weight: typography.$weight-medium
  line-height: typography.$line-normal
  letter-spacing: typography.$letter-spacing-tight
  cursor: pointer
  transition: all 0.3s ease-in-out
  text-decoration: none
  white-space: nowrap
  user-select: none
  outline: none
  
  // Reset anchor styles when used as link
  &:link,
  &:visited
    text-decoration: none
    color: inherit
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--color-focus-ring)
    outline-offset: base.$focus-ring-offset
  
  // Size modifiers
  &.small
    height: base.$size-xl
    padding: 0 base.$space-5
    font-size: typography.$label-size-small
    letter-spacing: typography.$letter-spacing-normal
    border-radius: base.$radius-sm
    svg
      width: base.$size-sm
      height: base.$size-sm
    
  &.medium
    height: base.$size-2xl
    padding: 0 base.$space-7
    font-size: typography.$label-size-base
    letter-spacing: typography.$letter-spacing-tight
    border-radius: base.$radius-md
    svg
      width: base.$size-md
      height: base.$size-md
    
  &.large
    height: base.$size-3xl
    padding: 0 base.$space-9
    font-size: typography.$label-size-large
    letter-spacing: typography.$letter-spacing-wide
    border-radius: base.$radius-md
    svg
      width: base.$size-lg
      height: base.$size-lg
    
  &.full-width
    width: 100%
    justify-content: center
    
  // Icon only button styles
  &.icon-only
    padding: 0
    gap: 0
    justify-content: center
    
    &.small
      width: base.$size-xl
      height: base.$size-xl
    
    &.medium
      width: base.$size-2xl
      height: base.$size-2xl
    
    &.large
      width: base.$size-3xl
      height: base.$size-3xl
    
  // Link variant overrides
  &[class*="link-"]
    &.small,
    &.medium,
    &.large
      height: auto
      padding: 0
      border-radius: 0
      svg
        width: 1em
        height: 1em
    
    &.icon-only
      width: auto
      height: auto
    
  &.loading,
  &.disabled
    cursor: not-allowed
    
    &[aria-disabled="true"]
      pointer-events: none
    
  &.loading
    &.disabled
      .spinner circle
        stroke: var(--color-text)
        opacity: 0.4
    
  .content
    display: flex
    align-items: center
    padding: 0 base.$space-3
    
  .icon-leading,
  .icon-trailing
    display: inline-flex
    align-items: center
    justify-content: center
    flex-shrink: 0
    
  .spinner
    animation: lb-spin 1s linear infinite
    
    svg
      display: block
      
    circle
      stroke-dasharray: 62.83
      stroke-dashoffset: 47.12
      animation: lb-spinner-dash 1.5s ease-in-out infinite
      opacity: 0.8

// Variant styles
@mixin button-variant($variant, $color, $color-name)
  // Common active state for all non-link variants
  @if $variant != 'link'
  
  // Base colors for each variant
  @if $variant == 'filled'
    background-color: var(--color-#{$color})
    color: if($color == 'warning', var(--color-warning-contrast-text), white)
    &:hover:not(.disabled):not(.loading)
      background-color: var(--color-#{$color}-hover)
    &.disabled
      background-color: var(--color-border-subtle)
      color: var(--color-text-disabled)
      
  @else if $variant == 'tonal'
    background-color: var(--color-#{$color}-a3)
    color: var(--color-#{$color})
    &:hover:not(.disabled):not(.loading)
      background-color: var(--color-#{$color}-a4)
      color: if($color == 'warning', var(--color-warning-text), var(--color-#{$color}))
    &:active:not(.disabled):not(.loading)
      background-color: var(--color-#{$color}-a5)
    &.disabled
      background-color: var(--color-surface)
      color: var(--color-text-disabled)
      
  @else if $variant == 'outline'
    background-color: transparent
    color: var(--color-#{$color})
    box-shadow: inset 0 0 0 2px var(--color-#{$color})
    &:hover:not(.disabled):not(.loading)
      background-color: var(--color-#{$color})
      color: if($color == 'warning', var(--color-warning-contrast-text), white)
    &.disabled
      color: var(--color-text-disabled)
      box-shadow: inset 0 0 0 2px var(--color-border)
      
  @else if $variant == 'ghost'
    background-color: transparent
    color: var(--color-#{$color})
    &:hover:not(.disabled):not(.loading)
      background-color: var(--color-#{$color}-a3)
      color: if($color == 'warning', var(--color-warning-text), var(--color-#{$color}))
    &:active:not(.disabled):not(.loading)
      background-color: var(--color-#{$color}-a4)
      transform: translateY(1px)
    &.disabled
      color: var(--color-text-disabled)
      
  @else if $variant == 'link'
    background-color: transparent
    color: var(--color-#{$color})
    padding: 0
    height: auto
    border: none
    border-radius: 0
    text-decoration: none
    display: inline-flex
    align-items: baseline
    gap: base.$space-1
    &:hover:not(.disabled):not(.loading)
      text-decoration: underline
      color: if($color == 'warning', var(--color-warning-text), var(--color-#{$color}))
    &:active:not(.disabled):not(.loading)
      opacity: 0.8
    &.disabled
      color: var(--color-text-disabled)
      cursor: not-allowed

// Generate all variant × color combinations
$variants: ('filled', 'tonal', 'outline', 'ghost', 'link')
$color-map: ('primary': 'orange', 'secondary': 'teal', 'success': 'green', 'warning': 'yellow', 'error': 'red', 'info': 'blue')

@each $variant in $variants
  @each $color, $color-name in $color-map
    .lb-button.#{$variant}-#{$color}
      @include button-variant($variant, $color, $color-name)

// Light mode specific warning text colors
:root:not([data-theme="dark"])
  .lb-button.tonal-warning,
  .lb-button.outline-warning,
  .lb-button.ghost-warning,
  .lb-button.link-warning
    color: var(--color-warning-text)

// Animations
@keyframes lb-spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
    
@keyframes lb-spinner-dash
  0%
    stroke-dashoffset: 47.12
  50%
    stroke-dashoffset: 15.71
  100%
    stroke-dashoffset: 47.12

.lb-fade-enter-active,
.lb-fade-leave-active
  transition: opacity 0.2s ease-in-out
  
.lb-fade-enter-from,
.lb-fade-leave-to
  opacity: 0
</style>