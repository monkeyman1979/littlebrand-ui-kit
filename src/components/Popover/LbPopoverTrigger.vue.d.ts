import type { DefineComponent } from 'vue'

export interface LbPopoverTriggerProps {
  asChild?: boolean
  disabled?: boolean
}

declare const LbPopoverTrigger: DefineComponent<LbPopoverTriggerProps>

export { LbPopoverTrigger }
export default LbPopoverTrigger