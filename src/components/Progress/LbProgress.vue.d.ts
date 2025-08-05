import { DefineComponent } from 'vue'

export type ProgressType = 'linear' | 'circular'
export type ProgressSize = 'thin' | 'normal' | 'thick'
export type CircularSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ProgressProps {
  /**
   * Current progress value (0-100)
   */
  value?: number
  /**
   * Progress indicator type
   * @default 'linear'
   */
  type?: ProgressType
  /**
   * Visual weight/thickness variant
   * @default 'normal'
   */
  size?: ProgressSize
  /**
   * Circular progress dimensions (only applies to circular type)
   * @default 'sm'
   */
  circularSize?: CircularSize
  /**
   * Show percentage text
   * @default false
   */
  showValue?: boolean
  /**
   * Unknown progress animation
   * @default false
   */
  indeterminate?: boolean
}

declare const LbProgress: DefineComponent<ProgressProps>

export default LbProgress