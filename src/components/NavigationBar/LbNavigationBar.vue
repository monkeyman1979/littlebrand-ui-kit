<template lang="pug">
nav.lb-navigation-bar(:class="navigationBarClasses")
  slot
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'

// Types
type ActiveColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

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
  display: flex
  align-items: center
  justify-content: space-around
  height: 3.5rem // 56px - Material Design 3 standard
  background-color: var(--color-surface)
  border-top: var(--border-sm) solid var(--color-border-subtle)
  box-shadow: var(--shadow-sm)
  z-index: var(--z-dropdown)
  
  &.fixed
    position: fixed
    bottom: 0
    left: 0
    right: 0
    z-index: var(--z-dropdown)
  
  // Ensure proper spacing distribution for up to 6 items
  > *
    flex: 1
    max-width: calc(100% / 6)
    min-width: 0
</style>