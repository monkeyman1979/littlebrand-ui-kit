import { DefineComponent } from 'vue'

export interface LbLabelProps {
  for?: string
  required?: boolean
}

export interface LbLabelSlots {
  default: () => any
  hint?: () => any
  icon?: () => any
}

declare const LbLabel: DefineComponent<LbLabelProps, {}, {}, {}, {}, {}, {}, {}>

export default LbLabel