# Input & Textarea Focus State Improvement

## Overview

This document outlines the proposed changes to improve the focus states for input and textarea components in the LittleBrand UI Kit, implementing a cleaner, more accessible approach using stronger neutral borders instead of primary colors.

## Current Behavior Issues

The current implementation has several issues:
- Uses both `outline` and `box-shadow` for focus states, creating visual confusion
- Shows focus rings on mouse clicks (not just keyboard navigation)
- Border color changes are not prominent enough
- Inconsistent behavior between mouse and keyboard focus

## Proposed Solution: Stronger Neutral Borders

### Design Philosophy

Use **stronger neutral borders** for focus states rather than primary colors. This approach is:
- **Subtle and professional** - Doesn't distract from content
- **Universally compatible** - Works in any color context (including inverted sections)
- **Accessibility-friendly** - Better contrast ratios with neutral colors
- **Non-conflicting** - Doesn't compete with error/success validation states

### Implementation

#### 1. Base Input/Textarea Styles

```sass
// In components/Input/LbInput.vue and components/Textarea/LbTextarea.vue

input, textarea
  // Remove default browser outline
  outline: none
  
  // Base border
  border: 1px solid var(--lb-border-neutral-normal)
  transition: border-color 0.2s ease, border-width 0.2s ease
```

#### 2. Focus State Changes

```sass
// Option A: Darker Border Color (Recommended)
input:focus, textarea:focus
  outline: none
  box-shadow: none  // Remove any box-shadow
  border-color: var(--lb-border-neutral-contrast-high)  // Much darker border
  
// Option B: Thicker Border (Alternative)
input:focus, textarea:focus
  outline: none
  box-shadow: none
  border-width: 2px
  border-color: var(--lb-border-neutral-active)
```

#### 3. Keyboard Navigation Focus Ring

```sass
// Only show focus ring for keyboard navigation
input:focus-visible, textarea:focus-visible
  outline: 2px solid var(--lb-focus-ring-color)
  outline-offset: 2px
  // Keep the border changes from :focus
```

### Complete Implementation Example

```sass
// LbInput.vue styles
.lb-input
  input
    // Remove defaults
    outline: none
    
    // Base state
    border: 1px solid var(--lb-border-neutral-normal)
    padding: base.$space-sm base.$space-md
    border-radius: base.$radius-md
    transition: border-color 0.2s ease
    
    // Hover state
    &:hover:not(:disabled):not(:focus)
      border-color: var(--lb-border-neutral-hover)
    
    // Focus state (both mouse and keyboard)
    &:focus
      border-color: var(--lb-border-neutral-contrast-high)  // Dark border
      box-shadow: none  // No box-shadow
    
    // Keyboard-only focus ring
    &:focus-visible
      outline: 2px solid var(--lb-focus-ring-color)
      outline-offset: 2px
    
    // Disabled state
    &:disabled
      opacity: 0.5
      cursor: not-allowed
      
    // Error state (takes precedence)
    &.error
      border-color: var(--lb-border-error-normal)
      
      &:focus
        border-color: var(--lb-border-error-active)
```

## Benefits of This Approach

### 1. Visual Hierarchy
- Primary colors reserved for CTAs and important actions
- Input focus is noticeable but not distracting
- Clear distinction between interactive states

### 2. Accessibility
- Meets WCAG 2.1 contrast requirements
- Clear focus indication for all users
- Keyboard navigation gets additional visual feedback

### 3. Consistency
- Works across all themes (light/dark/custom)
- Compatible with inverted sections
- Doesn't conflict with validation states

### 4. Modern UX Patterns
Following established patterns from:
- **GitHub**: Dark border on focus
- **Notion**: Stronger neutral border
- **Apple**: Subtle border emphasis
- **Slack**: Neutral border with subtle depth

## Migration Guide

### For Component Library

1. Update `LbInput.vue`:
```diff
- &:focus
-   outline: cv.$input-border-width solid var(--lb-border-primary-active)
+ &:focus
+   outline: none
+   border-color: var(--lb-border-neutral-contrast-high)
+   box-shadow: none

- &:focus-visible
-   box-shadow: 0 0 0 base.$focus-ring-width var(--lb-focus-ring-color)
+ &:focus-visible
+   outline: 2px solid var(--lb-focus-ring-color)
+   outline-offset: 2px
```

2. Update `LbTextarea.vue` with the same pattern

3. Update `LbSelect.vue` to maintain consistency

### For Applications Using the UI Kit

No changes required! The updates will automatically apply once the UI kit is updated.

### Optional Customization

Applications can override the focus border color if needed:

```css
/* Override with primary color if desired */
.lb-input input:focus {
  border-color: var(--lb-border-primary-active);
}

/* Or create custom focus color */
:root {
  --lb-input-focus-border: #your-color;
}
```

## CSS Variables to Add/Update

Consider adding these new variables for better customization:

```sass
:root
  // Input-specific focus colors
  --lb-input-focus-border: var(--lb-border-neutral-contrast-high)
  --lb-input-focus-ring: var(--lb-focus-ring-color)
  --lb-input-focus-ring-offset: 2px
```

## Testing Checklist

- [ ] Mouse click shows darker border, no outline
- [ ] Keyboard tab shows darker border + focus ring
- [ ] Focus states work in light mode
- [ ] Focus states work in dark mode
- [ ] Focus states work in inverted sections
- [ ] Error state borders override focus borders correctly
- [ ] Disabled inputs don't show focus states
- [ ] Transition animations are smooth
- [ ] No double borders or visual artifacts

## Comparison with Other Approaches

### Why Not Primary Color?

While using primary color for focus is common, we chose neutral because:

1. **Non-competitive**: Doesn't compete with CTA buttons for attention
2. **Error-friendly**: Doesn't clash with red error states
3. **Theme-agnostic**: Works equally well in any color scheme
4. **Professional**: Creates a calm, focused interface

### Why Not Box-Shadow?

Box-shadow for focus rings can:
- Create visual artifacts
- Cause layout issues with overflow
- Be harder to customize
- Not respect border-radius properly

Using `outline` with `outline-offset` is cleaner and more predictable.

## Examples in Context

### Standard Form
```html
<div class="form">
  <lb-input placeholder="Email" type="email" />
  <lb-input placeholder="Password" type="password" />
  <lb-button variant="filled">Submit</lb-button>
</div>
```
The stronger neutral borders ensure inputs are clearly focused without overwhelming the submit button's importance.

### Inverted Section
```html
<section class="inverted-section">
  <lb-input placeholder="Search..." />
</section>
```
Neutral borders adapt naturally to both light-on-dark and dark-on-light contexts.

### With Validation
```html
<lb-input 
  :class="{ error: hasError }"
  @blur="validate"
/>
```
Error states naturally override the neutral focus, maintaining clear validation feedback.

## Conclusion

This approach provides a clean, professional, and accessible focus state system that:
- Enhances usability without sacrificing aesthetics
- Works consistently across all contexts
- Follows modern UX best practices
- Maintains the design system's flexibility

The stronger neutral border approach creates a subtle yet clear focus indication that respects the overall visual hierarchy of the interface while ensuring accessibility for all users.