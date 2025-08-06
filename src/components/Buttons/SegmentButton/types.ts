import type { ComputedRef, Ref } from 'vue'

// SegmentButton shared types
export type Size = 'small' | 'medium'
export type Width = 'full' | 'auto'
export type Color = 'primary' | 'secondary' | 'neutral'

export interface SegmentButtonContext {
  activeValue: Ref<string | number | (string | number)[] | undefined>
  size: ComputedRef<Size>
  color: ComputedRef<Color>
  disabled: ComputedRef<boolean>
  allowEmpty: ComputedRef<boolean>
  multiSelect: ComputedRef<boolean>
  updateActive: (value: string | number) => void
  registerSegmentItem: (element: HTMLElement) => void
  unregisterSegmentItem: (element: HTMLElement) => void
}