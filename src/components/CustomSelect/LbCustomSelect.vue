<template lang="pug">
.lb-custom-select(:class="rootClasses")
  LbDropdown.select-dropdown(
    v-model="isOpen"
    :match-width="true"
    :disabled="disabled"
    :close-on-click-outside="true"
    :close-on-escape="true"
    @open="handleOpen"
    @close="handleClose"
  )
    template(#trigger)
      .select-trigger(
        ref="triggerRef"
        :tabindex="disabled ? -1 : 0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-haspopup="listbox"
        :aria-labelledby="computedAriaDescribedby"
        :aria-invalid="invalid || undefined"
        :aria-disabled="disabled"
        :id="computedId"
        @keydown="handleTriggerKeydown"
        @click="handleTriggerClick"
      )
        //- Display selected value or placeholder
        .select-value(:class="{ 'is-placeholder': !hasValue }")
          template(v-if="hasValue && selectedOption")
            slot(
              name="selected"
              :option="selectedOption"
              :value="modelValue"
            ) {{ selectedOption.label }}
          template(v-else-if="placeholder") {{ placeholder }}
          template(v-else) Select an option...
        
        //- Right side icons
        .select-icons
          //- Clear button
          button.icon-clear(
            v-if="clearable && hasValue && !disabled"
            type="button"
            @click.stop="handleClear"
            :aria-label="'Clear selection'"
            @mousedown.prevent
          )
            svg(
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            )
              circle(cx="8" cy="8" r="8" fill="currentColor" opacity="0.2")
              path(
                d="M10.5 5.5L5.5 10.5M5.5 5.5l5 5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              )
          
          //- Dropdown chevron
          .dropdown-icon(:class="{ 'is-open': isOpen }")
            svg(
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            )
              path(
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
    
    template(#content)
      .select-content(
        ref="contentRef"
        role="listbox"
        :aria-labelledby="computedAriaDescribedby"
        @keydown="handleContentKeydown"
        tabindex="-1"
      )
        .select-option(
          v-for="(option, index) in normalizedOptions"
          :key="getOptionKey(option, index)"
          :class="getOptionClasses(option, index)"
          :data-index="index"
          role="option"
          :aria-selected="isSelected(option)"
          :aria-disabled="option.disabled"
          @click="handleOptionClick(option, index)"
          @mouseenter="handleOptionHover(index)"
        )
          slot(
            name="option"
            :option="option"
            :index="index"
            :selected="isSelected(option)"
            :highlighted="highlightedIndex === index"
          )
            .option-content
              span.option-label {{ option.label }}
              .option-checkmark(v-if="isSelected(option)")
                svg(
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                )
                  path(
                    d="M13.5 4.5L6 12L2.5 8.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  )
</template>

<script setup lang="ts">
import { computed, ref, nextTick, inject, watch, type ComputedRef } from 'vue'
import LbDropdown from '../Dropdown/LbDropdown.vue'

// Types
export interface CustomSelectOption {
  value: any
  label: string
  disabled?: boolean
}

export interface LbCustomSelectProps {
  modelValue?: any
  options: (CustomSelectOption | string | number)[]
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  clearable?: boolean
  size?: 'medium' | 'large'
  id?: string
  ariaDescribedby?: string
}

// Props
const props = withDefaults(defineProps<LbCustomSelectProps>(), {
  modelValue: null,
  disabled: false,
  invalid: false,
  required: false,
  clearable: false,
  size: 'medium'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'change': [value: any, option: CustomSelectOption | null]
  'clear': []
  'open': []
  'close': []
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

// Refs
const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const isOpen = ref(false)
const highlightedIndex = ref(-1)

// Inject form field context if available
const injectedId = inject<ComputedRef<string> | undefined>('formFieldId', undefined)
const injectedAriaDescribedby = inject<ComputedRef<string | undefined> | undefined>('formFieldAriaDescribedby', undefined)

// Computed
const normalizedOptions = computed(() => {
  return props.options.map((option, index) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        value: option,
        label: String(option),
        disabled: false
      }
    }
    return {
      disabled: false,
      ...option
    }
  })
})

const selectableOptions = computed(() => {
  return normalizedOptions.value.filter(option => !option.disabled)
})

const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== '')

const selectedOption = computed(() => {
  if (!hasValue.value) return null
  return normalizedOptions.value.find(option => option.value === props.modelValue) || null
})

const computedId = computed(() => {
  return props.id || injectedId?.value
})

const computedAriaDescribedby = computed(() => {
  return props.ariaDescribedby || injectedAriaDescribedby?.value || undefined
})

const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'invalid': props.invalid,
  'is-open': isOpen.value,
  'has-value': hasValue.value,
  [`size-${props.size}`]: true
}))

// Methods
const getOptionKey = (option: CustomSelectOption, index: number) => {
  return `${index}-${option.value}`
}

const getOptionClasses = (option: CustomSelectOption, index: number) => ({
  'select-option-selected': isSelected(option),
  'select-option-highlighted': highlightedIndex.value === index,
  'select-option-disabled': option.disabled
})

const isSelected = (option: CustomSelectOption) => {
  return props.modelValue === option.value
}

const handleTriggerClick = () => {
  if (props.disabled) return
  // Toggle handled by dropdown component
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  
  const { key } = event
  
  switch (key) {
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
      } else {
        if (key === 'ArrowDown') {
          navigateDown()
        } else {
          navigateUp()
        }
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (!isOpen.value) {
        isOpen.value = true
      } else {
        selectHighlighted()
      }
      break
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        isOpen.value = false
      }
      break
    case 'Home':
      if (isOpen.value) {
        event.preventDefault()
        navigateToFirst()
      }
      break
    case 'End':
      if (isOpen.value) {
        event.preventDefault()
        navigateToLast()
      }
      break
    case 'Backspace':
    case 'Delete':
      if (props.clearable && hasValue.value) {
        event.preventDefault()
        handleClear()
      }
      break
  }
}

const handleContentKeydown = (event: KeyboardEvent) => {
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
    case 'Home':
      event.preventDefault()
      navigateToFirst()
      break
    case 'End':
      event.preventDefault()
      navigateToLast()
      break
    case 'Enter':
      event.preventDefault()
      selectHighlighted()
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      triggerRef.value?.focus()
      break
  }
}

const handleOptionClick = (option: CustomSelectOption, index: number) => {
  if (option.disabled) return
  
  emit('update:modelValue', option.value)
  emit('change', option.value, option)
  isOpen.value = false
  
  // Return focus to trigger
  nextTick(() => {
    triggerRef.value?.focus()
  })
}

const handleOptionHover = (index: number) => {
  highlightedIndex.value = index
}

const handleClear = () => {
  emit('update:modelValue', null)
  emit('change', null, null)
  emit('clear')
  
  // Return focus to trigger
  nextTick(() => {
    triggerRef.value?.focus()
  })
}

const handleOpen = () => {
  emit('open')
  
  nextTick(() => {
    // Focus the content for keyboard navigation
    contentRef.value?.focus()
    
    // Scroll to selected option or highlight first selectable option
    scrollToSelected()
  })
}

const handleClose = () => {
  emit('close')
  highlightedIndex.value = -1
}

// Navigation methods
const navigateDown = () => {
  const currentIndex = highlightedIndex.value
  const nextIndex = findNextSelectableIndex(currentIndex, 1)
  if (nextIndex !== -1) {
    setHighlightedIndex(nextIndex)
  }
}

const navigateUp = () => {
  const currentIndex = highlightedIndex.value
  const prevIndex = findNextSelectableIndex(currentIndex, -1)
  if (prevIndex !== -1) {
    setHighlightedIndex(prevIndex)
  }
}

const navigateToFirst = () => {
  const firstIndex = findNextSelectableIndex(-1, 1)
  if (firstIndex !== -1) {
    setHighlightedIndex(firstIndex)
  }
}

const navigateToLast = () => {
  const lastIndex = findNextSelectableIndex(normalizedOptions.value.length, -1)
  if (lastIndex !== -1) {
    setHighlightedIndex(lastIndex)
  }
}

const findNextSelectableIndex = (currentIndex: number, direction: number): number => {
  let index = currentIndex + direction
  
  while (index >= 0 && index < normalizedOptions.value.length) {
    const option = normalizedOptions.value[index]
    if (!option.disabled) {
      return index
    }
    index += direction
  }
  
  return -1
}

const setHighlightedIndex = (index: number) => {
  highlightedIndex.value = index
  scrollToHighlighted()
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < normalizedOptions.value.length) {
    const option = normalizedOptions.value[highlightedIndex.value]
    if (!option.disabled) {
      handleOptionClick(option, highlightedIndex.value)
    }
  }
}

const scrollToHighlighted = () => {
  if (!contentRef.value || highlightedIndex.value === -1) return
  
  const highlightedElement = contentRef.value.querySelector(`[data-index="${highlightedIndex.value}"]`) as HTMLElement
  if (highlightedElement) {
    highlightedElement.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth'
    })
  }
}

const scrollToSelected = () => {
  if (!isOpen.value) return
  
  const selectedIndex = normalizedOptions.value.findIndex(option => isSelected(option))
  if (selectedIndex >= 0) {
    setHighlightedIndex(selectedIndex)
  } else if (selectableOptions.value.length > 0) {
    // Highlight first selectable option if nothing selected
    const firstSelectableIndex = normalizedOptions.value.findIndex(option => !option.disabled)
    if (firstSelectableIndex >= 0) {
      setHighlightedIndex(firstSelectableIndex)
    }
  }
}

// Focus management
watch(() => isOpen.value, (open) => {
  if (open) {
    nextTick(() => {
      triggerRef.value?.dispatchEvent(new FocusEvent('focus'))
    })
  } else {
    nextTick(() => {
      triggerRef.value?.dispatchEvent(new FocusEvent('blur'))
    })
  }
})

// Slots
defineSlots<{
  selected?: (props: { 
    option: CustomSelectOption
    value: any
  }) => any
  option?: (props: { 
    option: CustomSelectOption
    index: number
    selected: boolean
    highlighted: boolean
  }) => any
}>()

// Component options
defineOptions({
  name: 'LbCustomSelect',
  inheritAttrs: false
})

// Expose
defineExpose({
  triggerRef,
  contentRef,
  isOpen
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-custom-select
  position: relative
  width: 100%

.select-dropdown
  width: 100%

.select-trigger
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  height: var(--lb-input-height-medium)
  padding: 0 var(--lb-space-sm)
  background: var(--lb-background-surface)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-normal)
  border-radius: var(--lb-radius-md)
  font-size: var(--lb-font-size-label-base)
  font-family: inherit
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: border-color var(--lb-transition), box-shadow var(--lb-transition)
  box-sizing: border-box
  gap: var(--lb-space-sm)
  outline: none
  
  &:hover:not([aria-disabled="true"])
    border-color: var(--lb-border-neutral-active)
  
  &:focus
    border-color: var(--lb-border-primary-normal)
    box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-primary-active)
  
  // Focus takes precedence over hover
  &:focus:hover:not([aria-disabled="true"])
    border-color: var(--lb-border-primary-normal)
    box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-primary-active)

// Size variations
.size-large .select-trigger
  height: var(--lb-input-height-large)
  padding: 0 var(--lb-space-md)
  font-size: var(--lb-font-size-label-large)

// State classes
.invalid .select-trigger
  border-color: var(--lb-border-error-normal)
  
  &:focus
    border-color: var(--lb-border-error-active)
    box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-surface-error-active)

.disabled .select-trigger
  background: var(--lb-surface-neutral-subtle)
  color: var(--lb-text-neutral-disabled)
  cursor: not-allowed
  opacity: var(--lb-opacity-60)
  pointer-events: none

.select-value
  flex: 1
  text-align: left
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  color: var(--lb-text-neutral-contrast-high)
  
  &.is-placeholder
    color: var(--lb-text-neutral-contrast-low)

.select-icons
  display: flex
  align-items: center
  gap: var(--lb-space-xs)
  flex-shrink: 0

.icon-clear
  display: flex
  align-items: center
  justify-content: center
  width: var(--lb-space-md)
  height: var(--lb-space-md)
  background: none
  border: none
  color: var(--lb-text-neutral-contrast-low)
  cursor: pointer
  border-radius: var(--lb-radius-xs)
  transition: color var(--lb-transition), opacity var(--lb-transition)
  padding: 0
  
  &:hover
    color: var(--lb-text-neutral-contrast-high)
  
  &:focus-visible
    outline: var(--lb-focus-ring-width) solid var(--lb-focus-ring-color)
    outline-offset: calc(var(--lb-space-2xs) * -1)
  
  &:active
    opacity: var(--lb-opacity-80)

.dropdown-icon
  display: flex
  align-items: center
  justify-content: center
  color: var(--lb-text-neutral-contrast-low)
  transition: transform var(--lb-transition), color var(--lb-transition)
  
  &.is-open
    transform: rotate(180deg)
  
  .select-trigger:focus ~ .select-icons &,
  .select-trigger:hover ~ .select-icons &
    color: var(--lb-text-neutral-contrast-high)

.invalid .select-icons
  color: var(--lb-text-error-normal)

.disabled .select-icons
  opacity: var(--lb-opacity-60)

// Content styles
.select-content
  display: flex
  flex-direction: column
  padding: var(--lb-space-xs)
  gap: var(--lb-space-2xs)
  outline: none
  max-height: 20rem
  overflow-y: auto

.select-option
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  min-height: var(--lb-input-height-medium)
  padding: 0 var(--lb-space-sm)
  background: transparent
  border: none
  border-radius: var(--lb-radius-md)
  font-size: var(--lb-font-size-label-base)
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: background-color var(--lb-transition), color var(--lb-transition)
  box-sizing: border-box
  gap: var(--lb-space-sm)
  
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

.option-content
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  gap: var(--lb-space-sm)

.option-label
  flex: 1
  text-align: left
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.option-checkmark
  display: flex
  align-items: center
  justify-content: center
  width: var(--lb-icon-size-sm)
  height: var(--lb-icon-size-sm)
  color: var(--lb-text-primary-normal)
  flex-shrink: 0
</style>