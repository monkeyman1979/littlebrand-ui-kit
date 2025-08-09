<template lang="pug">
.lb-calendar(
  :class="calendarClasses"
  :aria-label="calendarAriaLabel"
  role="application"
)
  .calendar-header
    .calendar-navigation
      LbButton(
        icon-only
        size="medium"
        variant="ghost"
        color="neutral"
        :disabled="!canNavigatePrevious"
        @click="navigatePrevious"
        :aria-label="previousAriaLabel"
      )
        template(#icon-leading)
          svg(width="20" height="20" viewBox="0 0 20 20" fill="currentColor")
            path(d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z")
      
      .calendar-selects
        LbSelect.month-select(
          v-model="selectedMonth"
          :options="monthOptions"
          size="medium"
          :aria-label="monthSelectAriaLabel"
          @change="handleMonthChange"
        )
        LbSelect.year-select(
          v-model="selectedYear"
          :options="yearOptions"
          searchable
          search-input-type="number"
          search-placeholder="Enter year..."
          size="medium"
          :aria-label="yearSelectAriaLabel"
          @change="handleYearChange"
        )
      
      LbButton(
        icon-only
        size="medium"
        variant="ghost"
        color="neutral"
        :disabled="!canNavigateNext"
        @click="navigateNext"
        :aria-label="nextAriaLabel"
      )
        template(#icon-leading)
          svg(width="20" height="20" viewBox="0 0 20 20" fill="currentColor")
            path(d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z")
  
  .calendar-grid(
    role="grid"
    :aria-label="gridAriaLabel"
    @keydown="handleGridKeydown"
  )
    .weekday-labels(role="row")
      .weekday(
        v-for="day in weekdayLabels"
        :key="day.short"
        role="columnheader"
        :aria-label="day.full"
      ) {{ day.short }}
    
    .days-grid
      .calendar-week(
        v-for="(week, weekIndex) in calendarWeeks"
        :key="weekIndex"
        role="row"
      )
        button.day(
          v-for="(day, dayIndex) in week"
          :key="`${weekIndex}-${dayIndex}`"
          :class="getDayClasses(day)"
          :disabled="day.disabled"
          :tabindex="getTabIndex(day)"
          :aria-label="getDayAriaLabel(day)"
          :aria-selected="day.selected ? 'true' : undefined"
          :aria-current="day.isToday ? 'date' : undefined"
          role="gridcell"
          @click="selectDate(day)"
          @focus="handleDayFocus(day)"
          @keydown="handleDayKeydown($event, day)"
        )
          span.day-number {{ day.date }}
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import LbButton from '../Buttons/Button/LbButton.vue'
import LbSelect from '../Select/LbSelect.vue'

// Types
export interface CalendarDay {
  date: number
  fullDate: Date
  isCurrentMonth: boolean
  isToday: boolean
  selected: boolean
  disabled: boolean
  inRange?: boolean
}

export interface CalendarWeek extends Array<CalendarDay> {}

export interface LbCalendarProps {
  modelValue?: Date | null
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  firstDayOfWeek?: 0 | 1  // 0 = Sunday, 1 = Monday
  locale?: string
}

// Props
const props = withDefaults(defineProps<LbCalendarProps>(), {
  modelValue: null,
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  firstDayOfWeek: 0,
  locale: 'en-US'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'change': [value: Date | null]
  'navigate': [value: { month: number, year: number }]
}>()

// Refs
const focusedDate = ref<Date | null>(null)

// State
const currentDate = ref(new Date())
const selectedMonth = ref(currentDate.value.getMonth())
const selectedYear = ref(currentDate.value.getFullYear())

// Initialize current date from modelValue or use today
if (props.modelValue) {
  currentDate.value = new Date(props.modelValue)
  selectedMonth.value = currentDate.value.getMonth()
  selectedYear.value = currentDate.value.getFullYear()
} else {
  // If no value, initialize to today (or min/max if today is outside range)
  let initDate = new Date()
  if (props.minDate && initDate < props.minDate) {
    initDate = new Date(props.minDate)
  } else if (props.maxDate && initDate > props.maxDate) {
    initDate = new Date(props.maxDate)
  }
  selectedMonth.value = initDate.getMonth()
  selectedYear.value = initDate.getFullYear()
}

// Ensure the selected month is valid for the selected year
if (props.minDate && selectedYear.value === props.minDate.getFullYear()) {
  const minMonth = props.minDate.getMonth()
  if (selectedMonth.value < minMonth) {
    selectedMonth.value = minMonth
  }
}

if (props.maxDate && selectedYear.value === props.maxDate.getFullYear()) {
  const maxMonth = props.maxDate.getMonth()
  if (selectedMonth.value > maxMonth) {
    selectedMonth.value = maxMonth
  }
}

// Computed
const calendarClasses = computed(() => ({
  'lb-calendar': true
}))

// Date utilities
const today = new Date()
const currentMonthStart = computed(() => new Date(selectedYear.value, selectedMonth.value, 1))
const currentMonthEnd = computed(() => new Date(selectedYear.value, selectedMonth.value + 1, 0))

// Month options for dropdown (filtered by min/max dates for current year)
const monthOptions = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, { month: 'long' })
  const shortFormatter = new Intl.DateTimeFormat(props.locale, { month: 'short' })
  
  let startMonth = 0
  let endMonth = 11
  
  // If we're in the min year, start from min month
  if (props.minDate && selectedYear.value === props.minDate.getFullYear()) {
    startMonth = props.minDate.getMonth()
  }
  
  // If we're in the max year, end at max month
  if (props.maxDate && selectedYear.value === props.maxDate.getFullYear()) {
    endMonth = props.maxDate.getMonth()
  }
  
  const months = []
  for (let i = startMonth; i <= endMonth; i++) {
    const date = new Date(2024, i, 1)
    months.push({
      value: i,
      label: formatter.format(date),
      displayLabel: shortFormatter.format(date),
      disabled: false
    })
  }
  
  return months
})

// Year options for dropdown (filtered by min/max dates)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  
  // Determine year range based on min/max dates
  let startYear = props.minDate ? props.minDate.getFullYear() : Math.min(1900, currentYear - 100)
  let endYear = props.maxDate ? props.maxDate.getFullYear() : Math.max(2100, currentYear + 100)
  
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
    value: startYear + i,
    label: String(startYear + i)
  }))
})

// Weekday labels
const weekdayLabels = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, { weekday: 'short' })
  const longFormatter = new Intl.DateTimeFormat(props.locale, { weekday: 'long' })
  
  // Get days starting from firstDayOfWeek
  const days = []
  for (let i = 0; i < 7; i++) {
    const dayIndex = (props.firstDayOfWeek + i) % 7
    // Create date for the weekday (using any Sunday as reference)
    const date = new Date(2024, 0, 7 + dayIndex) // January 7, 2024 is a Sunday
    days.push({
      short: formatter.format(date),
      full: longFormatter.format(date)
    })
  }
  
  return days
})

// Calendar weeks
const calendarWeeks = computed((): CalendarWeek[] => {
  const weeks: CalendarWeek[] = []
  const firstDay = new Date(currentMonthStart.value)
  
  // Get the first day of the week to show
  const startDay = new Date(firstDay)
  const dayOfWeek = (firstDay.getDay() - props.firstDayOfWeek + 7) % 7
  startDay.setDate(startDay.getDate() - dayOfWeek)
  
  // Generate 6 weeks (42 days)
  for (let week = 0; week < 6; week++) {
    const weekDays: CalendarDay[] = []
    
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDay)
      date.setDate(startDay.getDate() + (week * 7) + day)
      
      const isCurrentMonth = date.getMonth() === selectedMonth.value
      const isToday = isSameDate(date, today)
      const selected = props.modelValue && isSameDate(date, props.modelValue)
      const disabled = isDateDisabled(date)
      
      weekDays.push({
        date: date.getDate(),
        fullDate: new Date(date),
        isCurrentMonth,
        isToday,
        selected: !!selected,
        disabled
      })
    }
    
    weeks.push(weekDays)
  }
  
  return weeks
})

// Navigation checks
const canNavigatePrevious = computed(() => {
  if (!props.minDate) return true
  const prevMonth = new Date(selectedYear.value, selectedMonth.value - 1, 1)
  return prevMonth >= new Date(props.minDate.getFullYear(), props.minDate.getMonth(), 1)
})

const canNavigateNext = computed(() => {
  if (!props.maxDate) return true
  const nextMonth = new Date(selectedYear.value, selectedMonth.value + 1, 1)
  return nextMonth <= new Date(props.maxDate.getFullYear(), props.maxDate.getMonth(), 1)
})

// Aria labels
const calendarAriaLabel = computed(() => {
  const monthOption = monthOptions.value.find(m => m.value === selectedMonth.value)
  const monthName = monthOption ? monthOption.label : new Intl.DateTimeFormat(props.locale, { month: 'long' }).format(new Date(selectedYear.value, selectedMonth.value, 1))
  return `Calendar for ${monthName} ${selectedYear.value}`
})
const gridAriaLabel = computed(() => {
  const monthOption = monthOptions.value.find(m => m.value === selectedMonth.value)
  const monthName = monthOption ? monthOption.label : new Intl.DateTimeFormat(props.locale, { month: 'long' }).format(new Date(selectedYear.value, selectedMonth.value, 1))
  return `${monthName} ${selectedYear.value}`
})
const monthSelectAriaLabel = computed(() => 'Select month')
const yearSelectAriaLabel = computed(() => 'Select year')
const previousAriaLabel = computed(() => 'Previous month')
const nextAriaLabel = computed(() => 'Next month')

// Utility functions
const isSameDate = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

const isDateDisabled = (date: Date): boolean => {
  // Check min/max constraints
  if (props.minDate && date < props.minDate) return true
  if (props.maxDate && date > props.maxDate) return true
  
  // Check disabled dates
  if (props.disabledDates) {
    if (Array.isArray(props.disabledDates)) {
      return props.disabledDates.some(disabledDate => isSameDate(date, disabledDate))
    } else if (typeof props.disabledDates === 'function') {
      return props.disabledDates(date)
    }
  }
  
  return false
}

const getDayClasses = (day: CalendarDay) => ({
  'current-month': day.isCurrentMonth,
  'other-month': !day.isCurrentMonth,
  'today': day.isToday,
  'selected': day.selected,
  'disabled': day.disabled
})

const getTabIndex = (day: CalendarDay): number => {
  if (day.disabled) return -1
  
  // Focus on selected date, today, or first day of current month
  if (day.selected) return 0
  if (!props.modelValue && day.isToday && day.isCurrentMonth) return 0
  if (!props.modelValue && !hasToday() && isFirstDayOfMonth(day)) return 0
  
  return -1
}

const hasToday = (): boolean => {
  return calendarWeeks.value.some(week =>
    week.some(day => day.isToday && day.isCurrentMonth)
  )
}

const isFirstDayOfMonth = (day: CalendarDay): boolean => {
  return day.date === 1 && day.isCurrentMonth
}

const getDayAriaLabel = (day: CalendarDay): string => {
  const formatter = new Intl.DateTimeFormat(props.locale, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  let label = formatter.format(day.fullDate)
  
  if (day.isToday) label += ', today'
  if (day.selected) label += ', selected'
  if (!day.isCurrentMonth) label += ', outside current month'
  
  return label
}

// Event handlers
const handleMonthChange = (month: number) => {
  selectedMonth.value = month
  emit('navigate', { month, year: selectedYear.value })
}

const handleYearChange = (year: number) => {
  selectedYear.value = year
  
  // Adjust month if it's now out of range
  if (props.minDate && year === props.minDate.getFullYear()) {
    const minMonth = props.minDate.getMonth()
    if (selectedMonth.value < minMonth) {
      selectedMonth.value = minMonth
    }
  }
  
  if (props.maxDate && year === props.maxDate.getFullYear()) {
    const maxMonth = props.maxDate.getMonth()
    if (selectedMonth.value > maxMonth) {
      selectedMonth.value = maxMonth
    }
  }
  
  emit('navigate', { month: selectedMonth.value, year })
}

const navigatePrevious = () => {
  if (!canNavigatePrevious.value) return
  
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11
    selectedYear.value -= 1
  } else {
    selectedMonth.value -= 1
  }
  
  emit('navigate', { month: selectedMonth.value, year: selectedYear.value })
}

const navigateNext = () => {
  if (!canNavigateNext.value) return
  
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0
    selectedYear.value += 1
  } else {
    selectedMonth.value += 1
  }
  
  emit('navigate', { month: selectedMonth.value, year: selectedYear.value })
}

const selectDate = (day: CalendarDay) => {
  if (day.disabled) return
  
  const newDate = new Date(day.fullDate)
  emit('update:modelValue', newDate)
  emit('change', newDate)
  
  // Update focused date
  focusedDate.value = newDate
}

const handleDayFocus = (day: CalendarDay) => {
  if (!day.disabled) {
    focusedDate.value = new Date(day.fullDate)
  }
}

// Keyboard navigation
const handleGridKeydown = (event: KeyboardEvent) => {
  // Let individual day handlers deal with navigation
  // This is here for potential future grid-level shortcuts
}

const handleDayKeydown = (event: KeyboardEvent, day: CalendarDay) => {
  const { key } = event
  
  switch (key) {
    case 'ArrowLeft':
      event.preventDefault()
      navigateDay(-1)
      break
    case 'ArrowRight':
      event.preventDefault()
      navigateDay(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      navigateDay(-7)
      break
    case 'ArrowDown':
      event.preventDefault()
      navigateDay(7)
      break
    case 'Home':
      event.preventDefault()
      navigateToFirstDayOfWeek()
      break
    case 'End':
      event.preventDefault()
      navigateToLastDayOfWeek()
      break
    case 'PageUp':
      event.preventDefault()
      navigateMonth(event.shiftKey ? -12 : -1)
      break
    case 'PageDown':
      event.preventDefault()
      navigateMonth(event.shiftKey ? 12 : 1)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectDate(day)
      break
  }
}

const navigateDay = (days: number) => {
  if (!focusedDate.value) return
  
  const newDate = new Date(focusedDate.value)
  newDate.setDate(newDate.getDate() + days)
  
  // Check if we need to navigate months
  if (newDate.getMonth() !== selectedMonth.value || newDate.getFullYear() !== selectedYear.value) {
    selectedMonth.value = newDate.getMonth()
    selectedYear.value = newDate.getFullYear()
    emit('navigate', { month: selectedMonth.value, year: selectedYear.value })
  }
  
  focusedDate.value = newDate
  
  // Focus the new day after navigation
  nextTick(() => {
    const dayButton = findDayButton(newDate)
    if (dayButton && !isDateDisabled(newDate)) {
      dayButton.focus()
    }
  })
}

const navigateToFirstDayOfWeek = () => {
  if (!focusedDate.value) return
  
  const current = new Date(focusedDate.value)
  const dayOfWeek = (current.getDay() - props.firstDayOfWeek + 7) % 7
  current.setDate(current.getDate() - dayOfWeek)
  
  focusedDate.value = current
  nextTick(() => {
    const dayButton = findDayButton(current)
    if (dayButton && !isDateDisabled(current)) {
      dayButton.focus()
    }
  })
}

const navigateToLastDayOfWeek = () => {
  if (!focusedDate.value) return
  
  const current = new Date(focusedDate.value)
  const dayOfWeek = (current.getDay() - props.firstDayOfWeek + 7) % 7
  current.setDate(current.getDate() + (6 - dayOfWeek))
  
  focusedDate.value = current
  nextTick(() => {
    const dayButton = findDayButton(current)
    if (dayButton && !isDateDisabled(current)) {
      dayButton.focus()
    }
  })
}

const navigateMonth = (months: number) => {
  const newDate = new Date(selectedYear.value, selectedMonth.value + months, 1)
  selectedMonth.value = newDate.getMonth()
  selectedYear.value = newDate.getFullYear()
  emit('navigate', { month: selectedMonth.value, year: selectedYear.value })
  
  // Keep focused date in the new month if possible
  if (focusedDate.value) {
    const newFocusedDate = new Date(selectedYear.value, selectedMonth.value, focusedDate.value.getDate())
    // If the date doesn't exist in the new month (e.g., March 31 -> February), use last day
    if (newFocusedDate.getMonth() !== selectedMonth.value) {
      newFocusedDate.setDate(0) // Last day of previous month
    }
    focusedDate.value = newFocusedDate
  }
}

const findDayButton = (date: Date): HTMLButtonElement | null => {
  const buttons = document.querySelectorAll('.lb-calendar .day')
  for (const button of buttons) {
    const day = calendarWeeks.value
      .flat()
      .find(d => isSameDate(d.fullDate, date))
    
    if (day && button.textContent?.trim() === String(day.date)) {
      return button as HTMLButtonElement
    }
  }
  return null
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const date = new Date(newValue)
    selectedMonth.value = date.getMonth()
    selectedYear.value = date.getFullYear()
    focusedDate.value = date
  }
})

// Component options
defineOptions({
  name: 'LbCalendar',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-calendar
  display: inline-block
  width: min(24rem, 100%)
  background: var(--lb-background-surface)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-line)
  border-radius: var(--lb-radius-lg)
  padding: var(--lb-space-md)
  font-family: var(--lb-font-body)

.calendar-header
  display: flex
  align-items: center
  justify-content: space-between
  margin-bottom: var(--lb-space-lg)
  gap: var(--lb-space-md)

.calendar-navigation
  display: flex
  align-items: center
  gap: var(--lb-space-xs)
  flex: 1

.calendar-selects
  display: flex
  gap: var(--lb-space-xs)
  flex: 1
  min-width: 0
  
  .month-select
    flex: 1
  
  .year-select
    flex: none
    width: auto

.calendar-grid
  width: 100%

.weekday-labels
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 0
  margin-bottom: 2px

.weekday
  display: flex
  align-items: center
  justify-content: center
  min-width: base.$size-7xl // 48px to match day cells
  height: base.$size-6xl // Keep weekday labels at 40px height
  font-size: var(--lb-font-size-label-small)
  font-weight: var(--lb-font-weight-medium)
  color: var(--lb-text-neutral-contrast-low)
  text-align: center

.days-grid
  display: flex
  flex-direction: column
  row-gap: 2px

.calendar-week
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 0

.day
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  min-width: base.$size-7xl // 48px
  height: base.$size-7xl // 48px
  padding: 0
  background: transparent
  border: none
  border-radius: var(--lb-radius-lg)
  font-size: var(--lb-font-size-body-large) // Larger font for better readability
  font-weight: var(--lb-font-weight-normal)
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: all var(--lb-transition)
  position: relative
  
  &:focus-visible
    outline: var(--lb-focus-ring-width) solid var(--lb-focus-ring-color)
    outline-offset: var(--lb-focus-ring-offset)
    z-index: 1
  
  &:hover:not(:disabled)
    background: var(--lb-surface-neutral-hover)
  
  &:active:not(:disabled)
    background: var(--lb-surface-neutral-active)
    transform: translateY(1px)
  
  // Current month days
  &.current-month
    color: var(--lb-text-neutral-contrast-high)
  
  // Other month days (previous/next month)
  &.other-month
    color: var(--lb-text-neutral-contrast-low)
    opacity: var(--lb-opacity-60)
    
    &:hover:not(:disabled)
      background: var(--lb-surface-neutral-subtle)
      opacity: var(--lb-opacity-80)
  
  // Today's date
  &.today
    color: var(--lb-text-primary-contrast-high)
    font-weight: var(--lb-font-weight-medium)
    border: var(--lb-border-sm) solid var(--lb-border-primary-normal)
    
    &:hover:not(:disabled)
      background: var(--lb-surface-neutral-hover)
      border-color: var(--lb-border-primary-active)
    
    &:active:not(:disabled)
      background: var(--lb-surface-neutral-active)
      border-color: var(--lb-border-primary-active)
  
  // Selected date
  &.selected
    background: var(--lb-fill-primary-normal)
    color: var(--lb-text-on-variant-light)
    font-weight: var(--lb-font-weight-medium)
    
    &:hover:not(:disabled)
      background: var(--lb-fill-primary-hover)
    
    &:active:not(:disabled)
      background: var(--lb-fill-primary-active)
    
    // When selected date is also today
    &.today
      border: var(--lb-border-sm) solid var(--lb-border-primary-active)
  
  // Disabled dates
  &:disabled,
  &.disabled
    color: var(--lb-text-neutral-contrast-low)
    cursor: not-allowed
    opacity: var(--lb-opacity-60)
    background: transparent
    
    &:hover
      background: transparent
      transform: none

.day-number
  display: inline-flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%
</style>