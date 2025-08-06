<template lang="pug">
.lb-segment-button(
  ref="segmentButtonRef"
  :class="segmentButtonClasses" 
  :role="multiSelect ? 'group' : (allowEmpty ? 'group' : 'radiogroup')" 
  :aria-labelledby="ariaLabelledby"
  tabindex="-1"
)
  slot
</template>

<script setup lang="ts">
import { computed, provide, ref, shallowRef, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { Size, Width, Color } from './types'

// Props
const props = withDefaults(defineProps<{
  modelValue?: string | number | (string | number)[]
  size?: Size
  width?: Width
  color?: Color
  disabled?: boolean
  ariaLabelledby?: string
  allowEmpty?: boolean  // Allow all segments to be unselected
  multiSelect?: boolean  // Enable multi-select mode
}>(), {
  size: 'medium',
  width: 'full',
  color: 'primary',
  disabled: false,
  allowEmpty: true,
  multiSelect: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[] | undefined]
}>()

// Reactive state
const activeValue = ref<string | number | (string | number)[] | undefined>(props.modelValue)
const segmentButtonRef = ref<HTMLElement>()
const segmentItems = shallowRef<HTMLElement[]>([])

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  activeValue.value = newValue
})

// Computed
const segmentButtonClasses = computed(() => {
  const classes: any[] = [
    `size-${props.size}`,
    `width-${props.width}`,
    `color-${props.color}`
  ]
  
  if (props.disabled) {
    classes.push('disabled')
  }
  
  return classes
})

// Register segment item
const registerSegmentItem = (element: HTMLElement) => {
  const items = segmentItems.value
  if (!items.includes(element)) {
    segmentItems.value = [...items, element]
  }
}

// Unregister segment item
const unregisterSegmentItem = (element: HTMLElement) => {
  const items = segmentItems.value
  const index = items.indexOf(element)
  if (index > -1) {
    segmentItems.value = items.filter((_, i) => i !== index)
  }
}

// Get current focused index
const getCurrentFocusedIndex = (): number => {
  const activeElement = document.activeElement as HTMLElement
  return segmentItems.value.findIndex(item => item === activeElement)
}

// Focus segment by index
const focusSegmentByIndex = (index: number) => {
  if (index >= 0 && index < segmentItems.value.length) {
    segmentItems.value[index].focus()
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  const currentIndex = getCurrentFocusedIndex()
  if (currentIndex === -1) return
  
  const itemsCount = segmentItems.value.length
  if (itemsCount === 0) return

  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : itemsCount - 1
      focusSegmentByIndex(prevIndex)
      break

    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = currentIndex < itemsCount - 1 ? currentIndex + 1 : 0
      focusSegmentByIndex(nextIndex)
      break

    case 'Home':
      event.preventDefault()
      focusSegmentByIndex(0)
      break

    case 'End':
      event.preventDefault()
      focusSegmentByIndex(itemsCount - 1)
      break
  }
}

// Update active value
const updateActive = (value: string | number) => {
  if (!props.disabled) {
    if (props.multiSelect) {
      // Multi-select mode
      const currentValue = activeValue.value
      let newValue: (string | number)[]
      
      if (Array.isArray(currentValue)) {
        const hasValue = currentValue.includes(value)
        newValue = hasValue 
          ? currentValue.filter(v => v !== value)
          : [...currentValue, value]
      } else if (currentValue === value) {
        newValue = []
      } else if (currentValue !== undefined) {
        newValue = [currentValue, value]
      } else {
        newValue = [value]
      }
      
      const finalValue = newValue.length > 0 ? newValue : undefined
      activeValue.value = finalValue
      emit('update:modelValue', finalValue)
    } else {
      // Single-select mode
      if (props.allowEmpty && activeValue.value === value) {
        activeValue.value = undefined
        emit('update:modelValue', undefined)
      } else {
        activeValue.value = value
        emit('update:modelValue', value)
      }
    }
  }
}

// Provide context to child items
provide('segmentButton', {
  activeValue,
  size: computed(() => props.size),
  color: computed(() => props.color),
  disabled: computed(() => props.disabled),
  allowEmpty: computed(() => props.allowEmpty),
  multiSelect: computed(() => props.multiSelect),
  updateActive,
  registerSegmentItem,
  unregisterSegmentItem
})

// Mount keyboard listener
onMounted(() => {
  segmentButtonRef.value?.addEventListener('keydown', handleKeydown)
})

// Cleanup on unmount
onUnmounted(() => {
  segmentButtonRef.value?.removeEventListener('keydown', handleKeydown)
})

// Component options
defineOptions({
  name: 'LbSegmentButton',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-segment-button
  display: inline-grid
  grid-auto-flow: column
  gap: 0
  position: relative
  border: base.$border-sm solid var(--color-border-strong)
  border-radius: base.$radius-full
  overflow: hidden
  
  // Width variants
  &.width-full
    width: 100%
    grid-auto-columns: 1fr
    
  &.width-auto
    width: max-content
    grid-auto-columns: minmax(max-content, 1fr)

  &.size-small
    height: base.$size-5xl // 32px
    
  &.size-medium
    height: base.$size-6xl // 40px

  &.disabled
    opacity: base.$opacity-60
    pointer-events: none
</style>