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
  gap: base.$space-xs
  font-family: typography.$font-body
  font-size: typography.$font-size-label-base // 14px (0.875rem)
  font-weight: var(--lb-font-weight-label)
  line-height: typography.$line-height-normal
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  letter-spacing: typography.$letter-spacing-tight
  align-self: flex-start  // Prevent stretching in flex containers
  
  // Required indicator
  &.required > span::after
    content: ' *'
    color: var(--lb-text-error-normal)
    font-weight: var(--lb-font-weight-body)
  
  // Icon
  .icon
    display: flex
    align-items: center
    color: var(--lb-text-neutral-contrast-low)
    width: base.$size-md // 12px
    height: base.$size-md // 12px
  
  // Text wrapper
  > span
    display: inline-flex
    align-items: baseline
  
  // Hint text (inline)
  .hint
    font-weight: var(--lb-font-weight-body)
    color: var(--lb-text-neutral-contrast-low)
    margin-left: base.$space-xs
    font-size: typography.$font-size-label-small
</style>