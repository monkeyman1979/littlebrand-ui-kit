import type { DefineComponent, SlotsType } from 'vue'
import type { ComponentEmits, ComponentPublicProps as PublicProps, ComponentEventProps as EmitsToProps } from '../component-emits.js'

export interface LbTextareaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  required?: boolean
  id?: string
  ariaDescribedby?: string
  autofocus?: boolean
  rows?: number
  cols?: number
  minlength?: number
  maxlength?: number
  spellcheck?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  autoResize?: boolean
  maxRows?: number
  size?: 'medium' | 'large'
}

export interface LbTextareaEmits {
  'update:modelValue': (value: string) => void
  'input': (event: Event) => void
  'change': (event: Event) => void
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
}

export interface LbTextareaSlots {}

type TextareaEventTuples = { [K in keyof LbTextareaEmits]: LbTextareaEmits[K] extends (...args: infer Args) => void ? Args : never }
type TextareaVueEmits = ComponentEmits<TextareaEventTuples>
declare const LbTextarea: DefineComponent<
  LbTextareaProps, {}, {}, {}, {}, {}, {},
  TextareaVueEmits, never, PublicProps,
  Readonly<LbTextareaProps> & EmitsToProps<TextareaVueEmits>,
  {}, SlotsType<LbTextareaSlots>
>

export default LbTextarea