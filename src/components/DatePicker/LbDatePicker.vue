<template lang="pug">
.lb-date-picker(:class="datePickerClasses")
  .date-picker-input-container
    input.date-picker-native-input(
      ref="inputRef"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ invalid: invalid || inputError, [`size-${size}`]: true }"
      :required="required"
      :id="computedId"
      :aria-describedby="computedAriaDescribedby"
      :aria-invalid="invalid || inputError || undefined"
      type="text"
      inputmode="numeric"
      @input="handleNativeInput"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @keydown.enter="handleInputEnter"
      @keydown="handleKeydown"
    )
    button.calendar-trigger(
      type="button"
      :disabled="disabled"
      :aria-label="isOpen ? 'Close calendar' : 'Open calendar'"
      @click.stop="toggleCalendar"
    )
      svg(viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2")
        path(d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z" stroke-linecap="round" stroke-linejoin="round")
    
  LbPopover(
    v-model:open="isOpen"
    :placement="placement"
    :offset="offset"
    :close-on-click-outside="true"
    :close-on-escape="true"
  )
    LbPopoverTrigger(ref="popoverTriggerRef")
      span(ref="triggerRef" style="display: none;")
    
    LbPopoverContent
      .date-picker-content
          LbCalendar(
            v-model="internalDate"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            :first-day-of-week="firstDayOfWeek"
            :locale="locale"
            variant="embedded"
            @change="handleDateSelect"
          )
          
          .date-picker-actions(v-if="showActions")
            .actions-left
              LbButton(
                v-if="clearable"
                variant="ghost" 
                color="neutral"
                size="medium"
                @click="clearDate"
              ) Clear
              LbButton(
                v-if="showToday"
                variant="ghost"
                color="neutral"
                size="medium"
                @click="selectToday"
              ) Today
            .actions-right(v-if="showConfirmButtons")
              LbButton(
                variant="outline"
                color="neutral"
                size="medium"
                @click="handleCancel"
              ) Cancel
              LbButton(
                variant="filled"
                color="primary"
                size="medium"
                @click="handleConfirm"
              ) OK
</template>

<script setup lang="ts">
import { computed, ref, watch, inject, onMounted, nextTick } from 'vue'
import type { ComputedRef } from 'vue'
import LbInput from '../Input/LbInput.vue'
import LbButton from '../Buttons/Button/LbButton.vue'
import LbPopover from '../Popover/LbPopover.vue'
import LbPopoverTrigger from '../Popover/LbPopoverTrigger.vue'
import LbPopoverContent from '../Popover/LbPopoverContent.vue'
import LbCalendar from '../Calendar/LbCalendar.vue'

// Types
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
export type PopoverPlacement = 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'auto'

export interface LbDatePickerProps {
  modelValue?: Date | null
  format?: DateFormat
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  clearable?: boolean
  showToday?: boolean
  showConfirmButtons?: boolean
  size?: 'medium' | 'large'
  firstDayOfWeek?: 0 | 1
  locale?: string
  placement?: PopoverPlacement
  offset?: number
  id?: string
  ariaDescribedby?: string
  stayOpen?: boolean
}

// Props
const props = withDefaults(defineProps<LbDatePickerProps>(), {
  modelValue: null,
  format: 'MM/DD/YYYY',
  placeholder: 'Select date...',
  disabled: false,
  invalid: false,
  required: false,
  clearable: true,
  showToday: true,
  showConfirmButtons: true,
  size: 'medium',
  firstDayOfWeek: 0,
  locale: 'en-US',
  placement: 'bottom',
  offset: 4,
  stayOpen: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'change': [value: Date | null]
  'clear': []
  'open': []
  'close': []
}>()

// Refs
const inputRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popoverTriggerRef = ref<any>(null)
const isOpen = ref(false)
const internalDate = ref<Date | null>(props.modelValue)
const inputValue = ref('')
const inputError = ref(false)
const isInputFocused = ref(false)

// Inject form field context if available
const injectedId = inject<ComputedRef<string> | undefined>('formFieldId', undefined)
const injectedAriaDescribedby = inject<ComputedRef<string | undefined> | undefined>('formFieldAriaDescribedby', undefined)

// Computed
const computedId = computed(() => {
  return props.id || injectedId?.value
})

const computedAriaDescribedby = computed(() => {
  return props.ariaDescribedby || injectedAriaDescribedby?.value || undefined
})

const datePickerClasses = computed(() => ({
  'disabled': props.disabled,
  'invalid': props.invalid,
  [`size-${props.size}`]: true
}))

const showActions = computed(() => props.showToday || props.clearable || props.showConfirmButtons)

// Date formatting utility
const formatDate = (date: Date | null, format: DateFormat): string => {
  if (!date) return ''
  
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  
  return format
    .replace('DD', d)
    .replace('MM', m)
    .replace('YYYY', y.toString())
    .replace('YY', y.toString().slice(-2))
}

// Parse date from input string based on format
const parseDate = (input: string, format: DateFormat): Date | null => {
  if (!input || input.trim() === '') return null
  
  // Remove any non-numeric characters except slashes and dashes
  const cleanInput = input.replace(/[^0-9\/\-]/g, '')
  
  let day: number, month: number, year: number
  
  if (format === 'MM/DD/YYYY') {
    const match = cleanInput.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
    if (!match) return null
    month = parseInt(match[1], 10)
    day = parseInt(match[2], 10)
    year = parseInt(match[3], 10)
  } else if (format === 'DD/MM/YYYY') {
    const match = cleanInput.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
    if (!match) return null
    day = parseInt(match[1], 10)
    month = parseInt(match[2], 10)
    year = parseInt(match[3], 10)
  } else if (format === 'YYYY-MM-DD') {
    const match = cleanInput.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/)
    if (!match) return null
    year = parseInt(match[1], 10)
    month = parseInt(match[2], 10)
    day = parseInt(match[3], 10)
  } else {
    return null
  }
  
  // Handle 2-digit years
  if (year < 100) {
    year += year < 50 ? 2000 : 1900
  }
  
  // Validate month and day
  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null
  
  // Create date and check if it's valid
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  
  // Check constraints
  if (props.minDate && date < props.minDate) return null
  if (props.maxDate && date > props.maxDate) return null
  if (props.disabledDates) {
    if (Array.isArray(props.disabledDates)) {
      const isDisabled = props.disabledDates.some(d => 
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      )
      if (isDisabled) return null
    } else if (typeof props.disabledDates === 'function') {
      if (props.disabledDates(date)) return null
    }
  }
  
  return date
}

const formattedDate = computed(() => {
  return formatDate(internalDate.value, props.format)
})

// Methods
const formatInputAsTyping = (input: string, format: DateFormat): string => {
  // Remove all non-numeric characters
  const numbers = input.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  let formatted = ''
  
  if (format === 'MM/DD/YYYY') {
    // MM/DD/YYYY format
    if (numbers.length <= 2) {
      formatted = numbers
    } else if (numbers.length <= 4) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2)
    } else if (numbers.length <= 8) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4)
    } else {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8)
    }
  } else if (format === 'DD/MM/YYYY') {
    // DD/MM/YYYY format
    if (numbers.length <= 2) {
      formatted = numbers
    } else if (numbers.length <= 4) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2)
    } else if (numbers.length <= 8) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4)
    } else {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8)
    }
  } else if (format === 'YYYY-MM-DD') {
    // YYYY-MM-DD format
    if (numbers.length <= 4) {
      formatted = numbers
    } else if (numbers.length <= 6) {
      formatted = numbers.slice(0, 4) + '-' + numbers.slice(4)
    } else if (numbers.length <= 8) {
      formatted = numbers.slice(0, 4) + '-' + numbers.slice(4, 6) + '-' + numbers.slice(6)
    } else {
      formatted = numbers.slice(0, 4) + '-' + numbers.slice(4, 6) + '-' + numbers.slice(6, 8)
    }
  }
  
  return formatted
}

const handleNativeInput = (event: Event) => {
  if (props.disabled) return
  
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Format the input as user types
  const formatted = formatInputAsTyping(value, props.format)
  
  // Update the value
  inputValue.value = formatted
  
  // Clear error while typing
  inputError.value = false
  
  // Open calendar when user starts typing (shows visual feedback)
  if (!isOpen.value && formatted.length > 0) {
    isOpen.value = true
    // Set proper trigger for positioning
    if (popoverTriggerRef.value && inputRef.value) {
      popoverTriggerRef.value.triggerElement = inputRef.value.$el || inputRef.value
    }
    emit('open')
  }
  
  // Try to parse if we have a complete date
  const expectedLength = props.format === 'YYYY-MM-DD' ? 10 : 10
  if (formatted.length === expectedLength) {
    const parsedDate = parseDate(formatted, props.format)
    if (parsedDate) {
      internalDate.value = parsedDate
      if (!props.showConfirmButtons) {
        emit('update:modelValue', parsedDate)
        emit('change', parsedDate)
      }
    }
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Allow backspace to work naturally
  if (event.key === 'Backspace') {
    return
  }
  
  // Block non-numeric keys except for control keys
  if (!/\d/.test(event.key) && !['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(event.key)) {
    event.preventDefault()
  }
}

const handleInputFocus = () => {
  if (props.disabled) return
  
  // Set focused flag
  isInputFocused.value = true
  
  // Set input value to formatted date or empty
  if (internalDate.value) {
    inputValue.value = formattedDate.value
  } else {
    inputValue.value = ''
  }
  inputError.value = false
  
  // Don't automatically open calendar on focus - let user decide
  // They can click the calendar icon or start typing
}

const handleInputBlur = () => {
  if (props.disabled) return
  
  // Clear focused flag
  isInputFocused.value = false
  
  // Try to parse the input
  const parsedDate = parseDate(inputValue.value, props.format)
  
  if (inputValue.value.trim() === '') {
    // Empty input - clear the date
    internalDate.value = null
    inputError.value = false
    if (!props.showConfirmButtons) {
      emit('update:modelValue', null)
      emit('change', null)
      emit('clear')
    }
  } else if (parsedDate) {
    // Valid date entered
    internalDate.value = parsedDate
    inputError.value = false
    inputValue.value = formatDate(parsedDate, props.format)
    if (!props.showConfirmButtons) {
      emit('update:modelValue', parsedDate)
      emit('change', parsedDate)
    }
  } else {
    // Invalid or incomplete input - check if it's incomplete
    const expectedLength = props.format === 'YYYY-MM-DD' ? 10 : 10
    if (inputValue.value.length < expectedLength) {
      // Incomplete date - revert to previous value
      if (internalDate.value) {
        inputValue.value = formattedDate.value
      } else {
        inputValue.value = ''
      }
      inputError.value = false
    } else {
      // Complete but invalid date - show error
      inputError.value = true
    }
  }
}

const handleInputEnter = () => {
  if (props.disabled) return
  
  // Try to parse and set the date
  const parsedDate = parseDate(inputValue.value, props.format)
  if (parsedDate) {
    internalDate.value = parsedDate
    inputError.value = false
    inputValue.value = formatDate(parsedDate, props.format)
    if (!props.showConfirmButtons) {
      emit('update:modelValue', parsedDate)
      emit('change', parsedDate)
    }
    // Open calendar to show the selected date
    if (!isOpen.value) {
      isOpen.value = true
      emit('open')
    }
  }
}

const openCalendar = () => {
  if (props.disabled) return
  
  // This is now only used programmatically
  if (!isOpen.value) {
    isOpen.value = true
    emit('open')
  }
}

const toggleCalendar = () => {
  if (props.disabled) return
  
  // Calendar icon always toggles
  isOpen.value = !isOpen.value
  
  if (isOpen.value) {
    // Set the trigger ref to the input container for proper positioning
    if (popoverTriggerRef.value && inputRef.value) {
      popoverTriggerRef.value.triggerElement = inputRef.value.$el || inputRef.value
    }
    emit('open')
  } else {
    emit('close')
  }
}

const handleDateSelect = (date: Date | null) => {
  internalDate.value = date
  // If no confirm buttons, update immediately
  if (!props.showConfirmButtons) {
    emit('update:modelValue', date)
    emit('change', date)
    if (!props.stayOpen) {
      isOpen.value = false
      emit('close')
    }
  }
  // Otherwise wait for OK button
}

const selectToday = () => {
  const today = new Date()
  internalDate.value = today
}

const clearDate = () => {
  internalDate.value = null
}

const handleCancel = () => {
  // Reset to original value
  internalDate.value = props.modelValue
  inputError.value = false
  if (props.modelValue) {
    inputValue.value = formatDate(props.modelValue, props.format)
  } else {
    inputValue.value = ''
  }
  isOpen.value = false
  emit('close')
}

const handleConfirm = () => {
  // Clear any input errors when confirming
  inputError.value = false
  // Confirm the selection
  emit('update:modelValue', internalDate.value)
  emit('change', internalDate.value)
  if (internalDate.value === null) {
    emit('clear')
  }
  isOpen.value = false
  emit('close')
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  internalDate.value = newValue
  if (newValue) {
    inputValue.value = formatDate(newValue, props.format)
  } else {
    inputValue.value = ''
  }
  inputError.value = false
}, { immediate: true })

// Update input when internal date changes
watch(internalDate, (newDate) => {
  if (newDate) {
    inputValue.value = formatDate(newDate, props.format)
  } else if (!inputError.value) {
    inputValue.value = ''
  }
})

// Watch for open state changes
watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    emit('open')
  } else {
    emit('close')
    // Clear focus flag when calendar closes
    isInputFocused.value = false
  }
})

// Set up popover trigger on mount
onMounted(() => {
  // Set the input container as the trigger element for the popover
  if (popoverTriggerRef.value && inputRef.value) {
    const inputEl = inputRef.value.$el || inputRef.value
    const container = inputEl.closest('.date-picker-input-container')
    if (container) {
      popoverTriggerRef.value.triggerElement = container
    }
  }
})

// Component options
defineOptions({
  name: 'LbDatePicker',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-date-picker
  width: 100%
  
  &.disabled
    pointer-events: none
    opacity: var(--lb-opacity-60)

.date-picker-input-container
  position: relative
  width: 100%
  display: flex
  align-items: center

.date-picker-native-input
  width: 100%
  padding: 0 var(--lb-space-md)
  padding-right: var(--lb-space-5xl) // Space for icon
  background: var(--lb-background-surface)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  border-radius: var(--lb-radius-md)
  font-family: var(--lb-font-body)
  font-size: var(--lb-font-size-body-base)
  color: var(--lb-text-neutral-contrast-high)
  transition: all var(--lb-transition)
  height: var(--lb-input-height-medium)
  
  &.size-large
    height: var(--lb-input-height-large)
    font-size: var(--lb-font-size-body-large)
  
  &:focus
    outline: none
    border-color: var(--lb-border-neutral-focus)
    box-shadow: 0 0 0 3px var(--lb-surface-neutral-hover)
  
  &:hover:not(:disabled):not(:focus)
    border-color: var(--lb-border-neutral-active)
  
  &.invalid
    border-color: var(--lb-border-error-normal)
    
    &:focus
      border-color: var(--lb-border-error-focus)
      box-shadow: 0 0 0 3px var(--lb-surface-error-hover)
  
  &:disabled
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
    background: var(--lb-surface-neutral-subtle)
  
  &::placeholder
    color: var(--lb-text-neutral-contrast-low)

.calendar-trigger
  position: absolute
  right: var(--lb-space-xs)
  top: 50%
  transform: translateY(-50%)
  display: flex
  align-items: center
  justify-content: center
  width: var(--lb-space-3xl)  // 32px for medium
  height: var(--lb-space-3xl)  // 32px for medium
  padding: 0
  background: transparent
  border: none
  border-radius: var(--lb-radius-sm)
  color: var(--lb-text-neutral-contrast-low)
  cursor: pointer
  transition: all var(--lb-transition)
  
  &:hover:not(:disabled)
    color: var(--lb-text-neutral-contrast-high)
    background: var(--lb-surface-neutral-hover)
  
  &:focus-visible
    outline: var(--lb-focus-ring-width) solid var(--lb-focus-ring-color)
    outline-offset: calc(var(--lb-space-2xs) * -1)
  
  &:active:not(:disabled)
    opacity: var(--lb-opacity-80)
  
  &:disabled
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
  
  svg
    width: var(--lb-icon-size-md)
    height: var(--lb-icon-size-md)
    flex-shrink: 0

// Size modifiers for calendar trigger
.lb-date-picker.size-large
  .calendar-trigger
    width: var(--lb-space-4xl)  // 40px for large
    height: var(--lb-space-4xl)  // 40px for large


.date-picker-content
  display: flex
  flex-direction: column
  gap: var(--lb-space-md)
  min-width: 20rem // 320px using rem units

.date-picker-actions
  display: flex
  justify-content: space-between
  align-items: center
  gap: var(--lb-space-md)
  padding-top: var(--lb-space-md)
  border-top: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  
  .actions-left
    display: flex
    gap: var(--lb-space-xs)  // 4px
    align-items: center
    
  .actions-right
    display: flex
    gap: var(--lb-space-xs)  // 4px
    align-items: center
    
  // When no right actions, left actions should not be pushed
  &:not(:has(.actions-right))
    justify-content: flex-start
</style>