<template lang="pug">
button.lb-chip(
  :class="chipClasses"
  :disabled="disabled"
  :role="clickable ? 'button' : null"
  :aria-pressed="type === 'filter' ? selected.toString() : null"
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
  span.icon-selected(v-if="type === 'filter' && selected && !$slots.leadingIcon && !$slots.leadingAvatar")
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
type Type = 'assist' | 'filter' | 'input'
type Variant = 'filled' | 'tonal' | 'outline'
type Color = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'

// Props
const props = withDefaults(defineProps<{
  type?: Type
  variant?: Variant
  color?: Color
  selected?: boolean
  disabled?: boolean
  clickable?: boolean
  deletable?: boolean
  hasDropdown?: boolean
  muted?: boolean
}>(), {
  type: 'assist',
  variant: 'tonal',
  color: 'primary',
  selected: false,
  disabled: false,
  clickable: true,
  deletable: false,
  hasDropdown: false,
  muted: false
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
  `type-${props.type}`,
  `variant-${props.variant}`,
  `color-${props.color}`,
  {
    'selected': props.type === 'filter' && props.selected,
    'disabled': props.disabled,
    'clickable': props.clickable,
    'deletable': props.deletable,
    'has-leading-icon': !!slots.leadingIcon || !!slots.leadingAvatar || (props.type === 'filter' && props.selected && !slots.leadingIcon && !slots.leadingAvatar),
    'has-trailing-icon': !!slots.trailingIcon || props.deletable || props.hasDropdown,
    'has-dropdown': props.hasDropdown,
    'muted': props.muted
  }
])

// Methods
const handleClick = (event: Event) => {
  if (props.disabled || !props.clickable) return
  
  // Handle filter chip selection toggle
  if (props.type === 'filter') {
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
// Using CSS custom properties instead of SASS variables for runtime customization

.lb-chip
  position: relative
  display: inline-flex
  align-items: center
  gap: var(--lb-space-xs)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  border-radius: var(--lb-chip-border-radius)
  font-family: var(--lb-font-label)
  font-weight: var(--lb-font-weight-label)
  line-height: var(--lb-line-height-compact)
  letter-spacing: var(--lb-letter-spacing-tight)
  cursor: pointer
  transition: all var(--lb-transition-normal)
  text-decoration: none
  white-space: nowrap
  user-select: none
  outline: none
  background-color: var(--lb-surface-subtle)
  color: var(--lb-text-neutral-contrast-high)
  align-self: flex-start  // Prevent stretching in flex containers
  
  &:focus-visible
    outline: var(--lb-border-md) solid var(--lb-focus-ring-color)
    outline-offset: var(--lb-space-2xs)
    transition: none
  
  // Fixed size (32px height)
  height: var(--lb-chip-height)  // 32px
  padding: 0 var(--lb-chip-padding-x)  // 12px
  font-size: var(--lb-chip-font-size)  // 14px
  gap: var(--lb-space-xs)
  
  &.has-leading-icon
    padding-left: var(--lb-space-sm)  // 8px
  
  &.has-trailing-icon
    padding-right: var(--lb-space-sm)  // 8px
  
  // Icon sizes - fixed for single chip size
  .icon-leading,
  .icon-trailing,
  .icon-selected,
  .icon-dropdown,
  .delete-button
    svg
      width: var(--lb-chip-icon-size)  // 16px
      height: var(--lb-chip-icon-size)  // 16px
  
  // Avatar container - fixed size
  .avatar-container
    display: inline-flex
    align-items: center
    justify-content: center
    flex-shrink: 0
    width: var(--lb-chip-avatar-size, 1.5rem)  // 24px
    height: var(--lb-chip-avatar-size, 1.5rem)  // 24px
    margin: calc(var(--lb-space-xs) * -1) 0
    
    :deep(.lb-avatar)
      width: var(--lb-chip-avatar-size, 1.5rem)
      height: var(--lb-chip-avatar-size, 1.5rem)
  
  // Type styles (functional behavior)
  &.type-assist
    // Interactive chips for user actions
    
  &.type-filter
    // Chips with selected state for filtering
    // Special behavior handled below
  
  &.type-input
    // Chips for user selections (often deletable)
  
  // Disabled state
  &.disabled
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
    
    &:hover
      background-color: var(--lb-surface-subtle)
      border-color: var(--lb-border-neutral-line)
      color: var(--lb-text-neutral-disabled)
      box-shadow: none
      transform: none
  
  // Muted state for subtle chips
  &.muted
    color: var(--lb-text-neutral-contrast-low)
    
    &:not(.disabled)
      &:hover
        color: var(--lb-text-neutral-contrast-high)
    
    .lb-chip__leading-icon,
    .lb-chip__trailing-icon,
    .lb-chip__delete,
    .lb-chip__dropdown-icon
      color: inherit
  
  // Non-clickable chips - no interactive states
  &:not(.clickable)
    cursor: default
    pointer-events: none
    
    // Re-enable pointer events for deletable chips
    .delete-button
      pointer-events: auto
      cursor: pointer
    
    &:hover
      background-color: var(--lb-surface-subtle)
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
    
  .lb-chip:not(.disabled)
    @media (hover: hover)
      &:hover
        .icon-dropdown
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
    transition: all var(--lb-transition-normal)
    opacity: var(--lb-opacity-70)
    
    &:not(:disabled)
      &:hover
        opacity: var(--lb-opacity-100)
      
    &:active:not(:disabled)
      transform: scale(0.95)
      
    &:disabled
      cursor: not-allowed
      opacity: var(--lb-opacity-40)
    
    svg
      display: block

// Chip visual variant mixin
@mixin chip-visual-variant($variant, $color)
  &.variant-#{$variant}.color-#{$color}
    @if $variant == 'tonal'
      // Tonal variant - subtle surface colors
      border-color: var(--lb-border-#{$color}-line)
      background-color: var(--lb-surface-#{$color}-normal)
      color: var(--lb-text-#{$color}-normal)
      
      &:not(.disabled)
        &:hover
          background-color: var(--lb-surface-#{$color}-hover)
          border-color: var(--lb-border-#{$color}-normal)
          box-shadow: var(--lb-shadow-sm)
        
      &:active:not(.disabled)
        background-color: var(--lb-surface-#{$color}-active)
    
    @if $variant == 'filled'
      // Filled variant - prominent filled colors
      background-color: var(--lb-fill-#{$color}-normal)
      border-color: var(--lb-border-#{$color}-normal)
      color: var(--lb-text-on-#{$color})
      
      &:not(.disabled)
        &:hover
          background-color: var(--lb-fill-#{$color}-hover)
          box-shadow: var(--lb-shadow-sm)
        
      &:active:not(.disabled)
        background-color: var(--lb-fill-#{$color}-active)
    
    @if $variant == 'outline'
      // Outline variant - transparent background with colored border
      background-color: transparent
      border-color: var(--lb-border-#{$color}-normal)
      color: var(--lb-text-#{$color}-normal)
      
      &.clickable:not(.disabled)
        &:hover
          background-color: var(--lb-surface-#{$color}-normal)
          border-color: var(--lb-border-#{$color}-normal)
        
      &.clickable:active:not(.disabled)
        background-color: var(--lb-surface-#{$color}-hover)
        border-color: var(--lb-border-#{$color}-active)

// Generate all visual variant × color combinations
$visual-variants: ('tonal', 'filled', 'outline')
$colors: ('primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info')

@each $variant in $visual-variants
  @each $color in $colors
    .lb-chip
      @include chip-visual-variant($variant, $color)

// Special override for neutral color: use high contrast text for better visibility
.lb-chip.type-filter.selected
  &.variant-tonal.color-neutral,
  &.variant-outline.color-neutral
    color: var(--lb-text-neutral-contrast-high)
    
    &:not(.disabled)
      &:hover
        color: var(--lb-text-neutral-contrast-high)
    
    &:active:not(.disabled)
      color: var(--lb-text-neutral-contrast-high)
  
  // Filled variant uses text-on-neutral which is light
  &.variant-filled.color-neutral
    color: var(--lb-text-on-neutral)

// Delete button color-specific hover states
// Use alpha scale tokens for consistent transparent overlays
@each $color in $colors
  .lb-chip.color-#{$color} .delete-button
    &:not(:disabled)
      &:hover
        background-color: var(--lb-neutral-a4)  // ~6% opacity for subtle hover
    
    &:active:not(:disabled)
      background-color: var(--lb-neutral-a6)  // ~12% opacity for active state

// Update icon-selected color to use the current color variant
.lb-chip
  .icon-selected
    color: var(--lb-text-primary-normal)
    
  // For tonal and outline variants, use the color's text
  @each $color in $colors
    &.variant-tonal.color-#{$color} .icon-selected,
    &.variant-outline.color-#{$color} .icon-selected
      color: var(--lb-text-#{$color}-normal)
    
    // For filled variant, use the text-on color for better contrast
    &.variant-filled.color-#{$color} .icon-selected
      color: var(--lb-text-on-#{$color})
  
  // Special case for neutral: use high contrast text for better visibility
  &.variant-tonal.color-neutral .icon-selected,
  &.variant-outline.color-neutral .icon-selected
    color: var(--lb-text-neutral-contrast-high)
  
  &.variant-filled.color-neutral .icon-selected
    color: var(--lb-text-on-neutral)  // Uses light text

// Filter chips special behavior: neutral by default, color on hover, full color when selected
// Using high specificity to override variant/color combinations without !important
@each $variant in $visual-variants
  @each $color in $colors
    .lb-chip.type-filter.variant-#{$variant}.color-#{$color}
      &:not(.selected)
        // Always neutral when not selected (default state)
        @if $variant == 'outline'
          background-color: transparent  // Outline should stay transparent
        @else
          background-color: var(--lb-surface-subtle)
        border-color: var(--lb-border-neutral-line)
        color: var(--lb-text-neutral-contrast-high)
        
        // Show the color on hover (if color is provided)
        &:not(.disabled)
          &:hover
            @if $variant == 'tonal'
              background-color: var(--lb-surface-#{$color}-hover)
              border-color: var(--lb-border-#{$color}-normal)
              @if $color == 'neutral'
                color: var(--lb-text-neutral-contrast-high)
              @else
                color: var(--lb-text-#{$color}-normal)
            @else if $variant == 'filled'
              background-color: var(--lb-fill-#{$color}-hover)
              border-color: var(--lb-border-#{$color}-normal)
              color: var(--lb-text-on-#{$color})
            @else if $variant == 'outline'
              background-color: var(--lb-surface-#{$color}-normal)
              border-color: var(--lb-border-#{$color}-normal)
              @if $color == 'neutral'
                color: var(--lb-text-neutral-contrast-high)
              @else
                color: var(--lb-text-#{$color}-normal)
      
      // When selected, the variant and color styles will apply normally
</style>