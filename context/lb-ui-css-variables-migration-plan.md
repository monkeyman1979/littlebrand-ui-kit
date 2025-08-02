# LittleBrand UI Kit - CSS Variables Migration Plan

This document outlines the plan to migrate the entire UI kit from SASS variables to CSS custom properties for better runtime customization.

## Migration Goals

1. **Replace SASS variables with CSS custom properties** for all customizable values
2. **Maintain backward compatibility** where possible
3. **Preserve SASS syntax benefits** (nesting, parent selectors, etc.)
4. **Enable runtime customization** without build tools
5. **Simplify the customization story** - one system instead of two

## Phase 1: Define CSS Variables in _themes.sass

Add all customizable properties as CSS variables:

### Typography Variables
```sass
:root
  // Font families
  --font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace
  
  // Font sizes
  --font-size-xs: 0.75rem
  --font-size-sm: 0.875rem
  --font-size-base: 1rem
  --font-size-lg: 1.125rem
  --font-size-xl: 1.25rem
  --font-size-2xl: 1.5rem
  --font-size-3xl: 1.875rem
  --font-size-4xl: 2.25rem
  
  // Font weights
  --font-weight-normal: 400
  --font-weight-medium: 500
  --font-weight-semibold: 600
  --font-weight-bold: 700
  
  // Line heights
  --line-height-compact: 1.25
  --line-height-normal: 1.5
  --line-height-relaxed: 1.75
  
  // Letter spacing
  --letter-spacing-tight: -0.025em
  --letter-spacing-normal: 0
  --letter-spacing-wide: 0.025em
```

### Spacing Variables
```sass
:root
  // Full spacing scale
  --space-1: 0.125rem
  --space-2: 0.25rem
  --space-3: 0.375rem
  --space-4: 0.5rem
  --space-5: 0.75rem
  --space-6: 0.875rem
  --space-7: 1rem
  --space-8: 1.125rem
  --space-9: 1.25rem
  --space-10: 1.5rem
  --space-11: 2rem
  --space-12: 2.5rem
  --space-13: 3rem
  --space-14: 3.5rem
  --space-15: 4rem
  --space-16: 4.5rem
  --space-17: 5rem
  --space-18: 6rem
```

### Layout Variables
```sass
:root
  // Border radius
  --radius-xs: 0.25rem
  --radius-sm: 0.375rem
  --radius-md: 0.5rem
  --radius-lg: 0.625rem
  --radius-xl: 0.75rem
  --radius-2xl: 1rem
  --radius-3xl: 1.5rem
  --radius-4xl: 2rem
  --radius-full: 9999px
  
  // Border widths
  --border-thin: 1px
  --border-medium: 2px
  --border-thick: 4px
  
  // Z-index
  --z-dropdown: 10
  --z-modal-backdrop: 20
  --z-modal: 30
  --z-notification: 40
  
  // Transitions
  --transition-fast: 150ms ease
  --transition-base: 300ms ease
  --transition-slow: 500ms ease
  
  // Focus states
  --focus-ring-width: 2px
  --focus-ring-offset: 2px
```

### Component-Specific Variables
```sass
:root
  // Button
  --btn-height-small: 2rem
  --btn-height-medium: 2.5rem
  --btn-height-large: 3rem
  --btn-padding-x-small: 0.75rem
  --btn-padding-x-medium: 1rem
  --btn-padding-x-large: 1.25rem
  
  // Input
  --input-height-small: 2rem
  --input-height-medium: 2.5rem
  --input-height-large: 3rem
  --input-padding-x: 0.75rem
  --input-padding-y: 0.5rem
  
  // Form field
  --form-field-gap: 0.5rem
  --form-field-margin: 1.5rem
```

## Phase 2: Update SASS Files to Use CSS Variables

### _typography.sass
```sass
// Keep SASS variables for internal use/calculations
$font-heading: var(--font-heading)
$font-body: var(--font-body)
$font-mono: var(--font-mono)

// Update all typography styles
h1
  font-family: var(--font-heading)
  font-weight: var(--font-weight-bold)
  line-height: var(--line-height-compact)
  letter-spacing: var(--letter-spacing-tight)
  font-size: clamp(2rem, 3vw + 0.5rem, 3rem)

p
  font-family: var(--font-body)
  font-weight: var(--font-weight-normal)
  line-height: var(--line-height-normal)
  font-size: var(--font-size-base)

code, pre
  font-family: var(--font-mono)
```

### Component Updates
Each component file needs to be updated to use CSS variables:

#### LbButton.vue
```sass
.lb-button
  font-family: var(--font-body)
  font-weight: var(--font-weight-medium)
  border-radius: var(--radius-md)
  transition: all var(--transition-base)
  
  &.small
    height: var(--btn-height-small)
    padding: 0 var(--btn-padding-x-small)
    font-size: var(--font-size-sm)
    border-radius: var(--radius-sm)
    
  &.medium
    height: var(--btn-height-medium)
    padding: 0 var(--btn-padding-x-medium)
    font-size: var(--font-size-base)
    
  &.large
    height: var(--btn-height-large)
    padding: 0 var(--btn-padding-x-large)
    font-size: var(--font-size-lg)
```

## Phase 3: Update Dark Theme Variables

Extend dark theme with the new variables:

```sass
[data-theme="dark"]
  // Dark mode adjustments if needed
  --font-weight-normal: 300  // Slightly lighter for dark mode
  --letter-spacing-normal: 0.01em  // Slightly wider for readability
  
  // Component adjustments
  --btn-height-medium: 2.625rem  // Slightly taller for better touch targets
```

## Phase 4: Testing Checklist

1. **Build the library** and verify output
2. **Test runtime customization**:
   ```css
   :root {
     --font-heading: 'Playfair Display', serif;
     --space-4: 1rem;
     --radius-md: 0.75rem;
   }
   ```
3. **Test component variations** (small, medium, large)
4. **Test theme switching** (light/dark)
5. **Test in consuming application**
6. **Check file size** (CSS variables add minimal overhead)

## Phase 5: Update Documentation

1. Update all customization guides to show CSS variable approach
2. Create migration guide for existing users
3. Update README with new customization examples
4. Add CSS variable reference table

## Migration Order

1. **Start with _themes.sass** - Define all variables
2. **Update _typography.sass** - Core typography system
3. **Update base components**:
   - LbButton
   - LbInput
   - LbSelect
   - LbTextarea
4. **Update layout components**:
   - LbFormField
   - LbDialog
5. **Update utility components**:
   - LbLabel
   - LbHintText
6. **Update interactive components**:
   - LbCheckbox
   - LbRadio
   - LbSwitch

## Backward Compatibility Notes

- Color variables are already CSS custom properties ✓
- Shadow variables are already CSS custom properties ✓
- Typography, spacing, and radius will be new
- Existing CSS overrides will continue to work
- SASS variables will be removed in next major version

## Benefits After Migration

1. **Simpler mental model** - One customization system
2. **Runtime theming** - Change variables with JavaScript
3. **Better DevTools** - See and modify variables in browser
4. **No build required** - Override with plain CSS
5. **Scoped customization** - Override variables per component
6. **Dynamic calculations** - Use calc() with variables

## Example: Complete Theme Override

After migration, users can create complete themes with just CSS:

```css
/* brand-theme.css */
:root {
  /* Typography */
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  
  /* Spacing - using a 4px scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;
  
  /* Personality */
  --radius-sm: 0.125rem;  /* Sharp corners */
  --radius-md: 0.25rem;
  --radius-lg: 0.375rem;
  
  /* Brand colors */
  --color-primary: #5b21b6;
  --color-secondary: #0891b2;
}
```