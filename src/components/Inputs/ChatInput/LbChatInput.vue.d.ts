import { DefineComponent } from 'vue'

export interface ChatInputMenuItem {
  label: string
  icon?: string
  action: string | (() => void)
  disabled?: boolean
}

export interface LbChatInputProps {
  /**
   * The input text value (v-model)
   */
  modelValue?: string
  
  /**
   * Placeholder text for the input
   * @default "Type a message..."
   */
  placeholder?: string
  
  /**
   * Maximum number of rows before scrolling
   * @default 10
   */
  maxRows?: number
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean
  
  /**
   * Menu items for the plus button dropdown
   * @default []
   */
  menuItems?: ChatInputMenuItem[]
  
  /**
   * ARIA describedby attribute
   */
  ariaDescribedby?: string
}

export interface LbChatInputSlots {
  /**
   * Custom actions slot between plus button and send/mic button
   */
  actions?: () => any
}

export interface LbChatInputEmits {
  /**
   * Emitted when the input value changes (v-model)
   * @param value - The new input value
   */
  'update:modelValue': [value: string]
  
  /**
   * Emitted when send button is clicked or Enter is pressed
   * @param text - The message text to send
   */
  'send': [text: string]
  
  /**
   * Emitted when microphone button is clicked (when input is empty)
   */
  'voice': []
  
  /**
   * Emitted when a menu item is selected
   * @param action - The action associated with the menu item
   * @param item - The complete menu item object
   */
  'menu-action': [action: string | (() => void), item: ChatInputMenuItem]
}

declare const LbChatInput: DefineComponent<
  LbChatInputProps,
  {},
  {},
  {},
  {},
  {},
  {},
  LbChatInputEmits,
  string,
  {},
  {},
  {},
  LbChatInputSlots
>

export default LbChatInput