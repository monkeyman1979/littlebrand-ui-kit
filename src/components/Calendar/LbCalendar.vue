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
        :size="effectiveSize"
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
          :size="effectiveSize"
          :aria-label="monthSelectAriaLabel"
          @change="handleMonthChange"
        )
        LbSelect.year-select(
          v-model="selectedYear"
          :options="yearOptions"
          searchable
          search-placeholder="Enter year..."
          :size="effectiveSize"
          :aria-label="yearSelectAriaLabel"
          @change="handleYearChange"
        )
      
      LbButton(
        icon-only
        :size="effectiveSize"
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
import { ref, computed, watch, nextTick, inject, type ComputedRef } from 'vue'
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
  variant?: 'standalone' | 'embedded'  // standalone has border/padding, embedded doesn't
  size?: 'medium' | 'large'  // Controls sizing of all interactive elements
  dateMode?: 'past' | 'future' | 'both'  // Controls year range: past (history), future (appointments), both (default)
  mode?: 'all' | 'past' | 'future'  // Controls which dates can be selected
}

// Props
const props = withDefaults(defineProps<LbCalendarProps>(), {
  modelValue: null,
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  firstDayOfWeek: 0,
  locale: 'en-US',
  variant: 'standalone',
  dateMode: 'both',
  mode: 'all'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
  'change': [value: Date | null]
  'navigate': [value: { month: number, year: number }]
}>()

// Inject density context if available
const injectedDensitySize = inject<ComputedRef<'medium' | 'large'> | undefined>('densitySize', undefined)

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
// Compute effective size: explicit prop > density > default
const effectiveSize = computed(() => {
  // If size is explicitly set, use it
  if (props.size) return props.size
  // Otherwise use density-based size if available
  if (injectedDensitySize?.value) return injectedDensitySize.value
  // Fall back to default
  return 'medium'
})

const calendarClasses = computed(() => ({
  'lb-calendar': true,
  [`variant-${props.variant}`]: true,
  [`size-${effectiveSize.value}`]: true
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

// Year options for dropdown (filtered by min/max dates and dateMode)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  
  let startYear: number
  let endYear: number
  let ascending = false
  
  // Determine year range based on dateMode
  if (props.dateMode === 'past') {
    // For past dates: current year is the max, go back 100 years (descending)
    startYear = props.minDate ? props.minDate.getFullYear() : currentYear - 100
    endYear = props.maxDate ? Math.min(props.maxDate.getFullYear(), currentYear) : currentYear
    ascending = false
  } else if (props.dateMode === 'future') {
    // For future dates: current year is the min, go forward 50 years (ascending)
    startYear = props.minDate ? Math.max(props.minDate.getFullYear(), currentYear) : currentYear
    endYear = props.maxDate ? props.maxDate.getFullYear() : currentYear + 50
    ascending = true
  } else {
    // Both: standard range (descending)
    startYear = props.minDate ? props.minDate.getFullYear() : Math.min(1900, currentYear - 100)
    endYear = props.maxDate ? props.maxDate.getFullYear() : Math.max(2100, currentYear + 100)
    ascending = false
  }
  
  // Generate years based on order preference
  if (ascending) {
    // Ascending order for future dates
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
      value: startYear + i,
      label: String(startYear + i)
    }))
  } else {
    // Descending order for past dates and general use
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
      value: endYear - i,
      label: String(endYear - i)
    }))
  }
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
  // Check mode constraints for future mode
  if (props.mode === 'future') {
    const today = new Date()
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const prevMonth = new Date(selectedYear.value, selectedMonth.value - 1, 1)
    if (prevMonth < currentMonthStart) return false
  }
  
  if (!props.minDate) return true
  const prevMonth = new Date(selectedYear.value, selectedMonth.value - 1, 1)
  return prevMonth >= new Date(props.minDate.getFullYear(), props.minDate.getMonth(), 1)
})

const canNavigateNext = computed(() => {
  // Check mode constraints for past mode
  if (props.mode === 'past') {
    const today = new Date()
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const nextMonth = new Date(selectedYear.value, selectedMonth.value + 1, 1)
    if (nextMonth > currentMonthStart) return false
  }
  
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
  // Check mode constraints
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day for comparison
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0) // Reset time to start of day for comparison
  
  if (props.mode === 'future') {
    // Future mode: disable all past dates (today is allowed)
    if (checkDate < today) return true
  } else if (props.mode === 'past') {
    // Past mode: disable all future dates (today is allowed)
    if (checkDate > today) return true
  }
  
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
  
  // Make all non-disabled days tabbable for better keyboard navigation
  return 0
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
@use '@/styles/typography' as typography

.lb-calendar
  display: inline-flex
  flex-direction: column
  gap: base.$space-lg  // Gap between header and grid
  width: fit-content  // Size to content
  max-width: 100%  // But don't overflow container
  background: var(--lb-background-surface)
  font-family: var(--lb-font-body)
  
  // Standalone variant - with border and padding
  &.variant-standalone
    border: base.$border-sm solid var(--lb-border-neutral-line)
    border-radius: base.$radius-lg
    padding: base.$space-md
  
  // Embedded variant - no border or padding
  &.variant-embedded
    border: none
    border-radius: 0
    padding: 0

.calendar-header
  display: flex
  align-items: center
  justify-content: space-between
  gap: base.$space-md

.calendar-navigation
  display: flex
  align-items: center
  gap: base.$space-xs
  flex: 1

.calendar-selects
  display: flex
  gap: base.$space-xs
  flex: 1
  min-width: 0
  
  .month-select
    flex: 1
  
  .year-select
    flex: none
    width: auto

.calendar-grid
  display: flex
  flex-direction: column
  gap: base.$space-2xs  // Gap between weekday labels and days grid
  width: fit-content

.weekday-labels
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 0

.weekday
  display: flex
  align-items: center
  justify-content: center
  min-width: base.$unit-40  // 40px to match day cells
  height: base.$unit-32  // 32px height for weekday labels
  font-size: typography.$font-size-label-small
  font-weight: typography.$font-weight-medium
  color: var(--lb-text-neutral-contrast-low)
  text-align: center
  
  // Large size variant
  .size-large &
    min-width: base.$unit-48  // 48px to match day cells
    height: base.$unit-40  // 40px height for large

.days-grid
  display: flex
  flex-direction: column
  row-gap: base.$space-2xs

.calendar-week
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 0

.day
  display: flex
  align-items: center
  justify-content: center
  width: base.$unit-40  // 40px square for medium
  min-width: base.$unit-40  // 40px for medium
  min-height: base.$unit-40  // 40px for medium - using min-height to ensure full height
  height: base.$unit-40  // 40px for medium
  padding: 0
  background: transparent
  border: none
  box-sizing: border-box  // Ensure box-sizing is set
  border-radius: base.$radius-md
  font-size: typography.$font-size-body-base // Medium font by default
  font-weight: typography.$font-weight-normal
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: all base.$transition
  position: relative
  
  // Large size variant
  .size-large &
    width: base.$unit-48  // 48px square for large
    min-width: base.$unit-48  // 48px for large
    min-height: base.$unit-48  // 48px for large - using min-height to ensure full height
    height: base.$unit-48  // 48px for large
    border-radius: base.$radius-lg
    font-size: typography.$font-size-body-large
  
  &:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset
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
    opacity: base.$opacity-60
    
    &:hover:not(:disabled)
      background: var(--lb-surface-neutral-subtle)
      opacity: base.$opacity-80
  
  // Today's date
  &.today
    color: var(--lb-text-primary-contrast-high)
    font-weight: typography.$font-weight-medium
    border: base.$border-sm solid var(--lb-border-primary-normal)
    
    &:hover:not(:disabled)
      background: var(--lb-surface-neutral-hover)
      border-color: var(--lb-border-primary-active)
    
    &:active:not(:disabled)
      background: var(--lb-surface-neutral-active)
      border-color: var(--lb-border-primary-active)
  
  // Selected date
  &.selected
    background: var(--lb-fill-primary-normal)
    color: var(--lb-text-on-primary)
    font-weight: typography.$font-weight-medium
    
    &:hover:not(:disabled)
      background: var(--lb-fill-primary-hover)
      color: var(--lb-text-on-primary-hover)
    
    &:active:not(:disabled)
      background: var(--lb-fill-primary-active)
      color: var(--lb-text-on-primary-active)
    
    // When selected date is also today
    &.today
      border: base.$border-sm solid var(--lb-border-primary-active)
  
  // Disabled dates
  &:disabled,
  &.disabled
    color: var(--lb-text-neutral-contrast-low)
    cursor: not-allowed
    opacity: base.$opacity-60
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