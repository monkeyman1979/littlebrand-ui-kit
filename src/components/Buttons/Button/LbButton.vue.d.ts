import type { DefineComponent, VNode } from 'vue'

export interface LbButtonProps {
  variant?: 'filled' | 'tonal' | 'outline' | 'ghost' | 'link'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconPosition?: 'leading' | 'trailing'
  iconOnly?: boolean
  href?: string
  target?: string
  rel?: string
  tag?: string
}

export interface LbButtonEmits {
  click: (event: Event) => void
}

export interface LbButtonSlots {
  default(): VNode[]
  'icon-leading'?(): VNode[]
  'icon-trailing'?(): VNode[]
}

declare const LbButton: DefineComponent<LbButtonProps, {}, {}, {}, {}, {}, {}, {}>

export default LbButton