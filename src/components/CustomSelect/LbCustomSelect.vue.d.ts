import type { DefineComponent, SlotsType } from 'vue'
import type { ComponentEmits } from '../component-emits.js'

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

export interface LbCustomSelectEmits {
  'update:modelValue': [value: any]
  'change': [value: any, option: CustomSelectOption | null]
  'clear': []
  'open': []
  'close': []
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface LbCustomSelectSlots {
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
}

declare const LbCustomSelect: DefineComponent<
  LbCustomSelectProps,
  {},
  {},
  {},
  {},
  {},
  {},
  ComponentEmits<LbCustomSelectEmits>,
  string,
  {},
  {},
  string,
  SlotsType<LbCustomSelectSlots>
>

export default LbCustomSelect