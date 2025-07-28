<template lang="pug">
.app-container
  header.app-header
    h1 LittleBrand UI Kit
    p.body-large A clean, semantic Vue.js UI kit with zero utility classes
    
  main.app-main
    section.theme-section
      h2 Theme Support
      .theme-toggle
        button(@click="toggleTheme") Toggle {{ isDark ? 'Light' : 'Dark' }} Mode
    
    section.typography-section
      h2 Typography
      .display-1 Display 1
      .display-2 Display 2
      h1 Heading 1
      h2 Heading 2
      h3 Heading 3
      h4 Heading 4
      h5 Heading 5
      h6 Heading 6
      p This is a regular paragraph with normal text.
      p.body-large This is large body text for emphasis.
      p.body-small This is small body text for fine print.
      
    section.color-section
      h2 Color Palette
      .color-grid
        .color-card(v-for="color in colors" :key="color.name")
          .color-swatch(:style="{ background: `var(${color.var})` }")
          .label {{ color.name }}
          
    section.components-section
      h2 Components
      p Components will be displayed here as they are created.
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const colors = [
  { name: 'Primary', var: '--color-primary' },
  { name: 'Secondary', var: '--color-secondary' },
  { name: 'Error', var: '--color-error' },
  { name: 'Success', var: '--color-success' },
  { name: 'Warning', var: '--color-warning' },
  { name: 'Info', var: '--color-info' },
]

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  // Check for user's theme preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})
</script>

<style lang="sass">
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.app-container
  min-height: 100vh
  
.app-header
  padding: base.$space-2xl base.$space-xl
  text-align: center
  border-bottom: base.$border-thin solid var(--color-border)
  
  h1
    margin-bottom: base.$space-sm
    
.app-main
  max-width: 1200px
  margin: 0 auto
  padding: base.$space-xl
  
section
  margin-bottom: base.$space-2xl
  
  h2
    margin-bottom: base.$space-lg
    
.theme-section
  .theme-toggle
    button
      padding: base.$space-sm base.$space-md
      background: var(--color-primary)
      color: var(--color-primary-text)
      border-radius: base.$radius-md
      font-weight: typography.$weight-medium
      transition: base.$transition
      
      &:hover
        background: var(--color-primary-hover)
        
.typography-section
  > *
    margin-bottom: base.$space-md
    
.color-section
  .color-grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
    gap: base.$space-md
    
  .color-card
    text-align: center
    
    .color-swatch
      height: 80px
      border-radius: base.$radius-md
      border: base.$border-thin solid var(--color-border)
      margin-bottom: base.$space-sm
      
.components-section
  p
    color: var(--color-text-secondary)
</style>