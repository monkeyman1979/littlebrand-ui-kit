import type { DefineComponent, SlotsType, VNode } from 'vue'
import type { ComponentEmits, ComponentPublicProps as PublicProps, ComponentEventProps as EmitsToProps } from '../component-emits.js'

export type DialogVariant = 'default' | 'fullscreen'

export interface LbDialogProps {
  modelValue?: boolean
  title?: string
  variant?: DialogVariant
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

export interface LbDialogSlots {
  default?(): VNode[]
  header?(): VNode[]
  footer?(): VNode[]
}

export interface LbDialogEmits {
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}

type DialogVueEmits = ComponentEmits<LbDialogEmits>
declare const LbDialog: DefineComponent<
  LbDialogProps, {}, {}, {}, {}, {}, {},
  DialogVueEmits, never, PublicProps,
  Readonly<LbDialogProps> & EmitsToProps<DialogVueEmits>,
  {}, SlotsType<LbDialogSlots>
>

export default LbDialog