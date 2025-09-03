<template lang="pug">
.lb-chat-input(:class="rootClasses")
  //- Auto-growing textarea
  .input-row
    textarea(
      ref="textareaRef"
      v-model="internalValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="1"
      :aria-describedby="ariaDescribedby"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
    )
  
  //- Actions row
  .actions-row
    //- Plus button with menu
    .plus-menu(v-if="menuItems && menuItems.length > 0")
      LbMenu(
        :options="normalizedMenuItems"
        :close-on-select="true"
        @select="handleMenuSelect"
      )
        template(#trigger)
          LbButton(
            variant="ghost"
            color="neutral"
            icon-only
            :disabled="disabled"
            aria-label="More options"
          )
            template(#icon-leading)
              svg(
                                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              )
                path(
                  d="M10 4.5V15.5M4.5 10H15.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                )
    
    //- Flexible middle slot for custom actions
    .actions-middle(v-if="$slots.actions")
      slot(name="actions")
    
    //- Smart action button (mic/send) with transition
    .primary-action
      Transition(name="fade-switch" mode="out-in")
        //- Send button when has text
        LbButton(
          v-if="hasText"
          key="send"
          variant="tonal"
          color="neutral"
          icon-only
          :disabled="disabled"
          aria-label="Send message"
          @click="handlePrimaryAction"
        )
          template(#icon-leading)
            //- Horizontal arrow icon
            svg(
                            viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            )
              path(
                d="M3 10L17 10M17 10L13 6M17 10L13 14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
        
        //- Microphone button when empty (if showVoice is true)
        LbButton(
          v-else-if="showVoice"
          key="mic"
          variant="ghost"
          color="neutral"
          icon-only
          :disabled="disabled"
          aria-label="Record voice message"
          @click="handlePrimaryAction"
        )
          template(#icon-leading)
            svg(
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            )
              path(
                d="M10 1.25V12.5M10 12.5C8.61929 12.5 7.5 11.3807 7.5 10V5C7.5 3.61929 8.61929 2.5 10 2.5C11.3807 2.5 12.5 3.61929 12.5 5V10C12.5 11.3807 11.3807 12.5 10 12.5ZM5 8.75V10C5 13.1066 7.39339 15.625 10.5 15.625H9.5C12.6066 15.625 15 13.1066 15 10V8.75M10 15.625V18.75M7.5 18.75H12.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
        
        //- Send button when empty (if showVoice is false)
        LbButton(
          v-else
          key="send-empty"
          variant="tonal"
          color="neutral"
          icon-only
          :disabled="true"
          aria-label="Send message"
        )
          template(#icon-leading)
            //- Horizontal arrow icon (same as active send)
            svg(
                            viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            )
              path(
                d="M3 10L17 10M17 10L13 6M17 10L13 14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch, onMounted } from 'vue'
import LbButton from '../../Buttons/Button/LbButton.vue'
import LbMenu from '../../Menu/LbMenu.vue'

// Types
export interface ChatInputMenuItem {
  label: string
  icon?: string
  action: string | (() => void)
  disabled?: boolean
}

export interface Props {
  modelValue?: string
  placeholder?: string
  maxRows?: number
  disabled?: boolean
  menuItems?: ChatInputMenuItem[]
  ariaDescribedby?: string
  showVoice?: boolean
}

// Props
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Type a message...',
  maxRows: 10,
  disabled: false,
  menuItems: () => [],
  showVoice: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'send': [text: string]
  'voice': []
  'menu-action': [action: string | (() => void), item: ChatInputMenuItem]
}>()

// Refs
const textareaRef = ref<HTMLTextAreaElement>()
const internalValue = ref(props.modelValue)
const lineHeight = ref(0)
const maxHeight = ref(0)

// Computed
const hasText = computed(() => internalValue.value.trim().length > 0)

const rootClasses = computed(() => ({
  'disabled': props.disabled,
  'has-text': hasText.value
}))

const normalizedMenuItems = computed(() => {
  return props.menuItems?.map(item => ({
    value: item.action,
    label: item.label,
    disabled: item.disabled,
    _originalItem: item
  })) || []
})

// Methods
const adjustHeight = () => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  
  // Reset height to get accurate scrollHeight
  textarea.style.height = 'auto'
  
  // Calculate the height needed for content
  const scrollHeight = textarea.scrollHeight
  
  // Apply max height constraint
  const targetHeight = Math.min(scrollHeight, maxHeight.value)
  textarea.style.height = `${targetHeight}px`
  
  // Set overflow based on whether content exceeds maxHeight
  textarea.style.overflowY = scrollHeight > maxHeight.value ? 'auto' : 'hidden'
}

const calculateMaxHeight = () => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const computedStyle = window.getComputedStyle(textarea)
  
  // Calculate line height if not already done
  if (!lineHeight.value) {
    lineHeight.value = parseFloat(computedStyle.lineHeight)
  }
  
  // Calculate padding and borders
  const paddingTop = parseFloat(computedStyle.paddingTop)
  const paddingBottom = parseFloat(computedStyle.paddingBottom)
  const borderTop = parseFloat(computedStyle.borderTopWidth)
  const borderBottom = parseFloat(computedStyle.borderBottomWidth)
  
  // Calculate max height based on maxRows
  maxHeight.value = (lineHeight.value * props.maxRows) + paddingTop + paddingBottom + borderTop + borderBottom
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  internalValue.value = target.value
  emit('update:modelValue', target.value)
  
  nextTick(() => {
    adjustHeight()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (event.shiftKey) {
      // Shift+Enter: Allow new line (default behavior)
      return
    } else {
      // Enter: Send message
      event.preventDefault()
      if (hasText.value) {
        handleSend()
      }
    }
  }
}

const handleFocus = (event: FocusEvent) => {
  // Optional: Add focus handling
}

const handleBlur = (event: FocusEvent) => {
  // Optional: Add blur handling
}

const handlePrimaryAction = () => {
  if (hasText.value) {
    handleSend()
  } else if (props.showVoice) {
    handleVoice()
  }
}

const handleSend = () => {
  if (!hasText.value || props.disabled) return
  
  const textToSend = internalValue.value.trim()
  emit('send', textToSend)
  
  // Clear the input after sending
  internalValue.value = ''
  emit('update:modelValue', '')
  
  // Reset height
  nextTick(() => {
    adjustHeight()
  })
}

const handleVoice = () => {
  if (props.disabled) return
  emit('voice')
}

const handleMenuSelect = (value: any, item: any) => {
  const originalItem = item._originalItem
  if (originalItem) {
    emit('menu-action', originalItem.action, originalItem)
    
    // If action is a function, execute it
    if (typeof originalItem.action === 'function') {
      originalItem.action()
    }
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue || ''
    nextTick(() => {
      adjustHeight()
    })
  }
})

// Initialize on mount
onMounted(() => {
  if (textareaRef.value) {
    calculateMaxHeight()
    adjustHeight()
  }
})

// Slots
defineSlots<{
  actions?: () => any
}>()

// Component options
defineOptions({
  name: 'LbChatInput',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
// Using CSS custom properties only - no SASS imports needed

.lb-chat-input
  display: flex
  flex-direction: column
  width: 100%
  background: var(--lb-surface-base)
  border: var(--lb-border-sm) solid var(--lb-border-neutral-normal)
  border-radius: var(--lb-radius-md)
  transition: border-color 0.2s ease, box-shadow 0.2s ease
  overflow: hidden
  
  &:focus-within
    border-color: var(--lb-border-neutral-active)
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
  
  &.disabled
    background: var(--lb-surface-disabled)
    border-color: var(--lb-border-neutral-disabled)
    
    textarea
      color: var(--lb-text-neutral-disabled)
      cursor: not-allowed

.input-row
  width: 100%
  
  textarea
    width: 100%
    min-height: var(--lb-space-5xl)
    padding: var(--lb-space-sm) var(--lb-space-md)
    background: transparent
    border: none
    font-family: inherit
    font-size: var(--lb-font-size-body-base)
    color: var(--lb-text-neutral-contrast-high)
    resize: none
    outline: none
    overflow-y: hidden
    
    &::placeholder
      color: var(--lb-text-neutral-contrast-low)
      opacity: 1

.actions-row
  display: flex
  align-items: center
  justify-content: flex-end
  gap: var(--lb-space-xs)
  padding: var(--lb-space-xs)

.plus-menu
  display: flex
  align-items: center
  margin-right: auto

.actions-middle
  display: flex
  align-items: center
  gap: var(--lb-space-xs)
  flex: 1

.primary-action
  display: flex
  align-items: center

// Smooth height transitions
.input-row textarea
  transition: height 0.2s ease-out

// Handle disabled state
.lb-chat-input.disabled
  .actions-row
    opacity: 0.6

// Transition styles for button switch
.fade-switch-enter-active,
.fade-switch-leave-active
  transition: opacity 0.2s ease

.fade-switch-enter-from
  opacity: 0

.fade-switch-leave-to
  opacity: 0
</style>