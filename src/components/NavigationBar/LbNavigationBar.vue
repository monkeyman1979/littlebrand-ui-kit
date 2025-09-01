<template lang="pug">
nav.lb-navigation-bar(:class="navigationBarClasses")
  slot
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'

// Types
type ActiveColor = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'

// Props
const props = withDefaults(defineProps<{
  modelValue?: string | number
  showLabels?: boolean
  activeColor?: ActiveColor
  fixed?: boolean
}>(), {
  showLabels: true,
  activeColor: 'primary',
  fixed: true
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// Reactive state
const activeValue = ref(props.modelValue)

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  activeValue.value = newValue
})

// Computed
const navigationBarClasses = computed(() => [
  `active-${props.activeColor}`,
  {
    'fixed': props.fixed,
    'show-labels': props.showLabels
  }
])

// Provide context to child items
provide('navigationBar', {
  activeValue,
  showLabels: computed(() => props.showLabels),
  activeColor: computed(() => props.activeColor),
  updateActive: (value: string | number) => {
    activeValue.value = value
    emit('update:modelValue', value)
  }
})

// Component options
defineOptions({
  name: 'LbNavigationBar',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-navigation-bar
  display: grid
  grid-auto-flow: column
  grid-auto-columns: 1fr
  align-items: stretch
  height: 4rem // 64px fixed height
  background-color: var(--lb-surface-subtle)
  border-top: base.$border-sm solid var(--lb-border-neutral-line)
  box-shadow: base.$shadow-sm
  z-index: base.$z-dropdown
  
  // Account for safe area on mobile devices by increasing height
  @supports (padding: env(safe-area-inset-bottom))
    height: calc(4rem + env(safe-area-inset-bottom))
  
  &.fixed
    position: fixed
    bottom: 0
    left: 0
    right: 0
    z-index: base.$z-dropdown
</style>