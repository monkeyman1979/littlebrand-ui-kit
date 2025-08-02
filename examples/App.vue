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
                    LbHintText Let others see when you're online
                
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
          p It's particularly useful for mobile devices or when you need maximum space.
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
            LbSelect(v-model="selectSizeSmall" :options="colorOptions" placeholder="Small select" size="small")
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { LbButton, LbInput, LbLabel, LbHintText, LbTextarea, LbCheckbox, LbRadio, LbSwitch, LbSelect, LbFormField, LbDialog } from '../src'

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

// Select size variants
const selectSizeSmall = ref('')
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

.form-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
  gap: base.$space-6

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
  
// Checkbox and Radio styles
.checkbox-row,
.radio-row
  display: flex
  flex-wrap: wrap
  gap: base.$space-6
  align-items: center
  
.checkbox-item,
.radio-item
  display: flex
  align-items: center
  gap: base.$space-3
  
.checkbox-group,
.radio-group
  display: flex
  flex-direction: column
  gap: base.$space-4
  margin-top: base.$space-2
  
  .checkbox-item
    margin-left: base.$space-6
    
.radio-content
  display: flex
  flex-direction: column
  gap: base.$space-1

// Switch styles
.switch-row
  display: flex
  flex-wrap: wrap
  gap: base.$space-6
  align-items: center
  
.switch-item
  display: flex
  align-items: center
  gap: base.$space-3
  
.switch-field
  display: flex
  align-items: flex-start
  gap: base.$space-4
  
.switch-label-group
  display: flex
  flex-direction: column
  gap: base.$space-1
  
.switch-group
  display: flex
  flex-direction: column
  gap: base.$space-4
  
.settings-form
  display: flex
  flex-direction: column
  gap: base.$space-6
  background: var(--color-surface)
  border: base.$border-thin solid var(--color-border)
  border-radius: base.$radius-lg
  padding: base.$space-8
  max-width: 600px
  
  h5
    margin: 0 0 base.$space-2 0
    color: var(--color-text-secondary)

// Dialog demo styles
.dialog-form
  display: flex
  flex-direction: column
  gap: base.$space-6
  
  .form-field
    display: flex
    flex-direction: column
    gap: base.$space-2
    
    &.checkbox-field
      flex-direction: row
      align-items: center
      gap: base.$space-3

.scroll-content
  h4
    margin-top: base.$space-8
    margin-bottom: base.$space-4
    color: var(--color-text)
    
    &:first-child
      margin-top: 0
  
  p
    margin-bottom: base.$space-6
    line-height: 1.6
    color: var(--color-text-secondary)
</style>