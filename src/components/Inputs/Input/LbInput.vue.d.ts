import type { DefineComponent, EmitsToProps, PublicProps, SlotsType, VNode } from 'vue'
import type { ComponentEmits } from '../../component-emits.js'

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
  size?: 'medium' | 'large'
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
  'icon-leading'?(): VNode[]
  'icon-trailing'?(): VNode[]
  'icon-password-show'?(): VNode[]
  'icon-password-hide'?(): VNode[]
  'icon-clear'?(): VNode[]
  'icon-loading'?(): VNode[]
}

type InputEventTuples = { [K in keyof LbInputEmits]: LbInputEmits[K] extends (...args: infer Args) => void ? Args : never }
type InputVueEmits = ComponentEmits<InputEventTuples>
declare const LbInput: DefineComponent<
  LbInputProps, {}, {}, {}, {}, {}, {},
  InputVueEmits, never, PublicProps,
  Readonly<LbInputProps> & EmitsToProps<InputVueEmits>,
  {}, SlotsType<LbInputSlots>
>

export default LbInput