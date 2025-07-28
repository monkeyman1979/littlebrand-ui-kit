<template lang="pug">
button.lb-button(
  :class="buttonClasses"
  :type="type"
  :disabled="disabled || loading"
  @click="handleClick"
  v-bind="$attrs"
)
  span.lb-button__icon-leading(v-if="$slots['icon-leading'] || loading")
    transition(name="lb-fade" mode="out-in")
      .lb-button__spinner(v-if="loading && iconPosition === 'leading'" key="spinner")
        svg(
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        )
          circle(
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
          )
      slot(v-else name="icon-leading")
  
  span.lb-button__content
    slot
  
  span.lb-button__icon-trailing(v-if="$slots['icon-trailing'] || (loading && iconPosition === 'trailing')")
    transition(name="lb-fade" mode="out-in")
      .lb-button__spinner(v-if="loading && iconPosition === 'trailing'" key="spinner")
        svg(
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        )
          circle(
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
          )
      slot(v-else name="icon-trailing")
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'LbButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'filled',
      validator: (value) => ['filled', 'tonal', 'outline', 'ghost'].includes(value)
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    iconPosition: {
      type: String,
      default: 'leading',
      validator: (value) => ['leading', 'trailing'].includes(value)
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonClasses = computed(() => {
      return [
        `lb-button--${props.variant}-${props.color}`,
        `lb-button--${props.size}`,
        {
          'lb-button--full-width': props.fullWidth,
          'lb-button--loading': props.loading,
          'lb-button--disabled': props.disabled
        }
      ]
    })

    const handleClick = (event) => {
      if (!props.disabled && !props.loading) {
        emit('click', event)
      }
    }

    return {
      buttonClasses,
      handleClick
    }
  }
}
</script>

<style lang="sass">
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
  height: base.$size-5
  border: none
  border-radius: base.$radius-3
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
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--color-focus-ring)
    outline-offset: base.$focus-ring-offset
  
  &--small
    height: base.$size-4
    padding: 0 base.$space-5
    font-size: typography.$label-size-small
    letter-spacing: typography.$letter-spacing-normal
    border-radius: base.$radius-2
    
    .lb-button__icon-leading,
    .lb-button__icon-trailing
      width: base.$size-2
      height: base.$size-2
    
  &--medium
    height: base.$size-5
    padding: 0 base.$space-7
    font-size: typography.$label-size-base
    letter-spacing: typography.$letter-spacing-tight
    border-radius: base.$radius-3
    
    .lb-button__icon-leading,
    .lb-button__icon-trailing
      width: base.$size-2
      height: base.$size-2
    
  &--large
    height: base.$size-6
    padding: 0 base.$space-9
    font-size: typography.$label-size-large
    letter-spacing: typography.$letter-spacing-wide
    border-radius: base.$radius-3
    
    .lb-button__icon-leading,
    .lb-button__icon-trailing
      width: base.$size-3
      height: base.$size-3
    
  &--full-width
    width: 100%
    justify-content: center
    
  &--loading,
  &--disabled
    cursor: not-allowed
    
  &--loading
    &.lb-button--disabled
      .lb-button__spinner circle
        stroke: var(--color-text)
        opacity: 0.4
    
  &__content
    display: flex
    align-items: center
    padding: 0 base.$space-3
    
  &__icon-leading,
  &__icon-trailing
    display: inline-flex
    align-items: center
    justify-content: center
    overflow: hidden
    flex-shrink: 0
    
    svg
      display: block
      width: 100%
      height: 100%
    
  &__spinner
    width: 100%
    height: 100%
    animation: lb-spin 1s linear infinite
    
    svg
      display: block
      width: 100%
      height: 100%
      
    circle
      stroke-dasharray: 62.83
      stroke-dashoffset: 47.12
      animation: lb-spinner-dash 1.5s ease-in-out infinite
      opacity: 0.8

// Variants × Colors
@mixin button-variant($variant, $color, $color-name)
  @if $variant == 'filled'
    background-color: var(--color-#{$color})
    @if $color == 'warning'
      color: var(--color-warning-text)
    @else
      color: white
    
    &:hover:not(.lb-button--disabled):not(.lb-button--loading)
      background-color: var(--color-#{$color}-hover)
      
    &:active:not(.lb-button--disabled):not(.lb-button--loading)
      transform: translateY(1px)
      
    &.lb-button--disabled
      background-color: var(--color-border-subtle)
      color: var(--color-text-disabled)
      
  @else if $variant == 'tonal'
    @if $color == 'primary' or $color == 'secondary'
      background-color: var(--color-#{$color}-subtle)
    @else
      background-color: var(--color-#{$color}-background)
    color: var(--color-#{$color})
    
    &:hover:not(.lb-button--disabled):not(.lb-button--loading)
      opacity: 0.8
      
    &:active:not(.lb-button--disabled):not(.lb-button--loading)
      transform: translateY(1px)
      
    &.lb-button--disabled
      background-color: var(--color-surface)
      color: var(--color-text-disabled)
      
  @else if $variant == 'outline'
    background-color: transparent
    color: var(--color-#{$color})
    box-shadow: inset 0 0 0 2px var(--color-#{$color})
    
    &:hover:not(.lb-button--disabled):not(.lb-button--loading)
      background-color: var(--color-#{$color})
      @if $color == 'warning'
        color: var(--color-warning-text)
      @else
        color: white
      
    &:active:not(.lb-button--disabled):not(.lb-button--loading)
      transform: translateY(1px)
      
    &.lb-button--disabled
      color: var(--color-text-disabled)
      box-shadow: inset 0 0 0 2px var(--color-border)
      
  @else if $variant == 'ghost'
    background-color: transparent
    color: var(--color-#{$color})
    
    &:hover:not(.lb-button--disabled):not(.lb-button--loading)
      @if $color == 'primary' or $color == 'secondary'
        background-color: var(--color-#{$color}-subtle)
      @else
        background-color: var(--color-#{$color}-background)
      
    &:active:not(.lb-button--disabled):not(.lb-button--loading)
      transform: translateY(1px)
      
    &.lb-button--disabled
      color: var(--color-text-disabled)

// Generate all variant × color combinations
$variants: ('filled', 'tonal', 'outline', 'ghost')
$color-map: ('primary': 'purple', 'secondary': 'teal', 'success': 'green', 'warning': 'yellow', 'error': 'red', 'info': 'blue')

@each $variant in $variants
  @each $color, $color-name in $color-map
    .lb-button--#{$variant}-#{$color}
      @include button-variant($variant, $color, $color-name)

// Light mode specific warning text colors
:root:not([data-theme="dark"])
  .lb-button--tonal-warning,
  .lb-button--outline-warning,
  .lb-button--ghost-warning
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