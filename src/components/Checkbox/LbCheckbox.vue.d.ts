import type { DefineComponent, VNode } from 'vue'

export interface LbCheckboxProps {
  modelValue?: boolean | Array<any>
  value?: any
  id?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  indeterminate?: boolean
  ariaDescribedby?: string
}

export interface LbCheckboxEmits {
  'update:modelValue': (value: boolean | Array<any>) => void
  change: (event: Event) => void
  focus: (event: FocusEvent) => void
  blur: (event: FocusEvent) => void
}

export interface LbCheckboxSlots {
  'icon-check'?(): VNode[]
  'icon-indeterminate'?(): VNode[]
}

export interface LbCheckboxExposed {
  inputRef: HTMLInputElement | undefined
}

declare const LbCheckbox: DefineComponent<LbCheckboxProps, LbCheckboxExposed, {}, {}, {}, {}, {}, {}>

export default LbCheckbox