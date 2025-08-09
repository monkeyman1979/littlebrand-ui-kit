import type { DefineComponent } from 'vue'

// LbPopover types
export type PopoverPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

export interface LbPopoverProps {
  open?: boolean
  placement?: PopoverPlacement
  offset?: number
  showArrow?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  disabled?: boolean
}

export interface LbPopoverTriggerProps {
  asChild?: boolean
  disabled?: boolean
}

export interface LbPopoverContentProps {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionBoundary?: Element | null
  sticky?: 'partial' | 'always'
}

export interface LbPopoverArrowProps {
  width?: number
  height?: number
}

// Component declarations
declare const LbPopover: DefineComponent<LbPopoverProps>
declare const LbPopoverTrigger: DefineComponent<LbPopoverTriggerProps>
declare const LbPopoverContent: DefineComponent<LbPopoverContentProps>
declare const LbPopoverArrow: DefineComponent<LbPopoverArrowProps>

export { LbPopover, LbPopoverTrigger, LbPopoverContent, LbPopoverArrow }
export default LbPopover