<template lang="pug">
.lb-popover(:class="popoverClasses")
  slot
</template>

<script lang="ts">
// Global registry for managing open popovers (module scope)
const openPopovers = new Set<() => void>()
</script>

<script setup lang="ts">
import { computed, provide, ref, reactive, onBeforeUnmount, onMounted, watch } from 'vue'
import type { Ref } from 'vue'

// Types
export type PopoverPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

export interface LbPopoverProps {
  open?: boolean
  placement?: PopoverPlacement
  offset?: number
  showArrow?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  disabled?: boolean
}

export interface PopoverContext {
  open: boolean
  placement: PopoverPlacement
  offset: number
  showArrow: boolean
  disabled: boolean
  triggerRef: Ref<HTMLElement | null>
  contentRef: Ref<HTMLElement | null>
  arrowRef: Ref<HTMLElement | null>
  handleTriggerClick: () => void
  handleClose: () => void
  updatePosition: () => void
  isPositioned: boolean
}

// Props
const props = withDefaults(defineProps<LbPopoverProps>(), {
  open: false,
  placement: 'bottom',
  offset: 8, // Matches var(--lb-space-sm)
  showArrow: true,
  closeOnClickOutside: true,
  closeOnEscape: true,
  disabled: false
})

// Emits
const emit = defineEmits<{
  'update:open': [value: boolean]
  'open': []
  'close': []
}>()

// Refs for trigger, content, and arrow elements
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)

// State
const isPositioned = ref(false)

// Computed
const popoverClasses = computed(() => ({
  'is-open': props.open,
  'is-disabled': props.disabled,
  [`placement-${props.placement}`]: true
}))

// Methods
const handleTriggerClick = () => {
  if (props.disabled) return
  
  const newOpen = !props.open
  
  if (newOpen) {
    // Close all other open popovers
    openPopovers.forEach(closeFunc => closeFunc())
    openPopovers.clear()
  }
  
  emit('update:open', newOpen)
  
  if (newOpen) {
    emit('open')
  } else {
    emit('close')
  }
}

const handleClose = () => {
  if (!props.open) return
  
  emit('update:open', false)
  emit('close')
}

// Position calculation using browser-native positioning
const updatePosition = () => {
  if (!triggerRef.value || !contentRef.value || !props.open) {
    isPositioned.value = false
    return
  }

  const trigger = triggerRef.value
  const content = contentRef.value
  const arrow = arrowRef.value

  const triggerRect = trigger.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const scrollX = window.scrollX
  const scrollY = window.scrollY

  let x = 0
  let y = 0
  let arrowX = 0
  let arrowY = 0

  // Calculate base position based on placement
  switch (props.placement.split('-')[0]) {
    case 'top':
      x = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      y = triggerRect.top - contentRect.height - props.offset
      arrowX = contentRect.width / 2
      arrowY = contentRect.height
      break
    
    case 'bottom':
      x = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      y = triggerRect.bottom + props.offset
      arrowX = contentRect.width / 2
      arrowY = 0
      break
    
    case 'left':
      x = triggerRect.left - contentRect.width - props.offset
      y = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2)
      arrowX = contentRect.width
      arrowY = contentRect.height / 2
      break
    
    case 'right':
      x = triggerRect.right + props.offset
      y = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2)
      arrowX = 0
      arrowY = contentRect.height / 2
      break
  }

  // Apply alignment modifiers
  if (props.placement.includes('-start')) {
    if (props.placement.startsWith('top') || props.placement.startsWith('bottom')) {
      x = triggerRect.left
      arrowX = Math.min(triggerRect.width / 2, contentRect.width - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg')) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg'))))
    } else {
      y = triggerRect.top
      arrowY = Math.min(triggerRect.height / 2, contentRect.height - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg')) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg'))))
    }
  } else if (props.placement.includes('-end')) {
    if (props.placement.startsWith('top') || props.placement.startsWith('bottom')) {
      x = triggerRect.right - contentRect.width
      arrowX = Math.max(contentRect.width - triggerRect.width / 2, (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg')) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg'))))
    } else {
      y = triggerRect.bottom - contentRect.height
      arrowY = Math.max(contentRect.height - triggerRect.height / 2, (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg')) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-lg'))))
    }
  }

  // Viewport collision detection and adjustment
  const padding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-sm')) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lb-space-sm'))
  
  // Horizontal bounds checking
  if (x < padding) {
    x = padding
  } else if (x + contentRect.width > viewportWidth - padding) {
    x = viewportWidth - contentRect.width - padding
  }
  
  // Vertical bounds checking
  if (y < padding) {
    y = padding
  } else if (y + contentRect.height > viewportHeight - padding) {
    y = viewportHeight - contentRect.height - padding
  }

  // Apply final position with scroll offset
  content.style.left = `${x + scrollX}px`
  content.style.top = `${y + scrollY}px`
  
  // Position arrow if present
  if (arrow && props.showArrow) {
    arrow.style.left = `${arrowX}px`
    arrow.style.top = `${arrowY}px`
  }

  isPositioned.value = true
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (!props.closeOnClickOutside || !props.open) return
  
  const target = event.target as Node
  const targetElement = target as HTMLElement
  const trigger = triggerRef.value
  const content = contentRef.value
  
  // Check if click is on a dropdown element (Select dropdowns are teleported to body)
  const isDropdownClick = targetElement.closest('.dropdown-content') !== null
  const isSelectClick = targetElement.closest('.lb-select') !== null
  
  if (isDropdownClick || isSelectClick) {
    return // Don't close popover for dropdown/select interactions
  }
  
  // Check if click is outside both trigger and content
  const isOutsideTrigger = !trigger || !trigger.contains(target)
  const isOutsideContent = !content || !content.contains(target)
  
  if (isOutsideTrigger && isOutsideContent) {
    handleClose()
  }
}

// Escape key handler
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.open) {
    event.preventDefault()
    handleClose()
  }
}

// Provide context to child components - don't use reactive to preserve refs
const popoverContext = {
  get open() { return props.open },
  get placement() { return props.placement },
  get offset() { return props.offset },
  get showArrow() { return props.showArrow },
  get disabled() { return props.disabled },
  triggerRef,
  contentRef,
  arrowRef,
  handleTriggerClick,
  handleClose,
  updatePosition,
  get isPositioned() { return isPositioned.value }
}

provide('popoverContext', popoverContext)

// Set up event listeners
let clickOutsideCleanup: (() => void) | null = null
let escapeKeyCleanup: (() => void) | null = null

const setupEventListeners = () => {
  // Click outside listener
  document.addEventListener('mousedown', handleClickOutside, true)
  clickOutsideCleanup = () => {
    document.removeEventListener('mousedown', handleClickOutside, true)
  }

  // Escape key listener
  document.addEventListener('keydown', handleEscapeKey)
  escapeKeyCleanup = () => {
    document.removeEventListener('keydown', handleEscapeKey)
  }
}

const cleanupEventListeners = () => {
  clickOutsideCleanup?.()
  escapeKeyCleanup?.()
  clickOutsideCleanup = null
  escapeKeyCleanup = null
}

// Initialize event listeners
setupEventListeners()

// Register/unregister from global registry
const registerPopover = () => {
  openPopovers.add(handleClose)
}

const unregisterPopover = () => {
  openPopovers.delete(handleClose)
}

// Watch for open state changes to manage registry
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    registerPopover()
  } else {
    unregisterPopover()
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  cleanupEventListeners()
  unregisterPopover()
})

// Component options
defineOptions({
  name: 'LbPopover',
  inheritAttrs: false
})

// Expose
defineExpose({
  triggerRef,
  contentRef,
  arrowRef,
  updatePosition,
  handleClose
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-popover
  position: relative
  display: inline-block

  &.is-disabled
    pointer-events: none
    opacity: var(--lb-opacity-60)
</style>