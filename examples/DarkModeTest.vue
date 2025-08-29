<template lang="pug">
.dark-mode-test
  .controls
    h2 Dark Mode Test
    button(@click="toggleDarkMode") Toggle Dark Mode
    .mode-status
      | Current mode: {{ isDark ? 'Dark' : 'Light' }}
  
  .test-grid
    .test-section
      h3 Primary Color
      LbButton(color="primary" variant="filled") Primary Button
      .color-box.primary-fill
      .color-box.primary-border
      .text.primary-text Primary Text
    
    .test-section
      h3 Secondary Color
      LbButton(color="secondary" variant="filled") Secondary Button
      .color-box.secondary-fill
      .color-box.secondary-border
      .text.secondary-text Secondary Text
    
    .test-section
      h3 Surface Colors
      .surface-card
        h4 Surface Card
        p This tests surface background colors
      .surface-card.subtle
        h4 Subtle Surface
        p This tests subtle surface colors
    
    .test-section
      h3 Neutral/Background
      .background-test
        p Page background color test
      .surface-test
        p Surface background color test
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LbButton from '../src/components/LbButton.vue'

const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

onMounted(() => {
  // Check initial state
  isDark.value = document.documentElement.getAttribute('data-theme') === 'dark'
})
</script>

<style lang="sass" scoped>
.dark-mode-test
  padding: 2rem
  min-height: 100vh
  background: var(--lb-background-page)
  transition: background-color 0.3s ease

.controls
  margin-bottom: 2rem
  padding: 1rem
  background: var(--lb-background-surface)
  border-radius: var(--lb-radius-md)
  
  h2
    margin: 0 0 1rem 0
    
  button
    padding: 0.5rem 1rem
    margin-right: 1rem
    background: var(--lb-fill-primary-normal)
    color: var(--lb-text-on-primary)
    border: none
    border-radius: var(--lb-radius-sm)
    cursor: pointer
    
    &:hover
      background: var(--lb-fill-primary-hover)
      
  .mode-status
    display: inline-block
    padding: 0.5rem 1rem
    background: var(--lb-surface-neutral-normal)
    border-radius: var(--lb-radius-sm)
    color: var(--lb-text-neutral-contrast-high)

.test-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
  gap: 2rem

.test-section
  background: var(--lb-background-surface)
  padding: 1.5rem
  border-radius: var(--lb-radius-md)
  
  h3
    margin: 0 0 1rem 0
    color: var(--lb-text-neutral-contrast-high)

.color-box
  width: 100%
  height: 60px
  margin: 0.5rem 0
  border-radius: var(--lb-radius-sm)
  
  &.primary-fill
    background: var(--lb-fill-primary-normal)
    
  &.primary-border
    border: 2px solid var(--lb-border-primary-normal)
    
  &.secondary-fill
    background: var(--lb-fill-secondary-normal)
    
  &.secondary-border
    border: 2px solid var(--lb-border-secondary-normal)

.text
  margin: 0.5rem 0
  font-weight: 600
  
  &.primary-text
    color: var(--lb-text-primary-normal)
    
  &.secondary-text
    color: var(--lb-text-secondary-normal)

.surface-card
  padding: 1rem
  margin: 0.5rem 0
  border-radius: var(--lb-radius-sm)
  background: var(--lb-surface-neutral-normal)
  
  &.subtle
    background: var(--lb-surface-neutral-subtle)
    
  h4
    margin: 0 0 0.5rem 0
    color: var(--lb-text-neutral-contrast-high)
    
  p
    margin: 0
    color: var(--lb-text-neutral-normal)

.background-test,
.surface-test
  padding: 1rem
  margin: 0.5rem 0
  border-radius: var(--lb-radius-sm)
  
  p
    margin: 0
    color: var(--lb-text-neutral-normal)

.background-test
  background: var(--lb-background-page)
  border: 1px solid var(--lb-border-neutral-line)

.surface-test
  background: var(--lb-background-surface)
  border: 1px solid var(--lb-border-neutral-line)
</style>