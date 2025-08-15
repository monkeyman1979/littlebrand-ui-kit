<template lang="pug">
.lb-popover-trigger(
  ref="triggerElement"
  :class="triggerClasses"
  @click="handleClick"
  @keydown="handleKeydown"
  :tabindex="triggerTabindex"
  role="button"
  :aria-expanded="context?.open || false"
  :aria-haspopup="true"
  :aria-disabled="context?.disabled || false"
)
  slot
</template>

<script setup lang="ts">
import { computed, ref, inject, onMounted, onBeforeUnmount } from 'vue'
import type { PopoverContext } from './LbPopover.vue'

// Props
export interface LbPopoverTriggerProps {
  asChild?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<LbPopoverTriggerProps>(), {
  asChild: false,
  disabled: false
})

// Inject popover context
const context = inject<PopoverContext>('popoverContext')

if (!context) {
  throw new Error('LbPopoverTrigger must be used within LbPopover')
}

// Refs
const triggerElement = ref<HTMLElement>()

// Computed
const triggerClasses = computed(() => ({
  'as-child': props.asChild,
  'is-disabled': props.disabled || context.disabled,
  'is-open': context.open
}))

const triggerTabindex = computed(() => {
  return props.disabled || context.disabled ? -1 : 0
})

// Methods
const handleClick = () => {
  if (props.disabled || context.disabled) return
  context.handleTriggerClick()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || context.disabled) return
  
  // Handle Enter and Space as click
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    context.handleTriggerClick()
  }
  
  // Handle Escape to close if open
  if (event.key === 'Escape' && context.open) {
    event.preventDefault()
    context.handleClose()
  }
}

// Setup trigger reference in context
onMounted(() => {
  if (triggerElement.value && context.triggerRef) {
    context.triggerRef.value = triggerElement.value
  }
})

// Cleanup trigger reference
onBeforeUnmount(() => {
  if (context.triggerRef && context.triggerRef.value === triggerElement.value) {
    context.triggerRef.value = null
  }
})

// Component options
defineOptions({
  name: 'LbPopoverTrigger',
  inheritAttrs: false
})

// Expose
defineExpose({
  triggerElement
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-popover-trigger
  display: inline-flex
  align-items: center
  justify-content: center
  cursor: pointer
  user-select: none
  
  &:focus-visible
    outline: var(--lb-focus-ring-width) solid var(--lb-focus-ring-color)
    outline-offset: var(--lb-focus-ring-offset)
    border-radius: base.$radius-sm
  
  &.is-disabled
    cursor: not-allowed
    opacity: base.$opacity-60
  
  &.as-child
    // When used as child, remove styling and let child handle appearance
    all: unset
    display: contents
</style>