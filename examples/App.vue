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
          h4 Icon Only
          .button-row
            LbButton(icon-only variant="filled" color="primary" size="small")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6")
              | Home
            LbButton(icon-only variant="filled" color="primary")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6")
              | Home
            LbButton(icon-only variant="filled" color="primary" size="large")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6")
              | Home
            LbButton(icon-only variant="tonal" color="error")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16")
              | Delete
            LbButton(icon-only variant="outline" color="secondary")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M12 4v16m8-8H4")
              | Add
            LbButton(icon-only variant="ghost" color="info")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")
              | Info
            LbButton(icon-only variant="link" color="primary")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z")
              | Favorite
          .button-row
            LbButton(icon-only disabled)
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636")
              | Disabled
            LbButton(icon-only loading)
              | Loading
            
        .demo-group
          h4 Full Width
          LbButton(full-width) Full Width Button
              
        .demo-group
          h4 Button as Link
          .button-row
            LbButton(href="https://vuejs.org" target="_blank" rel="noopener") External Link
            LbButton(href="#typography-section" variant="outline" color="secondary") Anchor Link
            LbButton(tag="span" variant="ghost" color="info") Custom Tag (span)
            LbButton(href="https://github.com" target="_blank" variant="filled" color="primary")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="currentColor")
                  path(d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z")
              | GitHub
            LbButton(href="#" variant="tonal" color="success" disabled) Disabled Link
            
        .demo-group
          h4 Link Variant
          .button-row
            LbButton(variant="link" color="primary") Primary Link
            LbButton(variant="link" color="secondary") Secondary Link
            LbButton(variant="link" color="success") Success Link
            LbButton(variant="link" color="warning") Warning Link
            LbButton(variant="link" color="error") Error Link
            LbButton(variant="link" color="info") Info Link
          .button-row
            LbButton(variant="link" color="primary" disabled) Disabled Link
            LbButton(variant="link" color="primary" href="https://vuejs.org" target="_blank")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="currentColor")
                  path(d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22")
              | External Link
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
      border-radius: base.$radius-md
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
      border-radius: base.$radius-md
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