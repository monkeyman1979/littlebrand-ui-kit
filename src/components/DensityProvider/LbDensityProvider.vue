<template lang="pug">
.lb-density-provider(:class="densityClass")
  slot
</template>

<script setup lang="ts">
import { computed, provide, type ComputedRef } from 'vue'

export type Density = 'compact' | 'default'

interface Props {
  density?: Density
}

const props = withDefaults(defineProps<Props>(), {
  density: 'default'
})

// Map density to component sizes
const densityToSizeMap = {
  compact: 'medium',
  default: 'large'
} as const

// Provide the density value to all child components
provide<Density>('density', props.density)

// Also provide the mapped size for convenience
const mappedSize = computed(() => densityToSizeMap[props.density])
provide<ComputedRef<'medium' | 'large'>>('densitySize', mappedSize)

// Add a class to the root element for CSS-based density control
const densityClass = computed(() => `density-${props.density}`)

defineOptions({
  name: 'LbDensityProvider'
})
</script>

<style lang="sass" scoped>
.lb-density-provider
  // Set CSS variables that components can use
  &.density-compact
    --lb-density: compact
    --lb-density-input-height: var(--lb-size-6xl)
    --lb-density-font-size: var(--lb-font-size-label-base)
    
  &.density-default
    --lb-density: default
    --lb-density-input-height: var(--lb-size-7xl)
    --lb-density-font-size: var(--lb-font-size-label-large)
</style>