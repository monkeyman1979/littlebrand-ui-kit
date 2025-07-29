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
              
      .component-demo
        h3 Input
        
        .demo-group
          h4 Size Variants
          .input-row
            LbInput(v-model="inputSizeSmall" size="small" placeholder="Small input")
            LbInput(v-model="inputSizeMedium" size="medium" placeholder="Medium input (default)")
            LbInput(v-model="inputSizeLarge" size="large" placeholder="Large input")
        
        .demo-group
          h4 Basic Examples
          .input-row
            LbInput(v-model="inputValue1" placeholder="Enter text...")
            LbInput(v-model="inputValue2" type="email" placeholder="Enter email..." clearable)
            LbInput(v-model="passwordValue" type="password" placeholder="Enter password...")
        
        .demo-group
          h4 Password Toggle
          .input-row
            LbInput(v-model="passwordDemo1" type="password" placeholder="Your password")
            LbInput(v-model="passwordDemo2" type="password" placeholder="Confirm password" clearable)
        
        .demo-group
          h4 Search & Clearable
          .input-row
            LbInput(v-model="searchValue" type="search" placeholder="Search..." clearable)
              template(#icon-leading)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" fill="currentColor")
            LbInput(v-model="clearableValue" placeholder="Type something to see clear button..." clearable)
        
        .demo-group
          h4 Loading State
          .input-row
            LbInput(v-model="loadingValue" placeholder="Loading state example" :loading="true")
            LbInput(v-model="asyncSearchValue" placeholder="Type to search..." :loading="isSearching" @input="handleAsyncSearch" clearable)
              template(#icon-leading)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" fill="currentColor")
        
        .demo-group
          h4 Input States
          .input-row
            LbInput(v-model="inputDisabled" placeholder="Disabled input" :disabled="true")
            LbInput(v-model="inputReadonly" placeholder="Readonly input" :readonly="true")
            LbInput(v-model="inputInvalid" placeholder="Invalid input" :invalid="true")
        
        .demo-group
          h4 With Custom Icons
          .input-row
            LbInput(v-model="inputWithTrailing" placeholder="Enter amount...")
              template(#icon-trailing)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M8 1a7 7 0 100 14A7 7 0 008 1zM8.75 4.5a.75.75 0 00-1.5 0v3.25H5.5a.75.75 0 000 1.5h1.75v2.25a.75.75 0 001.5 0V9.25h1.75a.75.75 0 000-1.5H8.75V4.5z" fill="currentColor")
            LbInput(v-model="inputWithBoth" type="email" placeholder="Enter email..." clearable)
              template(#icon-leading)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 002 13h12a1 1 0 00.966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" fill="currentColor")
      
      .component-demo
        h3 Form Components
        
        .demo-group
          h4 Labels and Inputs
          .form-field
            LbLabel(for="form-name") Name
            LbInput(id="form-name" v-model="formData.name" placeholder="Enter your name")
          
          .form-field
            LbLabel(for="form-email" required) Email
            LbInput(
              id="form-email" 
              v-model="formData.email" 
              type="email" 
              placeholder="your@email.com"
              :aria-describedby="formData.email ? '' : 'email-hint'"
            )
            LbHintText(id="email-hint" v-if="!formData.email") We'll never share your email
        
        .demo-group
          h4 Validation States
          .form-field
            LbLabel(for="valid-input") Valid Input
            LbInput(
              id="valid-input" 
              v-model="validatedFields.valid" 
              placeholder="This is valid"
              aria-describedby="valid-hint"
            )
            LbHintText(id="valid-hint" success)
              template(#icon-leading)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M8 14A6 6 0 108 2a6 6 0 000 12zm2.78-7.22a.75.75 0 10-1.06-1.06L7.25 8.19l-.97-.97a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3-3z" fill="currentColor")
              | Looking good!
          
          .form-field
            LbLabel(for="warning-input") Warning State
            LbInput(
              id="warning-input" 
              v-model="validatedFields.warning" 
              placeholder="This has a warning"
              aria-describedby="warning-hint"
            )
            LbHintText(id="warning-hint" warning)
              template(#icon-leading)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M8.982 1.566a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 01-1.1 0L7.1 5.995A.905.905 0 018 5zm.002 6a1 1 0 100 2 1 1 0 000-2z" fill="currentColor")
              | This username is already taken
          
          .form-field
            LbLabel(for="error-input" required) Error State
            LbInput(
              id="error-input" 
              v-model="validatedFields.error" 
              placeholder="This has an error"
              :invalid="true"
              aria-describedby="error-hint"
            )
            LbHintText(id="error-hint" error) This field is required
        
        .demo-group
          h4 Complex Form Example
          form.example-form(@submit.prevent="handleSubmit")
            .form-field
              LbLabel(for="signup-email" required) Email Address
              LbInput(
                id="signup-email"
                v-model="signupForm.email"
                type="email"
                placeholder="your@email.com"
                :invalid="!!signupErrors.email"
                :aria-describedby="signupErrors.email ? 'signup-email-error' : 'signup-email-hint'"
              )
                template(#icon-leading)
                  svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                    path(d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 002 13h12a1 1 0 00.966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" fill="currentColor")
              LbHintText(id="signup-email-hint" v-if="!signupErrors.email") We'll use this to send you updates
              LbHintText(id="signup-email-error" error v-if="signupErrors.email") {{ signupErrors.email }}
            
            .form-field
              LbLabel(for="signup-password" required)
                template(#icon)
                  svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                    path(d="M12.5 5h-9a1 1 0 00-1 1v7a1 1 0 001 1h9a1 1 0 001-1V6a1 1 0 00-1-1zm-4.5 5.5a1 1 0 110-2 1 1 0 010 2zM11 5V3.5C11 2.12 9.88 1 8.5 1h-1C6.12 1 5 2.12 5 3.5V5h1.5V3.5a1 1 0 011-1h1a1 1 0 011 1V5H11z" fill="currentColor")
                | Create Password
              LbInput(
                id="signup-password"
                v-model="signupForm.password"
                type="password"
                placeholder="Create a strong password"
                :invalid="!!signupErrors.password"
                aria-describedby="signup-password-requirements"
              )
              LbHintText(
                id="signup-password-requirements"
                :error="!!signupErrors.password"
                :success="signupForm.password.length >= 8 && !signupErrors.password"
              )
                template(#icon-leading)
                  svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                    path(v-if="signupForm.password.length >= 8" d="M8 14A6 6 0 108 2a6 6 0 000 12zm2.78-7.22a.75.75 0 10-1.06-1.06L7.25 8.19l-.97-.97a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3-3z" fill="currentColor")
                    path(v-else d="M8 14A6 6 0 108 2a6 6 0 000 12zm0-9a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 018 5zm0 6a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="currentColor")
                | {{ signupErrors.password || 'Password must be at least 8 characters' }}
            
            .form-actions
              LbButton(type="submit" :disabled="!isFormValid") Sign Up
              LbButton(type="button" variant="ghost" @click="resetForm") Reset
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { LbButton, LbInput, LbLabel, LbHintText } from '../src'

const isDark = ref(false)

// Input demo values
const inputValue1 = ref('')
const inputValue2 = ref('')
const passwordValue = ref('secretpassword123')
const inputDisabled = ref('Disabled value')
const inputReadonly = ref('Readonly value')
const inputInvalid = ref('')
const inputWithTrailing = ref('')
const inputWithBoth = ref('')

// Size variants
const inputSizeSmall = ref('')
const inputSizeMedium = ref('')
const inputSizeLarge = ref('')

// Password demos
const passwordDemo1 = ref('mySecretPass123')
const passwordDemo2 = ref('')

// Search and clearable
const searchValue = ref('')
const clearableValue = ref('')

// Loading states
const loadingValue = ref('Loading example')
const asyncSearchValue = ref('')
const isSearching = ref(false)

// Async search handler
let searchTimeout
const handleAsyncSearch = () => {
  clearTimeout(searchTimeout)
  if (asyncSearchValue.value) {
    isSearching.value = true
    searchTimeout = setTimeout(() => {
      isSearching.value = false
    }, 1500)
  } else {
    isSearching.value = false
  }
}

// Form demo values
const formData = ref({
  name: '',
  email: ''
})

// Validated fields examples
const validatedFields = ref({
  valid: 'This is valid',
  warning: 'takenusername',
  error: ''
})

// Complex form example
const signupForm = ref({
  email: '',
  password: ''
})

const signupErrors = ref({
  email: '',
  password: ''
})

const isFormValid = computed(() => {
  return signupForm.value.email && 
         signupForm.value.password.length >= 8
})

const handleSubmit = () => {
  // Reset errors
  signupErrors.value = {
    email: '',
    password: ''
  }
  
  // Validate email
  if (!signupForm.value.email.includes('@')) {
    signupErrors.value.email = 'Please enter a valid email address'
  }
  
  // Validate password
  if (signupForm.value.password.length < 8) {
    signupErrors.value.password = 'Password is too short'
  }
  
  // If no errors, show success
  if (!signupErrors.value.email && !signupErrors.value.password) {
    alert('Form submitted successfully!')
  }
}

const resetForm = () => {
  signupForm.value = {
    email: '',
    password: ''
  }
  signupErrors.value = {
    email: '',
    password: ''
  }
}

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
  
  h1, p
    margin: 0
    
.app-main
  max-width: 1200px
  margin: 0 auto
  padding: base.$space-8
  
.app-main
  display: flex
  flex-direction: column
  gap: base.$space-12

section
  display: flex
  flex-direction: column
  gap: base.$space-6
  
  h2
    margin: 0
    
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
  display: flex
  flex-direction: column
  gap: base.$space-4
    
.color-section
  .color-grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
    gap: base.$space-4
    
  .color-card
    display: flex
    flex-direction: column
    gap: base.$space-2
    text-align: center
    
    .color-swatch
      height: 80px
      border-radius: base.$radius-md
      border: base.$border-thin solid var(--color-border)
      
.components-section
  display: flex
  flex-direction: column
  gap: base.$space-8
  
  .component-demo
    display: flex
    flex-direction: column
    gap: base.$space-8
    
    h3
      margin: 0
      
  .demo-group
    display: flex
    flex-direction: column
    gap: base.$space-4
    
    h4
      margin: 0
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
    
  .input-row
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
    gap: base.$space-4
    
  .demo-note
    font-size: 0.875rem
    color: var(--color-text-secondary)
    
.form-field
  display: flex
  flex-direction: column
  gap: base.$space-2
  max-width: 400px

.example-form
  display: flex
  flex-direction: column
  gap: base.$space-6
  background: var(--color-surface)
  border: base.$border-thin solid var(--color-border)
  border-radius: base.$radius-lg
  padding: base.$space-8
  max-width: 500px
  
  .form-field
    max-width: none

.form-actions
  display: flex
  gap: base.$space-4
</style>