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
          svg(:width="size === 'large' ? '20' : '16'" :height="size === 'large' ? '20' : '16'" viewBox="0 0 16 16" fill="currentColor" stroke="none")
            path(d="M5 6l3 3 3-3z")
  
  template(#content)
    .select-content(
      role="listbox"
      :aria-label="ariaLabel"
      @keydown="handleKeydown"
    )
      .select-search(v-if="searchable")
        input.search-input(
          ref="searchInputRef"
          v-model="searchQuery"
          :type="searchInputType"
          :inputmode="searchInputType === 'number' ? 'numeric' : 'text'"
          :pattern="searchInputType === 'number' ? '[0-9]*' : undefined"
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
          @click="handleOptionClick(option, index)"
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
import { ref, computed, watch, nextTick } from 'vue'
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
  searchInputType?: string  // Allow setting input type (e.g., 'number', 'text')
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
  searchInputType: 'text',
  size: 'medium',
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
const searchInputRef = ref<HTMLInputElement>()
const optionsRef = ref<HTMLElement>()

// State
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)

// Computed
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
  [`select-trigger-${props.size}`]: true,
}))

// Methods
const getOptionKey = (option: SelectOption, index: number) => {
  return `${index}-${option.value}-${option.type}`
}

const getOptionClasses = (option: SelectOption, index: number) => ({
  'select-option-selected': isSelected(option),
  'select-option-highlighted': highlightedIndex.value === index,
  'select-option-disabled': option.disabled,
})

const isSelected = (option: SelectOption) => {
  return option.type !== 'divider' && option.value === props.modelValue
}

const handleOptionClick = (option: SelectOption, index: number) => {
  if (option.disabled || option.type === 'divider') return
  
  emit('update:modelValue', option.value)
  emit('change', option.value)
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

const handleOpen = () => {
  emit('open')
  
  nextTick(() => {
    if (props.searchable) {
      searchInputRef.value?.focus()
    }
    
    // Highlight selected option or first option
    const selectedIndex = filteredOptions.value.findIndex(option => isSelected(option))
    if (selectedIndex >= 0) {
      highlightedIndex.value = selectedIndex
      scrollToHighlighted()
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
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  const { key } = event
  
  if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
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
    const containerTop = container.scrollTop
    const containerBottom = containerTop + container.clientHeight
    const itemTop = highlightedItem.offsetTop
    const itemBottom = itemTop + highlightedItem.offsetHeight
    
    if (itemTop < containerTop) {
      container.scrollTop = itemTop
    } else if (itemBottom > containerBottom) {
      container.scrollTop = itemBottom - container.clientHeight
    }
  }
}

// Component options
defineOptions({
  name: 'LbSelect',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-select
  display: inline-block
  width: 100%

.select-trigger
  display: flex
  align-items: center
  width: 100%
  padding: 0 var(--lb-space-md)
  background: var(--lb-background-surface)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-normal)
  border-radius: var(--lb-radius-md)
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: border-color var(--lb-transition), box-shadow var(--lb-transition)
  box-sizing: border-box
  
  &:focus-visible
    outline: none
    border-color: var(--lb-border-primary-normal)
    box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-primary-active)
  
  &:hover:not(.select-trigger-disabled)
    border-color: var(--lb-border-neutral-active)
  
  &.select-trigger-medium
    height: var(--lb-input-height-medium)
    font-size: var(--lb-font-size-label-base)
  
  &.select-trigger-large
    height: var(--lb-input-height-large)
    font-size: var(--lb-font-size-label-large)
  
  &.select-trigger-disabled
    background: var(--lb-surface-neutral-subtle)
    color: var(--lb-text-neutral-disabled)
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
  
  &.select-trigger-invalid
    border-color: var(--lb-border-error-normal)
    
    &:focus-visible
      border-color: var(--lb-border-error-active)
      box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-error-active)

.select-value
  flex: 1
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  
  &.placeholder
    color: var(--lb-text-neutral-contrast-low)
    opacity: var(--lb-opacity-100)

.clear-button
  display: inline-flex
  align-items: center
  justify-content: center
  width: 1.25rem
  height: 1.25rem
  padding: 0
  margin-right: var(--lb-space-xs)
  background: none
  border: none
  border-radius: var(--lb-radius-full)
  color: var(--lb-text-neutral-contrast-low)
  cursor: pointer
  transition: all var(--lb-transition)
  
  &:hover
    background: var(--lb-surface-neutral-hover)
    color: var(--lb-text-neutral-contrast-high)
  
  &:focus-visible
    outline: var(--lb-focus-ring-width) solid var(--lb-focus-ring-color)
    outline-offset: var(--lb-focus-ring-offset)

.select-icon
  display: inline-flex
  align-items: center
  justify-content: center
  margin-left: var(--lb-space-xs)
  color: var(--lb-text-neutral-contrast-low)
  flex-shrink: 0
  transition: transform var(--lb-transition)
  
  svg
    width: var(--lb-icon-size-sm) // 16px default
    height: var(--lb-icon-size-sm)
    
    .select-trigger-large &
      width: var(--lb-icon-size-md) // 20px for large
      height: var(--lb-icon-size-md)
  
  .lb-select[aria-expanded="true"] &
    transform: rotate(180deg)

.select-content
  display: flex
  flex-direction: column
  width: 100%
  outline: none

.select-search
  padding: var(--lb-space-sm)
  border-bottom: var(--lb-border-sm) solid var(--lb-border-neutral-normal)

.search-input
  width: 100%
  height: 2rem
  padding: 0 var(--lb-space-sm)
  background: var(--lb-background-surface)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-normal)
  border-radius: var(--lb-radius-md)
  color: var(--lb-text-neutral-contrast-high)
  transition: border-color var(--lb-transition)
  box-sizing: border-box
  
  &::placeholder
    color: var(--lb-text-neutral-contrast-low)
    opacity: var(--lb-opacity-100)
  
  &:focus
    outline: none
    border-color: var(--lb-border-primary-normal)
    box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-primary-active)

.select-options
  padding: var(--lb-space-xs)
  max-height: 15rem
  overflow-y: auto

.select-option
  display: flex
  align-items: center
  justify-content: space-between
  padding: var(--lb-space-sm) var(--lb-space-md)
  border-radius: var(--lb-radius-sm)
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: background-color var(--lb-transition)
  
  .select-content-medium &
    font-size: var(--lb-font-size-label-base)
  
  .select-content-large &
    font-size: var(--lb-font-size-label-large)
    padding: var(--lb-space-md) var(--lb-space-lg)
  
  &:hover:not(.select-option-disabled)
    background: var(--lb-surface-neutral-hover)
  
  &.select-option-highlighted:not(.select-option-disabled)
    background: var(--lb-surface-neutral-hover)
  
  &.select-option-selected
    background: var(--lb-surface-primary-subtle)
    color: var(--lb-text-primary-contrast-high)
    
    &:hover
      background: var(--lb-surface-primary-hover)
  
  &.select-option-disabled
    color: var(--lb-text-neutral-disabled)
    cursor: not-allowed
    opacity: var(--lb-opacity-60)

.option-label
  flex: 1
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.option-checkmark
  display: inline-flex
  align-items: center
  justify-content: center
  margin-left: var(--lb-space-sm)
  color: var(--lb-text-primary-normal)
  flex-shrink: 0

.select-divider
  height: 1px
  margin: var(--lb-space-xs) 0
  background: var(--lb-border-neutral-normal)
</style>