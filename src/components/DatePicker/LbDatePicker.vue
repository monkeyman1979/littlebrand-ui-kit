<template lang="pug">
.lb-date-picker(:class="datePickerClasses")
  LbPopover(
    v-model:open="isOpen"
    :placement="placement"
    :offset="12"
    :close-on-click-outside="true"
    :close-on-escape="true"
  )
    LbPopoverTrigger(:disabled="disabled")
      button.date-picker-trigger(
        type="button"
        :disabled="disabled"
        :class="{ invalid: invalid, [`size-${size}`]: true }"
        :id="computedId"
        :aria-describedby="computedAriaDescribedby"
        :aria-invalid="invalid || undefined"
        :aria-label="ariaLabel"
        :tabindex="-1"
      )
        .date-display
          span.date-text(:class="{ placeholder: !modelValue }") {{ displayText }}
        .calendar-icon
          svg(viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2")
            path(d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z" stroke-linecap="round" stroke-linejoin="round")
    
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
            :size="size"
            :date-mode="dateMode"
            @change="handleDateSelect"
          )
          
          .date-picker-actions
            .action-group-left
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
            .action-group-right
              LbButton(
                variant="ghost"
                color="neutral"
                size="medium"
                @click="handleCancel"
              ) Cancel
              LbButton(
                variant="filled"
                color="primary"
                size="medium"
                :disabled="!internalDate"
                @click="handleConfirm"
              ) OK
</template>

<script setup lang="ts">
import { computed, ref, watch, inject } from 'vue'
import type { ComputedRef } from 'vue'
import LbButton from '../Buttons/Button/LbButton.vue'
import LbPopover from '../Popover/LbPopover.vue'
import LbPopoverTrigger from '../Popover/LbPopoverTrigger.vue'
import LbPopoverContent from '../Popover/LbPopoverContent.vue'
import LbCalendar from '../Calendar/LbCalendar.vue'

// Types
export type PopoverPlacement = 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'auto'

export interface LbDatePickerProps {
  modelValue?: Date | null
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  clearable?: boolean
  showToday?: boolean
  size?: 'medium' | 'large'
  firstDayOfWeek?: 0 | 1
  locale?: string
  placement?: PopoverPlacement
  offset?: number
  id?: string
  ariaDescribedby?: string
  dateMode?: 'past' | 'future' | 'both'  // Controls year range in calendar
}

// Props
const props = withDefaults(defineProps<LbDatePickerProps>(), {
  modelValue: null,
  placeholder: 'Select date',
  disabled: false,
  invalid: false,
  required: false,
  clearable: false,
  showToday: false,
  size: 'medium',
  firstDayOfWeek: 0,
  locale: 'en-US',
  placement: 'bottom-start',
  offset: 4,
  dateMode: 'both'
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
const isOpen = ref(false)
const internalDate = ref<Date | null>(props.modelValue)

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

const displayText = computed(() => {
  if (internalDate.value) {
    return formatDate(internalDate.value)
  }
  return props.placeholder
})

const ariaLabel = computed(() => {
  if (internalDate.value) {
    return `Selected date: ${formatDate(internalDate.value)}. Click to change.`
  }
  return 'No date selected. Click to select a date.'
})

// Date formatting utility - always uses clear month name format
const formatDate = (date: Date | null): string => {
  if (!date) return ''
  
  const formatter = new Intl.DateTimeFormat(props.locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  
  // This will format as "December 25, 2024" in English
  // and adapt to local conventions in other locales
  return formatter.format(date)
}


// Methods
const handleDateSelect = (date: Date | null) => {
  // Just update the internal date, don't emit or close yet
  internalDate.value = date
}

const selectToday = () => {
  const today = new Date()
  handleDateSelect(today)
}

const clearDate = () => {
  internalDate.value = null
  emit('clear')
}

const handleConfirm = () => {
  emit('update:modelValue', internalDate.value)
  emit('change', internalDate.value)
  isOpen.value = false
  emit('close')
}

const handleCancel = () => {
  // Reset to the current modelValue
  internalDate.value = props.modelValue
  isOpen.value = false
  emit('close')
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  internalDate.value = newValue
}, { immediate: true })

// Watch for open state changes
watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    // Reset internal date to match modelValue when opening
    internalDate.value = props.modelValue
    emit('open')
  } else {
    emit('close')
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
  width: max-content
  display: inline-block
  
  &.disabled
    pointer-events: none
    opacity: var(--lb-opacity-60)
  
  // Make the popover trigger take full width
  :deep(.lb-popover-trigger)
    display: block
    width: max-content

.date-picker-trigger
  position: relative
  width: 100%
  display: flex
  align-items: center
  justify-content: space-between
  gap: var(--lb-space-md)
  padding: 0 var(--lb-space-md)
  background: var(--lb-background-surface)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  border-radius: var(--lb-radius-md)
  font-family: var(--lb-font-body)
  font-size: var(--lb-font-size-label-base)
  color: var(--lb-text-neutral-contrast-high)
  transition: all var(--lb-transition)
  height: var(--lb-input-height-medium)
  cursor: pointer
  text-align: left
  
  &.size-large
    height: var(--lb-input-height-large)
    font-size: var(--lb-font-size-label-large)
  
  &:focus
    outline: none
    border-color: var(--lb-border-neutral-focus)
    box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-focus-ring-color)
  
  &:hover:not(:disabled)
    border-color: var(--lb-border-neutral-active)
    background: var(--lb-surface-neutral-hover)
  
  &.invalid
    border-color: var(--lb-border-error-normal)
    
    &:focus
      border-color: var(--lb-border-error-focus)
      box-shadow: 0 0 0 var(--lb-focus-ring-width) var(--lb-border-error-focus)
  
  &:disabled
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
    background: var(--lb-surface-neutral-subtle)

.date-display
  flex: 1
  
  .date-text
    &.placeholder
      color: var(--lb-text-neutral-contrast-low)

.calendar-icon
  display: flex
  align-items: center
  justify-content: center
  color: var(--lb-text-neutral-contrast-low)
  
  svg
    width: var(--lb-icon-size-md)
    height: var(--lb-icon-size-md)
    flex-shrink: 0


.date-picker-content
  display: flex
  flex-direction: column
  gap: var(--lb-space-md)
  min-width: 20rem // 320px using rem units

.date-picker-actions
  display: flex
  justify-content: space-between
  align-items: center
  padding-top: var(--lb-space-md)
  border-top: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  
  .action-group-left,
  .action-group-right
    display: flex
    align-items: center
    gap: var(--lb-space-xs)
</style>