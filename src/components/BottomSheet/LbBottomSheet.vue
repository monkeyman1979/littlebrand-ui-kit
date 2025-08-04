<template lang="pug">
Teleport(to="body")
  Transition(
    name="bottom-sheet"
    @enter="onEnter"
    @after-leave="onAfterLeave"
  )
    .lb-bottom-sheet-overlay(
      v-if="modelValue"
      :class="overlayClasses"
      @click="handleBackdropClick"
      tabindex="-1"
      ref="overlayRef"
    )
      .lb-bottom-sheet(
        :class="sheetClasses"
        :style="sheetStyle"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
        @click.stop
        ref="sheetRef"
      )
        //- Drag handle
        .sheet-handle(
          v-if="showHandle"
          @mousedown="handleMouseDown"
          @touchstart="handleTouchStart"
          ref="handleRef"
        )
        
        //- Header slot
        header.sheet-header(v-if="$slots.header")
          slot(name="header")
        
        //- Content area
        .sheet-content(
          :id="contentId"
          ref="contentRef"
        )
          slot
        
        //- Footer slot
        footer.sheet-footer(v-if="$slots.footer")
          slot(name="footer")
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'

// Types
export type BottomSheetState = 'closed' | 'default' | 'expanded'

export interface LbBottomSheetProps {
  modelValue: boolean
  maxHeight?: string
  expandable?: boolean
  swipeable?: boolean
  showHandle?: boolean
  backdropOpacity?: number
  persistent?: boolean
}

// Props
const props = withDefaults(defineProps<LbBottomSheetProps>(), {
  modelValue: false,
  maxHeight: '80vh',
  expandable: true,
  swipeable: true,
  showHandle: true,
  backdropOpacity: 0.5,
  persistent: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'expand': []
  'collapse': []
}>()

// Utils
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`

// Refs
const overlayRef = ref<HTMLElement>()
const sheetRef = ref<HTMLElement>()
const handleRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const titleId = generateId('bottom-sheet-title')
const contentId = generateId('bottom-sheet-content')

// State
const currentState = ref<BottomSheetState>('closed')
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const initialHeight = ref(0)
const velocity = ref(0)
const lastMoveTime = ref(0)
const lastMoveY = ref(0)

// Store original body overflow
let originalBodyOverflow = ''
let originalBodyPaddingRight = ''

// Focus management
const lastFocusedElement = ref<HTMLElement | null>(null)

// Touch/mouse event handlers
const handleTouchStart = (event: TouchEvent) => {
  if (!props.swipeable) return
  
  const touch = event.touches[0]
  startDrag(touch.clientY)
}

const handleMouseDown = (event: MouseEvent) => {
  if (!props.swipeable) return
  
  startDrag(event.clientY)
  
  // Add mouse event listeners
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const startDrag = (y: number) => {
  isDragging.value = true
  startY.value = y
  currentY.value = y
  lastMoveY.value = y
  lastMoveTime.value = Date.now()
  velocity.value = 0
  
  if (sheetRef.value) {
    initialHeight.value = sheetRef.value.getBoundingClientRect().height
  }
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value) return
  
  const touch = event.touches[0]
  updateDrag(touch.clientY)
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  updateDrag(event.clientY)
}

const updateDrag = (y: number) => {
  currentY.value = y
  const deltaY = y - startY.value
  
  // Calculate velocity for momentum
  const now = Date.now()
  const timeDelta = now - lastMoveTime.value
  if (timeDelta > 0) {
    velocity.value = (y - lastMoveY.value) / timeDelta
  }
  lastMoveY.value = y
  lastMoveTime.value = now
  
  // Only allow downward drag or upward when expandable
  if (deltaY > 0 || (props.expandable && deltaY < 0)) {
    // Apply drag with resistance
    const resistance = deltaY > 0 ? 1 : 0.3
    const adjustedDelta = deltaY * resistance
    
    if (sheetRef.value) {
      sheetRef.value.style.transform = `translateY(${Math.max(0, adjustedDelta)}px)`
    }
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  endDrag()
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  
  endDrag()
  
  // Remove mouse event listeners
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const endDrag = () => {
  if (!sheetRef.value) return
  
  const deltaY = currentY.value - startY.value
  const velocityThreshold = 0.5
  const distanceThreshold = 100
  
  // Reset transform
  sheetRef.value.style.transform = ''
  
  // Determine action based on drag distance and velocity
  if (deltaY > distanceThreshold || velocity.value > velocityThreshold) {
    // Dismiss if dragged down significantly or with high downward velocity
    if (currentState.value === 'expanded') {
      currentState.value = 'default'
      emit('collapse')
    } else {
      close()
    }
  } else if (props.expandable && (deltaY < -distanceThreshold || velocity.value < -velocityThreshold)) {
    // Expand if dragged up significantly or with high upward velocity
    if (currentState.value === 'default') {
      currentState.value = 'expanded'
      emit('expand')
    }
  }
  
  isDragging.value = false
  velocity.value = 0
}

// Focus trap
const getFocusableElements = () => {
  if (!overlayRef.value) return []
  
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  return Array.from(overlayRef.value.querySelectorAll(selector)) as HTMLElement[]
}

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return
  
  const elements = getFocusableElements()
  if (elements.length === 0) return
  
  const firstElement = elements[0]
  const lastElement = elements[elements.length - 1]
  const { activeElement } = document
  
  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

// Scroll lock functions
const lockScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  originalBodyOverflow = document.body.style.overflow
  originalBodyPaddingRight = document.body.style.paddingRight
  
  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
}

const unlockScroll = () => {
  document.body.style.overflow = originalBodyOverflow
  document.body.style.paddingRight = originalBodyPaddingRight
}

// Computed
const overlayClasses = computed(() => ({
  [`state-${currentState.value}`]: true,
  'is-dragging': isDragging.value
}))

const sheetClasses = computed(() => ({
  [`state-${currentState.value}`]: true,
  'is-dragging': isDragging.value,
  'expandable': props.expandable
}))

const sheetStyle = computed(() => ({
  '--max-height': props.maxHeight,
  '--backdrop-opacity': props.backdropOpacity
}))

// Get slots
const slots = defineSlots<{
  default(): any
  header(): any
  footer(): any
}>()

// Methods
const close = () => {
  currentState.value = 'closed'
  emit('update:modelValue', false)
}

const expand = () => {
  if (props.expandable && currentState.value === 'default') {
    currentState.value = 'expanded'
    emit('expand')
  }
}

const collapse = () => {
  if (currentState.value === 'expanded') {
    currentState.value = 'default'
    emit('collapse')
  }
}

const handleBackdropClick = (event: MouseEvent) => {
  if (!props.persistent && event.target === overlayRef.value) {
    close()
  }
}

const onEnter = async () => {
  await nextTick()
  
  currentState.value = 'default'
  
  // Store last focused element
  lastFocusedElement.value = document.activeElement as HTMLElement
  
  // Lock scroll
  lockScroll()
  
  // Focus overlay for keyboard events
  overlayRef.value?.focus()
  
  // Set up focus trap
  overlayRef.value?.addEventListener('keydown', trapFocus)
  
  // Set up touch event listeners
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
}

const onAfterLeave = () => {
  currentState.value = 'closed'
  
  // Unlock scroll
  unlockScroll()
  
  // Remove focus trap
  overlayRef.value?.removeEventListener('keydown', trapFocus)
  
  // Remove touch event listeners
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  
  // Restore focus to last focused element
  lastFocusedElement.value?.focus()
}

// Escape key handler
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    event.preventDefault()
    close()
  }
}

// Set up escape key listener when mounted
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

// Clean up on unmount
onBeforeUnmount(() => {
  // Remove escape key listener
  document.removeEventListener('keydown', handleEscapeKey)
  
  // Clean up scroll lock if sheet is open
  if (props.modelValue) {
    unlockScroll()
  }
  
  // Remove all event listeners
  overlayRef.value?.removeEventListener('keydown', trapFocus)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

// Watch modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    currentState.value = 'closed'
  }
})

// Component options
defineOptions({
  name: 'LbBottomSheet',
  inheritAttrs: false
})

// Expose
defineExpose({
  overlayRef,
  sheetRef,
  close,
  expand,
  collapse,
  currentState: () => currentState.value
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

// Overlay (backdrop)
.lb-bottom-sheet-overlay
  position: fixed
  inset: 0
  z-index: var(--z-modal-backdrop)
  background: var(--color-modal-backdrop)
  backdrop-filter: blur(var(--space-xs))
  overflow: hidden
  
  // Use flexbox to position sheet at bottom
  display: flex
  align-items: flex-end
  justify-content: center
  
  &.is-dragging
    pointer-events: none

// Bottom sheet container
.lb-bottom-sheet
  position: relative
  background: var(--color-surface)
  border-radius: var(--radius-xl) var(--radius-xl) 0 0
  box-shadow: var(--shadow-lg)
  width: 100%
  max-width: 100vw
  min-height: 0
  max-height: var(--max-height)
  display: flex
  flex-direction: column
  transform-origin: bottom center
  transition: transform var(--transition), max-height var(--transition)
  
  // Safe area padding for mobile devices
  padding-bottom: env(safe-area-inset-bottom)
  
  &.state-expanded
    max-height: 100vh
    border-radius: 0
    
    .sheet-handle
      opacity: var(--opacity-30)
  
  &.is-dragging
    transition: none
    user-select: none

// Drag handle
.sheet-handle
  position: relative
  display: flex
  align-items: center
  justify-content: center
  height: var(--space-2xl)
  cursor: grab
  flex-shrink: 0
  
  &:before
    content: ''
    width: var(--space-5xl)
    height: var(--space-xs)
    background: var(--color-border-strong)
    border-radius: var(--radius-full)
    opacity: var(--opacity-60)
    transition: opacity var(--transition)
  
  &:hover:before
    opacity: var(--opacity-80)
  
  &:active
    cursor: grabbing
    
    &:before
      opacity: var(--opacity-100)

// Header
.sheet-header
  padding: var(--space-lg) var(--space-2xl) var(--space-md)
  border-bottom: var(--border-sm) solid var(--color-border-subtle)
  flex-shrink: 0

// Content area
.sheet-content
  flex: 1
  overflow-y: auto
  padding: var(--space-2xl)
  color: var(--color-text-secondary)
  min-height: 0
  
  // Adjust padding when no handle
  .lb-bottom-sheet:not(:has(.sheet-handle)) &
    padding-top: var(--space-3xl)

// Footer
.sheet-footer
  padding: var(--space-lg) var(--space-2xl) var(--space-2xl)
  border-top: var(--border-sm) solid var(--color-border-subtle)
  flex-shrink: 0
  
  // Add safe area padding for mobile
  padding-bottom: calc(var(--space-2xl) + env(safe-area-inset-bottom))

// Transitions
.bottom-sheet-enter-active
  transition: opacity var(--transition)

.bottom-sheet-leave-active
  transition: opacity 200ms ease

.bottom-sheet-enter-from,
.bottom-sheet-leave-to
  opacity: var(--opacity-0)
  
.bottom-sheet-enter-active .lb-bottom-sheet
  transition: transform var(--transition)
  
.bottom-sheet-leave-active .lb-bottom-sheet
  transition: transform 200ms ease

.bottom-sheet-enter-from .lb-bottom-sheet
  transform: translateY(100%)
  
.bottom-sheet-leave-to .lb-bottom-sheet
  transform: translateY(100%)

// Responsive adjustments
@media (max-width: 640px)
  .lb-bottom-sheet
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0
    
    &.state-expanded
      border-radius: 0
    
  .sheet-header,
  .sheet-content,
  .sheet-footer
    padding-left: var(--space-lg)
    padding-right: var(--space-lg)

// Reduce motion for accessibility
@media (prefers-reduced-motion: reduce)
  .lb-bottom-sheet-overlay,
  .lb-bottom-sheet,
  .sheet-handle:before
    transition: none
    
  .bottom-sheet-enter-active,
  .bottom-sheet-leave-active,
  .bottom-sheet-enter-active .lb-bottom-sheet,
  .bottom-sheet-leave-active .lb-bottom-sheet
    transition: none
</style>