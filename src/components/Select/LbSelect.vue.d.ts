import type { DefineComponent, VNode } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface LbSelectProps {
  modelValue?: string | number | null
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  id?: string
  ariaDescribedby?: string
  size?: 'small' | 'medium' | 'large'
}

export interface LbSelectEmits {
  'update:modelValue': (value: string | number | null) => void
  'input': (event: Event) => void
  'change': (event: Event) => void
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
}

export interface LbSelectSlots {
  icon(): VNode[]
}

declare const LbSelect: DefineComponent<LbSelectProps, {}, {}, {}, {}, {}, {}, {}>

export default LbSelect