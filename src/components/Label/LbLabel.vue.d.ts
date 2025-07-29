import type { DefineComponent, VNode } from 'vue'

export interface LbLabelProps {
  for?: string
  required?: boolean
}

export interface LbLabelSlots {
  default(): VNode[]
  hint?(): VNode[]
  icon?(): VNode[]
}

declare const LbLabel: DefineComponent<LbLabelProps, {}, {}, {}, {}, {}, {}, {}>

export default LbLabel