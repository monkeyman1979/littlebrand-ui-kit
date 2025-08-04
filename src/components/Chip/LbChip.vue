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
    svg(viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
      path(d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor")
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

// Types
type Variant = 'assist' | 'filter' | 'input' | 'suggestion'
type Size = 'small' | 'medium' | 'large'

// Props
const props = withDefaults(defineProps<{
  variant?: Variant
  selected?: boolean
  disabled?: boolean
  clickable?: boolean
  deletable?: boolean
  size?: Size
  hasDropdown?: boolean
}>(), {
  variant: 'assist',
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
  gap: var(--space-xs)
  border: var(--border-sm) solid var(--color-border)
  border-radius: var(--radius-sm)
  font-family: var(--font-body)
  font-weight: var(--font-weight-medium)
  line-height: var(--line-height-compact)
  letter-spacing: var(--letter-spacing-tight)
  cursor: pointer
  transition: all var(--transition)
  text-decoration: none
  white-space: nowrap
  user-select: none
  outline: none
  background-color: var(--color-surface)
  color: var(--color-text)
  
  &:focus-visible
    outline: var(--focus-ring-width) solid var(--color-focus-ring)
    outline-offset: var(--focus-ring-offset)
    transition: none
  
  // Fixed height of 32px for all chips
  height: 2rem
  padding: 0 var(--space-md)
  font-size: var(--font-size-label-base)
  gap: var(--space-xs)
  
  &.has-leading-icon
    padding-left: var(--space-sm)
    
  &.has-trailing-icon
    padding-right: var(--space-sm)
  
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
    border-color: var(--color-border)
    background-color: var(--color-surface)
    color: var(--color-text)
    
    &:hover:not(.disabled)
      background-color: var(--color-primary-a3)
      border-color: var(--color-primary)
      color: var(--color-primary)
      box-shadow: var(--shadow-sm)
      
    &:active:not(.disabled)
      background-color: var(--color-primary-a4)
      transform: translateY(1px)
  
  &.variant-filter
    border-color: var(--color-border)
    background-color: var(--color-surface)
    color: var(--color-text)
    
    &:hover:not(.disabled)
      background-color: var(--color-primary-a3)
      border-color: var(--color-primary)
      color: var(--color-primary)
      
    &.selected
      background-color: var(--color-primary-a4)
      border-color: var(--color-primary)
      color: var(--color-primary)
      
      &:hover:not(.disabled)
        background-color: var(--color-primary-a5)
  
  &.variant-input
    background-color: var(--color-primary-a3)
    border-color: var(--color-primary)
    color: var(--color-primary)
    
    &:hover:not(.disabled)
      background-color: var(--color-primary-a4)
      box-shadow: var(--shadow-sm)
      
    &:active:not(.disabled)
      background-color: var(--color-primary-a5)
  
  &.variant-suggestion
    border-color: var(--color-border-subtle)
    background-color: var(--color-surface)
    color: var(--color-text-secondary)
    
    &:hover:not(.disabled)
      background-color: var(--color-surface-raised)
      border-color: var(--color-border)
      color: var(--color-text)
      box-shadow: var(--shadow-sm)
      
    &:active:not(.disabled)
      background-color: var(--color-primary-a3)
      border-color: var(--color-primary)
      color: var(--color-primary)
  
  // Disabled state
  &.disabled
    cursor: not-allowed
    opacity: var(--opacity-60)
    
    &:hover
      background-color: var(--color-surface)
      border-color: var(--color-border)
      color: var(--color-text-disabled)
      box-shadow: none
      transform: none
  
  // Non-clickable chips
  &:not(.clickable)
    cursor: default
    
    &:hover
      background-color: var(--color-surface)
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
      fill: currentColor
  
  .icon-selected
    color: var(--color-primary)
  
  .icon-dropdown
    opacity: var(--opacity-70)
    
    .lb-chip:hover:not(.disabled) &
      opacity: var(--opacity-100)
  
  // Content
  .content
    display: flex
    align-items: center
    flex: 1
    min-width: 0
    overflow: hidden
    text-overflow: ellipsis
    padding: 0 var(--space-xs)
  
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
    padding: var(--space-2xs)
    margin: calc(var(--space-2xs) * -1)
    border-radius: var(--radius-full)
    transition: all var(--transition-fast)
    opacity: var(--opacity-70)
    
    &:hover:not(:disabled)
      opacity: var(--opacity-100)
      background-color: var(--color-error-a3)
      color: var(--color-error)
      
    &:active:not(:disabled)
      background-color: var(--color-error-a4)
      transform: scale(0.95)
      
    &:disabled
      cursor: not-allowed
      opacity: var(--opacity-40)
    
    svg
      display: block
      fill: currentColor
</style>