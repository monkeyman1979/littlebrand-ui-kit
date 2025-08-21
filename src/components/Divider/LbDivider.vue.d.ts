import type { DefineComponent } from 'vue'

export interface LbDividerProps {
  orientation?: 'horizontal' | 'vertical'
  size?: 'thin' | 'medium' | 'thick'
  inset?: boolean
  stretch?: boolean
}

declare const LbDivider: DefineComponent<LbDividerProps, {}, {}, {}, {}, {}, {}, {}>

export default LbDivider