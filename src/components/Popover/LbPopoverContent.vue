<template lang="pug">
Teleport(to="body")
  Transition(name="popover-fade")
    .lb-popover-content(
      v-if="context?.open"
      ref="contentElement"
      :style="contentStyles"
    )
      slot
</template>

<script setup lang="ts">
import { computed, ref, inject, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import type { PopoverContext } from './LbPopover.vue'

// Inject popover context
const context = inject<PopoverContext>('popoverContext')

if (!context) {
  throw new Error('LbPopoverContent must be used within LbPopover')
}

// Refs
const contentElement = ref<HTMLElement>()
const position = ref({ x: 0, y: 0 })
const previousActiveElement = ref<HTMLElement | null>(null)

// Position styles only - visual styles in CSS
const contentStyles = computed(() => ({
  position: 'fixed',
  top: `${position.value.y}px`,
  left: `${position.value.x}px`
}))

// Calculate position based on placement
const updatePosition = () => {
  if (!context.triggerRef?.value || !contentElement.value) {
    return
  }
  
  const triggerRect = context.triggerRef.value.getBoundingClientRect()
  const contentRect = contentElement.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Get the base placement (top, bottom, left, right)
  const [side, alignment] = context.placement.split('-')
  const offset = context.offset || 8
  
  let x = 0
  let y = 0
  
  // Calculate base position based on placement
  switch (side) {
    case 'top':
      x = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      y = triggerRect.top - contentRect.height - offset
      break
    
    case 'bottom':
    default:
      x = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      y = triggerRect.bottom + offset
      break
    
    case 'left':
      x = triggerRect.left - contentRect.width - offset
      y = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2)
      break
    
    case 'right':
      x = triggerRect.right + offset
      y = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2)
      break
  }
  
  // Apply alignment modifiers
  if (alignment === 'start') {
    if (side === 'top' || side === 'bottom') {
      x = triggerRect.left
    } else {
      y = triggerRect.top
    }
  } else if (alignment === 'end') {
    if (side === 'top' || side === 'bottom') {
      x = triggerRect.right - contentRect.width
    } else {
      y = triggerRect.bottom - contentRect.height
    }
  }
  
  // Collision detection - flip if needed
  const defaultPadding = 8 // Default to 8px (--lb-space-sm equivalent)
  const padding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-sm')) || defaultPadding
  let flipped = false
  
  // Check if we need to flip vertically
  if (side === 'bottom' && y + contentRect.height > viewportHeight - padding) {
    // Try flipping to top
    const topY = triggerRect.top - contentRect.height - offset
    if (topY >= padding) {
      y = topY
      flipped = true
    }
  } else if (side === 'top' && y < padding) {
    // Try flipping to bottom
    const bottomY = triggerRect.bottom + offset
    if (bottomY + contentRect.height <= viewportHeight - padding) {
      y = bottomY
      flipped = true
    }
  }
  
  // Check if we need to flip horizontally
  if (side === 'right' && x + contentRect.width > viewportWidth - padding) {
    // Try flipping to left
    const leftX = triggerRect.left - contentRect.width - offset
    if (leftX >= padding) {
      x = leftX
      flipped = true
    }
  } else if (side === 'left' && x < padding) {
    // Try flipping to right
    const rightX = triggerRect.right + offset
    if (rightX + contentRect.width <= viewportWidth - padding) {
      x = rightX
      flipped = true
    }
  }
  
  // Final boundary checks (clamp to viewport)
  x = Math.max(padding, Math.min(x, viewportWidth - contentRect.width - padding))
  y = Math.max(padding, Math.min(y, viewportHeight - contentRect.height - padding))
  
  position.value = { x, y }
  
  // After positioning, check if either trigger or popover is out of view
  // This happens during scrolling
  const triggerInView = (
    triggerRect.bottom > 0 &&
    triggerRect.top < viewportHeight &&
    triggerRect.right > 0 &&
    triggerRect.left < viewportWidth
  )
  
  const popoverWouldBeInView = (
    y + contentRect.height > 0 &&
    y < viewportHeight &&
    x + contentRect.width > 0 &&
    x < viewportWidth
  )
  
  // Close if trigger scrolled out of view OR popover can't stay in view
  if (!triggerInView || !popoverWouldBeInView) {
    context.handleClose()
    return
  }
}

// Throttle helper for performance
let scrollRafId: number | null = null
let resizeRafId: number | null = null

// Handle scroll and resize events
const handleScroll = () => {
  if (context.open && contentElement.value) {
    // Cancel any pending update
    if (scrollRafId) {
      cancelAnimationFrame(scrollRafId)
    }
    // Schedule update on next animation frame
    scrollRafId = requestAnimationFrame(() => {
      updatePosition()
      scrollRafId = null
    })
  }
}

const handleResize = () => {
  if (context.open && contentElement.value) {
    // Cancel any pending update
    if (resizeRafId) {
      cancelAnimationFrame(resizeRafId)
    }
    // Schedule update on next animation frame
    resizeRafId = requestAnimationFrame(() => {
      updatePosition()
      resizeRafId = null
    })
  }
}

// Focus trapping utilities
const getFocusableElements = (): HTMLElement[] => {
  if (!contentElement.value) return []
  
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'a[href]',
    'area[href]',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex="0"]',
    '.select-trigger:not([aria-disabled="true"])',
    '.day:not([disabled])'
  ].join(',')
  
  return Array.from(contentElement.value.querySelectorAll(focusableSelectors))
}

const handleKeydownForFocusTrap = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !context.open || !context.trapFocus) return
  
  const focusableElements = getFocusableElements()
  if (focusableElements.length === 0) return
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  const activeElement = document.activeElement as HTMLElement
  
  if (event.shiftKey) {
    // Shift+Tab: Move focus backward
    if (activeElement === firstElement || !contentElement.value?.contains(activeElement)) {
      event.preventDefault()
      lastElement.focus()
    }
  } else {
    // Tab: Move focus forward
    if (activeElement === lastElement || !contentElement.value?.contains(activeElement)) {
      event.preventDefault()
      firstElement.focus()
    }
  }
}

const setInitialFocus = () => {
  if (!contentElement.value) return
  
  // Look for an element with autofocus or the first focusable element
  const autofocusElement = contentElement.value.querySelector('[autofocus]') as HTMLElement
  if (autofocusElement) {
    autofocusElement.focus()
    return
  }
  
  const focusableElements = getFocusableElements()
  if (focusableElements.length > 0) {
    // For DatePicker, try to focus the first navigation button or select
    const firstButton = contentElement.value.querySelector('button:not([disabled])') as HTMLElement
    if (firstButton) {
      firstButton.focus()
    } else {
      focusableElements[0].focus()
    }
  }
}

const restoreFocus = () => {
  if (previousActiveElement.value && 'focus' in previousActiveElement.value) {
    previousActiveElement.value.focus()
  }
}

// Simple position update
watch(() => context.open, async (isOpen) => {
  if (isOpen) {
    // Store the currently focused element if focus trapping is enabled
    if (context.trapFocus) {
      previousActiveElement.value = document.activeElement as HTMLElement
    }
    
    await nextTick()
    updatePosition()
    // Register content element after it's positioned
    if (contentElement.value && context.contentRef) {
      context.contentRef.value = contentElement.value
    }
    
    // Set initial focus after a small delay to ensure DOM is ready (only if focus trapping is enabled)
    if (context.trapFocus) {
      setTimeout(() => {
        setInitialFocus()
      }, 50)
    }
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    if (context.trapFocus) {
      document.addEventListener('keydown', handleKeydownForFocusTrap)
    }
  } else {
    // Remove event listeners
    window.removeEventListener('scroll', handleScroll, true)
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('keydown', handleKeydownForFocusTrap)
    
    // Restore focus to the trigger element (only if focus trapping was enabled)
    if (context.trapFocus) {
      restoreFocus()
    }
  }
})

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  if (!context.open || !contentElement.value) return
  
  const target = event.target as Node
  const targetElement = target as HTMLElement
  
  // Check if click is on a dropdown element (Select dropdowns are teleported to body)
  // or on a select trigger (month/year selects in calendar)
  const isDropdownClick = targetElement.closest('.dropdown-content') !== null
  const isSelectClick = targetElement.closest('.lb-select') !== null
  
  if (isDropdownClick || isSelectClick) {
    return // Don't close popover for dropdown/select clicks
  }
  
  // Check if click is outside the content element
  if (!contentElement.value.contains(target)) {
    // Also check if it's not the trigger element
    if (context.triggerRef?.value && !context.triggerRef.value.contains(target)) {
      context.handleClose()
    }
  }
}

// Setup click outside listener
watch(() => context.open, (isOpen) => {
  if (isOpen) {
    // Add listener after a small delay to avoid immediate close
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true)
    }, 10)
  } else {
    document.removeEventListener('click', handleClickOutside, true)
  }
})

// Cleanup
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('keydown', handleKeydownForFocusTrap)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
  if (context.contentRef && context.contentRef.value === contentElement.value) {
    context.contentRef.value = null
  }
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-popover-content
  // Layout
  width: max-content
  min-width: 12.5rem // 200px
  max-width: min(90vw, 32rem) // 512px
  padding: base.$space-md
  
  // Visual
  background: var(--lb-surface-base)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-md
  box-shadow: base.$shadow-lg
  
  // Positioning
  z-index: base.$z-dropdown
  
  overflow: auto
  max-height: calc(100vh - calc(#{base.$space-xl} * 2))

// Transition classes for fade animation
.popover-fade-enter-active,
.popover-fade-leave-active
  transition: opacity base.$transition

.popover-fade-enter-from,
.popover-fade-leave-to
  opacity: 0
</style>