<template lang="pug">
.lb-hint-text(:id="id" :class="rootClasses" role="status" v-if="$slots.default")
  .icon.icon-leading(v-if="$slots['icon-leading']")
    slot(name="icon-leading")
  span
    slot
  .icon.icon-trailing(v-if="$slots['icon-trailing']")
    slot(name="icon-trailing")
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  error?: boolean
  warning?: boolean
  success?: boolean
  id?: string
}

const props = defineProps<Props>()

// Computed - only add the active state class
const rootClasses = computed(() => {
  if (props.error) return 'error'
  if (props.warning) return 'warning'
  if (props.success) return 'success'
  return ''
})

// Slots
defineSlots<{
  default: () => any
  'icon-leading'?: () => any
  'icon-trailing'?: () => any
}>()
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-hint-text
  display: flex
  align-items: center
  gap: base.$space-xs
  font-size: typography.$font-size-label-small // 12px
  line-height: typography.$line-height-normal
  color: var(--lb-text-neutral-contrast-low)
  
  // State variations
  &.error
    color: var(--lb-text-error-contrast-high)
    
    .icon
      color: var(--lb-text-error-normal)
  
  &.warning
    color: var(--lb-text-warning-contrast-high)
    
    .icon
      color: var(--lb-text-warning-normal)
  
  &.success
    color: var(--lb-text-success-contrast-high)
    
    .icon
      color: var(--lb-text-success-normal)
  
  // Icons
  .icon
    display: flex
    align-items: center
    width: base.$size-2xl // 18px
    height: base.$size-2xl // 18px
    color: currentColor
  
  // Message text wrapper
  > span
    flex: 1
    
    // Ensure links inherit the state color
    a
      color: inherit
      text-decoration: underline
      
      &:hover
        opacity: base.$opacity-80
</style>