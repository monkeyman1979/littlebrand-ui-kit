import type { DefineComponent, SlotsType } from 'vue'
import type { ComponentPublicProps as PublicProps } from '../../component-emits.js'

export interface LbSegmentButtonItemProps {
  /**
   * Unique value for this segment item
   */
  value: string | number

  /**
   * Disable this segment item
   * @default false
   */
  disabled?: boolean

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string
}

export interface LbSegmentButtonItemSlots {
  /**
   * Default slot for the segment item content (text, icons, etc.)
   */
  default?: () => any

  /**
   * Leading icon slot
   */
  icon?: () => any
}

declare const LbSegmentButtonItem: DefineComponent<
  LbSegmentButtonItemProps,
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  never,
  PublicProps,
  Readonly<LbSegmentButtonItemProps>,
  {},
  SlotsType<LbSegmentButtonItemSlots>
>

export default LbSegmentButtonItem
