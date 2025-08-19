import { DefineComponent } from 'vue'

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
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any, option: CustomSelectOption | null): void
  (e: 'clear'): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
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
  LbCustomSelectEmits,
  string,
  {},
  {},
  string,
  LbCustomSelectSlots
>

export default LbCustomSelect