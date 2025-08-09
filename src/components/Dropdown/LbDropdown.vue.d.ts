import { DefineComponent } from 'vue'

export interface LbDropdownProps {
  modelValue?: boolean
  matchWidth?: boolean
  placement?: 'bottom' | 'top' | 'auto'
  disabled?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
}

declare const LbDropdown: DefineComponent<LbDropdownProps>

export default LbDropdown