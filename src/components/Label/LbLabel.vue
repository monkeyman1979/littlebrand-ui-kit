<template lang="pug">
label(:for="for" :class="{ required }")
  .icon(v-if="$slots.icon")
    slot(name="icon")
  span(v-if="$slots.default || $slots.hint")
    slot
    span.hint(v-if="$slots.hint")
      slot(name="hint")
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

// Props
interface Props {
  for?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

// Destructure props for cleaner template usage
const { required } = toRefs(props)

// Slots
defineSlots<{
  default: () => any
  hint?: () => any
  icon?: () => any
}>()
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

label
  display: inline-flex
  align-items: center
  gap: var(--lb-space-xs)
  font-family: var(--lb-font-body)
  font-weight: var(--lb-font-weight-medium)
  line-height: var(--lb-line-height-normal)
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  font-size: var(--lb-font-size-label-base)
  letter-spacing: var(--lb-letter-spacing-tight)
  
  // Required indicator
  &.required > span::after
    content: ' *'
    color: var(--lb-text-error-normal)
    font-weight: var(--lb-font-weight-normal)
  
  // Icon
  .icon
    display: flex
    align-items: center
    color: var(--lb-text-neutral-contrast-low)
    width: var(--lb-icon-size-xs) // 12px
    height: var(--lb-icon-size-xs) // 12px
  
  // Text wrapper
  > span
    flex: 1
  
  // Hint text (inline)
  .hint
    font-weight: var(--lb-font-weight-normal)
    color: var(--lb-text-neutral-contrast-low)
    margin-left: var(--lb-space-xs)
    font-size: var(--lb-font-size-label-small)
</style>