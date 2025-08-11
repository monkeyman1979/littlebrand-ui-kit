<template lang="pug">
.app-container
  header.app-header
    h1 LittleBrand UI Kit
    p.body-large A clean, semantic Vue.js UI kit with zero utility classes
  
  main.app-main
    section.theme-section
      h2 Theme Support
      .theme-toggle
        LbButton(@click="toggleTheme" variant="filled" color="primary")
          template(#icon-leading)
            svg(v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
              path(d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z")
            svg(v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
              path(d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z")
          | {{ isDark ? 'Dark Mode' : 'Light Mode' }}
      
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
        h3 Textarea
        
        .demo-group
          h4 Basic Examples
          .input-row
            LbTextarea(v-model="textareaValue1" placeholder="Enter your message...")
            LbTextarea(v-model="textareaValue2" placeholder="Another textarea...")
        
        .demo-group
          h4 Textarea States
          .input-row
            LbTextarea(v-model="textareaDisabled" placeholder="Disabled textarea" :disabled="true")
            LbTextarea(v-model="textareaReadonly" placeholder="Readonly textarea" :readonly="true")
            LbTextarea(v-model="textareaInvalid" placeholder="Invalid textarea" :invalid="true")
        
        .demo-group
          h4 Auto-Resize Options
          .input-row
            LbTextarea(v-model="textareaAutoResize1" placeholder="Type to see auto-resize..." auto-resize)
            LbTextarea(v-model="textareaAutoResize2" placeholder="Auto-resize with max 8 rows" auto-resize :max-rows="8")
            LbTextarea(v-model="textareaAutoResize3" placeholder="Starts with 6 rows" :rows="6" auto-resize :max-rows="12")
        
        .demo-group
          h4 Resize Options
          .input-row
            LbTextarea(v-model="textareaValue1" placeholder="No resize" resize="none")
            LbTextarea(v-model="textareaValue1" placeholder="Vertical resize (default)" resize="vertical")
            LbTextarea(v-model="textareaValue1" placeholder="Both directions" resize="both")
        
        .demo-group
          h4 With Labels and Hints
          .form-field
            LbLabel(for="textarea-feedback" required) Feedback
            LbTextarea(
              id="textarea-feedback"
              v-model="textareaValue1"
              placeholder="Tell us what you think..."
              :rows="5"
              aria-describedby="textarea-feedback-hint"
            )
            LbHintText(id="textarea-feedback-hint") Please provide detailed feedback to help us improve
          
          .form-field
            LbLabel(for="textarea-bio") Bio
              template(#hint) optional
            LbTextarea(
              id="textarea-bio"
              v-model="textareaValue2"
              placeholder="Tell us about yourself..."
              :maxlength="200"
              aria-describedby="textarea-bio-hint"
            )
            LbHintText(id="textarea-bio-hint") Write a short bio. Max 200 characters.
      
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
            LbHintText(id="email-hint" v-if="!formData.email") | We'll never share your email
        
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
              LbHintText(id="signup-email-hint" v-if="!signupErrors.email") | We'll use this to send you updates
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
      
      .component-demo
        h3 Checkbox & Radio
        
        .demo-group
          h4 Checkbox States
          .checkbox-row
            .checkbox-item
              LbCheckbox(v-model="checkboxUnchecked" id="check-unchecked")
              LbLabel(for="check-unchecked") Unchecked
            .checkbox-item
              LbCheckbox(v-model="checkboxChecked" id="check-checked")
              LbLabel(for="check-checked") Checked
            .checkbox-item
              LbCheckbox(v-model="checkboxDisabled" disabled id="check-disabled")
              LbLabel(for="check-disabled") Disabled
            .checkbox-item
              LbCheckbox(v-model="checkboxDisabledChecked" disabled id="check-disabled-checked")
              LbLabel(for="check-disabled-checked") Disabled checked
            .checkbox-item
              LbCheckbox(v-model="checkboxInvalid" invalid id="check-invalid")
              LbLabel(for="check-invalid") Invalid state
        
        .demo-group
          h4 Indeterminate State
          .checkbox-row
            .checkbox-item
              LbCheckbox(
                v-model="parentCheckbox"
                :indeterminate="isIndeterminate"
                id="parent-checkbox"
                @change="handleParentChange"
              )
              LbLabel(for="parent-checkbox") Select all items
          .checkbox-group
            .checkbox-item(v-for="(item, index) in checkboxItems" :key="index")
              LbCheckbox(
                v-model="item.checked"
                :id="`child-checkbox-${index}`"
                @change="handleChildChange"
              )
              LbLabel(:for="`child-checkbox-${index}`") {{ item.label }}
        
        .demo-group
          h4 Multiple Selection (Array Binding)
          .checkbox-row
            .checkbox-item(v-for="option in multipleOptions" :key="option.value")
              LbCheckbox(
                v-model="selectedOptions"
                :value="option.value"
                :id="`multi-${option.value}`"
              )
              LbLabel(:for="`multi-${option.value}`") {{ option.label }}
          .demo-note Selected: {{ selectedOptions.join(', ') || 'None' }}
        
        .demo-group
          h4 Radio States
          .radio-row
            .radio-item
              LbRadio(v-model="radioStates" value="unchecked" name="radio-states" id="radio-unchecked")
              LbLabel(for="radio-unchecked") Unchecked
            .radio-item
              LbRadio(v-model="radioStates" value="checked" name="radio-states" id="radio-checked")
              LbLabel(for="radio-checked") Checked
            .radio-item
              LbRadio(v-model="radioDisabled" value="disabled" disabled name="radio-disabled" id="radio-disabled")
              LbLabel(for="radio-disabled") Disabled
            .radio-item
              LbRadio(v-model="radioDisabledChecked" value="disabled-checked" disabled name="radio-disabled-checked" id="radio-disabled-checked")
              LbLabel(for="radio-disabled-checked") Disabled checked
            .radio-item
              LbRadio(v-model="radioInvalid" value="invalid" invalid name="radio-invalid" id="radio-invalid")
              LbLabel(for="radio-invalid") Invalid state
        
        .demo-group
          h4 Radio Group Example
          .form-field
            LbLabel Plan Selection
            .radio-group(role="radiogroup" aria-labelledby="plan-label")
              .radio-item(v-for="plan in planOptions" :key="plan.value")
                LbRadio(
                  v-model="selectedPlan"
                  :value="plan.value"
                  name="plan-selection"
                  :id="`plan-${plan.value}`"
                  :aria-describedby="`plan-${plan.value}-desc`"
                )
                .radio-content
                  LbLabel(:for="`plan-${plan.value}`") {{ plan.name }}
                  LbHintText(:id="`plan-${plan.value}-desc`") {{ plan.description }}
            .demo-note Selected plan: {{ selectedPlan }}
        
        .demo-group
          h4 Form Integration Example
          form.example-form(@submit.prevent="handleCheckboxFormSubmit")
            .form-field
              LbLabel Notification Preferences
              .checkbox-group(role="group" aria-labelledby="notifications-label")
                .checkbox-item
                  LbCheckbox(
                    v-model="notificationPrefs.email"
                    id="notif-email"
                    aria-describedby="notif-email-hint"
                  )
                  LbLabel(for="notif-email") Email notifications
                  LbHintText(id="notif-email-hint") Receive updates via email
                
                .checkbox-item
                  LbCheckbox(
                    v-model="notificationPrefs.sms"
                    id="notif-sms"
                    aria-describedby="notif-sms-hint"
                  )
                  LbLabel(for="notif-sms") SMS notifications
                  LbHintText(id="notif-sms-hint") Receive text messages for urgent updates
                
                .checkbox-item
                  LbCheckbox(
                    v-model="notificationPrefs.push"
                    id="notif-push"
                    aria-describedby="notif-push-hint"
                  )
                  LbLabel(for="notif-push") Push notifications
                  LbHintText(id="notif-push-hint") Get browser notifications
            
            .form-field
              LbLabel(required) Frequency
              .radio-group(role="radiogroup" aria-labelledby="frequency-label")
                .radio-item(v-for="freq in frequencyOptions" :key="freq.value")
                  LbRadio(
                    v-model="notificationFrequency"
                    :value="freq.value"
                    name="notification-frequency"
                    :id="`freq-${freq.value}`"
                  )
                  LbLabel(:for="`freq-${freq.value}`") {{ freq.label }}
            
            .form-field
              LbCheckbox(
                v-model="termsAccepted"
                id="terms-checkbox"
                :invalid="showTermsError"
                aria-describedby="terms-error"
                required
              )
              LbLabel(for="terms-checkbox") I agree to the terms and conditions
              LbHintText(id="terms-error" error v-if="showTermsError") You must accept the terms to continue
            
            .form-actions
              LbButton(type="submit") Save Preferences
              LbButton(type="button" variant="ghost" @click="resetCheckboxForm") Reset
      
      .component-demo
        h3 Switch
        
        .demo-group
          h4 Switch States
          .switch-row
            .switch-item
              LbSwitch(v-model="switchOff" id="switch-off")
              LbLabel(for="switch-off") Off
            .switch-item
              LbSwitch(v-model="switchOn" id="switch-on")
              LbLabel(for="switch-on") On
            .switch-item
              LbSwitch(v-model="switchDisabled" disabled id="switch-disabled")
              LbLabel(for="switch-disabled") Disabled
            .switch-item
              LbSwitch(v-model="switchDisabledOn" disabled id="switch-disabled-on")
              LbLabel(for="switch-disabled-on") Disabled on
            .switch-item
              LbSwitch(v-model="switchInvalid" invalid id="switch-invalid")
              LbLabel(for="switch-invalid") Invalid state
        
        .demo-group
          h4 With Labels and Descriptions
          .form-field
            .switch-field
              LbSwitch(v-model="darkModeSwitch" id="dark-mode-switch" aria-describedby="dark-mode-hint")
              .switch-label-group
                LbLabel(for="dark-mode-switch") Dark Mode
                LbHintText(id="dark-mode-hint") Enable dark theme for better viewing in low light
          
          .form-field
            .switch-field
              LbSwitch(v-model="notificationsSwitch" id="notifications-switch" aria-describedby="notifications-hint")
              .switch-label-group
                LbLabel(for="notifications-switch") Push Notifications
                LbHintText(id="notifications-hint") Get notified about important updates
          
          .form-field
            .switch-field
              LbSwitch(v-model="autoSaveSwitch" id="auto-save-switch" aria-describedby="auto-save-hint")
              .switch-label-group
                LbLabel(for="auto-save-switch") Auto-save
                LbHintText(id="auto-save-hint") Automatically save your work every 5 minutes
        
        .demo-group
          h4 Settings Form Example
          form.settings-form
            .form-field
              h5 Privacy Settings
              .switch-group
                .switch-field
                  LbSwitch(v-model="privacySettings.profilePublic" id="profile-public")
                  .switch-label-group
                    LbLabel(for="profile-public") Public Profile
                    LbHintText Others can view your profile information
                
                .switch-field
                  LbSwitch(v-model="privacySettings.showActivity" id="show-activity")
                  .switch-label-group
                    LbLabel(for="show-activity") Show Activity Status
                    LbHintText | Let others see when you're online
                
                .switch-field
                  LbSwitch(v-model="privacySettings.allowMessages" id="allow-messages")
                  .switch-label-group
                    LbLabel(for="allow-messages") Allow Direct Messages
                    LbHintText Receive messages from other users
            
            .form-field
              h5 Accessibility
              .switch-group
                .switch-field
                  LbSwitch(v-model="accessibilitySettings.reduceMotion" id="reduce-motion")
                  .switch-label-group
                    LbLabel(for="reduce-motion") Reduce Motion
                    LbHintText Minimize animations and transitions
                
                .switch-field
                  LbSwitch(v-model="accessibilitySettings.highContrast" id="high-contrast")
                  .switch-label-group
                    LbLabel(for="high-contrast") High Contrast Mode
                    LbHintText Increase color contrast for better visibility
            
            .form-actions
              LbButton(type="button" @click="saveSettings") Save Settings
              LbButton(type="button" variant="ghost" @click="resetSettings") Reset
      
      .component-demo
        h3 Dialog
        
        .demo-group
          h4 Basic Dialog
          .button-row
            LbButton(@click="showBasicDialog = true") Open Basic Dialog
            LbButton(@click="showTitleDialog = true" variant="outline") Another Basic Dialog
            LbButton(@click="showFullscreenDialog = true" variant="tonal") Fullscreen with Title
        
        .demo-group
          h4 Dialog Options
          .button-row
            LbButton(@click="showNoBackdropDialog = true" variant="ghost") No Backdrop Close
            LbButton(@click="showNoEscapeDialog = true" variant="ghost") No Escape Close
            LbButton(@click="showNoCloseDialog = true" variant="ghost") No Close Button
        
        .demo-group
          h4 Dialog with Long Content
          .button-row
            LbButton(@click="showScrollDialog = true" color="primary") Open Scrollable Dialog
            LbButton(@click="showFormDialog = true" color="secondary" variant="outline") Form in Dialog
        
        // Basic Dialog
        LbDialog(v-model="showBasicDialog")
          p This is a basic dialog with default settings.
          p Click outside or press Escape to close.
        
        // Dialog with Title (only shows in fullscreen)
        LbDialog(v-model="showTitleDialog")
          p This is a basic dialog. Titles only show in fullscreen dialogs.
          p Close button is absolutely positioned in the top-right corner.
        
        // Fullscreen Dialog
        LbDialog(v-model="showFullscreenDialog" variant="fullscreen" title="Fullscreen Dialog")
          p This is a fullscreen dialog that takes up the entire viewport.
          p | It's particularly useful for mobile devices or when you need maximum space.
          template(#footer)
            LbButton(@click="showFullscreenDialog = false" variant="ghost") Close
            LbButton(@click="showFullscreenDialog = false") Save Changes
        
        // No Backdrop Close Dialog
        LbDialog(v-model="showNoBackdropDialog" :closeOnBackdrop="false")
          p This dialog cannot be closed by clicking the backdrop.
          p You must use the close button or press Escape.
        
        // No Escape Close Dialog
        LbDialog(v-model="showNoEscapeDialog" :closeOnEscape="false")
          p This dialog cannot be closed by pressing the Escape key.
          p You must use the close button or click the backdrop.
        
        // No Close Button Dialog
        LbDialog(v-model="showNoCloseDialog" :showClose="false")
          p This dialog has no close button.
          p You can still close it with Escape or clicking the backdrop.
          template(#footer)
            LbButton(@click="showNoCloseDialog = false" variant="ghost") Cancel
            LbButton(@click="showNoCloseDialog = false") Confirm
        
        // Scrollable Content Dialog
        LbDialog(v-model="showScrollDialog")
          .scroll-content
            h3 Terms of Service
            h4 1. Acceptance of Terms
            p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            
            h4 2. Use of Service
            p Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            
            h4 3. Privacy Policy
            p Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            
            h4 4. User Obligations
            p Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            
            h4 5. Intellectual Property
            p At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
            
            h4 6. Limitation of Liability
            p Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.
            
            h4 7. Modifications
            p Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            
            h4 8. Termination
            p Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            
            h4 9. Governing Law
            p Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            
            h4 10. Contact Information
            p For any questions about these terms, please contact us at legal@example.com.
          template(#footer)
            LbButton(@click="showScrollDialog = false" variant="ghost") Decline
            LbButton(@click="acceptTerms") Accept Terms
        
        // Form Dialog
        LbDialog(v-model="showFormDialog" title="Create New Project")
          form.dialog-form(@submit.prevent="handleCreateProject")
            .form-field
              LbLabel(for="project-name" required) Project Name
              LbInput(
                id="project-name"
                v-model="newProject.name"
                placeholder="My Awesome Project"
                required
              )
            
            .form-field
              LbLabel(for="project-description") Description
              LbTextarea(
                id="project-description"
                v-model="newProject.description"
                placeholder="Brief description of your project..."
                :rows="4"
              )
            
            .form-field
              LbLabel(for="project-visibility") Visibility
              LbSelect(
                id="project-visibility"
                v-model="newProject.visibility"
                :options="visibilityOptions"
              )
            
            .form-field.checkbox-field
              LbCheckbox(
                id="project-initialize"
                v-model="newProject.initializeRepo"
              )
              LbLabel(for="project-initialize") Initialize with README
          template(#footer)
            LbButton(@click="showFormDialog = false" variant="ghost") Cancel
            LbButton(@click="handleCreateProject" :disabled="!newProject.name") Create Project
      
      .component-demo
        h3 Select
        
        .demo-group
          h4 Size Variants
          .input-row
            LbSelect(v-model="selectSizeMedium" :options="colorOptions" placeholder="Medium select (default)" size="medium")
            LbSelect(v-model="selectSizeLarge" :options="colorOptions" placeholder="Large select" size="large")
        
        .demo-group
          h4 Basic Examples
          .input-row
            LbSelect(v-model="selectValue1" :options="countryOptions" placeholder="Select a country")
            LbSelect(v-model="selectValue2" :options="colorOptions" placeholder="Choose a color")
            LbSelect(v-model="selectValue3" :options="priorityOptions" placeholder="Set priority" required)
        
        .demo-group
          h4 Select States
          .input-row
            LbSelect(v-model="selectDisabled" :options="colorOptions" placeholder="Disabled select" :disabled="true")
            LbSelect(v-model="selectInvalid" :options="colorOptions" placeholder="Invalid select" :invalid="true")
            LbSelect(v-model="selectWithValue" :options="colorOptions" placeholder="Select with value")
        
        .demo-group
          h4 With Disabled Options
          .input-row
            LbSelect(v-model="selectWithDisabledOptions" :options="optionsWithDisabled" placeholder="Some options are disabled")
        
        .demo-group
          h4 Searchable Select
          .input-row
            LbSelect(
              v-model="selectSearchable1" 
              :options="countryOptions" 
              placeholder="Search countries..."
              :searchable="true"
              search-placeholder="Type to search..."
            )
            LbSelect(
              v-model="selectSearchable2" 
              :options="colorOptions" 
              placeholder="Search colors..."
              :searchable="true"
            )
        
        .demo-group
          h4 Clearable Select
          .input-row
            LbSelect(
              v-model="selectClearable1" 
              :options="countryOptions" 
              placeholder="Select a country (clearable)"
              :clearable="true"
            )
            LbSelect(
              v-model="selectClearable2" 
              :options="colorOptions" 
              placeholder="Select a color (clearable)"
              :clearable="true"
              :searchable="true"
              search-placeholder="Search and clear..."
            )
        
        .demo-group
          h4 Custom Icon Slot
          .input-row
            LbSelect(v-model="selectCustomIcon" :options="iconOptions" placeholder="Custom dropdown icon")
              template(#icon)
                svg(width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M5 12l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        
        .demo-group
          h4 Form Integration
          .form-field
            LbLabel(for="select-country" required) Country
            LbSelect(
              id="select-country"
              v-model="formData.country"
              :options="countryOptions"
              placeholder="Select your country"
              aria-describedby="country-hint"
            )
            LbHintText(id="country-hint") Choose your country of residence
          
          .form-field
            LbLabel(for="select-timezone") Timezone
              template(#hint) optional
            LbSelect(
              id="select-timezone"
              v-model="formData.timezone"
              :options="timezoneOptions"
              placeholder="Select timezone"
              aria-describedby="timezone-hint"
            )
            LbHintText(id="timezone-hint") Your local timezone for scheduling
          
          .form-field
            LbLabel(for="select-notification" required) Notification Method
            LbSelect(
              id="select-notification"
              v-model="formData.notificationMethod"
              :options="notificationMethodOptions"
              placeholder="How should we contact you?"
              :invalid="!!formErrors.notificationMethod"
              :aria-describedby="formErrors.notificationMethod ? 'notification-error' : 'notification-hint'"
            )
            LbHintText(id="notification-hint" v-if="!formErrors.notificationMethod") Select your preferred contact method
            LbHintText(id="notification-error" error v-if="formErrors.notificationMethod") {{ formErrors.notificationMethod }}
      
      .component-demo
        h3 FormField
        p The FormField component simplifies form creation by combining labels, form controls, and hint/validation messages.
        
        .demo-group
          h4 Basic Usage
          .form-grid
            LbFormField(
              label="Username"
              hint="Choose a unique username"
              required
            )
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbInput(
                  :id="id"
                  v-model="formFieldData.username"
                  placeholder="Enter username"
                  :aria-describedby="ariaDescribedby"
                )
            
            LbFormField(
              label="Email Address"
              hint="We'll never share your email"
            )
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbInput(
                  :id="id"
                  v-model="formFieldData.email"
                  type="email"
                  placeholder="you@example.com"
                  :aria-describedby="ariaDescribedby"
                )
        
        .demo-group
          h4 With Different Form Controls
          .form-grid
            LbFormField(
              label="Password"
              hint="Must be at least 8 characters"
              required
            )
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbInput(
                  :id="id"
                  v-model="formFieldData.password"
                  type="password"
                  placeholder="Enter password"
                  :aria-describedby="ariaDescribedby"
                )
            
            LbFormField(
              label="Bio"
              hint="Tell us about yourself"
            )
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbTextarea(
                  :id="id"
                  v-model="formFieldData.bio"
                  placeholder="Write a short bio..."
                  :rows="4"
                  :aria-describedby="ariaDescribedby"
                )
            
            LbFormField(
              label="Role"
              hint="Select your account type"
              required
            )
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbSelect(
                  :id="id"
                  v-model="formFieldData.role"
                  :options="roleOptions"
                  placeholder="Choose a role"
                  :aria-describedby="ariaDescribedby"
                )
        
        .demo-group
          h4 Validation States
          .form-grid
            LbFormField(
              label="Website URL"
              error="Please enter a valid URL starting with https://"
            )
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbInput(
                  :id="id"
                  v-model="formFieldData.website"
                  type="url"
                  placeholder="https://example.com"
                  :aria-describedby="ariaDescribedby"
                  invalid
                )
            
            LbFormField(
              label="Notifications"
              warning="Changing this will affect all devices"
            )
              template(#default="{ id }")
                LbSwitch(
                  :id="id"
                  v-model="formFieldData.notifications"
                )
            
            LbFormField(
              label="Verification Code"
              success="Code verified successfully!"
            )
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbInput(
                  :id="id"
                  value="ABC123"
                  placeholder="Enter code"
                  :aria-describedby="ariaDescribedby"
                  readonly
                )
        
        .demo-group
          h4 Custom IDs and Label Icons
          .form-grid
            LbFormField(
              id="custom-field-id"
              label="Security Key"
              hint="Enter your 2FA key"
              required
            )
              template(#label-icon)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM8 9a6 6 0 00-5.784 7.5.75.75 0 001.495-.154A4.5 4.5 0 018 12.5a4.5 4.5 0 014.289 3.846.75.75 0 101.495.154A6 6 0 008 9z" fill="currentColor")
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbInput(
                  :id="id"
                  value=""
                  type="password"
                  placeholder="Enter security key"
                  :aria-describedby="ariaDescribedby"
                )
            
            LbFormField(
              label="Priority Email"
              hint="For urgent notifications only"
            )
              template(#label-icon)
                svg(width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg")
                  path(d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 4.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4.5zm0 7a.75.75 0 100-1.5.75.75 0 000 1.5z" fill="currentColor")
              template(#default="{ id, 'aria-describedby': ariaDescribedby }")
                LbInput(
                  :id="id"
                  value=""
                  type="email"
                  placeholder="priority@example.com"
                  :aria-describedby="ariaDescribedby"
                )
      
      .component-demo
        h3 Badge
        p Notification indicators for numbers and status
        
        .demo-group
          h4 Navigation Style (Like Screenshot)
          .navigation-badge-demo
            .nav-item
              svg(viewBox="0 0 24 24" fill="currentColor" width="24" height="24")
                path(d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v14h16V5H4zm2 2h2v2H6V7zm4 0h8v2h-8V7zm0 4h8v2h-8v-2zm0 4h5v2h-5v-2zm-4-4h2v2H6v-2zm0 4h2v2H6v-2z")
              span Mail
              LbBadge(variant="error" position="top-right" size="small") 999+
            .nav-item
              svg(viewBox="0 0 24 24" fill="currentColor" width="24" height="24")
                path(d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z")
              span Chat
              LbBadge(variant="error" position="top-right" size="small") 10
            .nav-item
              svg(viewBox="0 0 24 24" fill="currentColor" width="24" height="24")
                path(d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z")
              span Rooms
              LbBadge(variant="default" position="top-right" size="small" dot)
            .nav-item
              svg(viewBox="0 0 24 24" fill="currentColor" width="24" height="24")
                path(d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z")
              span Meet
              LbBadge(variant="error" position="top-right") 3
        
        .demo-group
          h4 Badge with Avatars
          .button-row
            .avatar-badge-item
              LbAvatar(name="John Doe" size="md" status="online")
              LbBadge(variant="error" position="top-right" size="small" dot)
            .avatar-badge-item
              LbAvatar(src="https://picsum.photos/seed/badge1/100/100" alt="User" size="lg" status="away")
              LbBadge(variant="error" position="top-right") 5
            .avatar-badge-item
              LbAvatar(name="Jane Smith" size="xl" status="busy")
              LbBadge(variant="primary" position="top-right") 12
        
        .demo-group
          h4 Inline Badges
          .button-row
            LbBadge(size="small") SM
            LbBadge(size="medium") MD
            LbBadge(size="large") LG
          .button-row
            LbBadge(variant="default") Default
            LbBadge(variant="primary") Primary
            LbBadge(variant="secondary") Secondary
            LbBadge(variant="neutral") Neutral
            LbBadge(variant="success") Success
            LbBadge(variant="warning") Warning
            LbBadge(variant="error") Error
            LbBadge(variant="info") Info
        
        .demo-group
          h4 With Icons/Buttons
          .button-row
            LbButton(variant="outline")
              | Inbox
              LbBadge(variant="error" size="small" style="margin-left: 8px") 3
            LbButton(variant="ghost" icon-only)
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9")
              .badge-wrapper
                LbBadge(variant="error" size="small" dot style="position: absolute; top: -4px; right: -4px")
      
      .component-demo
        h3 Avatar
        p Circular profile images with initials fallback and status indicators
        
        .demo-group
          h4 Size Variants
          .button-row
            LbAvatar(src="https://i.pravatar.cc/150?img=1" alt="Jane Doe" size="xs")
            LbAvatar(src="https://i.pravatar.cc/150?img=2" alt="John Smith" size="sm")
            LbAvatar(src="https://i.pravatar.cc/150?img=3" alt="Alice Johnson" size="md")
            LbAvatar(src="https://i.pravatar.cc/150?img=4" alt="Bob Wilson" size="lg")
            LbAvatar(src="https://i.pravatar.cc/150?img=5" alt="Carol White" size="xl")
        
        .demo-group
          h4 Initials Fallback
          .button-row
            LbAvatar(name="John Doe" size="md")
            LbAvatar(name="Jane Smith" size="md" variant="secondary")
            LbAvatar(name="Alice" size="md" variant="success")
            LbAvatar(name="Bob Wilson" size="md" variant="warning")
            LbAvatar(name="Carol" size="md" variant="error")
            LbAvatar(name="David Lee" size="md" variant="info")
        
        .demo-group
          h4 Status Indicators
          .button-row
            LbAvatar(name="Online User" status="online" size="md")
            LbAvatar(name="Offline User" status="offline" size="md")
            LbAvatar(name="Away User" status="away" size="md")
            LbAvatar(name="Busy User" status="busy" size="md")
        
        .demo-group
          h4 Image with Status
          .button-row
            LbAvatar(src="https://i.pravatar.cc/150?img=10" alt="Online" status="online" size="lg")
            LbAvatar(src="https://i.pravatar.cc/150?img=11" alt="Away" status="away" size="lg")
            LbAvatar(src="https://i.pravatar.cc/150?img=12" alt="Busy" status="busy" size="lg")
            LbAvatar(src="https://i.pravatar.cc/150?img=13" alt="Offline" status="offline" size="lg")
        
        .demo-group
          h4 Fallback Behavior
          .button-row
            LbAvatar(size="md")
            LbAvatar(src="https://invalid-url.com/image.jpg" alt="Failed to load" size="md")
            LbAvatar(src="https://invalid-url.com/image.jpg" alt="With Name" name="Error User" size="md" variant="error")
      
      .component-demo
        h3 Chip
        p Material Design 3 style chips for filtering and selection
        
        .demo-group
          h4 Chip Variants
          .button-row
            LbChip(variant="assist" @click="handleChipClick")
              template(#leadingIcon)
                svg(viewBox="0 0 24 24" fill="currentColor" width="18" height="18")
                  path(d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm.624-8.719a.75.75 0 00-.124-.418l-.625-1a.75.75 0 00-.635-.363h-3.19a.75.75 0 00-.447.146l-.688.52a.75.75 0 01-.447.145H11a.75.75 0 100 1.5h2.968c.288 0 .571-.079.82-.229l.688-.52a.75.75 0 01.447-.145h2.786l.331.53a.75.75 0 11-1.267.79l-.281-.45v5.191a.75.75 0 101.5 0v-6a.747.747 0 00.002-.062z")
              | Assist
            
            LbChip(
              variant="filter" 
              v-model:selected="filterChipSelected"
            ) Filter
            
            LbChip(variant="input" deletable @delete="handleChipDelete") Input
            
            LbChip(variant="suggestion" @click="handleChipClick") Suggestion
        
        .demo-group
          h4 Chip Colors
          .button-row
            LbChip(variant="filter" color="primary") Primary
            LbChip(variant="filter" color="secondary") Secondary
            LbChip(variant="filter" color="neutral") Neutral
            LbChip(variant="filter" color="success") Success
            LbChip(variant="filter" color="warning") Warning
            LbChip(variant="filter" color="error") Error
            LbChip(variant="filter" color="info") Info
        
        .demo-group
          h4 With Leading Avatar
          .button-row
            LbChip(variant="input" deletable @delete="handleChipDelete")
              template(#leadingAvatar)
                LbAvatar(src="https://picsum.photos/seed/chip1/100/100" alt="User" size="xs")
              | John Doe
            
            LbChip(variant="input" deletable @delete="handleChipDelete")
              template(#leadingAvatar)
                LbAvatar(name="Jane Smith" size="xs")
              | Jane Smith
        
        .demo-group
          h4 With Dropdown (Visual Only)
          .button-row
            LbChip(variant="filter" :has-dropdown="true" @click="handleChipClick") 
              template(#leadingIcon)
                svg(viewBox="0 0 24 24" fill="currentColor" width="18" height="18")
                  path(d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z")
                  path(d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z")
              | Edit filters
            
            LbChip(variant="assist" :has-dropdown="true" @click="handleChipClick") View options
            
            LbChip(variant="suggestion" :has-dropdown="true" @click="handleChipClick") Pick date
        
        .demo-group
          h4 Filter Chips Example
          .button-row
            LbChip(
              v-for="filter in filterOptions"
              :key="filter.value"
              variant="filter"
              v-model:selected="filter.selected"
            ) {{ filter.label }}
        
        .demo-group
          h4 Chips with Functional Dropdown
          .button-row
            //- Filter chip with dropdown menu
            LbDropdown
              template(#trigger)
                LbChip(variant="filter" :has-dropdown="true") 
                  | Sort: {{ selectedSort || 'Default' }}
              
              template(#content)
                .dropdown-menu-content
                  .menu-item(
                    v-for="option in ['Default', 'Name', 'Date', 'Size']"
                    :key="option"
                    @click="selectedSort = option"
                    :class="{ 'menu-item-selected': selectedSort === option }"
                  ) {{ option }}
            
            //- Assist chip with dropdown for more actions
            LbDropdown
              template(#trigger)
                LbChip(variant="assist" :has-dropdown="true")
                  template(#leadingIcon)
                    svg(viewBox="0 0 24 24" fill="currentColor" width="18" height="18")
                      path(d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z")
                  | More actions
              
              template(#content)
                .dropdown-menu-content
                  .menu-item(@click="handleChipAction('edit')")
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 8px")
                      path(d="M11.013 2.513a1.75 1.75 0 012.475 2.474L6.226 12.25a2.751 2.751 0 01-.892.596l-2.047.848a.75.75 0 01-.98-.98l.848-2.047a2.751 2.751 0 01.596-.892l7.262-7.262z")
                    | Edit
                  .menu-item(@click="handleChipAction('duplicate')")
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 8px")
                      path(d="M10.5 3A1.5 1.5 0 0112 4.5v7a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 014 11.5v-7A1.5 1.5 0 015.5 3h5zm1.5 8.5v-7a3 3 0 00-3-3h-5a3 3 0 00-3 3v7a3 3 0 003 3h5a3 3 0 003-3z")
                    | Duplicate
                  .menu-item(@click="handleChipAction('share')")
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 8px")
                      path(d="M5.75 7.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm2.5 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm3.25.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z")
                    | Share
                  .menu-divider
                  .menu-item.menu-item-danger(@click="handleChipAction('delete')")
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 8px")
                      path(d="M5 5.5A.5.5 0 015.5 5h5a.5.5 0 01.5.5V6h-6v-.5zM4.5 7.5a.5.5 0 00-.5.5v5a2 2 0 002 2h4a2 2 0 002-2V8a.5.5 0 00-.5-.5h-7z")
                    | Delete
            
            //- Date picker chip with dropdown
            LbDropdown
              template(#trigger)
                LbChip(variant="suggestion" :has-dropdown="true")
                  template(#leadingIcon)
                    svg(viewBox="0 0 24 24" fill="currentColor" width="18" height="18")
                      path(d="M17 3h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h4V1h2v2h6V1h2v2zm3 8H4v8h16v-8zm-5-6h-2v1h-2V5H9v1H7V5H4v4h16V5h-3v1h-2V5z")
                  | {{ selectedChipDate || 'Pick date' }}
              
              template(#content)
                .dropdown-menu-content
                  .menu-item(@click="selectedChipDate = 'Today'") Today
                  .menu-item(@click="selectedChipDate = 'Tomorrow'") Tomorrow
                  .menu-item(@click="selectedChipDate = 'This week'") This week
                  .menu-item(@click="selectedChipDate = 'This month'") This month
                  .menu-divider
                  .menu-item(@click="selectedChipDate = 'Custom range'") Custom range...
          .demo-note Active filters: {{ activeFilters }}
        
        .demo-group
          h4 Input Chips (Tags)
          .button-row
            LbChip(
              v-for="(tag, index) in tags"
              :key="tag"
              variant="input"
              deletable
              @delete="removeTag(index)"
            ) {{ tag }}
            LbButton(variant="ghost" size="medium" @click="addTag")
              template(#icon-leading)
                svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                  path(d="M12 4v16m8-8H4")
              | Add Tag
        
        .demo-group
          h4 States
          .button-row
            LbChip Enabled
            LbChip(disabled) Disabled
            LbChip(:clickable="false") Non-clickable
      
      .component-demo
        h3 Bottom Sheet
        p Swipeable sheets that expand from the bottom
        
        .demo-group
          h4 Sheet Examples
          .button-row
            LbButton(@click="showBasicSheet = true") Basic Sheet
            LbButton(@click="showExpandableSheet = true" variant="outline") Expandable Sheet
            LbButton(@click="showPersistentSheet = true" variant="tonal") Persistent Sheet
        
        // Basic Bottom Sheet
        LbBottomSheet(v-model="showBasicSheet")
          template(#header)
            h5 Basic Bottom Sheet
          p This is a simple bottom sheet. You can swipe down to dismiss it.
          p Try dragging the handle at the top!
          
        // Expandable Bottom Sheet
        LbBottomSheet(
          v-model="showExpandableSheet"
          :expandable="true"
          max-height="60vh"
        )
          template(#header)
            h5 Expandable Sheet
          .sheet-content
            p This sheet can be expanded to full screen by dragging up.
            p It starts at 60% viewport height but can expand to 100%.
            div(v-for="i in 20" :key="i")
              p Lorem ipsum dolor sit amet, consectetur adipiscing elit. {{ i }}
          template(#footer)
            LbButton(@click="showExpandableSheet = false" full-width) Close Sheet
        
        // Persistent Bottom Sheet
        LbBottomSheet(
          v-model="showPersistentSheet"
          :persistent="true"
          :show-handle="false"
        )
          template(#header)
            h5 Confirm Action
          p This sheet cannot be dismissed by clicking the backdrop.
          p You must use one of the action buttons below.
          template(#footer)
            .button-row(style="width: 100%; justify-content: flex-end")
              LbButton(@click="showPersistentSheet = false" variant="ghost") Cancel
              LbButton(@click="confirmSheetAction" variant="filled" color="error") Delete
      
      .component-demo
        h3 Navigation Bar
        p Bottom navigation for mobile interfaces
        
        .demo-group
          h4 Navigation Bar Demo
          .input-row
            LbSelect(
              v-model="navActiveColor"
              :options="navColorOptions"
              placeholder="Active Color"
            )
            .switch-field
              LbSwitch(v-model="navShowLabels" id="nav-labels")
              LbLabel(for="nav-labels") Show Labels
          .navigation-demo
            LbNavigationBar(
              v-model="activeNavItem"
              :fixed="false"
              :active-color="navActiveColor"
              :show-labels="navShowLabels"
            )
              LbNavigationBarItem(value="home" label="Home")
                template(#icon)
                  svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                    path(d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6")
              
              LbNavigationBarItem(value="explore" label="Explore")
                template(#icon)
                  svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                    path(d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7")
              
              LbNavigationBarItem(value="add" label="Create" disabled)
                template(#icon)
                  svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                    path(d="M12 4v16m8-8H4")
              
              LbNavigationBarItem(value="activity" label="Activity")
                template(#icon)
                  svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                    path(d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z")
              
              LbNavigationBarItem(value="profile" label="Profile")
                template(#icon)
                  svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2")
                    path(d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")
          .demo-note Active: {{ activeNavItem }}
      
      .component-demo
        h3 Snackbar
        p Temporary notifications with actions
        
        .demo-group
          h4 Basic Snackbars
          .button-row
            LbButton(@click="showDefaultSnackbar") Default
            LbButton(@click="showSuccessSnackbar" color="success") Success
            LbButton(@click="showErrorSnackbar" color="error") Error
            LbButton(@click="showWarningSnackbar" color="warning") Warning
            LbButton(@click="showInfoSnackbar" color="info") Info
        
        .demo-group
          h4 With Actions
          .button-row
            LbButton(@click="showActionSnackbar" variant="outline") With Action
            LbButton(@click="showPersistentSnackbar" variant="outline") Persistent
            LbButton(@click="showLongActionSnackbar" variant="outline") Long Action
            LbButton(@click="showMultipleSnackbars" variant="outline") Multiple
        
        .demo-group
          h4 Snackbar Management
          .button-row
            LbButton(@click="clearAllSnackbars" variant="ghost" color="error") Clear All
      
      .component-demo
        h3 Progress
        p Linear and circular progress indicators with customizable sizes and states
        
        .demo-group
          h4 Linear Progress - All Sizes
          p Demonstrates all three thickness options: thin (2px), normal (4px), and thick (8px)
          .progress-demo-grid
            .progress-item
              .progress-label Thin (2px) - {{ linearProgress1 }}%
              LbProgress(:value="linearProgress1" type="linear" size="thin")
            .progress-item
              .progress-label Normal (4px) - {{ linearProgress2 }}%
              LbProgress(:value="linearProgress2" type="linear" size="normal")
            .progress-item
              .progress-label Thick (8px) - {{ linearProgress3 }}%
              LbProgress(:value="linearProgress3" type="linear" size="thick")
        
        .demo-group
          h4 Linear Progress - Indeterminate
          p All sizes in indeterminate (loading) state
          .progress-demo-grid
            .progress-item
              .progress-label Indeterminate Thin
              LbProgress(type="linear" size="thin" :indeterminate="true")
            .progress-item
              .progress-label Indeterminate Normal
              LbProgress(type="linear" size="normal" :indeterminate="true")
            .progress-item
              .progress-label Indeterminate Thick
              LbProgress(type="linear" size="thick" :indeterminate="true")
        
        .demo-group
          h4 Circular Progress - All Sizes
          p Demonstrates all four circular sizes: xs (24px), sm (32px), md (40px), lg (48px)
          .progress-demo-grid
            .progress-item
              .progress-label Extra Small (xs) - {{ circularProgress1 }}%
              LbProgress(:value="circularProgress1" type="circular" size="normal" circular-size="xs")
            .progress-item
              .progress-label Small (sm) - {{ circularProgress2 }}%
              LbProgress(:value="circularProgress2" type="circular" size="normal" circular-size="sm")
            .progress-item
              .progress-label Medium (md) - {{ circularProgress3 }}%
              LbProgress(:value="circularProgress3" type="circular" size="normal" circular-size="md")
            .progress-item
              .progress-label Large (lg) - {{ circularProgress4 }}%
              LbProgress(:value="circularProgress4" type="circular" size="normal" circular-size="lg")
        
        .demo-group
          h4 Circular Progress - Size vs Thickness Combinations
          p Shows how circular size and stroke thickness work independently
          .progress-demo-grid
            .progress-item
              .progress-label XS + Thin stroke - {{ circularProgress1 }}%
              LbProgress(:value="circularProgress1" type="circular" size="thin" circular-size="xs")
            .progress-item
              .progress-label XS + Thick stroke - {{ circularProgress2 }}%
              LbProgress(:value="circularProgress2" type="circular" size="thick" circular-size="xs")
            .progress-item
              .progress-label LG + Thin stroke - {{ circularProgress3 }}%
              LbProgress(:value="circularProgress3" type="circular" size="thin" circular-size="lg")
            .progress-item
              .progress-label LG + Thick stroke - {{ circularProgress4 }}%
              LbProgress(:value="circularProgress4" type="circular" size="thick" circular-size="lg")
        
        .demo-group
          h4 Circular Progress - With Value Display
          p All sizes showing percentage values
          .progress-demo-grid
            .progress-item
              .progress-label XS with value - {{ circularProgress1 }}%
              LbProgress(:value="circularProgress1" type="circular" size="normal" circular-size="xs" :show-value="true")
            .progress-item
              .progress-label SM with value - {{ circularProgress2 }}%
              LbProgress(:value="circularProgress2" type="circular" size="normal" circular-size="sm" :show-value="true")
            .progress-item
              .progress-label MD with value - {{ circularProgress3 }}%
              LbProgress(:value="circularProgress3" type="circular" size="normal" circular-size="md" :show-value="true")
            .progress-item
              .progress-label LG with value - {{ circularProgress4 }}%
              LbProgress(:value="circularProgress4" type="circular" size="normal" circular-size="lg" :show-value="true")
        
        .demo-group
          h4 Circular Progress - Indeterminate
          p All sizes in indeterminate (loading) state
          .progress-demo-grid
            .progress-item
              .progress-label Indeterminate XS
              LbProgress(type="circular" size="normal" circular-size="xs" :indeterminate="true")
            .progress-item
              .progress-label Indeterminate SM
              LbProgress(type="circular" size="normal" circular-size="sm" :indeterminate="true")
            .progress-item
              .progress-label Indeterminate MD
              LbProgress(type="circular" size="normal" circular-size="md" :indeterminate="true")
            .progress-item
              .progress-label Indeterminate LG
              LbProgress(type="circular" size="normal" circular-size="lg" :indeterminate="true")
        
        .demo-group
          h4 Different Progress Values
          .progress-demo-grid
            .progress-item
              .progress-label 0% Complete
              LbProgress(:value="0" type="linear" size="normal")
            .progress-item
              .progress-label 25% Complete
              LbProgress(:value="25" type="linear" size="normal")
            .progress-item
              .progress-label 50% Complete
              LbProgress(:value="50" type="linear" size="normal")
            .progress-item
              .progress-label 75% Complete
              LbProgress(:value="75" type="linear" size="normal")
            .progress-item
              .progress-label 100% Complete
              LbProgress(:value="100" type="linear" size="normal")
        
        .demo-group
          h4 Interactive Progress
          .progress-controls
            .control-group
              LbLabel Demo Linear Progress ({{ interactiveProgress }}%)
              LbInput(
                v-model="interactiveProgress"
                type="range"
                min="0"
                max="100"
                step="1"
              )
              LbProgress(:value="interactiveProgress" type="linear" size="thick")
            .control-group
              LbLabel Demo Circular Progress ({{ interactiveProgress }}%)
              LbProgress(:value="interactiveProgress" type="circular" size="normal" circular-size="lg" :show-value="true")
      
      .component-demo
        h3 Divider
        p Visual separators for organizing content sections
        
        .demo-group
          h4 Horizontal Dividers - Sizes
          .divider-demo-vertical
            .divider-item
              p Content above thin divider (1px)
              LbDivider(orientation="horizontal" size="thin")
              p Content below thin divider (1px)
            .divider-item
              p Content above medium divider (2px)
              LbDivider(orientation="horizontal" size="medium")
              p Content below medium divider (2px)
            .divider-item
              p Content above thick divider (4px)
              LbDivider(orientation="horizontal" size="thick")
              p Content below thick divider (4px)
        
        .demo-group
          h4 Inset Dividers
          .divider-demo-vertical
            .divider-item
              p Full width divider (default)
              LbDivider
              p Inset divider with spacing
              LbDivider(inset)
              p End of section
        
        .demo-group
          h4 Vertical Dividers
          .divider-demo-horizontal
            .divider-item-horizontal
              span Item 1
              LbDivider(orientation="vertical" size="thin")
              span Item 2
              LbDivider(orientation="vertical" size="medium")
              span Item 3
              LbDivider(orientation="vertical" size="thick")
              span Item 4
        
        .demo-group
          h4 Vertical Dividers with Inset
          .divider-demo-horizontal(style="height: 60px")
            .divider-item-horizontal
              span Full height
              LbDivider(orientation="vertical")
              span Inset vertical
              LbDivider(orientation="vertical" inset)
              span End
        
        .demo-group
          h4 Real-world Examples
          .card-example
            h5 User Profile
            p John Doe - Software Engineer
            LbDivider(size="thin")
            .info-row
              span Email: john.doe@example.com
            .info-row
              span Location: San Francisco, CA
            LbDivider(size="thin")
            .action-row
              LbButton(variant="ghost" size="medium") Message
              LbDivider(orientation="vertical" size="thin")
              LbButton(variant="ghost" size="medium") Follow
              LbDivider(orientation="vertical" size="thin")
              LbButton(variant="ghost" size="medium") More
          
          .list-example.surface-subtle
            .list-item
              h5 Settings
              p Manage your account preferences
            LbDivider(inset)
            .list-item
              h5 Privacy
              p Control your data and visibility
            LbDivider(inset)
            .list-item
              h5 Notifications
              p Choose what updates you receive
      
      .component-demo
        h3 Segment Button
        p Single-select buttons for filtering and content switching
        
        .demo-group
          h4 Basic Segment Buttons
          .segment-demo
            LbSegmentButton(v-model="selectedSegment1")
              LbSegmentButtonItem(value="all") All
              LbSegmentButtonItem(value="active") Active
              LbSegmentButtonItem(value="completed") Completed
            p.demo-note Selected: {{ selectedSegment1 }}
        
        .demo-group
          h4 Size Variant
          .segment-demo
            .segment-row
              h5 Medium (Default)
              LbSegmentButton(v-model="selectedSize")
                LbSegmentButtonItem(value="small") Small
                LbSegmentButtonItem(value="medium") Medium
                LbSegmentButtonItem(value="large") Large
            
        
        .demo-group
          h4 Multi-Select Mode
          .segment-demo
            .segment-row
              h5 Filter by Tags (Multi-select)
              LbSegmentButton(v-model="selectedTags" :multiSelect="true")
                LbSegmentButtonItem(value="vue") Vue.js
                LbSegmentButtonItem(value="react") React
                LbSegmentButtonItem(value="angular") Angular
                LbSegmentButtonItem(value="svelte") Svelte
              p.demo-note Selected: {{ selectedTags?.length ? selectedTags.join(', ') : 'None' }}
            
            .segment-row
              h5 Toggle Mode (Single-select with deselect)
              LbSegmentButton(v-model="toggleValue" :allowEmpty="true")
                LbSegmentButtonItem(value="bold") Bold
                LbSegmentButtonItem(value="italic") Italic
                LbSegmentButtonItem(value="underline") Underline
              p.demo-note Active: {{ toggleValue || 'None' }}
        
        .demo-group
          h4 Width Variants
          .segment-demo
            .segment-row
              h5 Full Width (Default - stretches to fill container)
              LbSegmentButton(v-model="widthExample" width="full")
                LbSegmentButtonItem(value="short") Short
                LbSegmentButtonItem(value="medium-length") Medium Length
                LbSegmentButtonItem(value="very-long-label") Very Long Label
            
            .segment-row
              h5 Auto Width (Fits content)
              LbSegmentButton(v-model="widthExample" width="auto")
                LbSegmentButtonItem(value="short") Short
                LbSegmentButtonItem(value="medium-length") Medium Length
                LbSegmentButtonItem(value="very-long-label") Very Long Label
            p.demo-note Auto width makes segments fit their content naturally
        
        .demo-group
          h4 Color Variants
          .segment-demo
            .segment-row
              h5 Primary (Default)
              LbSegmentButton(v-model="colorExample" color="primary")
                LbSegmentButtonItem(value="option1") Option 1
                LbSegmentButtonItem(value="option2") Option 2
                LbSegmentButtonItem(value="option3") Option 3
            
            .segment-row
              h5 Secondary
              LbSegmentButton(v-model="colorExample" color="secondary")
                LbSegmentButtonItem(value="option1") Option 1
                LbSegmentButtonItem(value="option2") Option 2
                LbSegmentButtonItem(value="option3") Option 3
                
            .segment-row
              h5 Neutral
              LbSegmentButton(v-model="colorExample" color="neutral")
                LbSegmentButtonItem(value="option1") Option 1
                LbSegmentButtonItem(value="option2") Option 2
                LbSegmentButtonItem(value="option3") Option 3
            p.demo-note Colors provide subtle tonal variations for different contexts
        
        .demo-group
          h4 With Icons (Full Width)
          .segment-demo
            LbSegmentButton(v-model="selectedView")
              LbSegmentButtonItem(value="grid")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 2h6v6H2zm0 8h6v6H2zm8-8h6v6h-6zm0 8h6v6h-6z")
                Grid
              LbSegmentButtonItem(value="list")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 10h2v-2H2v2zm0 3h2v-2H2v2zm0-6h2V5H2v2zm4 3h10v-2H6v2zm0 3h10v-2H6v2zM6 5v2h10V5H6z")
                List
              LbSegmentButtonItem(value="calendar")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M14 2h-1V1h-1v1H6V1H5v1H4c-.83 0-1.5.67-1.5 1.5v11c0 .83.67 1.5 1.5 1.5h10c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5zm0 12H4V6h10v8zM5 8h4v4H5z")
                Calendar
        
        .demo-group
          h4 With Icons (Auto Width - Fits Content)
          .segment-demo
            LbSegmentButton(v-model="selectedViewAuto" width="auto")
              LbSegmentButtonItem(value="grid")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 2h6v6H2zm0 8h6v6H2zm8-8h6v6h-6zm0 8h6v6h-6z")
                Grid
              LbSegmentButtonItem(value="list")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 10h2v-2H2v2zm0 3h2v-2H2v2zm0-6h2V5H2v2zm4 3h10v-2H6v2zm0 3h10v-2H6v2zM6 5v2h10V5H6z")
                List
              LbSegmentButtonItem(value="calendar")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M14 2h-1V1h-1v1H6V1H5v1H4c-.83 0-1.5.67-1.5 1.5v11c0 .83.67 1.5 1.5 1.5h10c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5zm0 12H4V6h10v8zM5 8h4v4H5z")
                Calendar
            p.demo-note Auto width segments only take up the space they need
        
        .demo-group
          h4 Icons with Labels (Auto Width)
          .segment-demo
            LbSegmentButton(v-model="selectedViewWithLabels" width="auto")
              LbSegmentButtonItem(value="grid")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 2h6v6H2zm0 8h6v6H2zm8-8h6v6h-6zm0 8h6v6h-6z")
                | Grid
              LbSegmentButtonItem(value="list")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 10h2v-2H2v2zm0 3h2v-2H2v2zm0-6h2V5H2v2zm4 3h10v-2H6v2zm0 3h10v-2H6v2zM6 5v2h10V5H6z")
                | List
              LbSegmentButtonItem(value="calendar")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M14 2h-1V1h-1v1H6V1H5v1H4c-.83 0-1.5.67-1.5 1.5v11c0 .83.67 1.5 1.5 1.5h10c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5zm0 12H4V6h10v8zM5 8h4v4H5z")
                | Calendar
            p.demo-note Auto width with icons and labels fits content naturally
        
        .demo-group
          h4 Icon-Only Buttons
          .segment-demo
            LbSegmentButton(v-model="selectedIconOnly" width="auto")
              LbSegmentButtonItem(value="grid" aria-label="Grid view")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 2h6v6H2zm0 8h6v6H2zm8-8h6v6h-6zm0 8h6v6h-6z")
              LbSegmentButtonItem(value="list" aria-label="List view")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M2 10h2v-2H2v2zm0 3h2v-2H2v2zm0-6h2V5H2v2zm4 3h10v-2H6v2zm0 3h10v-2H6v2zM6 5v2h10V5H6z")
              LbSegmentButtonItem(value="calendar" aria-label="Calendar view")
                template(#icon)
                  svg(width="18" height="18" viewBox="0 0 18 18" fill="currentColor")
                    path(d="M14 2h-1V1h-1v1H6V1H5v1H4c-.83 0-1.5.67-1.5 1.5v11c0 .83.67 1.5 1.5 1.5h10c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5zm0 12H4V6h10v8zM5 8h4v4H5z")
            p.demo-note Icon-only buttons for compact view switchers
        
        .demo-group
          h4 Disabled States
          .segment-demo
            .segment-row
              p Individual items disabled
              LbSegmentButton(v-model="selectedDisabled")
                LbSegmentButtonItem(value="option1") Option 1
                LbSegmentButtonItem(value="option2" :disabled="true") Option 2
                LbSegmentButtonItem(value="option3") Option 3
                LbSegmentButtonItem(value="option4" :disabled="true") Option 4
        
        .demo-group
          h4 Real-world Examples
          .segment-demo
            .example-card
              h5 Content Filter
              LbSegmentButton(v-model="contentFilter")
                LbSegmentButtonItem(value="all") All
                LbSegmentButtonItem(value="photos") Photos
                LbSegmentButtonItem(value="videos") Videos
                LbSegmentButtonItem(value="docs") Docs
              
              .content-preview
                p(v-if="contentFilter === 'all'") Showing all 245 items
                p(v-else-if="contentFilter === 'photos'") Showing 142 photos
                p(v-else-if="contentFilter === 'videos'") Showing 67 videos
                p(v-else-if="contentFilter === 'docs'") Showing 36 documents
            
            .example-card
              h5 Date Range Selector
              LbSegmentButton(v-model="dateRange")
                LbSegmentButtonItem(value="today") Today
                LbSegmentButtonItem(value="week") Week
                LbSegmentButtonItem(value="month") Month
                LbSegmentButtonItem(value="year") Year
              
              .date-info
                p(v-if="dateRange === 'today'") {{ new Date().toLocaleDateString() }}
                p(v-else-if="dateRange === 'week'") Last 7 days
                p(v-else-if="dateRange === 'month'") {{ new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) }}
                p(v-else-if="dateRange === 'year'") {{ new Date().getFullYear() }}
                
            .example-card
              h5 Filter Options (Multi-select)
              LbSegmentButton(v-model="statusFilters" :multiSelect="true" color="neutral")
                LbSegmentButtonItem(value="active") Active
                LbSegmentButtonItem(value="archived") Archived
                LbSegmentButtonItem(value="starred") Starred
              
              .filter-info
                p(v-if="!statusFilters || statusFilters.length === 0") Showing all items
                p(v-else) | Filters: {{ statusFilters.join(' + ') }}
      
      .component-demo
        h3 Popover
        p Floating content container that can hold any Vue component with proper positioning and portal rendering.
        
        .demo-group
          h4 Basic Usage
          .popover-demo
            LbPopover(v-model:open="basicPopoverOpen" placement="bottom-start")
              LbPopoverTrigger
                LbButton Basic Popover
              LbPopoverContent
                .popover-content-demo
                  h4 Popover Title
                  p This is a basic popover with some content.
                  LbButton(@click="basicPopoverOpen = false" size="small" variant="outline") Close
        
        .demo-group
          h4 Placement Options
          .popover-demo
            .popover-grid
              template(v-for="placement in popoverPlacements" :key="placement")
                LbPopover(v-model:open="popoverStates[placement]" :placement="placement")
                  LbPopoverTrigger
                    LbButton(size="small" variant="outline") {{ placement }}
                  LbPopoverContent
                    .popover-content-demo
                      p Content positioned {{ placement }}
        
        .demo-group
          h4 With Arrow
          .popover-demo
            LbPopover(v-model:open="arrowPopoverOpen" :show-arrow="true")
              LbPopoverTrigger
                LbButton(variant="filled" color="primary") Popover with Arrow
              LbPopoverContent
                LbPopoverArrow
                .popover-content-demo
                  h4 With Arrow
                  p This popover includes an arrow pointing to the trigger.
                  p The arrow automatically positions itself based on the popover placement.
        
        .demo-group
          h4 Rich Content
          .popover-demo
            LbPopover(v-model:open="richPopoverOpen" placement="bottom-start")
              LbPopoverTrigger
                LbButton(variant="tonal" color="secondary") User Menu
                  template(#icon-trailing)
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                      path(d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z")
              LbPopoverContent
                .user-menu-demo
                  header.user-header
                    .user-avatar
                      LbAvatar(name="John Doe")
                    .user-info
                      h4.user-name John Doe
                      p.user-email john.doe@example.com
                  
                  LbDivider
                  
                  nav.user-menu
                    .menu-item
                      svg.menu-icon(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                        path(d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.47z")
                      | Profile
                    .menu-item
                      svg.menu-icon(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                        path(d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z")
                      | Settings
                    .menu-item
                      svg.menu-icon(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                        path(d="M6 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z")
                      | Help & Support
                  
                  LbDivider
                  
                  .menu-item(@click="richPopoverOpen = false")
                    svg.menu-icon(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                      path(d="M6 14a.5.5 0 01-.5-.5v-9a.5.5 0 01.146-.354L10.146 1.146A.5.5 0 0110.5 1a.5.5 0 01.5.5v9a.5.5 0 01-.146.354L6.354 14.854A.5.5 0 016 14z")
                    | Sign Out
        
        .demo-group
          h4 Form Content
          .popover-demo
            LbPopover(v-model:open="formPopoverOpen" placement="bottom-end")
              LbPopoverTrigger
                LbButton(variant="ghost" color="neutral")
                  template(#icon-leading)
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                      path(d="M11.5 2a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 12.5v-9A1.5 1.5 0 014.5 2h7zm-4 1.5v1a.5.5 0 001 0v-1h1.5v1a.5.5 0 001 0v-1H11a.5.5 0 01.5.5v1.5H4V4a.5.5 0 01.5-.5h1v1a.5.5 0 001 0v-1h1z")
                  | Quick Add
              LbPopoverContent
                .form-demo
                  h4 Add New Item
                  .form-field
                    LbLabel(for="quick-title" required) Title
                    LbInput(
                      id="quick-title"
                      v-model="quickFormData.title"
                      placeholder="Enter title"
                    )
                  
                  .form-field
                    LbLabel(for="quick-category") Category
                    LbSelect(
                      id="quick-category"
                      v-model="quickFormData.category"
                      :options="categoryOptions"
                      placeholder="Select category"
                    )
                  
                  .form-field
                    LbLabel(for="quick-description") Description
                    LbTextarea(
                      id="quick-description"
                      v-model="quickFormData.description"
                      placeholder="Add description..."
                      :rows="3"
                    )
                  
                  .form-actions
                    LbButton(@click="formPopoverOpen = false" variant="ghost" size="small") Cancel
                    LbButton(@click="handleQuickAdd" variant="filled" color="primary" size="small") Add Item
      
      .component-demo
        h3 Dropdown
        p Base dropdown component for menus, selects, and other floating content
        
        .demo-group
          h4 Basic Dropdown
          .button-row
            LbDropdown(v-model="dropdownOpen1")
              template(#trigger)
                LbButton(variant="outline") Click for Dropdown
              template(#content)
                .dropdown-demo-content
                  p This is dropdown content
                  p It can contain anything
        
        .demo-group
          h4 Match Trigger Width
          .button-row
            LbDropdown(v-model="dropdownOpen2" :match-width="true")
              template(#trigger)
                LbButton(variant="filled" style="width: 200px") Wide Button
              template(#content)
                .dropdown-demo-content
                  p Content matches button width
        
        .demo-group  
          h4 Placement Options
          .button-row
            LbDropdown(v-model="dropdownOpen3" placement="top")
              template(#trigger)
                LbButton(variant="outline") Top Placement
              template(#content)
                .dropdown-demo-content
                  p Opens above the trigger
            
            LbDropdown(v-model="dropdownOpen4" placement="bottom")
              template(#trigger)
                LbButton(variant="outline") Bottom Placement
              template(#content)
                .dropdown-demo-content
                  p Opens below the trigger

      .component-demo
        h3 Menu
        p Flexible dropdown menu for lists with search, virtual scrolling, and custom content support.
        
        .demo-group
          h4 Basic Menu
          .button-row
            LbMenu(v-model="selectedMenuItem" :options="basicMenuOptions")
              template(#trigger)
                LbButton(variant="outline") {{ selectedMenuItem || 'Select Option' }}
            
            LbMenu(v-model="selectedColor" :options="colorMenuOptions")
              template(#trigger)
                LbButton(variant="filled" :color="selectedColor || 'primary'") 
                  | {{ selectedColorLabel }}
                  template(#icon-trailing)
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="none")
                      path(d="M5 6l3 3 3-3z")
        
        .demo-group
          h4 Month Selection Menu
          .button-row
            LbMenu(v-model="selectedMonth" :options="monthOptions")
              template(#trigger)
                LbButton(variant="tonal" color="secondary") 
                  | {{ selectedMonthLabel }}
                  template(#icon-trailing)
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="none")
                      path(d="M5 6l3 3 3-3z")
        
        .demo-group
          h4 Long List with Virtual Scrolling (Year Selection)
          .button-row
            LbMenu(
              v-model="selectedYear" 
              :options="yearOptions" 
              searchable
              placeholder="Type year..."
              :visible-items="8"
            )
              template(#trigger)
                LbButton(variant="outline") 
                  template(#icon-leading)
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                      path(d="M11 0H3a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V2a2 2 0 00-2-2zM5 3h6v2H5V3zm0 3h6v2H5V6zm0 3h6v2H5V9zm0 3h4v2H5v-2z")
                  | Year: {{ selectedYear }}
        
        .demo-group
          h4 Custom Item Template
          .button-row
            LbMenu(v-model="selectedUser" :options="userOptions" searchable placeholder="Search users...")
              template(#trigger)
                LbButton(variant="ghost") 
                  template(v-if="selectedUser" #icon-leading)
                    LbAvatar(:name="selectedUserData.label" size="xs")
                  | {{ selectedUser ? selectedUserData.label : 'Select User' }}
              template(#item="{ item }")
                .custom-menu-item
                  LbAvatar(:name="item.label" :status="item.status" size="xs")
                  .item-info
                    .item-name {{ item.label }}
                    .item-email {{ item.email }}
        
        .demo-group
          h4 Menu with Dividers
          .button-row
            LbMenu(v-model="selectedAction" :options="actionMenuOptions" @select="handleActionSelect")
              template(#trigger)
                LbButton(variant="outline")
                  template(#icon-trailing)
                    svg(width="16" height="16" viewBox="0 0 16 16" fill="currentColor")
                      path(d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM14.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z")
                  | Actions
        
        .demo-group
          h4 Disabled State
          .button-row
            LbMenu(disabled :options="basicMenuOptions")
              template(#trigger)
                LbButton(disabled) Disabled Menu
            
            LbMenu(v-model="selectedWithDisabled" :options="optionsWithDisabled")
              template(#trigger)
                LbButton(variant="outline") {{ selectedWithDisabled || 'Some Disabled' }}
      
      .component-demo
        h3 Calendar
        p Date selection component with month/year navigation and keyboard support
        
        .demo-group
          h4 Basic Calendar
          .calendar-demo
            LbCalendar(v-model="selectedCalendarDate" @change="handleCalendarChange")
        
        .demo-group
          h4 With Min/Max Dates
          .calendar-demo
            LbCalendar(
              v-model="selectedCalendarDate2"
              :min-date="calendarMinDate"
              :max-date="calendarMaxDate"
            )
            .demo-note
              p Min date: {{ calendarMinDate.toLocaleDateString() }}
              p Max date: {{ calendarMaxDate.toLocaleDateString() }}
        
        .demo-group
          h4 With Disabled Dates
          .calendar-demo
            LbCalendar(
              v-model="selectedCalendarDate3"
              :disabled-dates="disabledCalendarDates"
            )
            .demo-note Weekends are disabled
        
        .demo-group
          h4 Selection Mode Constraints
          .calendar-demo
            LbCalendar(
              v-model="selectedPastDate"
              mode="past"
              date-mode="past"
            )
            .demo-note Past mode: Only past dates and today can be selected (future dates are disabled)
          .calendar-demo
            LbCalendar(
              v-model="selectedFutureDate"
              mode="future"
              date-mode="future"
            )
            .demo-note Future mode: Only today and future dates can be selected (past dates are disabled)
        
        .demo-group
          h4 Monday as First Day of Week
          .calendar-demo
            LbCalendar(
              v-model="selectedCalendarDate4"
              :first-day-of-week="1"
            )
      
      .component-demo
        h3 Date Picker
        p Complete date selection with input field and calendar popover
        
        .demo-group
          h4 Basic Date Picker
          .date-picker-demo
            LbDatePicker(
              v-model="selectedDate1"
              placeholder="Select date"
              placement="bottom-start"
              @change="handleDateChange"
            )
            .demo-note Selected: {{ selectedDate1 ? selectedDate1.toLocaleDateString() : 'None' }}
        
        .demo-group
          h4 Date Selection Modes
          .date-picker-demo
            LbDatePicker(
              v-model="selectedBirthdate"
              mode="past"
              date-mode="past"
              placeholder="Select birthdate"
              placement="bottom-start"
            )
            LbDatePicker(
              v-model="selectedAppointment"
              mode="future"
              date-mode="future"
              placeholder="Schedule appointment"
              placement="bottom-start"
            )
            .demo-note 
              p Past mode: Only past dates and today can be selected (for birthdays, historical events)
              p Future mode: Only today and future dates can be selected (for appointments, scheduling)
        
        .demo-group
          h4 With Action Buttons
          .date-picker-demo
            LbDatePicker(
              v-model="selectedDate5"
              :clearable="true"
              :show-today="true"
              placeholder="With Today & Clear buttons"
              placement="bottom-start"
            )
        
        .demo-group
          h4 Date Constraints
          .date-picker-demo
            LbDatePicker(
              v-model="selectedDate6"
              :min-date="datePickerMinDate"
              :max-date="datePickerMaxDate"
              placeholder="With min/max dates"
              placement="bottom-start"
            )
            .demo-note
              p Min: {{ datePickerMinDate.toLocaleDateString() }}
              p Max: {{ datePickerMaxDate.toLocaleDateString() }}
        
        .demo-group
          h4 With Form Field Label and Hints
          .date-picker-demo
            LbFormField(
              label="Event Date"
              :hint="`Select a date between ${datePickerMinDate.toLocaleDateString()} and ${datePickerMaxDate.toLocaleDateString()}`"
              required
            )
              LbDatePicker(
                v-model="selectedEventDate"
                :min-date="datePickerMinDate"
                :max-date="datePickerMaxDate"
                placeholder="Choose event date"
                placement="bottom-start"
              )
            
            LbFormField(
              label="Date of Birth"
              hint="Must be 18 years or older"
              required
            )
              LbDatePicker(
                v-model="selectedBirthdate2"
                date-mode="past"
                :max-date="eighteenYearsAgo"
                placeholder="Enter your birthdate"
                placement="bottom-start"
              )
        
        .demo-group
          h4 Sizes and States
          .date-picker-demo
            LbDatePicker(
              v-model="selectedDate7"
              size="medium"
              placeholder="Medium size (default)"
              placement="bottom-start"
            )
            LbDatePicker(
              v-model="selectedDate8"
              size="large"
              placeholder="Large size"
              placement="bottom-start"
            )
            LbDatePicker(
              v-model="selectedDate9"
              :disabled="true"
              placeholder="Disabled"
              placement="bottom-start"
            )
            LbDatePicker(
              v-model="selectedDate10"
              :invalid="true"
              placeholder="Invalid state"
              placement="bottom-start"
            )
        
        .demo-group
          h4 With Disabled Dates (Weekends)
          .date-picker-demo
            LbDatePicker(
              v-model="selectedDate11"
              :disabled-dates="disabledWeekends"
              placeholder="Select weekday"
              placement="bottom-start"
            )
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { 
  LbButton, LbInput, LbLabel, LbHintText, LbTextarea, LbCheckbox, LbRadio, LbSwitch, LbSelect, LbFormField, LbDialog,
  LbBadge, LbNavigationBar, LbNavigationBarItem, LbBottomSheet, LbChip, LbAvatar, LbProgress, LbDivider, 
  LbSegmentButton, LbSegmentButtonItem, useSnackbar, LbPopover, LbPopoverTrigger, LbPopoverContent, LbPopoverArrow,
  LbDropdown, LbMenu, LbCalendar, LbDatePicker
} from '../src'

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

// Textarea demo values
const textareaValue1 = ref('')
const textareaValue2 = ref('This is some example text in a textarea component.')
const textareaReadonly = ref('This textarea is readonly and cannot be edited.')
const textareaDisabled = ref('This textarea is disabled.')
const textareaInvalid = ref('')
const textareaAutoResize1 = ref('')
const textareaAutoResize2 = ref('')
const textareaAutoResize3 = ref('')

// Checkbox demo values
const checkboxUnchecked = ref(false)
const checkboxChecked = ref(true)
const checkboxDisabled = ref(false)
const checkboxDisabledChecked = ref(true)
const checkboxInvalid = ref(true)

// Indeterminate state demo
const parentCheckbox = ref(false)
const checkboxItems = ref([
  { label: 'Item 1', checked: false },
  { label: 'Item 2', checked: true },
  { label: 'Item 3', checked: false }
])

const isIndeterminate = computed(() => {
  const checkedCount = checkboxItems.value.filter(item => item.checked).length
  return checkedCount > 0 && checkedCount < checkboxItems.value.length
})

const handleParentChange = () => {
  const newValue = parentCheckbox.value
  checkboxItems.value.forEach(item => {
    item.checked = newValue
  })
}

const handleChildChange = () => {
  const checkedCount = checkboxItems.value.filter(item => item.checked).length
  if (checkedCount === 0) {
    parentCheckbox.value = false
  } else if (checkedCount === checkboxItems.value.length) {
    parentCheckbox.value = true
  }
}

// Multiple selection demo
const selectedOptions = ref(['option1', 'option3'])
const multipleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' }
]

// Radio demo values
const radioStates = ref('checked')
const radioDisabled = ref('disabled')
const radioDisabledChecked = ref('disabled-checked')
const radioInvalid = ref('invalid')

// Radio group demo
const selectedPlan = ref('standard')
const planOptions = [
  { value: 'basic', name: 'Basic Plan', description: '$9/month - Essential features' },
  { value: 'standard', name: 'Standard Plan', description: '$19/month - Most popular' },
  { value: 'premium', name: 'Premium Plan', description: '$39/month - All features included' }
]

// Form integration demo
const notificationPrefs = ref({
  email: true,
  sms: false,
  push: true
})

const notificationFrequency = ref('daily')
const frequencyOptions = [
  { value: 'instant', label: 'Instant' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
  { value: 'never', label: 'Never' }
]

const termsAccepted = ref(false)
const showTermsError = ref(false)

// Switch demo values
const switchOff = ref(false)
const switchOn = ref(true)
const switchDisabled = ref(false)
const switchDisabledOn = ref(true)
const switchInvalid = ref(true)

// Switch form examples
const darkModeSwitch = ref(false)
const notificationsSwitch = ref(true)
const autoSaveSwitch = ref(true)

// Settings form
const privacySettings = ref({
  profilePublic: true,
  showActivity: true,
  allowMessages: false
})

const accessibilitySettings = ref({
  reduceMotion: false,
  highContrast: false
})

const handleCheckboxFormSubmit = () => {
  showTermsError.value = !termsAccepted.value
  
  if (termsAccepted.value) {
    alert(`Preferences saved!\n\nNotifications:\n- Email: ${notificationPrefs.value.email}\n- SMS: ${notificationPrefs.value.sms}\n- Push: ${notificationPrefs.value.push}\n\nFrequency: ${notificationFrequency.value}`)
  }
}

const resetCheckboxForm = () => {
  notificationPrefs.value = {
    email: true,
    sms: false,
    push: true
  }
  notificationFrequency.value = 'daily'
  termsAccepted.value = false
  showTermsError.value = false
}

// Dialog demo values
const showBasicDialog = ref(false)
const showTitleDialog = ref(false)
const showFullscreenDialog = ref(false)
const showNoBackdropDialog = ref(false)
const showNoEscapeDialog = ref(false)
const showNoCloseDialog = ref(false)
const showScrollDialog = ref(false)
const showFormDialog = ref(false)

// Form dialog data
const newProject = ref({
  name: '',
  description: '',
  visibility: 'public',
  initializeRepo: true
})

const visibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'internal', label: 'Internal' }
]

// Dialog handlers
const acceptTerms = () => {
  showScrollDialog.value = false
  alert('Terms accepted!')
}

const handleCreateProject = () => {
  if (newProject.value.name) {
    alert(`Project "${newProject.value.name}" created successfully!`)
    showFormDialog.value = false
    // Reset form
    newProject.value = {
      name: '',
      description: '',
      visibility: 'public',
      initializeRepo: true
    }
  }
}

// Switch settings handlers
const saveSettings = () => {
  alert(`Settings saved!\n\nPrivacy:\n- Public Profile: ${privacySettings.value.profilePublic}\n- Show Activity: ${privacySettings.value.showActivity}\n- Allow Messages: ${privacySettings.value.allowMessages}\n\nAccessibility:\n- Reduce Motion: ${accessibilitySettings.value.reduceMotion}\n- High Contrast: ${accessibilitySettings.value.highContrast}`)
}

const resetSettings = () => {
  privacySettings.value = {
    profilePublic: true,
    showActivity: true,
    allowMessages: false
  }
  accessibilitySettings.value = {
    reduceMotion: false,
    highContrast: false
  }
}

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
  email: '',
  country: '',
  timezone: '',
  notificationMethod: ''
})

// FormField demo data
const formFieldData = ref({
  username: '',
  email: '',
  password: '',
  bio: '',
  website: '',
  role: null,
  notifications: false
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

const formErrors = ref({
  notificationMethod: ''
})

// Select demo values
const selectValue1 = ref('')
const selectValue2 = ref('')
const selectValue3 = ref('')
const selectDisabled = ref('blue')
const selectInvalid = ref('')
const selectWithValue = ref('green')
const selectWithDisabledOptions = ref('')
const selectCustomIcon = ref('')

// Searchable selects
const selectSearchable1 = ref('')
const selectSearchable2 = ref('')

// Clearable selects
const selectClearable1 = ref('canada')
const selectClearable2 = ref('blue')

// Select size variants
const selectSizeMedium = ref('')
const selectSizeLarge = ref('')

// Select options
const colorOptions = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' }
]

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' }
]

const priorityOptions = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'urgent', label: 'Urgent' }
]

const optionsWithDisabled = [
  { value: 'available1', label: 'Available Option 1' },
  { value: 'available2', label: 'Available Option 2' },
  { value: 'disabled1', label: 'Disabled Option 1', disabled: true },
  { value: 'available3', label: 'Available Option 3' },
  { value: 'disabled2', label: 'Disabled Option 2', disabled: true },
  { value: 'available4', label: 'Available Option 4' }
]

const iconOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'guest', label: 'Guest' }
]

const timezoneOptions = [
  { value: 'pst', label: 'Pacific Standard Time (PST)' },
  { value: 'mst', label: 'Mountain Standard Time (MST)' },
  { value: 'cst', label: 'Central Standard Time (CST)' },
  { value: 'est', label: 'Eastern Standard Time (EST)' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
  { value: 'cet', label: 'Central European Time (CET)' },
  { value: 'jst', label: 'Japan Standard Time (JST)' }
]

const notificationMethodOptions = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS Text Message' },
  { value: 'push', label: 'Push Notification' },
  { value: 'none', label: 'No Notifications' }
]

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
  { name: 'Primary', var: '--lb-fill-primary-normal' },
  { name: 'Secondary', var: '--lb-fill-secondary-normal' },
  { name: 'Neutral', var: '--lb-fill-neutral-normal' },
  { name: 'Error', var: '--lb-fill-error-normal' },
  { name: 'Success', var: '--lb-fill-success-normal' },
  { name: 'Warning', var: '--lb-fill-warning-normal' },
  { name: 'Info', var: '--lb-fill-info-normal' },
]

const buttonVariants = ['filled', 'tonal', 'outline', 'ghost']
const buttonColors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info']

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

// Badge demo data
const badgeCount = ref(5)

// Chip demo data
const filterChipSelected = ref(false)
const filterOptions = ref([
  { value: 'new', label: 'New', selected: true },
  { value: 'popular', label: 'Popular', selected: false },
  { value: 'trending', label: 'Trending', selected: true },
  { value: 'featured', label: 'Featured', selected: false }
])

// Progress demo data
const linearProgress1 = ref(45)
const linearProgress2 = ref(70)
const linearProgress3 = ref(90)
const circularProgress1 = ref(30)
const circularProgress2 = ref(85)
const circularProgress3 = ref(60)
const circularProgress4 = ref(75)
const interactiveProgress = ref(50)

// SegmentButton demo data
const selectedSegment1 = ref(undefined) // Start with no selection
const selectedSize = ref('medium')
const selectedTags = ref([]) // Multi-select
const toggleValue = ref(undefined) // Toggle mode
const widthExample = ref('medium-length')
const colorExample = ref('option2')
const selectedView = ref('grid')
const selectedViewAuto = ref('grid')
const selectedViewWithLabels = ref('grid')
const selectedIconOnly = ref('grid')
const selectedDisabled = ref('option1')
const contentFilter = ref('all')
const dateRange = ref('month')
const statusFilters = ref([])
const tags = ref(['Vue.js', 'TypeScript', 'UI Kit', 'Component Library'])

const activeFilters = computed(() => {
  return filterOptions.value
    .filter(f => f.selected)
    .map(f => f.label)
    .join(', ')
})

const selectedSort = ref('')
const selectedChipDate = ref('')

const handleChipClick = () => {
  console.log('Chip clicked')
}

const handleChipDelete = () => {
  console.log('Chip deleted')
}

const handleChipAction = (action) => {
  console.log('Chip action:', action)
  // You could handle different actions here
  switch(action) {
    case 'edit':
      console.log('Edit action')
      break
    case 'duplicate':
      console.log('Duplicate action')
      break
    case 'share':
      console.log('Share action')
      break
    case 'delete':
      console.log('Delete action')
      break
  }
}

const removeTag = (index) => {
  tags.value.splice(index, 1)
}

const addTag = () => {
  const newTag = prompt('Enter new tag:')
  if (newTag) {
    tags.value.push(newTag)
  }
}

// Bottom Sheet demo data
const showBasicSheet = ref(false)
const showExpandableSheet = ref(false)
const showPersistentSheet = ref(false)

const confirmSheetAction = () => {
  alert('Action confirmed!')
  showPersistentSheet.value = false
}

// Navigation Bar demo data
const activeNavItem = ref('home')
const navActiveColor = ref('primary')
const navShowLabels = ref(true)

const navColorOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'info', label: 'Info' }
]

// Snackbar demo data
// Get snackbar methods from the composable
const { showSnackbar, clearAll: clearAllSnackbars } = useSnackbar()

const showDefaultSnackbar = () => {
  showSnackbar({
    message: 'This is a default snackbar'
  })
}

const showSuccessSnackbar = () => {
  showSnackbar({
    message: 'Operation completed successfully!',
    variant: 'success'
  })
}

const showErrorSnackbar = () => {
  showSnackbar({
    message: 'An error occurred. Please try again.',
    variant: 'error'
  })
}

const showWarningSnackbar = () => {
  showSnackbar({
    message: 'This action cannot be undone',
    variant: 'warning'
  })
}

const showInfoSnackbar = () => {
  showSnackbar({
    message: 'New update available',
    variant: 'info'
  })
}

const showActionSnackbar = () => {
  showSnackbar({
    message: 'File deleted',
    variant: 'default',
    action: {
      label: 'Undo',
      handler: () => {
        alert('Undo clicked!')
      }
    }
  })
}

const showPersistentSnackbar = () => {
  showSnackbar({
    message: 'New version available. Update now?',
    variant: 'info',
    action: {
      label: 'Update',
      handler: () => {
        alert('Updating...')
      }
    }
  })
}

const showLongActionSnackbar = () => {
  showSnackbar({
    message: 'Photo already has the label "travel". Would you like to add a new label?',
    variant: 'default',
    action: {
      label: 'Add a new label',
      handler: () => {
        alert('Adding new label...')
      }
    }
  })
}

const showMultipleSnackbars = () => {
  showSnackbar({ message: 'First snackbar', variant: 'default' })
  setTimeout(() => {
    showSnackbar({ message: 'Second snackbar', variant: 'info' })
  }, 500)
  setTimeout(() => {
    showSnackbar({ message: 'Third snackbar (max visible)', variant: 'success' })
  }, 1000)
}

// Popover demo data
const basicPopoverOpen = ref(false)
const arrowPopoverOpen = ref(false)
const richPopoverOpen = ref(false)
const formPopoverOpen = ref(false)

// Dropdown demo data  
const dropdownOpen1 = ref(false)
const dropdownOpen2 = ref(false)
const dropdownOpen3 = ref(false)
const dropdownOpen4 = ref(false)


const popoverPlacements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end'
]

const popoverStates = ref(
  popoverPlacements.reduce((acc, placement) => {
    acc[placement] = false
    return acc
  }, {})
)

// Menu demo data
const selectedMenuItem = ref('')
const selectedColor = ref('primary')
const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())
const selectedUser = ref('')
const selectedAction = ref('')
const selectedWithDisabled = ref('')

// Basic menu options
const basicMenuOptions = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4',
  'Option 5'
]

// Color menu options
const colorMenuOptions = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'info', label: 'Info' }
]

// Month options
const monthOptions = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
]

// Year options (100+ years for virtual scrolling demo)
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 125 }, (_, i) => ({
  value: currentYear - i,
  label: (currentYear - i).toString()
}))

// User options with custom data
const userOptions = [
  { value: 'john', label: 'John Doe', email: 'john@example.com', status: 'online' },
  { value: 'jane', label: 'Jane Smith', email: 'jane@example.com', status: 'away' },
  { value: 'alice', label: 'Alice Johnson', email: 'alice@example.com', status: 'busy' },
  { value: 'bob', label: 'Bob Wilson', email: 'bob@example.com', status: 'offline' },
  { value: 'carol', label: 'Carol Davis', email: 'carol@example.com', status: 'online' }
]

// Action menu with dividers
const actionMenuOptions = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { type: 'divider' },
  { value: 'archive', label: 'Archive' },
  { value: 'move', label: 'Move to...' },
  { type: 'divider' },
  { value: 'delete', label: 'Delete', disabled: false }
]

// Computed properties for labels
const selectedColorLabel = computed(() => {
  const option = colorMenuOptions.find(opt => opt.value === selectedColor.value)
  return option ? option.label : 'Select Color'
})

const selectedMonthLabel = computed(() => {
  const option = monthOptions.find(opt => opt.value === selectedMonth.value)
  return option ? option.label : 'Select Month'
})

const selectedUserData = computed(() => {
  return userOptions.find(opt => opt.value === selectedUser.value) || {}
})

// Menu handlers
const handleActionSelect = (value) => {
  console.log('Action selected:', value)
  // Reset after action
  setTimeout(() => {
    selectedAction.value = ''
  }, 100)
}

const quickFormData = ref({
  title: '',
  category: '',
  description: ''
})

// Calendar demo data
const selectedCalendarDate = ref(new Date())
const selectedCalendarDate2 = ref(new Date())
const selectedCalendarDate3 = ref(new Date())
const selectedCalendarDate4 = ref(new Date())
const selectedPastDate = ref(null)
const selectedFutureDate = ref(null)

// Min/Max dates for calendar
const calendarMinDate = new Date()
calendarMinDate.setMonth(calendarMinDate.getMonth() - 3) // 3 months ago

const calendarMaxDate = new Date()
calendarMaxDate.setMonth(calendarMaxDate.getMonth() + 3) // 3 months from now

// Disabled dates function (disable weekends)
const disabledCalendarDates = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

// Calendar handlers
const handleCalendarChange = (date) => {
  console.log('Calendar date changed:', date)
}

// DatePicker demo data
const selectedDate1 = ref(null)
const selectedBirthdate = ref(null)
const selectedAppointment = ref(null)
const selectedDate5 = ref(null)
const selectedDate6 = ref(null)
const selectedDate7 = ref(null)
const selectedDate8 = ref(null)
const selectedDate9 = ref(new Date())
const selectedDate10 = ref(null)
const selectedDate11 = ref(null)
const selectedDateImmediate = ref(null)
const selectedEventDate = ref(null)
const selectedBirthdate2 = ref(null)

// Date constraints for DatePicker
const datePickerMinDate = new Date()
datePickerMinDate.setMonth(datePickerMinDate.getMonth() - 1) // 1 month ago

const datePickerMaxDate = new Date()
datePickerMaxDate.setMonth(datePickerMaxDate.getMonth() + 3) // 3 months from now

// Compute date that's 18 years ago for birthdate validation
const eighteenYearsAgo = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return date
})

// Disabled weekends function for DatePicker
const disabledWeekends = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

// DatePicker handler
const handleDateChange = (date) => {
  console.log('DatePicker date changed:', date)
}

const categoryOptions = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'project', label: 'Project' },
  { value: 'idea', label: 'Idea' }
]

const handleQuickAdd = () => {
  if (quickFormData.value.title.trim()) {
    alert(`Added: ${quickFormData.value.title}`)
    // Reset form
    quickFormData.value = {
      title: '',
      category: '',
      description: ''
    }
    formPopoverOpen.value = false
  }
}

onMounted(() => {
  // Check for user's theme preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  
  // Animate progress values for demonstration
  const animateProgress = () => {
    linearProgress1.value = Math.floor(Math.random() * 101)
    linearProgress2.value = Math.floor(Math.random() * 101)
    linearProgress3.value = Math.floor(Math.random() * 101)
    circularProgress1.value = Math.floor(Math.random() * 101)
    circularProgress2.value = Math.floor(Math.random() * 101)
    circularProgress3.value = Math.floor(Math.random() * 101)
    circularProgress4.value = Math.floor(Math.random() * 101)
  }
  
  // Start with initial animation
  animateProgress()
  
  // Continue animating every 3 seconds
  setInterval(animateProgress, 3000)
})
</script>

<style lang="sass">
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.app-container
  min-height: 100vh
  
.app-header
  padding: base.$space-4xl base.$space-lg
  text-align: center
  border-bottom: base.$border-sm solid var(--lb-border-neutral-normal)
  
  h1, p
    margin: 0
    
.app-main
  max-width: 1200px
  margin: 0 auto
  padding: base.$space-lg
  
.app-main
  display: flex
  flex-direction: column
  gap: base.$space-3xl

section
  display: flex
  flex-direction: column
  gap: base.$space-lg
  margin-bottom: base.$space-3xl
  
  &:last-child
    margin-bottom: 0
  
  h2
    margin: 0 0 base.$space-md 0
    
.theme-section
  .theme-toggle
    margin-top: base.$space-md
        
.typography-section
  display: flex
  flex-direction: column
  gap: base.$space-md
  
  > *
    margin: 0
    
.color-section
  .color-grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
    gap: base.$space-lg
    margin-top: base.$space-xs
    
  .color-card
    display: flex
    flex-direction: column
    gap: base.$space-xs
    text-align: center
    
    .color-swatch
      height: 80px
      border-radius: base.$radius-md
      border: base.$border-sm solid var(--lb-border-neutral-normal)
      
.components-section
  display: flex
  flex-direction: column
  gap: base.$space-lg
  
  .component-demo
    display: flex
    flex-direction: column
    gap: base.$space-lg
    margin-bottom: base.$space-4xl
    padding: base.$space-2xl
    background: var(--lb-surface-neutral-subtle)
    border-radius: var(--lb-radius-lg)
    border: base.$border-sm solid var(--lb-border-neutral-line)
    
    &:last-child
      margin-bottom: 0
    
    h3
      margin: 0
      
  .demo-group
    display: flex
    flex-direction: column
    gap: base.$space-lg
    margin-bottom: base.$space-xl
    
    &:last-child
      margin-bottom: 0
    
    h4
      margin: 0 0 base.$space-xs 0
      color: var(--lb-text-neutral-contrast-low)
      text-transform: uppercase
      letter-spacing: 0.05em
      
  .button-grid
    display: grid
    gap: base.$space-md
    
  .variant-row
    display: grid
    grid-template-columns: 100px 1fr
    align-items: center
    gap: base.$space-sm
    
    h5
      color: var(--lb-text-neutral-contrast-low)
      
  .button-row
    display: flex
    flex-wrap: wrap
    gap: base.$space-md
    align-items: center
    margin-top: base.$space-xs
    
  .input-row
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
    gap: base.$space-lg
    margin-top: base.$space-xs
    
  .demo-note
    font-size: 0.875rem
    color: var(--lb-text-neutral-contrast-low)

.form-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
  gap: base.$space-md

// Global form-field styles
.form-field
  display: flex
  flex-direction: column
  gap: base.$space-xs  // 4px gap between label, input, and hint

.example-form
  display: flex
  flex-direction: column
  gap: base.$space-md
  background: var(--lb-surface-neutral-normal)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-lg
  padding: base.$space-lg
  max-width: 500px
  
  .form-field
    max-width: none

.form-actions
  display: flex
  gap: base.$space-sm
  
// Checkbox and Radio styles
.checkbox-row,
.radio-row
  display: flex
  flex-wrap: wrap
  gap: base.$space-lg
  align-items: center
  margin-top: base.$space-xs
  
.checkbox-item,
.radio-item
  display: flex
  align-items: center
  gap: base.$space-xs
  
.checkbox-group,
.radio-group
  display: flex
  flex-direction: column
  gap: base.$space-sm
  margin-top: base.$space-xs
  
  .checkbox-item
    margin-left: base.$space-md
    
.radio-content
  display: flex
  flex-direction: column
  gap: base.$space-2xs

// Switch styles
.switch-row
  display: flex
  flex-wrap: wrap
  gap: base.$space-lg
  align-items: center
  margin-top: base.$space-xs
  
.switch-item
  display: flex
  align-items: center
  gap: base.$space-xs
  
.switch-field
  display: flex
  align-items: flex-start
  gap: base.$space-sm
  
.switch-label-group
  display: flex
  flex-direction: column
  gap: base.$space-2xs
  
.switch-group
  display: flex
  flex-direction: column
  gap: base.$space-sm
  
.settings-form
  display: flex
  flex-direction: column
  gap: base.$space-md
  background: var(--lb-surface-neutral-normal)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-lg
  padding: base.$space-lg
  max-width: 600px
  
  h5
    margin: 0 0 base.$space-xs 0
    color: var(--lb-text-neutral-contrast-low)

// Dialog demo styles
.dialog-form
  display: flex
  flex-direction: column
  gap: base.$space-md
  
  .form-field
    &.checkbox-field
      flex-direction: row
      align-items: center
      gap: base.$space-xs

.scroll-content
  h4
    margin-top: base.$space-lg
    margin-bottom: base.$space-sm
    color: var(--lb-text-neutral-contrast-high)
    
    &:first-child
      margin-top: 0
  
  p
    margin-bottom: base.$space-md
    line-height: 1.6
    color: var(--lb-text-neutral-contrast-low)

// Badge demo styles
.badge-demo-item
  display: inline-flex
  align-items: center
  gap: base.$space-xs
  padding: base.$space-xs base.$space-sm
  background: var(--lb-surface-neutral-normal)

.navigation-badge-demo
  display: flex
  gap: base.$space-xl
  padding: base.$space-lg
  background: var(--lb-surface-neutral-subtle)
  border-radius: var(--lb-radius-md)
  margin-top: base.$space-xs
  
  .nav-item
    position: relative
    display: flex
    flex-direction: column
    align-items: center
    gap: base.$space-xs
    color: var(--lb-text-neutral-contrast-low)
    
    svg
      color: var(--lb-text-neutral-disabled)
    
    span
      font-size: var(--lb-font-size-label-small)

.avatar-badge-item
  position: relative
  display: inline-block
  margin: 0 base.$space-xs

.badge-wrapper
  position: relative

// Navigation demo styles
.navigation-demo
  background: var(--lb-surface-neutral-normal)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-lg
  overflow: hidden
  position: relative
  height: 200px
  
  .lb-navigation-bar
    position: absolute
    bottom: 0
    left: 0
    right: 0

// Sheet demo content
.sheet-content
  padding: base.$space-lg
  
  p
    margin-bottom: base.$space-md

// Progress demo styles
.progress-demo-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
  gap: base.$space-lg
  
.progress-item
  display: flex
  flex-direction: column
  gap: base.$space-sm
  
  .progress-label
    font-size: var(--lb-font-size-label-base)
    color: var(--lb-text-neutral-contrast-low)
    margin-bottom: base.$space-xs

.progress-controls
  display: flex
  flex-direction: column
  gap: base.$space-xl
  
  .control-group
    display: flex
    flex-direction: column
    gap: base.$space-sm
    max-width: 400px

// Divider demo styles
.divider-demo-vertical
  display: flex
  flex-direction: column
  gap: base.$space-xl
  
  .divider-item
    display: flex
    flex-direction: column
    
    p
      margin: base.$space-md 0
      color: var(--lb-text-neutral-contrast-low)

.divider-demo-horizontal
  display: flex
  align-items: stretch
  gap: 0
  min-height: base.$space-4xl
  
  .divider-item-horizontal
    display: flex
    align-items: center
    gap: 0
    
    span
      padding: 0 base.$space-md
      color: var(--lb-text-neutral-contrast-low)
      white-space: nowrap
      
    .lb-divider
      height: 100%

.card-example
  background: var(--lb-surface-neutral-normal)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-md
  padding: base.$space-lg
  max-width: 400px
  
  h5
    margin: 0 0 base.$space-xs 0
    
  > p
    margin: 0 0 base.$space-md 0
    color: var(--lb-text-neutral-contrast-low)
    
  .info-row
    padding: base.$space-xs 0
    color: var(--lb-text-neutral-contrast-low)
    font-size: var(--lb-font-size-label-base)
    
  .action-row
    display: flex
    align-items: stretch
    gap: 0
    margin-top: base.$space-md
    min-height: base.$space-3xl
    
    .lb-button
      align-self: center
      
    .lb-divider
      height: base.$space-2xl
      align-self: center

.list-example
  background: var(--lb-surface-neutral-normal)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-md
  overflow: hidden
  max-width: 500px
  
  &.surface-subtle
    background: var(--lb-surface-neutral-subtle)
    border: none
  
  .list-item
    padding: base.$space-lg
    
    h5
      margin: 0 0 base.$space-xs 0
      
    p
      margin: 0
      color: var(--lb-text-neutral-contrast-low)
      font-size: var(--lb-font-size-label-base)

// SegmentButton demo styles
.segment-demo
  display: flex
  flex-direction: column
  gap: base.$space-lg
  
  .demo-note
    margin-top: base.$space-sm
    font-size: var(--lb-font-size-label-base)
    color: var(--lb-text-neutral-contrast-low)

.segment-row
  display: flex
  flex-direction: column
  gap: base.$space-sm
  
  h5
    margin: 0
    color: var(--lb-text-neutral-contrast-low)
    font-size: var(--lb-font-size-label-base)
    text-transform: uppercase
    letter-spacing: 0.05em

.example-card
  background: var(--lb-surface-neutral-normal)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-md
  padding: base.$space-lg
  max-width: 500px
  margin-bottom: base.$space-lg
  
  &:last-child
    margin-bottom: 0
  
  h5
    margin: 0 0 base.$space-md 0
    
  .content-preview,
  .date-info
    margin-top: base.$space-md
    padding: base.$space-md
    background: var(--lb-surface-neutral-subtle)
    border-radius: base.$radius-sm
    
    p
      margin: 0
      color: var(--lb-text-neutral-contrast-low)
      font-size: var(--lb-font-size-label-base)

// Popover demo styles
.popover-demo
  display: flex
  flex-direction: column
  gap: var(--lb-space-lg)

.popover-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))
  gap: var(--lb-space-md)
  
  @media (max-width: 768px)
    grid-template-columns: repeat(2, 1fr)

.popover-content-demo
  padding: var(--lb-space-md)
  
  h4
    margin: 0 0 var(--lb-space-sm) 0
    font-size: var(--lb-font-size-label-large)
    color: var(--lb-text-neutral-contrast-high)
  
  p
    margin: 0 0 var(--lb-space-md) 0
    color: var(--lb-text-neutral-contrast-low)
    font-size: var(--lb-font-size-label-base)
    
    &:last-child
      margin-bottom: 0

.user-menu-demo
  min-width: 280px
  
  .user-header
    display: flex
    align-items: center
    gap: var(--lb-space-md)
    padding: var(--lb-space-md)
    
    .user-info
      flex: 1
      min-width: 0
      
      .user-name
        margin: 0 0 var(--lb-space-2xs) 0
        font-size: var(--lb-font-size-label-base)
        font-weight: var(--lb-font-weight-medium)
        color: var(--lb-text-neutral-contrast-high)
      
      .user-email
        margin: 0
        font-size: var(--lb-font-size-label-small)
        color: var(--lb-text-neutral-contrast-low)
  
  .user-menu
    padding: var(--lb-space-xs) 0
    
    .menu-item
      display: flex
      align-items: center
      gap: var(--lb-space-md)
      padding: var(--lb-space-sm) var(--lb-space-md)
      cursor: pointer
      transition: background-color var(--lb-transition)
      color: var(--lb-text-neutral-contrast-low)
      font-size: var(--lb-font-size-label-base)
      
      &:hover
        background: var(--lb-surface-neutral-hover)
        color: var(--lb-text-neutral-contrast-high)
      
      .menu-icon
        width: var(--lb-icon-size-sm)
        height: var(--lb-icon-size-sm)
        flex-shrink: 0

// Dropdown menu content styles for chip examples
.dropdown-menu-content
  padding: var(--lb-space-xs)
  min-width: 10rem // 160px

  .menu-item
    padding: var(--lb-space-sm) var(--lb-space-md)
    cursor: pointer
    border-radius: var(--lb-radius-sm)
    color: var(--lb-text-neutral-contrast-high)
    transition: background-color var(--lb-transition)
    display: flex
    align-items: center
    
    &:hover
      background-color: var(--lb-surface-neutral-hover)
    
    &.menu-item-selected
      background-color: var(--lb-surface-primary-subtle)
      color: var(--lb-text-primary-contrast-high)

// Calendar demo styles
.calendar-demo
  display: flex
  flex-direction: column
  gap: var(--lb-space-md)
  align-items: flex-start
  
  .demo-note
    margin-top: var(--lb-space-md)
    padding: var(--lb-space-sm)
    background: var(--lb-surface-neutral-subtle)
    border-radius: var(--lb-radius-md)
    font-size: var(--lb-font-size-body-small)
    color: var(--lb-text-neutral-contrast-high)
    
    p
      margin: 0
      &:not(:last-child)
        margin-bottom: var(--lb-space-xs)

// DatePicker demo styles
.date-picker-demo
  display: flex
  flex-direction: column
  gap: var(--lb-space-md)
  align-items: flex-start
  
  .lb-date-picker
    min-width: 15rem
  
  .demo-note
    padding: var(--lb-space-sm)
    background: var(--lb-surface-neutral-subtle)
    border-radius: var(--lb-radius-md)
    font-size: var(--lb-font-size-body-small)
    color: var(--lb-text-neutral-contrast-high)
    
    p
      margin: 0
      
      &.hint-text
        margin-top: var(--lb-space-xs)
        color: var(--lb-text-neutral-contrast-low)
        font-size: var(--lb-font-size-label-small)
      
      &:not(:last-child)
        margin-bottom: var(--lb-space-xs)
    
    &.menu-item-danger
      color: var(--lb-text-error-normal)
      
      &:hover
        background-color: var(--lb-surface-error-normal)
  
  .menu-divider
    height: 1px
    background-color: var(--lb-border-neutral-line)
    margin: var(--lb-space-xs) 0

.form-demo
  min-width: 300px
  
  h4
    margin: 0 0 var(--lb-space-lg) 0

// Dropdown demo styles
.dropdown-demo-content
  padding: var(--lb-space-md)
  min-width: 200px
  
  p
    margin: 0 0 var(--lb-space-sm) 0
    &:last-child
      margin-bottom: 0

// Menu demo styles
.custom-menu-item
  display: flex
  align-items: center
  gap: var(--lb-space-md)
  width: 100%
  
  .item-info
    flex: 1
    min-width: 0
    
    .item-name
      font-size: var(--lb-font-size-label-base)
      color: var(--lb-text-neutral-contrast-high)
      margin-bottom: var(--lb-space-2xs)
    
    .item-email
      font-size: var(--lb-font-size-label-small)
      color: var(--lb-text-neutral-contrast-low)
    font-size: var(--lb-font-size-label-large)
    color: var(--lb-text-neutral-contrast-high)
  
  .form-field
    display: flex
    flex-direction: column
    gap: var(--lb-form-field-gap)
    margin-bottom: var(--lb-form-field-margin)
    
    &:last-of-type
      margin-bottom: var(--lb-space-lg)
  
  .form-actions
    display: flex
    justify-content: flex-end
    gap: var(--lb-space-sm)
</style>