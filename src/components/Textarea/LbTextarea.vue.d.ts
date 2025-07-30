import { DefineComponent } from 'vue'

export interface LbTextareaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  required?: boolean
  id?: string
  ariaDescribedby?: string
  size?: 'small' | 'medium' | 'large'
  autofocus?: boolean
  rows?: number
  cols?: number
  minlength?: number
  maxlength?: number
  spellcheck?: boolean
  showCharacterCount?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export interface LbTextareaEmits {
  'update:modelValue': [value: string]
  'input': [event: Event]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

declare const LbTextarea: DefineComponent<LbTextareaProps, {}, {}, {}, {}, {}, {}, LbTextareaEmits>

export default LbTextarea