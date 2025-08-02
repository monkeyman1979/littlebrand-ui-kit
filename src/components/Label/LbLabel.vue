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
  gap: var(--space-xs)
  font-family: var(--font-body)
  font-weight: var(--font-weight-medium)
  line-height: var(--line-height-normal)
  color: var(--color-text)
  cursor: pointer
  font-size: var(--font-size-label-base)
  letter-spacing: var(--letter-spacing-tight)
  
  // Required indicator
  &.required > span::after
    content: ' *'
    color: var(--color-error)
    font-weight: var(--font-weight-normal)
  
  // Icon
  .icon
    display: flex
    align-items: center
    color: var(--color-text-secondary)
    width: var(--icon-size-xs) // 12px
    height: var(--icon-size-xs) // 12px
  
  // Text wrapper
  > span
    flex: 1
  
  // Hint text (inline)
  .hint
    font-weight: var(--font-weight-normal)
    color: var(--color-text-secondary)
    margin-left: var(--space-xs)
    font-size: var(--font-size-label-small)
</style>