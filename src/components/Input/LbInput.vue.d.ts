import type { DefineComponent, VNode } from 'vue'

export interface LbInputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  required?: boolean
  id?: string
  ariaDescribedby?: string
  clearable?: boolean
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
  autofocus?: boolean
}

export interface LbInputEmits {
  'update:modelValue': (value: string) => void
  'input': (event: Event) => void
  'change': (event: Event) => void
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
  'clear': () => void
}

export interface LbInputSlots {
  'icon-leading'(): VNode[]
  'icon-trailing'(): VNode[]
}

declare const LbInput: DefineComponent<LbInputProps, {}, {}, {}, {}, {}, {}, {}>

export default LbInput