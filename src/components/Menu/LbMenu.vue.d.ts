import { DefineComponent } from 'vue'

export type MenuPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

export interface MenuItem {
  value: any
  label: string
  disabled?: boolean
  type?: 'item' | 'divider'
}

export interface LbMenuProps {
  modelValue?: any
  options: (MenuItem | string | number)[]
  searchable?: boolean
  placeholder?: string
  visibleItems?: number
  disabled?: boolean
  closeOnSelect?: boolean
  placement?: MenuPlacement
  virtualScrolling?: boolean
  itemHeight?: number
  activeColor?: 'neutral' | 'primary'
}

export interface LbMenuSlots {
  trigger: () => any
  item?: (props: {
    item: MenuItem
    index: number
    selected: boolean
    highlighted: boolean
  }) => any
  'item-icon-leading'?: (props: {
    item: MenuItem
    selected: boolean
  }) => any
  'item-icon-trailing'?: (props: {
    item: MenuItem
    selected: boolean
  }) => any
}

export interface LbMenuEmits {
  'update:modelValue': [value: any]
  'select': [value: any, item: MenuItem]
  'open': []
  'close': []
  'search': [query: string]
}

declare const LbMenu: DefineComponent<LbMenuProps, {}, {}, {}, {}, {}, {}, LbMenuEmits, string, {}, {}, string, LbMenuSlots>

export default LbMenu