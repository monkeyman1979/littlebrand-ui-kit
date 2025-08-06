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
  padding: var(--lb-space-md) var(--lb-space-lg)
  background-color: var(--lb-background-surface-raised)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  border-radius: var(--lb-radius-sm)
  box-shadow: var(--lb-shadow-lg)
  pointer-events: auto
  overflow: hidden
  transition: transform 200ms ease-out
  cursor: pointer
  
  // Safe area support for mobile
  @supports (padding: env(safe-area-inset-bottom))
    padding-bottom: max(var(--lb-space-md), env(safe-area-inset-bottom))
  
  &.dragging
    transition: none
  


.snackbar-content
  display: flex
  align-items: flex-start
  flex-wrap: wrap
  gap: var(--lb-space-sm)
  width: 100%
  position: relative

.snackbar-message
  flex: 1 1 auto
  font-size: var(--lb-font-size-label-base)
  font-weight: var(--lb-font-weight-normal)
  line-height: var(--lb-line-height-normal)
  color: var(--lb-text-neutral-contrast-high)
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
    background-color: var(--lb-background-surface-raised)
    border-color: var(--lb-border-neutral-line)
  
  // Success variant
  &.variant-success
    background-color: var(--lb-surface-success-subtle)
    border-color: var(--lb-border-success-normal)
    
    .snackbar-message
      color: var(--lb-text-success-normal)
  
  // Error variant
  &.variant-error
    background-color: var(--lb-surface-error-subtle)
    border-color: var(--lb-border-error-normal)
    
    .snackbar-message
      color: var(--lb-text-error-normal)
  
  // Warning variant
  &.variant-warning
    background-color: var(--lb-surface-warning-subtle)
    border-color: var(--lb-border-warning-normal)
    
    .snackbar-message
      color: var(--lb-text-warning-normal)
  
  // Info variant
  &.variant-info
    background-color: var(--lb-surface-info-subtle)
    border-color: var(--lb-border-info-normal)
    
    .snackbar-message
      color: var(--lb-text-info-normal)

// Dark mode adjustments are handled by the token system
</style>