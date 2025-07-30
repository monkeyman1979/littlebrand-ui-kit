import type { DefineComponent } from 'vue'

export interface LbRadioProps {
  modelValue?: any
  value: any
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  ariaDescribedby?: string
}

export interface LbRadioEmits {
  'update:modelValue': (value: any) => void
  change: (event: Event) => void
  focus: (event: FocusEvent) => void
  blur: (event: FocusEvent) => void
}

export interface LbRadioExposed {
  inputRef: HTMLInputElement | undefined
}

declare const LbRadio: DefineComponent<LbRadioProps, LbRadioExposed, {}, {}, {}, {}, {}, {}>

export default LbRadio