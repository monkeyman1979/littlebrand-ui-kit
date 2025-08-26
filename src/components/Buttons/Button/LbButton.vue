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
type Color = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
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
@use '@/styles/component-variables' as cv
@use '@/styles/typography' as typography

.lb-button
  position: relative
  display: inline-grid
  grid-auto-flow: column
  place-content: center
  gap: base.$space-xs
  padding: 0 cv.$button-padding-x-medium
  height: cv.$button-height-medium  // Default to medium
  border: none
  border-radius: cv.$button-border-radius
  font-family: typography.$font-body
  font-size: cv.$button-font-size-medium
  font-weight: var(--lb-font-weight-label)
  line-height: typography.$line-height-normal
  letter-spacing: typography.$letter-spacing-tight
  cursor: pointer
  transition: all base.$transition
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
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
    transition: none
  
  // Size modifiers
  &.small
    height: cv.$button-height-small
    padding: 0 cv.$button-padding-x-small
    font-size: cv.$button-font-size-small
    letter-spacing: typography.$letter-spacing-normal
    border-radius: cv.$button-border-radius-small
    svg
      width: cv.$button-icon-size-small
      height: cv.$button-icon-size-small
    
  &.medium
    height: cv.$button-height-medium
    padding: 0 cv.$button-padding-x-medium
    font-size: cv.$button-font-size-medium
    letter-spacing: typography.$letter-spacing-tight
    border-radius: cv.$button-border-radius-medium
    svg
      width: cv.$button-icon-size-medium
      height: cv.$button-icon-size-medium
    
  &.large
    height: cv.$button-height-large
    padding: 0 cv.$button-padding-x-large
    font-size: cv.$button-font-size-large
    letter-spacing: typography.$letter-spacing-wide
    border-radius: cv.$button-border-radius-large
    svg
      width: cv.$button-icon-size-large
      height: cv.$button-icon-size-large
    
  &.full-width
    width: 100%
    justify-content: center
    
  // Icon only button styles
  &.icon-only
    padding: 0
    gap: 0
    justify-content: center
    
    &.small
      width: cv.$button-height-small
      height: cv.$button-height-small
      border-radius: cv.$button-border-radius-small
    
    &.medium
      width: cv.$button-height-medium
      height: cv.$button-height-medium
      border-radius: cv.$button-border-radius-medium
    
    &.large
      width: cv.$button-height-large
      height: cv.$button-height-large
      border-radius: cv.$button-border-radius-large
    
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
        stroke: var(--lb-text-neutral-contrast-high)
        opacity: base.$opacity-40
    
  .content
    display: flex
    align-items: center
    padding: 0 base.$space-xs
    
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
      opacity: base.$opacity-80

// Variant styles
@mixin button-variant($variant, $color, $color-name)
  // Common active state for all non-link variants
  @if $variant != 'link'
  
  // Base colors for each variant
  @if $variant == 'filled'
    background-color: var(--lb-fill-#{$color}-normal)
    color: var(--lb-text-on-#{$color})
    &:not(.disabled):not(.loading)
      @include base.hover-supported
        background-color: var(--lb-fill-#{$color}-hover)
        color: var(--lb-text-on-#{$color}-hover)
    &:active:not(.disabled):not(.loading)
      background-color: var(--lb-fill-#{$color}-active)
      color: var(--lb-text-on-#{$color}-active)
    &.disabled
      background-color: var(--lb-surface-neutral-subtle)
      color: var(--lb-text-neutral-disabled)
      
  @else if $variant == 'tonal'
    background-color: var(--lb-surface-#{$color}-normal)
    color: if($color == 'neutral', var(--lb-text-neutral-contrast-high), var(--lb-text-#{$color}-normal))
    &:not(.disabled):not(.loading)
      @include base.hover-supported
        background-color: var(--lb-surface-#{$color}-hover)
        color: if($color == 'warning' or $color == 'neutral', var(--lb-text-neutral-contrast-high), var(--lb-text-#{$color}-normal))
    &:active:not(.disabled):not(.loading)
      background-color: var(--lb-surface-#{$color}-active)
    &.disabled
      background-color: var(--lb-background-surface)
      color: var(--lb-text-neutral-disabled)
      
  @else if $variant == 'outline'
    background-color: transparent
    color: if($color == 'neutral', var(--lb-text-neutral-contrast-high), var(--lb-text-#{$color}-normal))
    box-shadow: inset 0 0 0 base.$border-sm var(--lb-border-#{$color}-normal)
    &:not(.disabled):not(.loading)
      @include base.hover-supported
        background-color: var(--lb-fill-#{$color}-normal)
        color: var(--lb-text-on-#{$color})
        box-shadow: none
    &:active:not(.disabled):not(.loading)
      background-color: var(--lb-fill-#{$color}-active)
      color: var(--lb-text-on-#{$color}-active)
      box-shadow: none
    &.disabled
      color: var(--lb-text-neutral-disabled)
      box-shadow: inset 0 0 0 base.$border-md var(--lb-border-neutral-line)
      
  @else if $variant == 'ghost'
    background-color: transparent
    color: if($color == 'neutral', var(--lb-text-neutral-contrast-high), var(--lb-text-#{$color}-normal))
    &:not(.disabled):not(.loading)
      @include base.hover-supported
        background-color: var(--lb-surface-#{$color}-normal)
        color: if($color == 'warning' or $color == 'neutral', var(--lb-text-neutral-contrast-high), var(--lb-text-#{$color}-normal))
    &:active:not(.disabled):not(.loading)
      background-color: var(--lb-surface-#{$color}-hover)
      transform: translateY(1px)
    &.disabled
      color: var(--lb-text-neutral-disabled)
      
  @else if $variant == 'link'
    background-color: transparent
    color: var(--lb-text-#{$color}-normal)
    padding: 0
    height: auto
    border: none
    border-radius: 0
    text-decoration: none
    display: inline-flex
    align-items: center
    gap: base.$space-2xs
    &:not(.disabled):not(.loading)
      @include base.hover-supported
        text-decoration: underline
        color: if($color == 'warning', var(--lb-text-warning-contrast-high), var(--lb-text-#{$color}-normal))
    &:active:not(.disabled):not(.loading)
      opacity: base.$opacity-80
    &.disabled
      color: var(--lb-text-neutral-disabled)
      cursor: not-allowed

// Generate all variant × color combinations
$variants: ('filled', 'tonal', 'outline', 'ghost', 'link')
$color-map: ('primary': 'orange', 'secondary': 'teal', 'neutral': 'neutral', 'success': 'green', 'warning': 'yellow', 'error': 'red', 'info': 'blue')

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
    color: var(--lb-text-warning-contrast-high)

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
  opacity: base.$opacity-0
</style>