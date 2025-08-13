<template lang="pug">
.theme-test
  h1 Custom Theme Test
  
  .section
    h2 Testing Mix & Match Approach
    
    .color-grid
      //- Test primary color (single color input)
      .color-card
        .color-swatch.primary
        .color-info
          strong Primary
          span Single color: #6366f1
          span Auto-generated scale
      
      //- Test secondary with full scale
      .color-card
        .color-swatch.secondary
        .color-info
          strong Secondary  
          span Full 12-step scale
          span Custom defined
      
      //- Test preset
      .color-card
        .color-swatch.neutral
        .color-info
          strong Neutral
          span Preset: 'slate'
          span Built-in scale
      
      //- Test custom accent color
      .color-card
        .color-swatch.accent-purple
        .color-info
          strong Custom Accent
          span accent-purple: #9333ea
          span Additional color
    
    .component-test
      h3 Components with Custom Theme
      
      LbButton(variant="filled" color="primary") Primary Button
      LbButton(variant="filled" color="secondary") Secondary Button
      LbButton(variant="outline" color="primary") Outline Primary
      
      .custom-accent-demo
        //- Using custom accent color in CSS
        .custom-box Custom Accent Box
</template>

<script setup lang="ts">
import { LbButton } from '@/components'
</script>

<style lang="sass" scoped>
// Import custom theme configuration
@use '../src/styles/theme-config' as config with (
  $theme-colors: (
    'primary': #6366f1,    // Indigo
    'secondary': (         // Full scale for secondary
      1: #f0fdfa,
      2: #ccfbf1,
      3: #99f6e4,
      4: #5eead4,
      5: #2dd4bf,
      6: #14b8a6,
      7: #0d9488,
      8: #0f766e,
      9: #115e59,
      10: #134e4a,
      11: #0f3a36,
      12: #042825,
    ),
    'neutral': 'slate',    // Use preset
    'accent-purple': #9333ea,  // Custom accent color
  )
)

// Apply the custom theme to this component
@use '../src/styles/theme' with (
  $use-custom-theme: true
)

.theme-test
  padding: 2rem
  font-family: system-ui, -apple-system, sans-serif

.section
  margin-bottom: 3rem

h1
  color: var(--lb-text-primary-contrast-high)
  margin-bottom: 2rem

h2
  color: var(--lb-text-neutral-contrast-high)
  margin-bottom: 1.5rem

h3
  color: var(--lb-text-neutral-contrast-low)
  margin-bottom: 1rem

.color-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: 1rem
  margin-bottom: 2rem

.color-card
  background: white
  border: 1px solid var(--lb-border-neutral-line)
  border-radius: 8px
  padding: 1rem
  
.color-swatch
  height: 80px
  border-radius: 4px
  margin-bottom: 0.5rem
  
  &.primary
    background: var(--lb-fill-primary-normal)
    
  &.secondary
    background: var(--lb-fill-secondary-normal)
    
  &.neutral
    background: var(--lb-fill-neutral-normal)
    
  &.accent-purple
    background: var(--lb-fill-accent-purple-normal)

.color-info
  display: flex
  flex-direction: column
  gap: 0.25rem
  
  strong
    font-weight: 600
    color: var(--lb-text-neutral-contrast-high)
    
  span
    font-size: 0.875rem
    color: var(--lb-text-neutral-contrast-low)

.component-test
  background: var(--lb-surface-neutral-subtle)
  padding: 1.5rem
  border-radius: 8px
  
  button
    margin-right: 0.5rem
    margin-bottom: 0.5rem

.custom-accent-demo
  margin-top: 1rem
  
.custom-box
  padding: 1rem
  background: var(--lb-surface-accent-purple-normal)
  color: var(--lb-text-accent-purple-contrast-high)
  border: 2px solid var(--lb-border-accent-purple-normal)
  border-radius: 8px
  text-align: center
  
  &:hover
    background: var(--lb-surface-accent-purple-hover)
    border-color: var(--lb-border-accent-purple-active)
</style>
</template>