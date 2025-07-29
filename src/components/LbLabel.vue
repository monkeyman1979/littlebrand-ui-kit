<template lang="pug">
label(:for="for" :class="rootClasses")
  .icon(v-if="$slots.icon")
    slot(name="icon")
  span
    slot
    span.hint(v-if="$slots.hint")
      slot(name="hint")
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  for?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

// Computed
const rootClasses = computed(() => ({
  'required': props.required
}))

// Slots
defineSlots<{
  default: () => any
  hint?: () => any
  icon?: () => any
}>()
</script>

<style lang="sass" scoped>
@use '../styles/base' as base
@use '../styles/typography' as typography

label
  display: inline-flex
  align-items: center
  gap: base.$space-2
  font-family: typography.$font-body
  font-weight: typography.$weight-medium
  line-height: typography.$line-normal
  color: var(--color-text)
  cursor: pointer
  font-size: typography.$label-size-base
  letter-spacing: typography.$letter-spacing-tight
  
  // Required indicator
  &.required > span::after
    content: ' *'
    color: var(--color-error)
    font-weight: typography.$weight-normal
  
  // Icon
  .icon
    flex-shrink: 0
    display: flex
    align-items: center
    color: var(--color-text-secondary)
    width: base.$size-2xs // 12px
    height: base.$size-2xs // 12px
  
  // Text wrapper
  > span
    flex: 1
  
  // Hint text (inline)
  .hint
    font-weight: typography.$weight-normal
    color: var(--color-text-secondary)
    margin-left: base.$space-2
    font-size: typography.$label-size-small
</style>