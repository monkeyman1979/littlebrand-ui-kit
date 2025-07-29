import type { DefineComponent, VNode } from 'vue'

export interface LbHintTextProps {
  error?: boolean
  warning?: boolean
  success?: boolean
  id?: string
}

export interface LbHintTextSlots {
  default(): VNode[]
  'icon-leading'?(): VNode[]
  'icon-trailing'?(): VNode[]
}

declare const LbHintText: DefineComponent<LbHintTextProps, {}, {}, {}, {}, {}, {}, {}>

export default LbHintText