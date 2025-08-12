<template lang="pug">
button.lb-chip(
  :class="chipClasses"
  :disabled="disabled"
  :role="clickable ? 'button' : null"
  :aria-pressed="variant === 'filter' ? selected.toString() : null"
  :aria-expanded="hasDropdown ? 'false' : null"
  :tabindex="disabled || !clickable ? -1 : 0"
  @click="handleClick"
  @keydown.enter="handleClick"
  @keydown.space.prevent="handleClick"
)
  //- Leading avatar slot
  span.avatar-container(v-if="$slots.leadingAvatar")
    slot(name="leadingAvatar")
  
  //- Leading icon slot
  span.icon-leading(v-else-if="$slots.leadingIcon")
    slot(name="leadingIcon")
  
  //- Selected checkmark for filter chips
  span.icon-selected(v-if="variant === 'filter' && selected && !$slots.leadingIcon && !$slots.leadingAvatar")
    svg(viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
      path(d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor")
  
  //- Chip content
  span.content
    slot
  
  //- Dropdown indicator
  span.icon-dropdown(v-if="hasDropdown && !deletable")
    svg(viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
      path(d="M7 10l5 5 5-5z" fill="currentColor")
  
  //- Trailing icon slot
  span.icon-trailing(v-else-if="$slots.trailingIcon && !deletable")
    slot(name="trailingIcon")
  
  //- Delete button for deletable chips
  button.delete-button(
    v-if="deletable"
    type="button"
    :disabled="disabled"
    @click.stop="handleDelete"
    @keydown.enter.stop="handleDelete"
    @keydown.space.stop.prevent="handleDelete"
    aria-label="Delete"
  )
    svg(viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg")
      path(d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

// Types
type Variant = 'assist' | 'filter' | 'input' | 'suggestion'
type Color = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'

// Props
const props = withDefaults(defineProps<{
  variant?: Variant
  color?: Color
  selected?: boolean
  disabled?: boolean
  clickable?: boolean
  deletable?: boolean
  hasDropdown?: boolean
}>(), {
  variant: 'assist',
  color: 'primary',
  selected: false,
  disabled: false,
  clickable: true,
  deletable: false,
  hasDropdown: false
})

// Emits
const emit = defineEmits<{
  click: [event: Event]
  delete: [event: Event]
  'update:selected': [value: boolean]
}>()

// Slots
const slots = useSlots()

// Internal selected state for v-model support
const internalSelected = ref(props.selected)

// Computed
const chipClasses = computed(() => [
  `variant-${props.variant}`,
  `color-${props.color}`,
  {
    'selected': props.variant === 'filter' && props.selected,
    'disabled': props.disabled,
    'clickable': props.clickable,
    'deletable': props.deletable,
    'has-leading-icon': !!slots.leadingIcon || !!slots.leadingAvatar || (props.variant === 'filter' && props.selected && !slots.leadingIcon && !slots.leadingAvatar),
    'has-trailing-icon': !!slots.trailingIcon || props.deletable || props.hasDropdown,
    'has-dropdown': props.hasDropdown
  }
])

// Methods
const handleClick = (event: Event) => {
  if (props.disabled || !props.clickable) return
  
  // Handle filter chip selection toggle
  if (props.variant === 'filter') {
    const newSelected = !props.selected
    emit('update:selected', newSelected)
  }
  
  emit('click', event)
}

const handleDelete = (event: Event) => {
  if (props.disabled) return
  emit('delete', event)
}

// Component options
defineOptions({
  name: 'LbChip',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/component-variables' as cv
@use '@/styles/typography' as typography

.lb-chip
  position: relative
  display: inline-flex
  align-items: center
  gap: base.$space-xs
  border: base.$border-sm solid var(--lb-border-neutral-line)
  border-radius: cv.$chip-border-radius
  font-family: typography.$font-body
  font-weight: typography.$font-weight-medium
  line-height: typography.$line-height-compact
  letter-spacing: typography.$letter-spacing-tight
  cursor: pointer
  transition: all base.$transition
  text-decoration: none
  white-space: nowrap
  user-select: none
  outline: none
  background-color: var(--lb-background-surface)
  color: var(--lb-text-neutral-contrast-high)
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
    transition: none
  
  // Fixed size (32px height)
  height: cv.$chip-height  // 32px
  padding: 0 cv.$chip-padding-x  // 12px
  font-size: cv.$chip-font-size  // 14px
  gap: base.$space-xs
  
  &.has-leading-icon
    padding-left: base.$space-sm  // 8px
  
  &.has-trailing-icon
    padding-right: base.$space-sm  // 8px
  
  // Icon sizes - fixed for single chip size
  .icon-leading,
  .icon-trailing,
  .icon-selected,
  .icon-dropdown,
  .delete-button
    svg
      width: cv.$chip-icon-size  // 16px
      height: cv.$chip-icon-size  // 16px
  
  // Avatar container - fixed size
  .avatar-container
    display: inline-flex
    align-items: center
    justify-content: center
    flex-shrink: 0
    width: base.$unit-24  // 24px
    height: base.$unit-24  // 24px
    margin: calc(base.$space-xs * -1) 0
    
    :deep(.lb-avatar)
      width: base.$unit-24
      height: base.$unit-24
  
  // Variant styles
  &.variant-assist
    border-color: var(--lb-border-neutral-line)
    background-color: var(--lb-background-surface)
    color: var(--lb-text-neutral-contrast-high)
    
    &:not(.disabled)
      @include base.hover-supported
        background-color: var(--lb-surface-primary-normal)
        border-color: var(--lb-border-primary-normal)
        color: var(--lb-text-primary-normal)
        box-shadow: base.$shadow-sm
      
    &:active:not(.disabled)
      background-color: var(--lb-surface-primary-hover)
      transform: translateY(1px)
  
  &.variant-filter
    border-color: var(--lb-border-neutral-line)
    background-color: var(--lb-background-surface)
    color: var(--lb-text-neutral-contrast-high)
    
    &:not(.disabled)
      @include base.hover-supported
        background-color: var(--lb-surface-primary-normal)
        border-color: var(--lb-border-primary-normal)
        color: var(--lb-text-primary-normal)
      
    &.selected
      background-color: var(--lb-surface-primary-hover)
      border-color: var(--lb-border-primary-normal)
      color: var(--lb-text-primary-normal)
      
      &:not(.disabled)
        @include base.hover-supported
          background-color: var(--lb-surface-primary-active)
  
  &.variant-input
    background-color: var(--lb-fill-primary-normal)
    border-color: var(--lb-border-primary-normal)
    color: var(--lb-text-on-variant-light)
    
    &:not(.disabled)
      @include base.hover-supported
        background-color: var(--lb-fill-primary-hover)
        box-shadow: base.$shadow-sm
      
    &:active:not(.disabled)
      background-color: var(--lb-fill-primary-active)
  
  &.variant-suggestion
    border-color: var(--lb-border-neutral-line)
    background-color: var(--lb-background-surface)
    color: var(--lb-text-neutral-contrast-low)
    
    &:not(.disabled)
      @include base.hover-supported
        background-color: var(--lb-background-surface-raised)
        border-color: var(--lb-border-neutral-normal)
        color: var(--lb-text-neutral-contrast-high)
        box-shadow: base.$shadow-sm
      
    &:active:not(.disabled)
      background-color: var(--lb-surface-primary-normal)
      border-color: var(--lb-border-primary-normal)
      color: var(--lb-text-primary-normal)
  
  // Disabled state
  &.disabled
    cursor: not-allowed
    opacity: base.$opacity-60
    
    @include base.hover-supported
      background-color: var(--lb-background-surface)
      border-color: var(--lb-border-neutral-line)
      color: var(--lb-text-neutral-disabled)
      box-shadow: none
      transform: none
  
  // Non-clickable chips - no interactive states
  &:not(.clickable)
    cursor: default
    pointer-events: none
    
    // Re-enable pointer events for deletable chips
    .delete-button
      pointer-events: auto
      cursor: pointer
    
    @include base.hover-supported
      background-color: var(--lb-background-surface)
      box-shadow: none
      transform: none
  
  // Icon containers
  .icon-leading,
  .icon-trailing,
  .icon-selected,
  .icon-dropdown
    display: inline-flex
    align-items: center
    justify-content: center
    flex-shrink: 0
    
    svg
      display: block
  
  .icon-selected
    color: var(--lb-text-primary-normal)
  
  .icon-dropdown
    opacity: base.$opacity-70
    
  .lb-chip:not(.disabled)
    @include base.hover-supported
      .icon-dropdown
        opacity: base.$opacity-100
  
  // Content
  .content
    display: flex
    align-items: center
    flex: 1
    min-width: 0
    overflow: hidden
    text-overflow: ellipsis
    padding: 0 base.$space-xs
  
  // Delete button
  .delete-button
    display: inline-flex
    align-items: center
    justify-content: center
    flex-shrink: 0
    border: none
    background: none
    color: currentColor
    cursor: pointer
    padding: base.$space-2xs
    margin: calc(base.$space-2xs * -1)
    border-radius: base.$radius-full
    transition: all base.$transition
    opacity: base.$opacity-70
    
    &:not(:disabled)
      @include base.hover-supported
        opacity: base.$opacity-100
        background-color: var(--lb-surface-error-normal)
        color: var(--lb-text-error-normal)
      
    &:active:not(:disabled)
      background-color: var(--lb-surface-error-hover)
      transform: scale(0.95)
      
    &:disabled
      cursor: not-allowed
      opacity: base.$opacity-40
    
    svg
      display: block

// Chip variant color mixin
@mixin chip-variant($variant, $color)
  @if $variant == 'assist'
    &.color-#{$color}
      border-color: var(--lb-border-neutral-line)
      background-color: var(--lb-background-surface)
      color: var(--lb-text-neutral-contrast-high)
      
      &:not(.disabled)
        @include base.hover-supported
          background-color: var(--lb-surface-#{$color}-normal)
          border-color: var(--lb-border-#{$color}-normal)
          color: var(--lb-text-#{$color}-normal)
          box-shadow: base.$shadow-sm
        
      &:active:not(.disabled)
        background-color: var(--lb-surface-#{$color}-hover)
        transform: translateY(1px)
  
  @if $variant == 'filter'
    &.color-#{$color}
      border-color: var(--lb-border-neutral-line)
      background-color: var(--lb-background-surface)
      color: var(--lb-text-neutral-contrast-high)
      
      &:not(.disabled)
        @include base.hover-supported
          background-color: var(--lb-surface-#{$color}-normal)
          border-color: var(--lb-border-#{$color}-normal)
          color: var(--lb-text-#{$color}-normal)
        
      &.selected
        background-color: var(--lb-surface-#{$color}-hover)
        border-color: var(--lb-border-#{$color}-normal)
        color: var(--lb-text-#{$color}-normal)
        
        &:not(.disabled)
          @include base.hover-supported
            background-color: var(--lb-surface-#{$color}-active)
  
  @if $variant == 'input'
    &.color-#{$color}
      background-color: var(--lb-fill-#{$color}-normal)
      border-color: var(--lb-border-#{$color}-normal)
      color: if($color == 'warning', var(--lb-text-neutral-contrast-high), var(--lb-text-on-variant-light))
      
      &:not(.disabled)
        @include base.hover-supported
          background-color: var(--lb-fill-#{$color}-hover)
          box-shadow: base.$shadow-sm
        
      &:active:not(.disabled)
        background-color: var(--lb-fill-#{$color}-active)
  
  @if $variant == 'suggestion'
    &.color-#{$color}
      border-color: var(--lb-border-neutral-line)
      background-color: var(--lb-background-surface)
      color: var(--lb-text-neutral-contrast-low)
      
      &:not(.disabled)
        @include base.hover-supported
          background-color: var(--lb-background-surface-raised)
          border-color: var(--lb-border-neutral-normal)
          color: var(--lb-text-neutral-contrast-high)
          box-shadow: base.$shadow-sm
        
      &:active:not(.disabled)
        background-color: var(--lb-surface-#{$color}-normal)
        border-color: var(--lb-border-#{$color}-normal)
        color: var(--lb-text-#{$color}-normal)

// Generate all variant × color combinations
$variants: ('assist', 'filter', 'input', 'suggestion')
$colors: ('primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info')

@each $variant in $variants
  @each $color in $colors
    .lb-chip.variant-#{$variant}
      @include chip-variant($variant, $color)

// Update icon-selected color to use the current color variant
.lb-chip
  .icon-selected
    color: var(--lb-text-primary-normal)
    
  @each $color in $colors
    &.color-#{$color} .icon-selected
      color: var(--lb-text-#{$color}-normal)
</style>