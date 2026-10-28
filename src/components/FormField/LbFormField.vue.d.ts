import type { DefineComponent, SlotsType, VNode } from 'vue'
import type { ComponentPublicProps as PublicProps } from '../component-emits.js'

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

declare const LbFormField: DefineComponent<
  LbFormFieldProps, {}, {}, {}, {}, {}, {},
  {}, never, PublicProps,
  Readonly<LbFormFieldProps>,
  {}, SlotsType<LbFormFieldSlots>
>

export default LbFormField