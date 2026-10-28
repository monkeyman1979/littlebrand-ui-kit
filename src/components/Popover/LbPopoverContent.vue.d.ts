import type { DefineComponent } from 'vue'

// Positioning is controlled by LbPopover, not by content props.
export interface LbPopoverContentProps {}

declare const LbPopoverContent: DefineComponent<LbPopoverContentProps>

export { LbPopoverContent }
export default LbPopoverContent