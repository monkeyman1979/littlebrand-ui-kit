<template lang="pug">
.lb-snackbar(
  :class="snackbarClasses"
  :style="snackbarStyles"
  role="alert"
  :aria-live="variant === 'error' ? 'assertive' : 'polite'"
  :aria-label="message"
  @click="handleSnackbarClick"
  @touchstart="handleTouchStart"
  @touchmove="handleTouchMove"
  @touchend="handleTouchEnd"
)
  
  //- Content container with flexbox wrapping
  .snackbar-content
    //- Message text
    span.snackbar-message {{ message }}
    
    //- Action button (inline when space permits)
    lb-button.snackbar-action(
      v-if="action"
      variant="ghost"
      :color="actionColor"
      size="small"
      @click.stop="handleActionClick"
    ) {{ action.label }}
    
    //- Close button (only show when no action)
    lb-button.snackbar-close(
      v-if="!action"
      variant="ghost"
      :color="closeButtonColor"
      size="small"
      icon-only
      @click.stop="handleDismiss"
      aria-label="Close notification"
    )
      template(#icon-leading)
        svg(viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg")
          path(d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import LbButton from '../Buttons/Button/LbButton.vue'
import type { SnackbarVariant, SnackbarAction } from './types'

// Props
const props = withDefaults(defineProps<{
  id: string
  message: string
  variant?: SnackbarVariant
  duration?: number
  action?: SnackbarAction
  persistent?: boolean
}>(), {
  variant: 'default',
  duration: 5000,
  persistent: false
})

// Emits
const emit = defineEmits<{
  dismiss: [id: string]
}>()

// State
const touchStartX = ref(0)
const touchCurrentX = ref(0)
const isDragging = ref(false)

// Computed
const snackbarClasses = computed(() => [
  `variant-${props.variant}`,
  {
    'has-action': !!props.action,
    'dragging': isDragging.value
  }
])

const snackbarStyles = computed(() => {
  const translateX = isDragging.value ? `${touchCurrentX.value - touchStartX.value}px` : '0px'
  return {
    transform: `translateX(${translateX})`
  }
})

const showIcon = computed(() => props.variant !== 'default')

const actionColor = computed(() => {
  switch (props.variant) {
    case 'success': return 'success'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'primary'
  }
})

const closeButtonColor = computed(() => {
  // Use a neutral color that works on all variant backgrounds
  return props.variant === 'default' ? 'primary' : actionColor.value
})

// Methods
const handleDismiss = () => {
  emit('dismiss', props.id)
}

const handleActionClick = () => {
  if (props.action) {
    props.action.handler()
    handleDismiss()
  }
}

const handleSnackbarClick = () => {
  // Dismiss on click if no action
  if (!props.action && !props.persistent) {
    handleDismiss()
  }
}

// Touch handlers for swipe-to-dismiss
const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
  touchCurrentX.value = touchStartX.value
  isDragging.value = false
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value) {
    isDragging.value = true
  }
  touchCurrentX.value = event.touches[0].clientX
}

const handleTouchEnd = () => {
  const deltaX = touchCurrentX.value - touchStartX.value
  const threshold = 100 // This is fine as a gesture threshold in pixels
  
  if (Math.abs(deltaX) > threshold) {
    handleDismiss()
  } else {
    // Reset position
    isDragging.value = false
    touchCurrentX.value = touchStartX.value
  }
}

// Component options
defineOptions({
  name: 'LbSnackbar'
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-snackbar
  position: relative
  display: flex
  align-items: stretch
  width: min(31.25rem, 90%)
  min-height: var(--size-2xl)
  padding: var(--space-md) var(--space-lg)
  background-color: var(--color-surface-raised)
  border: var(--border-sm) solid var(--color-border)
  border-radius: var(--radius-sm)
  box-shadow: var(--shadow-lg)
  pointer-events: auto
  overflow: hidden
  transition: transform 200ms ease-out
  cursor: pointer
  
  // Safe area support for mobile
  @supports (padding: env(safe-area-inset-bottom))
    padding-bottom: max(var(--space-md), env(safe-area-inset-bottom))
  
  &.dragging
    transition: none
  


.snackbar-content
  display: flex
  align-items: flex-start
  flex-wrap: wrap
  gap: var(--space-sm)
  width: 100%
  position: relative

.snackbar-message
  flex: 1 1 auto
  font-size: var(--font-size-label-base)
  font-weight: var(--font-weight-normal)
  line-height: var(--line-height-normal)
  color: var(--color-text)
  word-wrap: break-word
  align-self: center

.snackbar-action
  flex: 0 0 auto
  align-self: flex-end
  margin-left: auto
  // When wrapping occurs, action button aligns to bottom-right

.snackbar-close
  flex: 0 0 auto
  margin-left: auto // Push to the right
  align-self: center

// Variant styles
.lb-snackbar
  // Default variant
  &.variant-default
    background-color: var(--color-surface-raised)
    border-color: var(--color-border)
  
  // Success variant
  &.variant-success
    background-color: var(--color-success-3)
    border-color: var(--color-success-border)
  
  // Error variant
  &.variant-error
    background-color: var(--color-error-3)
    border-color: var(--color-error-border)
  
  // Warning variant
  &.variant-warning
    background-color: var(--color-warning-3)
    border-color: var(--color-warning-border)
    
    .snackbar-message
      color: var(--color-warning-text)
  
  // Info variant
  &.variant-info
    background-color: var(--color-info-3)
    border-color: var(--color-info-border)

// Dark mode adjustments
[data-theme="dark"]
  .lb-snackbar
    background-color: var(--color-surface-raised)
    
    &.variant-success
      background-color: var(--color-success-3)
    
    &.variant-error
      background-color: var(--color-error-3)
    
    &.variant-warning
      background-color: var(--color-warning-3)
    
    &.variant-info
      background-color: var(--color-info-3)
</style>