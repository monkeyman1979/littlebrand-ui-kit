import { DefineComponent } from 'vue'

export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
export type PopoverPlacement = 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'auto'

export interface LbDatePickerProps {
  /**
   * The selected date value
   */
  modelValue?: Date | null
  
  /**
   * Date display format
   * @default 'MM/DD/YYYY'
   */
  format?: DateFormat
  
  /**
   * Placeholder text when no date is selected
   * @default 'Select date...'
   */
  placeholder?: string
  
  /**
   * Minimum selectable date
   */
  minDate?: Date
  
  /**
   * Maximum selectable date
   */
  maxDate?: Date
  
  /**
   * Array of disabled dates or function to determine if date is disabled
   */
  disabledDates?: Date[] | ((date: Date) => boolean)
  
  /**
   * Whether the date picker is disabled
   * @default false
   */
  disabled?: boolean
  
  /**
   * Whether the date picker is in invalid state
   * @default false
   */
  invalid?: boolean
  
  /**
   * Whether the date picker is required
   * @default false
   */
  required?: boolean
  
  /**
   * Whether to show clear button
   * @default true
   */
  clearable?: boolean
  
  /**
   * Whether to show today button
   * @default true
   */
  showToday?: boolean
  
  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'medium' | 'large'
  
  /**
   * First day of the week (0 = Sunday, 1 = Monday)
   * @default 0
   */
  firstDayOfWeek?: 0 | 1
  
  /**
   * Locale for date formatting
   * @default 'en-US'
   */
  locale?: string
  
  /**
   * Calendar popover placement
   * @default 'bottom'
   */
  placement?: PopoverPlacement
  
  /**
   * Input field ID
   */
  id?: string
  
  /**
   * ARIA described by attribute
   */
  ariaDescribedby?: string
  
  /**
   * Whether to keep calendar open after date selection
   * @default false
   */
  stayOpen?: boolean
}

export interface LbDatePickerSlots {
  // No slots defined for DatePicker
}

export interface LbDatePickerEmits {
  /**
   * Emitted when the selected date changes
   */
  'update:modelValue': [value: Date | null]
  
  /**
   * Emitted when the selected date changes
   */
  'change': [value: Date | null]
  
  /**
   * Emitted when the date is cleared
   */
  'clear': []
  
  /**
   * Emitted when the calendar opens
   */
  'open': []
  
  /**
   * Emitted when the calendar closes
   */
  'close': []
}

declare const LbDatePicker: DefineComponent<
  LbDatePickerProps,
  LbDatePickerEmits,
  {},
  {},
  {},
  {},
  {},
  LbDatePickerSlots
>

export default LbDatePicker