<template lang="pug">
Teleport(to="body")
  Transition(
    name="dialog"
    @enter="onEnter"
    @after-leave="onAfterLeave"
  )
    .lb-dialog-overlay(
      v-if="modelValue"
      :class="overlayClasses"
      @click="handleBackdropClick"
      tabindex="-1"
      ref="overlayRef"
    )
      .lb-dialog(
        :class="dialogClasses"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
        @click.stop
      )
        //- Header only for fullscreen variant
        header.dialog-header(v-if="hasHeader && props.variant === 'fullscreen'")
          .header-content
            slot(name="header")
              h3.dialog-title(v-if="title" :id="titleId") {{ title }}
        
        //- Close button (absolute positioned)
        LbButton.dialog-close(
          v-if="showClose"
          icon-only
          variant="ghost"
          color="neutral"
          size="small"
          @click="close"
          aria-label="Close dialog"
        )
          template(#icon-leading)
            svg(
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            )
              path(d="M18 6L6 18M6 6l12 12")
        
        .dialog-content(:id="contentId")
          slot
        
        footer.dialog-footer(v-if="$slots.footer")
          slot(name="footer")
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onBeforeUnmount, onMounted } from 'vue'
import LbButton from '@/components/Buttons/Button/LbButton.vue'

// Types
export type DialogVariant = 'default' | 'fullscreen'

export interface LbDialogProps {
  modelValue: boolean
  title?: string
  variant?: DialogVariant
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

// Props
const props = withDefaults(defineProps<LbDialogProps>(), {
  modelValue: false,
  variant: 'default',
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}>()

// Utils
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`

// Refs
const overlayRef = ref<HTMLElement>()
const titleId = generateId('dialog-title')
const contentId = generateId('dialog-content')

// Store original body overflow
let originalBodyOverflow = ''
let originalBodyPaddingRight = ''

// Focus management
const lastFocusedElement = ref<HTMLElement | null>(null)

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
  [`variant-${props.variant}`]: true
}))

const dialogClasses = computed(() => ({
  [`variant-${props.variant}`]: true
}))

const hasHeader = computed(() => props.title || !!slots.header)

// Get slots
const slots = defineSlots<{
  default(): any
  header(): any
  footer(): any
}>()

// Methods
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (props.closeOnBackdrop && event.target === overlayRef.value) {
    close()
  }
}


const onEnter = async () => {
  await nextTick()
  
  // Store last focused element
  lastFocusedElement.value = document.activeElement as HTMLElement
  
  // Lock scroll
  lockScroll()
  
  // Focus overlay for keyboard events
  overlayRef.value?.focus()
  
  // Set up focus trap
  overlayRef.value?.addEventListener('keydown', trapFocus)
  
  emit('open')
}

const onAfterLeave = () => {
  // Unlock scroll
  unlockScroll()
  
  // Remove focus trap
  overlayRef.value?.removeEventListener('keydown', trapFocus)
  
  // Restore focus to last focused element
  lastFocusedElement.value?.focus()
}

// Escape key handler
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.modelValue) {
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
  
  // Clean up scroll lock if dialog is open
  if (props.modelValue) {
    unlockScroll()
  }
  
  // Remove focus trap listener if still attached
  overlayRef.value?.removeEventListener('keydown', trapFocus)
})

// Component options
defineOptions({
  name: 'LbDialog',
  inheritAttrs: false
})

// Expose
defineExpose({
  overlayRef,
  close
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

// Overlay (backdrop)
.lb-dialog-overlay
  position: fixed
  inset: 0
  z-index: var(--z-modal-backdrop)
  background: var(--color-modal-backdrop)
  backdrop-filter: blur(2px)
  overflow-y: auto
  -webkit-overflow-scrolling: touch
  
  // Center the dialog using CSS Grid
  display: grid
  place-items: center
  padding: var(--lb-space-2xl)
  
  // Full-screen variant removes padding
  &.variant-fullscreen
    padding: 0

// Dialog container
.lb-dialog
  position: relative
  background: var(--lb-background-surface)
  border-radius: var(--lb-radius-xl)
  box-shadow: var(--lb-shadow-lg)
  max-width: min(90vw, 32rem)
  width: 100%
  max-height: min(90vh, 48rem)
  display: flex
  flex-direction: column
  
  // Full-screen variant
  &.variant-fullscreen
    max-width: 100%
    width: 100%
    height: 100vh
    max-height: 100vh
    border-radius: 0

// Dialog header (only for fullscreen)
.dialog-header
  display: flex
  align-items: center
  gap: var(--lb-space-lg)
  padding: var(--lb-space-2xl)
  flex-shrink: 0
  
  .header-content
    flex: 1
    min-width: 0 // Allow text truncation if needed

// Close button positioning
.dialog-close
  position: absolute
  top: var(--lb-space-sm)
  right: var(--lb-space-sm)
  z-index: 1
    
  // Adjust position for fullscreen variant
  .lb-dialog.variant-fullscreen &
    top: var(--lb-space-lg)
    right: var(--lb-space-lg)

// Dialog content
.dialog-content
  flex: 1
  overflow-y: auto
  padding: var(--lb-space-3xl) var(--lb-space-2xl) var(--lb-space-2xl) var(--lb-space-2xl)
  color: var(--lb-text-neutral-contrast-low)
  
  // Adjust padding when fullscreen with header
  .lb-dialog.variant-fullscreen:has(.dialog-header) &
    padding-top: 0

// Dialog footer
.dialog-footer
  display: flex
  align-items: center
  justify-content: flex-end
  gap: var(--lb-space-sm)
  padding: var(--lb-space-lg)
  padding-top: 0
  flex-shrink: 0
  
  // Add top spacing if there's content
  .dialog-content + &
    padding-top: var(--lb-space-lg)

// Transitions
.dialog-enter-active
  transition: opacity var(--lb-transition)

.dialog-leave-active
  transition: opacity 200ms ease

.dialog-enter-from,
.dialog-leave-to
  opacity: var(--lb-opacity-0)
  
.dialog-enter-active .lb-dialog
  transition: transform var(--lb-transition), opacity var(--lb-transition)
  
.dialog-leave-active .lb-dialog
  transition: transform 200ms ease, opacity 200ms ease

.dialog-enter-from .lb-dialog
  opacity: var(--lb-opacity-0)
  transform: scale(0.95) translateY(var(--lb-space-sm))
  
.dialog-leave-to .lb-dialog
  opacity: var(--lb-opacity-0)
  transform: scale(0.95) translateY(var(--lb-space-sm))

// Responsive adjustments
@media (max-width: 640px)
  .lb-dialog-overlay
    padding: var(--lb-space-lg)
    
  .lb-dialog
    max-width: 100%
    
  .dialog-header,
  .dialog-content,
  .dialog-footer
    padding-left: var(--lb-space-lg)
    padding-right: var(--lb-space-lg)
</style>