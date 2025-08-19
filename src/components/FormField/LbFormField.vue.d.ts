import type { DefineComponent, VNode } from 'vue'

export interface LbFormFieldProps {
  label?: string
  hint?: string
  required?: boolean
  error?: string
  warning?: string
  success?: string
  id?: string
  labelFor?: string
}

export interface LbFormFieldSlots {
  default(props: { id: string; 'aria-describedby'?: string }): VNode[]
  'label-icon'?(): VNode[]
}

declare const LbFormField: DefineComponent<LbFormFieldProps, {}, {}, {}, {}, {}, {}, {}>

export default LbFormField