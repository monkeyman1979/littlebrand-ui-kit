import type { DefineComponent, SlotsType, VNode } from 'vue'
import type { ComponentEmits, ComponentPublicProps as PublicProps, ComponentEventProps as EmitsToProps } from '../../component-emits.js'

export interface LbButtonProps {
  variant?: 'filled' | 'tonal' | 'outline' | 'ghost' | 'link'
  color?: 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconPosition?: 'leading' | 'trailing'
  iconOnly?: boolean
  href?: string
  to?: string | object
  target?: string
  rel?: string
  muted?: boolean
}

export interface LbButtonEmits {
  click: (event: Event) => void
}

export interface LbButtonSlots {
  default?(): VNode[]
  'icon-leading'?(): VNode[]
  'icon-trailing'?(): VNode[]
}

type ButtonEventTuples = { [K in keyof LbButtonEmits]: LbButtonEmits[K] extends (...args: infer Args) => void ? Args : never }
type ButtonVueEmits = ComponentEmits<ButtonEventTuples>
// Keep the resolved props generic when specifying event/slot types: {} would erase strict prop validation.
declare const LbButton: DefineComponent<
  LbButtonProps, {}, {}, {}, {}, {}, {},
  ButtonVueEmits, never, PublicProps,
  Readonly<LbButtonProps> & EmitsToProps<ButtonVueEmits>,
  {}, SlotsType<LbButtonSlots>
>

export default LbButton