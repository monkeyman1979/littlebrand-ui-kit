# LittleBrand UI Kit - SASS Architecture Guide

## Overview
This guide defines the SASS architecture and patterns for the LittleBrand UI Kit. All styles use SASS syntax (not SCSS) with indentation-based nesting.

## File Structure
```
styles/
├── _base.sass       # Core variables: spacing, borders, shadows
├── _colors.sass     # Color scales and primitives  
├── _typography.sass # Font stacks, sizes, and examples
├── _themes.sass     # CSS custom properties for theming
├── _reset.sass      # Global resets and defaults
└── main.sass        # Imports all files
```

## Import Strategy

### For Components
Each component imports ONLY what it needs:
```sass
// In LbButton.vue
@import '@/styles/colors'
@import '@/styles/base'
@import '@/styles/typography'
// NOT importing main.sass
```

### For Global Styles
Only `main.sass` is imported globally (if using plugin mode).

## _base.sass Structure

```sass
// Spacing Scale (rem-based)
$space-xs: 0.25rem   // 4px
$space-sm: 0.5rem    // 8px
$space-md: 1rem      // 16px
$space-lg: 1.5rem    // 24px
$space-xl: 2rem      // 32px
$space-2xl: 3rem     // 48px

// Border Widths
$border-thin: 1px
$border-medium: 2px
$border-thick: 4px

// Border Radius
$radius-sm: 0.25rem
$radius-md: 0.5rem
$radius-lg: 1rem
$radius-full: 9999px

// Shadows (subtle, elegant)
$shadow-sm: 0 1px 2px hsla(0, 0%, 0%, 0.05)
$shadow-md: 0 4px 6px hsla(0, 0%, 0%, 0.07)
$shadow-lg: 0 10px 15px hsla(0, 0%, 0%, 0.1)

// Z-Index Scale (max 50)
$z-dropdown: 10
$z-modal-backdrop: 20
$z-modal: 30
$z-notification: 40

// Transitions
$transition: 300ms ease

// Focus States
$focus-ring-width: 2px
$focus-ring-offset: 2px
```

## _colors.sass Structure

Uses 1-12 scale inspired by Radix UI:

```sass
// Neutral Scale - Light
$gray-1: hsl(0, 0%, 99%)
$gray-2: hsl(0, 0%, 97.3%)
// ... through to
$gray-12: hsl(0, 0%, 9%)

// Neutral Scale - Dark
$gray-dark-1: hsl(0, 0%, 8.5%)
$gray-dark-2: hsl(0, 0%, 11%)
// ... through to
$gray-dark-12: hsl(0, 0%, 93%)

// Primary (Purple)
$purple-1: hsl(280, 65%, 99.4%)
// ... through to
$purple-12: hsl(280, 70%, 13%)

// Secondary (Teal)
$teal-1: hsl(180, 60%, 99%)
// ... through to  
$teal-12: hsl(180, 65%, 11%)

// Utility Colors (Blue, Red, Green, Yellow)
// Each with 1-12 light and dark scales

// Alpha Variants
$gray-a1: hsla(0, 0%, 0%, 0.012)
// ... through to
$gray-a12: hsla(0, 0%, 0%, 0.910)
```

## _typography.sass Structure

```sass
// === CUSTOM FONT EXAMPLES (uncomment to use) ===
// Option 1: Self-hosted fonts
// @font-face
//   font-family: 'Inter'
//   src: url('../fonts/Inter.woff2') format('woff2')
//   font-weight: 400
//   font-display: swap

// Option 2A: Google Fonts via @import
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')

// Option 2B: Google Fonts via <link> (add to index.html)
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

// Font Stacks
$font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
$font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif

// Font Weights
$weight-normal: 400
$weight-medium: 500  
$weight-semibold: 600
$weight-bold: 700

// Line Heights
$line-compact: 1.25
$line-normal: 1.5

// Special Display Sizes
$display-1: clamp(3rem, 5vw + 1rem, 5rem)
$display-2: clamp(2.5rem, 4vw + 1rem, 4rem)

// Typography Styles (applied directly to elements)
h1
  font-size: clamp(2rem, 3vw + 0.5rem, 3rem)
  font-family: $font-heading
  font-weight: $weight-bold
  line-height: $line-compact

h2
  font-size: clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)
  // etc...

p
  font-size: 1rem
  font-family: $font-body
  line-height: $line-normal
  
  &.body-large
    font-size: clamp(1.125rem, 1vw + 0.25rem, 1.25rem)
    
  &.body-small
    font-size: 0.875rem

.label
  font-size: 0.875rem
  font-weight: $weight-medium
  letter-spacing: 0.025em
  
  &.label-large
    font-size: 1rem
    
  &.label-small
    font-size: 0.75rem
```

## _themes.sass Structure

Maps semantic colors to theme values:

```sass
:root
  // Colors
  --color-background: #{$gray-1}
  --color-surface: white
  --color-border: #{$gray-6}
  --color-text: #{$gray-12}
  --color-text-secondary: #{$gray-11}
  
  // Brand Colors
  --color-primary: #{$purple-9}
  --color-primary-hover: #{$purple-10}
  --color-secondary: #{$teal-9}
  --color-secondary-hover: #{$teal-10}
  
  // Utility States
  --color-error: #{$red-9}
  --color-error-background: #{$red-2}
  --color-error-border: #{$red-7}
  
  --color-success: #{$green-9}
  --color-success-background: #{$green-2}
  --color-success-border: #{$green-7}
  
  // Focus
  --color-focus-ring: #{$blue-7}

[data-theme="dark"]
  // Dark mode overrides
  --color-background: #{$gray-dark-1}
  --color-surface: #{$gray-dark-2}
  --color-border: #{$gray-dark-6}
  --color-text: #{$gray-dark-12}
  // etc...
```

## Component Styling Patterns

### Use CSS Custom Properties for Theme-aware Colors
```sass
.lb-button
  background: var(--color-primary)
  color: var(--color-surface)
  
  &:hover
    background: var(--color-primary-hover)
```

### Use SASS Variables for Non-themed Values
```sass
.lb-input
  padding: $space-sm $space-md
  border-radius: $radius-md
  border-width: $border-medium
```

### Grid/Flexbox for All Spacing
```sass
.form-group
  display: grid
  gap: $space-md
  
// NEVER use margin-bottom for spacing
```

## _reset.sass Structure

```sass
// Box model
*,
*::before,
*::after
  box-sizing: border-box

// Remove default margins
body,
h1, h2, h3, h4, h5, h6,
p, ul, ol, li,
figure, figcaption, blockquote,
dl, dd
  margin: 0

// Body defaults
body
  min-height: 100vh
  line-height: $line-normal
  font-family: $font-body
  color: var(--color-text)
  background: var(--color-background)
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

// Focus styles
:focus
  outline: none
  
:focus-visible
  outline: $focus-ring-width solid var(--color-focus-ring)
  outline-offset: $focus-ring-offset

// Links
a
  color: var(--color-primary)
  text-decoration: none
  
  &:hover
    text-decoration: underline

// Lists
ul, ol
  padding-left: $space-xl
  
li + li
  margin-top: $space-xs

// Images
img,
picture,
video,
canvas,
svg
  display: block
  max-width: 100%
  height: auto

// Form elements
input,
button,
textarea,
select
  font: inherit

// Button reset
button
  cursor: pointer
  background: none
  border: none
  padding: 0
  
  &:disabled
    cursor: not-allowed

// Remove number input spinners
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button
  -webkit-appearance: none
  margin: 0

input[type="number"]
  -moz-appearance: textfield
```

## main.sass Structure

```sass
// Import all partials in order
@import 'colors'
@import 'base'
@import 'typography'  
@import 'themes'
@import 'reset'

// Any additional global styles can go here
// (though most should be in reset.sass)
```

## Key Principles

1. **Import only what you need** - Components shouldn't import main.sass
2. **Semantic variables** - Name by purpose, not appearance
3. **Theme via CSS properties** - Not SASS variables
4. **Scale consistently** - Use the defined scales
5. **No magic numbers** - Always use variables
6. **Grid/Flex for spacing** - Never margins