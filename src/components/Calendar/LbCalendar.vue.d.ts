import { DefineComponent } from 'vue'

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
  /**
   * The selected date value
   * @default null
   */
  modelValue?: Date | null
  
  /**
   * Minimum selectable date
   * @default undefined
   */
  minDate?: Date
  
  /**
   * Maximum selectable date
   * @default undefined
   */
  maxDate?: Date
  
  /**
   * Array of disabled dates or function to check if date is disabled
   * @default undefined
   */
  disabledDates?: Date[] | ((date: Date) => boolean)
  
  /**
   * First day of the week (0 = Sunday, 1 = Monday)
   * @default 0
   */
  firstDayOfWeek?: 0 | 1
  
  /**
   * Locale for formatting month and day names
   * @default 'en-US'
   */
  locale?: string
}

export interface LbCalendarEmits {
  /**
   * Emitted when the selected date changes
   */
  'update:modelValue': [value: Date | null]
  
  /**
   * Emitted when a date is selected
   */
  'change': [value: Date | null]
  
  /**
   * Emitted when the calendar navigates to a different month/year
   */
  'navigate': [value: { month: number, year: number }]
}

/**
 * Calendar component for date selection
 * 
 * Features:
 * - Month/Year dropdown navigation
 * - Keyboard navigation with arrow keys
 * - Support for min/max date constraints
 * - Disabled date functionality
 * - Localization support
 * - Accessible with ARIA labels
 */
declare const LbCalendar: DefineComponent<LbCalendarProps, {}, {}, {}, {}, any, any, LbCalendarEmits>

export default LbCalendar