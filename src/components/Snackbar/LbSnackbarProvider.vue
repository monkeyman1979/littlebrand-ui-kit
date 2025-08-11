<template lang="pug">
//- Slot for the app content
slot

//- Teleport snackbars to body to avoid z-index issues
teleport(to="body")
  .lb-snackbar-provider(
    :class="positionClass"
    :style="providerStyles"
  )
    transition-group(
      name="lb-snackbar"
      tag="div"
      class="snackbar-container"
      appear
    )
      lb-snackbar(
        v-for="snackbar in visibleSnackbars"
        :key="snackbar.id"
        v-bind="snackbar"
        @dismiss="removeSnackbar"
        @click.stop
      )
</template>

<script setup lang="ts">
import { computed, provide, ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import LbSnackbar from './LbSnackbar.vue'
import type { SnackbarConfig, SnackbarItem, SnackbarProviderContext } from './types'

// Props
const props = withDefaults(defineProps<{
  position?: 'bottom-center' | 'top-center' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  offset?: string
}>(), {
  position: 'bottom-center',
  offset: 'var(--lb-space-lg)'
})

// State
const snackbars = ref<SnackbarItem[]>([])
const idCounter = ref(0)
const snackbarElement = ref<HTMLElement | null>(null)

// Computed
const positionClass = computed(() => `position-${props.position}`)

const providerStyles = computed(() => ({
  '--snackbar-offset': props.offset
}))

const visibleSnackbars = computed(() => {
  // Show all snackbars, they will stack
  return snackbars.value
})

// Methods
const generateId = (): string => {
  return `snackbar-${++idCounter.value}-${Date.now()}`
}

const showSnackbar = async (config: SnackbarConfig): Promise<string> => {
  const id = generateId()
  
  // Determine auto-dismiss behavior
  // - Snackbars without actions: 4 seconds
  // - Snackbars with actions: 6 seconds
  // - Persistent snackbars: no auto-dismiss
  const hasAction = Boolean(config.action)
  const shouldAutoDismiss = !config.persistent
  const defaultDuration = hasAction ? 6000 : 4000 // 6s with action, 4s without
  
  const snackbarItem: SnackbarItem = {
    id,
    message: config.message,
    variant: config.variant || 'default',
    duration: config.duration ?? defaultDuration,
    action: config.action,
    persistent: config.persistent || false
  }
  
  // Always add new snackbars to the stack
  snackbars.value.push(snackbarItem)
  
  // Auto-dismiss all non-persistent snackbars
  if (shouldAutoDismiss && snackbarItem.duration > 0) {
    setTimeout(() => {
      removeSnackbar(id)
    }, snackbarItem.duration)
  }
  
  await nextTick()
  return id
}

const removeSnackbar = (id: string) => {
  const index = snackbars.value.findIndex(snackbar => snackbar.id === id)
  if (index > -1) {
    snackbars.value.splice(index, 1)
  }
}

const clearAll = () => {
  snackbars.value = []
}

const updateSnackbar = (id: string, updates: Partial<SnackbarItem>) => {
  const snackbar = snackbars.value.find(s => s.id === id)
  if (snackbar) {
    Object.assign(snackbar, updates)
  }
}

// Click outside handler
const handleDocumentClick = (event: MouseEvent) => {
  if (visibleSnackbars.value.length === 0) return
  
  // Check if click was outside all snackbars
  const target = event.target as Node
  const snackbarElements = document.querySelectorAll('.lb-snackbar')
  
  let clickedInsideSnackbar = false
  snackbarElements.forEach(el => {
    if (el.contains(target)) {
      clickedInsideSnackbar = true
    }
  })
  
  // If clicked outside, dismiss all non-persistent snackbars
  if (!clickedInsideSnackbar) {
    // Create a copy of the array to avoid mutation during iteration
    const snackbarsToCheck = [...visibleSnackbars.value]
    snackbarsToCheck.forEach(snackbar => {
      if (!snackbar.persistent) {
        removeSnackbar(snackbar.id)
      }
    })
  }
}

// Watch for snackbar visibility changes to add/remove document listener
watch(visibleSnackbars, (newVal) => {
  if (newVal.length > 0) {
    // Add listener when snackbar is shown
    document.addEventListener('click', handleDocumentClick, true)
  } else {
    // Remove listener when no snackbars
    document.removeEventListener('click', handleDocumentClick, true)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick, true)
})

const handleBackdropClick = () => {
  // This method is no longer needed since we're using document click handler
  // Keeping it to avoid breaking the template
}

// Provide context for useSnackbar composable
const snackbarContext: SnackbarProviderContext = {
  showSnackbar,
  removeSnackbar,
  clearAll,
  updateSnackbar,
  snackbars: computed(() => snackbars.value)
}

provide('snackbar', snackbarContext)

// Component options
defineOptions({
  name: 'LbSnackbarProvider'
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-snackbar-provider
  position: fixed
  z-index: var(--z-notification)
  pointer-events: none
  
  // Position variations
  &.position-bottom-center
    bottom: var(--snackbar-offset)
    left: 0
    right: 0
    
  &.position-top-center
    top: var(--snackbar-offset)
    left: 0
    right: 0
    
  &.position-bottom-left
    bottom: var(--snackbar-offset)
    left: var(--snackbar-offset)
    
  &.position-bottom-right
    bottom: var(--snackbar-offset)
    right: var(--snackbar-offset)
    
  &.position-top-left
    top: var(--snackbar-offset)
    left: var(--snackbar-offset)
    
  &.position-top-right
    top: var(--snackbar-offset)
    right: var(--snackbar-offset)

.snackbar-container
  display: flex
  flex-direction: column
  align-items: center
  gap: var(--lb-space-md)
  width: 100vw
  pointer-events: none
  
  // Only the snackbars themselves should be interactive
  :deep(.lb-snackbar)
    pointer-events: auto
  
  // Stack from bottom for bottom positions (newest at bottom)
  .position-bottom-center &,
  .position-bottom-left &,
  .position-bottom-right &
    flex-direction: column-reverse
    
  // For top positions, newest appears at top
  .position-top-center &,
  .position-top-left &,
  .position-top-right &
    flex-direction: column
  
  // Ensure responsive behavior
  @media (max-width: 640px)
    padding: 0 var(--lb-space-md)
    
    // Add extra bottom padding on mobile to account for OS bars
    .position-bottom-center &,
    .position-bottom-left &,
    .position-bottom-right &
      padding-bottom: calc(var(--lb-space-lg) + env(safe-area-inset-bottom, 0px))

// Snackbar animations - grow/shrink height with smooth easing
.lb-snackbar-enter-active,
.lb-snackbar-leave-active
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
  
.lb-snackbar-enter-from
  opacity: 0
  transform: scale(0.8) translateY(1rem)
  
  // For top positions, animate from top
  .position-top-center &,
  .position-top-left &,
  .position-top-right &
    transform: scale(0.8) translateY(-1rem)
  
.lb-snackbar-enter-to
  opacity: 1
  transform: scale(1) translateY(0)
  
.lb-snackbar-leave-from
  opacity: 1
  transform: scale(1) translateY(0)
  
.lb-snackbar-leave-to
  opacity: 0
  transform: scale(0.8) translateY(1rem)
  
  // For top positions, animate to top
  .position-top-center &,
  .position-top-left &,
  .position-top-right &
    transform: scale(0.8) translateY(-1rem)
  
// Move animations for items being displaced
.lb-snackbar-move
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1)

// Add wrapper animation for height
:deep(.lb-snackbar)
  &.lb-snackbar-enter-active
    overflow: hidden
    animation: snackbar-height-expand 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards
    
  &.lb-snackbar-leave-active
    overflow: hidden
    animation: snackbar-height-collapse 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards

@keyframes snackbar-height-expand
  from
    max-height: 0
    padding-top: 0
    padding-bottom: 0
    margin-bottom: 0
  to
    max-height: 12.5rem
    padding-top: var(--lb-space-sm)
    padding-bottom: var(--lb-space-sm)
    margin-bottom: 0

@keyframes snackbar-height-collapse
  from
    max-height: 12.5rem
    padding-top: var(--lb-space-sm)
    padding-bottom: var(--lb-space-sm)
    margin-bottom: 0
  to
    max-height: 0
    padding-top: 0
    padding-bottom: 0
    margin-bottom: 0
</style>