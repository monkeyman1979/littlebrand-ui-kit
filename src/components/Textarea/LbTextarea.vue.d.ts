import type { DefineComponent } from 'vue'

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
}

export interface LbTextareaEmits {
  'update:modelValue': (value: string) => void
  'input': (event: Event) => void
  'change': (event: Event) => void
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
}

declare const LbTextarea: DefineComponent<LbTextareaProps, {}, {}, {}, {}, {}, {}, {}>

export default LbTextarea