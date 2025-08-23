<template lang="pug">
LbDropdown.lb-select(
  ref="dropdownRef"
  v-model="isOpen"
  :match-width="true"
  :placement="placement"
  :disabled="disabled"
  @open="handleOpen"
  @close="handleClose"
)
  template(#trigger)
    .select-trigger(
      ref="triggerRef"
      :class="triggerClasses"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-disabled="disabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="ariaDescribedby"
      @keydown="handleTriggerKeydown"
    )
      span.select-value(:class="{ placeholder: !selectedLabel }")
        | {{ selectedLabel || placeholder }}
      
      //- Clearable button
      button.clear-button(
        v-if="clearable && modelValue && !disabled"
        type="button"
        @click.stop="handleClear"
        aria-label="Clear selection"
      )
        svg(width="16" height="16" viewBox="0 0 16 16" fill="none")
          path(d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")
      
      //- Dropdown icon
      span.select-icon
        slot(name="icon")
          svg(:width="effectiveSize === 'large' ? '20' : '16'" :height="effectiveSize === 'large' ? '20' : '16'" viewBox="0 0 16 16" fill="currentColor" stroke="none")
            path(d="M5 6l3 3 3-3z")
  
  template(#content)
    .select-content(
      ref="contentRef"
      :class="`select-content-${effectiveSize}`"
      role="listbox"
      :aria-label="ariaLabel"
      :tabindex="!searchable ? 0 : -1"
      @keydown="handleKeydown"
    )
      .select-search(v-if="searchable")
        form(@submit.prevent="handleFormSubmit")
          input.search-input(
            ref="searchInputRef"
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            @input="handleSearch"
            @keydown="handleSearchKeydown"
          )
      
      .select-options(ref="optionsRef")
        .select-option(
          v-for="(option, index) in filteredOptions"
          :key="getOptionKey(option, index)"
          :class="getOptionClasses(option, index)"
          :role="option.type === 'divider' ? 'separator' : 'option'"
          :aria-selected="isSelected(option)"
          :aria-disabled="option.disabled"
          @click.stop="handleOptionClick(option, index)"
          @mouseenter="highlightedIndex = index"
        )
          template(v-if="option.type !== 'divider'")
            span.option-label {{ option.label }}
            span.option-checkmark(v-if="isSelected(option)")
              svg(width="16" height="16" viewBox="0 0 16 16" fill="none")
                path(d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round")
          
          .select-divider(v-else)
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, inject, onMounted, onUnmounted, type ComputedRef } from 'vue'
import LbDropdown from '../Dropdown/LbDropdown.vue'

// Types
export interface SelectOption {
  value: any
  label: string
  displayLabel?: string  // Optional abbreviated label for trigger display
  disabled?: boolean
  type?: 'option' | 'divider'
}

export interface LbSelectProps {
  modelValue?: any
  options: (SelectOption | string | number)[]
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  clearable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  size?: 'medium' | 'large'
  placement?: 'bottom' | 'top' | 'auto'
  ariaLabel?: string
  ariaDescribedby?: string
}

// Props
const props = withDefaults(defineProps<LbSelectProps>(), {
  modelValue: undefined,
  placeholder: 'Select an option',
  disabled: false,
  invalid: false,
  required: false,
  clearable: false,
  searchable: false,
  searchPlaceholder: 'Search...',
  placement: 'bottom',
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any]
  'clear': []
  'search': [query: string]
  'open': []
  'close': []
}>()

// Refs
const dropdownRef = ref<InstanceType<typeof LbDropdown>>()
const triggerRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const optionsRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

// Inject density context if available
const injectedDensitySize = inject<ComputedRef<'medium' | 'large'> | undefined>('densitySize', undefined)

// State
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const isKeyboardFocus = ref(false)

// Computed
// Compute effective size: explicit prop > density > default
const effectiveSize = computed(() => {
  // If size is explicitly set, use it
  if (props.size) return props.size
  // Otherwise use density-based size if available
  if (injectedDensitySize?.value) return injectedDensitySize.value
  // Fall back to default
  return 'medium'
})

const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map(option => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        value: option,
        label: String(option),
        disabled: false,
        type: 'option' as const
      }
    }
    return {
      disabled: false,
      type: 'option' as const,
      ...option
    }
  })
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return normalizedOptions.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return normalizedOptions.value.filter(option => {
    if (option.type === 'divider') return false
    return option.label.toLowerCase().includes(query)
  })
})

const selectedOption = computed(() => {
  return normalizedOptions.value.find(option => 
    option.type !== 'divider' && option.value === props.modelValue
  )
})

const selectedLabel = computed(() => {
  // Use displayLabel if available, otherwise fall back to label
  return selectedOption.value?.displayLabel || selectedOption.value?.label || ''
})

const triggerClasses = computed(() => ({
  'select-trigger-disabled': props.disabled,
  'select-trigger-invalid': props.invalid,
  'select-trigger-clearable': props.clearable,
  'select-trigger-keyboard-focus': isKeyboardFocus.value,
  [`select-trigger-${effectiveSize.value}`]: true,
}))

// Methods
const getOptionKey = (option: SelectOption, index: number) => {
  return `${index}-${option.value}-${option.type}`
}

const getOptionClasses = (option: SelectOption, index: number) => ({
  'select-option-selected': isSelected(option),
  'select-option-highlighted': highlightedIndex.value === index,
  'select-option-disabled': option.disabled,
  [`select-content-${effectiveSize.value}`]: true,
})

const isSelected = (option: SelectOption) => {
  return option.type !== 'divider' && option.value === props.modelValue
}

const handleOptionClick = (option: SelectOption, index: number) => {
  if (option.disabled || option.type === 'divider') return
  
  emit('update:modelValue', option.value)
  emit('change', option.value)
  searchQuery.value = '' // Clear search after selection
  isOpen.value = false
}

const handleClear = () => {
  emit('update:modelValue', undefined)
  emit('clear')
}

const handleSearch = () => {
  emit('search', searchQuery.value)
  highlightedIndex.value = -1
  
  // Auto-highlight first result
  nextTick(() => {
    const firstSelectableIndex = filteredOptions.value.findIndex(
      option => option.type !== 'divider' && !option.disabled
    )
    if (firstSelectableIndex >= 0) {
      highlightedIndex.value = firstSelectableIndex
    }
  })
}

const handleFormSubmit = () => {
  // Called when mobile number pad's "Go/Done" button is pressed
  // First try to find exact match if search query is present
  if (searchQuery.value.trim()) {
    const exactMatch = filteredOptions.value.find(
      option => option.type !== 'divider' && !option.disabled && 
                option.label === searchQuery.value.trim()
    )
    
    if (exactMatch) {
      // Exact match found - select it directly
      const index = filteredOptions.value.indexOf(exactMatch)
      handleOptionClick(exactMatch, index)
      return
    }
  }
  
  // No exact match or no search query - select the highlighted option if there is one
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    const option = filteredOptions.value[highlightedIndex.value]
    if (option.type !== 'divider' && !option.disabled) {
      handleOptionClick(option, highlightedIndex.value)
    }
  }
}

const handleOpen = () => {
  emit('open')
  
  nextTick(() => {
    if (props.searchable) {
      searchInputRef.value?.focus()
    } else {
      // Focus the content div when not searchable so it can receive keyboard events
      contentRef.value?.focus()
    }
    
    // Highlight selected option or first option
    const selectedIndex = filteredOptions.value.findIndex(option => isSelected(option))
    if (selectedIndex >= 0) {
      highlightedIndex.value = selectedIndex
      // Use requestAnimationFrame to ensure DOM is ready and use multiple frames for reliability
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToHighlighted()
        })
      })
    } else {
      const firstSelectableIndex = filteredOptions.value.findIndex(
        option => option.type !== 'divider' && !option.disabled
      )
      if (firstSelectableIndex >= 0) {
        highlightedIndex.value = firstSelectableIndex
      }
    }
  })
}

const handleClose = () => {
  emit('close')
  searchQuery.value = ''
  highlightedIndex.value = -1
  
  // Return focus to the trigger element after closing
  nextTick(() => {
    triggerRef.value?.focus()
  })
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  const { key } = event
  
  if (key === 'Enter' || key === ' ') {
    event.preventDefault()
    isOpen.value = !isOpen.value
  } else if ((key === 'ArrowDown' || key === 'ArrowUp') && !isOpen.value) {
    event.preventDefault()
    isOpen.value = true
  }
}

const handleSearchKeydown = (event: KeyboardEvent) => {
  const { key } = event
  
  // Only stop propagation for actual typing keys
  // Let navigation keys bubble up to the parent handler
  if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === 'Escape') {
    // Don't stop propagation - let these bubble up to handleKeydown
    return
  }
  
  // Stop propagation for all other keys (typing characters)
  event.stopPropagation()
}

const handleKeydown = (event: KeyboardEvent) => {
  const { key } = event
  
  switch (key) {
    case 'ArrowDown':
      event.preventDefault()
      navigateDown()
      break
    case 'ArrowUp':
      event.preventDefault()
      navigateUp()
      break
    case 'Enter':
      event.preventDefault()
      selectHighlighted()
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      break
  }
}

const navigateDown = () => {
  const currentIndex = highlightedIndex.value
  const nextIndex = findNextSelectableIndex(currentIndex, 1)
  if (nextIndex !== -1) {
    highlightedIndex.value = nextIndex
    scrollToHighlighted()
  }
}

const navigateUp = () => {
  const currentIndex = highlightedIndex.value
  const prevIndex = findNextSelectableIndex(currentIndex, -1)
  if (prevIndex !== -1) {
    highlightedIndex.value = prevIndex
    scrollToHighlighted()
  }
}

const findNextSelectableIndex = (currentIndex: number, direction: number): number => {
  const items = filteredOptions.value
  let index = currentIndex + direction
  
  while (index >= 0 && index < items.length) {
    const item = items[index]
    if (item.type !== 'divider' && !item.disabled) {
      return index
    }
    index += direction
  }
  
  return -1
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    const option = filteredOptions.value[highlightedIndex.value]
    handleOptionClick(option, highlightedIndex.value)
  }
}

const scrollToHighlighted = () => {
  if (!optionsRef.value || highlightedIndex.value === -1) return
  
  const container = optionsRef.value
  const items = container.querySelectorAll('.select-option')
  const highlightedItem = items[highlightedIndex.value] as HTMLElement
  
  if (highlightedItem) {
    // Try to use scrollIntoView for better browser support
    highlightedItem.scrollIntoView({
      behavior: 'auto',
      block: 'center'
    })
    
    // Fallback: manually calculate and set scroll position
    if (container.scrollTop === 0 || container.scrollTop === container.scrollHeight - container.clientHeight) {
      const containerHeight = container.clientHeight
      const itemTop = highlightedItem.offsetTop
      const itemHeight = highlightedItem.offsetHeight
      
      // Calculate position to center the item
      const idealScrollTop = itemTop - (containerHeight / 2) + (itemHeight / 2)
      
      // Set scroll position
      container.scrollTop = Math.max(0, idealScrollTop)
    }
  }
}

// Track keyboard vs mouse focus
let lastInteractionWasKeyboard = false

const handleKeyDown = () => {
  lastInteractionWasKeyboard = true
}

const handleMouseDown = () => {
  lastInteractionWasKeyboard = false
}

const handleTriggerFocus = () => {
  isKeyboardFocus.value = lastInteractionWasKeyboard
}

const handleTriggerBlur = () => {
  isKeyboardFocus.value = false
}

// Set up global listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown, true)
  document.addEventListener('mousedown', handleMouseDown, true)
  triggerRef.value?.addEventListener('focus', handleTriggerFocus)
  triggerRef.value?.addEventListener('blur', handleTriggerBlur)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown, true)
  document.removeEventListener('mousedown', handleMouseDown, true)
  triggerRef.value?.removeEventListener('focus', handleTriggerFocus)
  triggerRef.value?.removeEventListener('blur', handleTriggerBlur)
})

// Component options
defineOptions({
  name: 'LbSelect',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/component-variables' as cv
@use '@/styles/typography' as typography

.lb-select
  display: inline-block
  width: 100%

.select-trigger
  display: flex
  align-items: center
  width: 100%
  padding: 0 cv.$select-padding-x-medium
  background: var(--lb-background-surface)
  border: cv.$select-border-width solid var(--lb-border-neutral-normal)
  border-radius: cv.$select-border-radius
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: border-color base.$transition, box-shadow base.$transition
  box-sizing: border-box
  
  // Hover state (only when not focused and not invalid)
  &:hover:not(.select-trigger-disabled):not(.select-trigger-invalid)
    border-color: var(--lb-border-neutral-active)
  
  // Focus visible state (keyboard navigation)
  &:focus-visible
    outline: base.$focus-ring-width solid transparent
    outline-offset: base.$focus-ring-offset
    border-color: var(--lb-border-neutral-active)
    box-shadow: base.$shadow-sm
  
  &.select-trigger-medium
    height: cv.$select-height-medium  // 40px
    font-size: cv.$select-font-size-medium  // 14px - matches input
  
  &.select-trigger-large
    height: cv.$select-height-large  // 48px
    padding: 0 cv.$select-padding-x-large
    font-size: cv.$select-font-size-large  // 16px - matches input
  
  &.select-trigger-disabled
    background: var(--lb-surface-neutral-subtle)
    color: var(--lb-text-neutral-disabled)
    cursor: not-allowed
    opacity: base.$opacity-60
  
  &.select-trigger-invalid
    border-color: var(--lb-border-error-normal)
    
    // Maintain error border on hover
    &:hover:not(.select-trigger-disabled)
      border-color: var(--lb-border-error-normal)
    
    // Error border on focus
    &:focus-visible
      outline: base.$focus-ring-width solid transparent
      outline-offset: base.$focus-ring-offset
      border-color: var(--lb-border-error-active)
      box-shadow: base.$shadow-sm

.select-value
  flex: 1
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  text-align: left
  
  &.placeholder
    color: var(--lb-text-neutral-contrast-low)
    opacity: base.$opacity-100

.clear-button
  display: inline-flex
  align-items: center
  justify-content: center
  width: base.$unit-20  // 20px
  height: base.$unit-20  // 20px
  padding: 0
  margin-right: base.$space-xs
  background: none
  border: none
  border-radius: base.$radius-full
  color: var(--lb-text-neutral-contrast-low)
  cursor: pointer
  transition: all base.$transition
  
  &:hover
    background: var(--lb-surface-neutral-hover)
    color: var(--lb-text-neutral-contrast-high)
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset

.select-icon
  display: inline-flex
  align-items: center
  justify-content: center
  margin-left: base.$space-xs
  color: var(--lb-text-neutral-contrast-low)
  flex-shrink: 0
  transition: transform base.$transition
  
  svg
    width: cv.$select-icon-size  // 16px default
    height: cv.$select-icon-size
  
  &.lb-select[aria-expanded="true"]
    transform: rotate(180deg)

.select-content
  display: flex
  flex-direction: column
  width: 100%
  outline: none

.select-search
  padding: base.$space-sm
  border-bottom: cv.$select-border-width solid var(--lb-border-neutral-normal)
  
  form
    margin: 0
    padding: 0

.search-input
  width: 100%
  height: base.$unit-32  // 32px
  padding: 0 base.$space-sm
  background: var(--lb-background-surface)
  border: cv.$select-border-width solid var(--lb-border-neutral-normal)
  border-radius: cv.$select-border-radius
  color: var(--lb-text-neutral-contrast-high)
  transition: border-color base.$transition
  box-sizing: border-box
  
  &::placeholder
    color: var(--lb-text-neutral-contrast-low)
    opacity: base.$opacity-100
  
  &:focus-visible
    outline: base.$focus-ring-width solid transparent
    outline-offset: base.$focus-ring-offset
    border-color: var(--lb-border-neutral-active)
    box-shadow: base.$shadow-sm

.select-options
  padding: base.$space-xs

.select-option
  display: flex
  align-items: center
  justify-content: space-between
  padding: base.$space-sm base.$space-md
  border-radius: base.$radius-sm
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: background-color base.$transition
  
  &.select-content-medium
    font-size: cv.$select-font-size-medium
  
  &.select-content-large
    font-size: cv.$select-font-size-large
    padding: base.$space-md base.$space-lg
  
  &:hover:not(.select-option-disabled):not(.select-option-selected)
    background: var(--lb-surface-neutral-hover)
  
  &.select-option-highlighted:not(.select-option-disabled):not(.select-option-selected)
    background: var(--lb-surface-neutral-hover)
  
  &.select-option-selected
    background: var(--lb-surface-neutral-hover)
    color: var(--lb-text-neutral-contrast-high)
    
    &:hover
      background: var(--lb-surface-neutral-hover)
  
  &.select-option-disabled
    color: var(--lb-text-neutral-disabled)
    cursor: not-allowed
    opacity: base.$opacity-60

.option-label
  flex: 1
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.option-checkmark
  display: inline-flex
  align-items: center
  justify-content: center
  margin-left: base.$space-sm
  color: var(--lb-text-neutral-contrast-low)
  flex-shrink: 0

.select-divider
  height: base.$border-sm
  margin: base.$space-xs 0
  background: var(--lb-border-neutral-normal)
</style>