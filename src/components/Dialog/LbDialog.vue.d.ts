import type { DefineComponent, VNode } from 'vue'

export type DialogVariant = 'default' | 'fullscreen'

export interface LbDialogProps {
  modelValue: boolean
  title?: string
  variant?: DialogVariant
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

export interface LbDialogSlots {
  default(): VNode[]
  header?(): VNode[]
  footer?(): VNode[]
}

export interface LbDialogEmits {
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}

declare const LbDialog: DefineComponent<LbDialogProps, {}, {}, {}, {}, {}, {}, {}>

export default LbDialog