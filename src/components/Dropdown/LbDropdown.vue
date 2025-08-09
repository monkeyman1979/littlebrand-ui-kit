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
        @keydown="handleKeyDown"
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
  zIndex: 'var(--lb-z-dropdown)'
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
  
  let top = triggerRect.bottom + 8 // 0.5rem gap
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
    top = triggerRect.top - contentRect.height - 8
  } else if (placement === 'bottom' && top + contentRect.height > viewportHeight) {
    // Flip to top if not enough space
    top = triggerRect.top - contentRect.height - 8
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
    opacity: var(--lb-opacity-60)

.dropdown-content
  background: var(--lb-background-surface)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-normal)
  border-radius: var(--lb-radius-lg)
  box-shadow: var(--lb-shadow-lg)
  overflow-y: auto
  overflow-x: hidden
  max-height: 20rem // 320px
  // Ensure content determines width unless matchWidth is true
  width: max-content
  min-width: 12.5rem // 200px
  max-width: min(90vw, 25rem) // 400px

// Transition
.dropdown-fade-enter-active,
.dropdown-fade-leave-active
  transition: opacity var(--lb-transition), transform var(--lb-transition)

.dropdown-fade-enter-from,
.dropdown-fade-leave-to
  opacity: 0
  transform: translateY(-0.25rem) // -4px
</style>