<template lang="pug">
.lb-dropdown(ref="dropdownRef")
  .dropdown-trigger(
    ref="triggerRef"
    @click="handleTriggerClick"
    :aria-expanded="isOpen"
    :aria-haspopup="true"
  )
    slot(name="trigger")
  
  Teleport(to="body")
    Transition(name="dropdown-fade")
      .dropdown-content(
        v-if="isOpen"
        ref="contentRef"
        :style="contentStyles"
        @click.stop
        @keydown="handleKeyDown"
        @wheel="handleWheel"
      )
        slot(name="content")
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface LbDropdownProps {
  modelValue?: boolean
  matchWidth?: boolean
  placement?: 'bottom' | 'top' | 'auto'
  disabled?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<LbDropdownProps>(), {
  modelValue: false,
  matchWidth: false,
  placement: 'bottom',
  disabled: false,
  closeOnClickOutside: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
}>()

// Refs
const dropdownRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const isOpen = ref(props.modelValue)
const position = ref({ top: 0, left: 0, width: 'auto' })

// Computed
const contentStyles = computed(() => ({
  position: 'fixed',
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  width: props.matchWidth ? `${position.value.width}` : 'auto',
  zIndex: 1000  // High z-index for dropdown to appear above other elements
}))

// Methods
const handleTriggerClick = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const updatePosition = () => {
  if (!triggerRef.value || !contentRef.value) return
  
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  const dropdownOffset = 8 // Using 8px for dropdown offset (--lb-space-sm)
  let top = triggerRect.bottom + dropdownOffset
  let left = triggerRect.left
  let placement = props.placement
  
  // Auto placement
  if (placement === 'auto') {
    const spaceBelow = viewportHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top
    placement = spaceBelow < contentRect.height && spaceAbove > spaceBelow ? 'top' : 'bottom'
  }
  
  // Calculate position
  if (placement === 'top') {
    top = triggerRect.top - contentRect.height - dropdownOffset
  } else if (placement === 'bottom' && top + contentRect.height > viewportHeight) {
    // Flip to top if not enough space
    top = triggerRect.top - contentRect.height - dropdownOffset
  }
  
  // Check if trigger scrolled out of view OR dropdown can't stay in view
  const triggerInView = (
    triggerRect.bottom > 0 &&
    triggerRect.top < viewportHeight &&
    triggerRect.right > 0 &&
    triggerRect.left < viewportWidth
  )
  
  const dropdownWouldBeInView = (
    top + contentRect.height > 0 &&
    top < viewportHeight &&
    left + contentRect.width > 0 &&
    left < viewportWidth
  )
  
  // Close if trigger scrolled out of view OR dropdown can't stay in view
  if (!triggerInView || !dropdownWouldBeInView) {
    isOpen.value = false
    return
  }
  
  position.value = {
    top,
    left,
    width: `${triggerRect.width}px`
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (!dropdownRef.value?.contains(event.target as Node) && 
      !contentRef.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    isOpen.value = false
    triggerRef.value?.focus()
  }
}

const handleWheel = (event: WheelEvent) => {
  const element = contentRef.value
  if (!element) return
  
  const { scrollTop, scrollHeight, clientHeight } = element
  const isAtTop = scrollTop === 0
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
  
  // Prevent scroll propagation when at boundaries
  // Scrolling up while at top
  if (isAtTop && event.deltaY < 0) {
    event.preventDefault()
    return
  }
  
  // Scrolling down while at bottom
  if (isAtBottom && event.deltaY > 0) {
    event.preventDefault()
    return
  }
}

// Throttle helper for performance
let scrollRafId: number | null = null
let resizeRafId: number | null = null

// Handle scroll and resize events
const handleScroll = () => {
  if (isOpen.value && contentRef.value) {
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
  if (isOpen.value && contentRef.value) {
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

// Watchers
watch(isOpen, async (newValue) => {
  emit('update:modelValue', newValue)
  if (newValue) {
    emit('open')
    await nextTick()
    updatePosition()
    
    // Add scroll and resize listeners
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    
    if (props.closeOnClickOutside) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 10)
    }
  } else {
    emit('close')
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', handleScroll, true)
    window.removeEventListener('resize', handleResize)
  }
})

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
})

// Lifecycle
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)
})

defineOptions({
  name: 'LbDropdown'
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-dropdown
  display: inline-block
  position: relative

.dropdown-trigger
  cursor: pointer
  
  &[aria-disabled="true"]
    cursor: not-allowed
    opacity: base.$opacity-60

.dropdown-content
  background: var(--lb-surface-base)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-lg
  box-shadow: base.$shadow-lg
  overflow-y: auto
  overflow-x: hidden
  max-height: 17rem // 272px
  // Prevent scroll chaining to parent
  overscroll-behavior-y: contain
  // Width is either matched to trigger or content-based
  width: max-content
  min-width: min-content // Allow content to determine minimum width
  max-width: min(90vw, 30rem) // Prevent overflow on small screens

// Transition
.dropdown-fade-enter-active,
.dropdown-fade-leave-active
  transition: opacity base.$transition, transform base.$transition

.dropdown-fade-enter-from,
.dropdown-fade-leave-to
  opacity: 0
  transform: translateY(-0.25rem) // -4px
</style>