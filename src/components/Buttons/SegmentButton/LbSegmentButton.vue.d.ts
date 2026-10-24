import type { DefineComponent, SlotsType } from 'vue'
import type { ComponentEmits, ComponentPublicProps as PublicProps, ComponentEventProps as EmitsToProps } from '../../component-emits.js'

export interface LbSegmentButtonProps {
  /**
   * Current selected value(s)
   * @default undefined
   */
  modelValue?: string | number | (string | number)[]

  /**
   * Size variant of the segment button
   * @default 'medium'
   */
  size?: 'medium' | 'large'

  /**
   * Width behavior
   * @default 'full'
   */
  width?: 'full' | 'auto'

  /**
   * Color variant
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'neutral'

  /**
   * Disable the entire segment button
   * @default false
   */
  disabled?: boolean

  /**
   * ARIA labelledby attribute
   */
  ariaLabelledby?: string

  /**
   * Allow all segments to be unselected
   * @default true
   */
  allowEmpty?: boolean

  /**
   * Enable multi-select mode
   * @default false
   */
  multiSelect?: boolean
}

export interface LbSegmentButtonSlots {
  /**
   * Default slot for LbSegmentButtonItem components
   */
  default?: () => any
}

export interface LbSegmentButtonEmits {
  /**
   * Emitted when the selected value changes
   */
  'update:modelValue': [value: string | number | (string | number)[] | undefined]
}

declare const LbSegmentButton: DefineComponent<
  LbSegmentButtonProps,
  {},
  {},
  {},
  {},
  {},
  {},
  ComponentEmits<LbSegmentButtonEmits>,
  never,
  PublicProps,
  Readonly<LbSegmentButtonProps> & EmitsToProps<ComponentEmits<LbSegmentButtonEmits>>,
  {},
  SlotsType<LbSegmentButtonSlots>
>

export default LbSegmentButton
