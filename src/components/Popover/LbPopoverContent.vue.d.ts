import type { DefineComponent } from 'vue'

export interface LbPopoverContentProps {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionBoundary?: Element | null
  sticky?: 'partial' | 'always'
}

declare const LbPopoverContent: DefineComponent<LbPopoverContentProps>

export { LbPopoverContent }
export default LbPopoverContent