import type { DefineComponent } from 'vue'

export interface LbSwitchProps {
  modelValue?: boolean
  id?: string
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  ariaDescribedby?: string
}

export interface LbSwitchEmits {
  'update:modelValue': (value: boolean) => void
  change: (event: Event) => void
  focus: (event: FocusEvent) => void
  blur: (event: FocusEvent) => void
}

export interface LbSwitchExposed {
  inputRef: HTMLInputElement | undefined
}

declare const LbSwitch: DefineComponent<LbSwitchProps, LbSwitchExposed, {}, {}, {}, {}, {}, {}>

export default LbSwitch