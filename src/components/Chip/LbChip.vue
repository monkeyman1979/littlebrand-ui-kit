<template lang="pug">
button.lb-chip(
  :class="chipClasses"
  :disabled="disabled"
  :role="clickable ? 'button' : null"
  :aria-pressed="variant === 'filter' ? selected.toString() : null"
  :aria-expanded="hasDropdown ? 'false' : null"
  :tabindex="disabled ? -1 : 0"
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
type Size = 'small' | 'medium' | 'large'

// Props
const props = withDefaults(defineProps<{
  variant?: Variant
  color?: Color
  selected?: boolean
  disabled?: boolean
  clickable?: boolean
  deletable?: boolean
  size?: Size
  hasDropdown?: boolean
}>(), {
  variant: 'assist',
  color: 'primary',
  selected: false,
  disabled: false,
  clickable: true,
  deletable: false,
  size: 'medium',
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
  `size-${props.size}`,
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

.lb-chip
  position: relative
  display: inline-flex
  align-items: center
  gap: var(--lb-space-xs)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  border-radius: var(--lb-radius-sm)
  font-family: var(--lb-font-body)
  font-weight: var(--lb-font-weight-medium)
  line-height: var(--lb-line-height-compact)
  letter-spacing: var(--lb-letter-spacing-tight)
  cursor: pointer
  transition: all var(--lb-transition)
  text-decoration: none
  white-space: nowrap
  user-select: none
  outline: none
  background-color: var(--lb-background-surface)
  color: var(--lb-text-neutral-contrast-high)
  
  &:focus-visible
    outline: var(--lb-focus-ring-width) solid var(--lb-focus-ring-color)
    outline-offset: var(--lb-focus-ring-offset)
    transition: none
  
  // Fixed height of 32px for all chips
  height: 2rem
  padding: 0 var(--lb-space-md)
  font-size: var(--lb-font-size-label-base)
  gap: var(--lb-space-xs)
  
  &.has-leading-icon
    padding-left: var(--lb-space-sm)
    
  &.has-trailing-icon
    padding-right: var(--lb-space-sm)
  
  // Icon sizes - 18x18px
  .icon-leading,
  .icon-trailing,
  .icon-selected,
  .icon-dropdown,
  .delete-button
    svg
      width: 1.125rem
      height: 1.125rem
  
  // Avatar container - 24x24px
  .avatar-container
    display: inline-flex
    align-items: center
    justify-content: center
    flex-shrink: 0
    width: 1.5rem
    height: 1.5rem
    margin: -0.25rem 0
    
    :deep(.lb-avatar)
      width: 1.5rem
      height: 1.5rem
  
  // Variant styles
  &.variant-assist
    border-color: var(--lb-border-neutral-line)
    background-color: var(--lb-background-surface)
    color: var(--lb-text-neutral-contrast-high)
    
    &:hover:not(.disabled)
      background-color: var(--lb-surface-primary-normal)
      border-color: var(--lb-border-primary-normal)
      color: var(--lb-text-primary-normal)
      box-shadow: var(--lb-shadow-sm)
      
    &:active:not(.disabled)
      background-color: var(--lb-surface-primary-hover)
      transform: translateY(1px)
  
  &.variant-filter
    border-color: var(--lb-border-neutral-line)
    background-color: var(--lb-background-surface)
    color: var(--lb-text-neutral-contrast-high)
    
    &:hover:not(.disabled)
      background-color: var(--lb-surface-primary-normal)
      border-color: var(--lb-border-primary-normal)
      color: var(--lb-text-primary-normal)
      
    &.selected
      background-color: var(--lb-surface-primary-hover)
      border-color: var(--lb-border-primary-normal)
      color: var(--lb-text-primary-normal)
      
      &:hover:not(.disabled)
        background-color: var(--lb-surface-primary-active)
  
  &.variant-input
    background-color: var(--lb-fill-primary-normal)
    border-color: var(--lb-border-primary-normal)
    color: var(--lb-text-on-variant-light)
    
    &:hover:not(.disabled)
      background-color: var(--lb-fill-primary-hover)
      box-shadow: var(--lb-shadow-sm)
      
    &:active:not(.disabled)
      background-color: var(--lb-fill-primary-active)
  
  &.variant-suggestion
    border-color: var(--lb-border-neutral-line)
    background-color: var(--lb-background-surface)
    color: var(--lb-text-neutral-contrast-low)
    
    &:hover:not(.disabled)
      background-color: var(--lb-background-surface-raised)
      border-color: var(--lb-border-neutral-normal)
      color: var(--lb-text-neutral-contrast-high)
      box-shadow: var(--lb-shadow-sm)
      
    &:active:not(.disabled)
      background-color: var(--lb-surface-primary-normal)
      border-color: var(--lb-border-primary-normal)
      color: var(--lb-text-primary-normal)
  
  // Disabled state
  &.disabled
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
    
    &:hover
      background-color: var(--lb-background-surface)
      border-color: var(--lb-border-neutral-line)
      color: var(--lb-text-neutral-disabled)
      box-shadow: none
      transform: none
  
  // Non-clickable chips
  &:not(.clickable)
    cursor: default
    
    &:hover
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
    opacity: var(--lb-opacity-70)
    
    .lb-chip:hover:not(.disabled) &
      opacity: var(--lb-opacity-100)
  
  // Content
  .content
    display: flex
    align-items: center
    flex: 1
    min-width: 0
    overflow: hidden
    text-overflow: ellipsis
    padding: 0 var(--lb-space-xs)
  
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
    padding: var(--lb-space-2xs)
    margin: calc(var(--lb-space-2xs) * -1)
    border-radius: var(--lb-radius-full)
    transition: all var(--lb-transition-fast)
    opacity: var(--lb-opacity-70)
    
    &:hover:not(:disabled)
      opacity: var(--lb-opacity-100)
      background-color: var(--lb-surface-error-normal)
      color: var(--lb-text-error-normal)
      
    &:active:not(:disabled)
      background-color: var(--lb-surface-error-hover)
      transform: scale(0.95)
      
    &:disabled
      cursor: not-allowed
      opacity: var(--lb-opacity-40)
    
    svg
      display: block

// Chip variant color mixin
@mixin chip-variant($variant, $color)
  @if $variant == 'assist'
    &.color-#{$color}
      border-color: var(--lb-border-neutral-line)
      background-color: var(--lb-background-surface)
      color: var(--lb-text-neutral-contrast-high)
      
      &:hover:not(.disabled)
        background-color: var(--lb-surface-#{$color}-normal)
        border-color: var(--lb-border-#{$color}-normal)
        color: var(--lb-text-#{$color}-normal)
        box-shadow: var(--lb-shadow-sm)
        
      &:active:not(.disabled)
        background-color: var(--lb-surface-#{$color}-hover)
        transform: translateY(1px)
  
  @if $variant == 'filter'
    &.color-#{$color}
      border-color: var(--lb-border-neutral-line)
      background-color: var(--lb-background-surface)
      color: var(--lb-text-neutral-contrast-high)
      
      &:hover:not(.disabled)
        background-color: var(--lb-surface-#{$color}-normal)
        border-color: var(--lb-border-#{$color}-normal)
        color: var(--lb-text-#{$color}-normal)
        
      &.selected
        background-color: var(--lb-surface-#{$color}-hover)
        border-color: var(--lb-border-#{$color}-normal)
        color: var(--lb-text-#{$color}-normal)
        
        &:hover:not(.disabled)
          background-color: var(--lb-surface-#{$color}-active)
  
  @if $variant == 'input'
    &.color-#{$color}
      background-color: var(--lb-fill-#{$color}-normal)
      border-color: var(--lb-border-#{$color}-normal)
      color: if($color == 'warning', var(--lb-text-neutral-contrast-high), var(--lb-text-on-variant-light))
      
      &:hover:not(.disabled)
        background-color: var(--lb-fill-#{$color}-hover)
        box-shadow: var(--lb-shadow-sm)
        
      &:active:not(.disabled)
        background-color: var(--lb-fill-#{$color}-active)
  
  @if $variant == 'suggestion'
    &.color-#{$color}
      border-color: var(--lb-border-neutral-line)
      background-color: var(--lb-background-surface)
      color: var(--lb-text-neutral-contrast-low)
      
      &:hover:not(.disabled)
        background-color: var(--lb-background-surface-raised)
        border-color: var(--lb-border-neutral-normal)
        color: var(--lb-text-neutral-contrast-high)
        box-shadow: var(--lb-shadow-sm)
        
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