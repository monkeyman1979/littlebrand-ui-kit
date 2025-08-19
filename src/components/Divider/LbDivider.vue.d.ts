import type { DefineComponent } from 'vue'

export interface LbDividerProps {
  orientation?: 'horizontal' | 'vertical'
  size?: 'thin' | 'medium' | 'thick'
  inset?: boolean
}

declare const LbDivider: DefineComponent<LbDividerProps, {}, {}, {}, {}, {}, {}, {}>

export default LbDivider