import { DefineComponent } from 'vue'

export interface LbHintTextProps {
  error?: boolean
  warning?: boolean
  success?: boolean
  id?: string
}

export interface LbHintTextSlots {
  default: () => any
  'icon-leading'?: () => any
  'icon-trailing'?: () => any
}

declare const LbHintText: DefineComponent<LbHintTextProps, {}, {}, {}, {}, {}, {}, {}>

export default LbHintText