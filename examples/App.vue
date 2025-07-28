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
      
      .component-demo
        h3 Buttons
        
        .demo-group
          h4 Variants × Colors
          .button-grid
            template(v-for="variant in buttonVariants" :key="variant")
              .variant-row
                h5 {{ capitalize(variant) }}
                .button-row
                  LbButton(
                    v-for="color in buttonColors"
                    :key="`${variant}-${color}`"
                    :variant="variant"
                    :color="color"
                  ) {{ capitalize(color) }}
        
        .demo-group
          h4 Sizes
          .button-row
            LbButton(size="small") Small
            LbButton(size="medium") Medium
            LbButton(size="large") Large
            
        .demo-group
          h4 States
          .button-row
            LbButton Enabled
            LbButton(disabled) Disabled
            LbButton(loading) Loading
            LbButton(loading icon-position="trailing") Loading
            
        .demo-group
          h4 With Icons
          .button-row
            LbButton
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z")
              | Security
            LbButton(variant="outline" color="error")
              template(#icon-trailing)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9")
              | Sign Out
              
        .demo-group
          h4 Full Width
          LbButton(full-width) Full Width Button
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LbButton } from '../src'

const isDark = ref(false)

const colors = [
  { name: 'Primary', var: '--color-primary' },
  { name: 'Secondary', var: '--color-secondary' },
  { name: 'Error', var: '--color-error' },
  { name: 'Success', var: '--color-success' },
  { name: 'Warning', var: '--color-warning' },
  { name: 'Info', var: '--color-info' },
]

const buttonVariants = ['filled', 'tonal', 'outline', 'ghost']
const buttonColors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

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
  padding: base.$space-12 base.$space-8
  text-align: center
  border-bottom: base.$border-thin solid var(--color-border)
  
  h1
    margin-bottom: base.$space-2
    
.app-main
  max-width: 1200px
  margin: 0 auto
  padding: base.$space-8
  
section
  margin-bottom: base.$space-12
  
  h2
    margin-bottom: base.$space-6
    
.theme-section
  .theme-toggle
    button
      padding: base.$space-2 base.$space-4
      background: var(--color-primary)
      color: var(--color-primary-text)
      border-radius: base.$radius-3
      font-weight: typography.$weight-medium
      transition: base.$transition
      
      &:hover
        background: var(--color-primary-hover)
        
.typography-section
  > *
    margin-bottom: base.$space-4
    
.color-section
  .color-grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
    gap: base.$space-4
    
  .color-card
    text-align: center
    
    .color-swatch
      height: 80px
      border-radius: base.$radius-3
      border: base.$border-thin solid var(--color-border)
      margin-bottom: base.$space-2
      
.components-section
  .component-demo
    margin-bottom: base.$space-8
    
    h3
      margin-bottom: base.$space-6
      
  .demo-group
    margin-bottom: base.$space-8
    
    h4
      margin-bottom: base.$space-4
      color: var(--color-text-secondary)
      text-transform: uppercase
      letter-spacing: 0.05em
      
  .button-grid
    display: grid
    gap: base.$space-6
    
  .variant-row
    display: grid
    grid-template-columns: 100px 1fr
    align-items: center
    gap: base.$space-4
    
    h5
      color: var(--color-text-secondary)
      
  .button-row
    display: flex
    flex-wrap: wrap
    gap: base.$space-4
    align-items: center
</style>