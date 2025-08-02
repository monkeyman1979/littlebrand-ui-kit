# LittleBrand UI Kit - Spacing & Sizes Customization Guide

This guide explains how to customize spacing, component sizes, border radius, and shadows in the LittleBrand UI Kit.

## Table of Contents
1. [Understanding the Spacing System](#understanding-the-spacing-system)
2. [Customizing the Spacing Scale](#customizing-the-spacing-scale)
3. [Component Size Customization](#component-size-customization)
4. [Border Radius System](#border-radius-system)
5. [Shadow System](#shadow-system)
6. [Layout & Gap Management](#layout--gap-management)
7. [Complete Examples](#complete-examples)

## Understanding the Spacing System

The UI kit uses an 18-level spacing scale based on rem units:

```scss
$space-1: 0.125rem   // 2px
$space-2: 0.25rem    // 4px
$space-3: 0.375rem   // 6px
$space-4: 0.5rem     // 8px
$space-5: 0.75rem    // 12px
$space-6: 0.875rem   // 14px
$space-7: 1rem       // 16px
$space-8: 1.125rem   // 18px
$space-9: 1.25rem    // 20px
$space-10: 1.5rem    // 24px
$space-11: 2rem      // 32px
$space-12: 2.5rem    // 40px
$space-13: 3rem      // 48px
$space-14: 3.5rem    // 56px
$space-15: 4rem      // 64px
$space-16: 4.5rem    // 72px
$space-17: 5rem      // 80px
$space-18: 6rem      // 96px
```

## Customizing the Spacing Scale

**Important Note**: The spacing scale in LittleBrand UI Kit is compiled from SASS variables, not exposed as CSS custom properties. This means you have two options for customization:

### Method 1: Direct CSS Overrides (Runtime)

Override the compiled spacing values in components:

```css
/* custom-spacing.css */

/* Button spacing overrides */
.lb-button.small {
  padding: 0 1rem;  /* Override default padding */
}

.lb-button.medium {
  padding: 0 1.5rem;
}

.lb-button.large {
  padding: 0 2rem;
}

/* Input spacing overrides */
.lb-input {
  padding: 0.75rem 1rem;  /* Override compiled values */
}

/* Form field spacing */
.lb-form-field {
  gap: 0.75rem;  /* Override gap between label and input */
}
```

### Method 2: Build-Time SASS Override

For complete control over spacing, override SASS variables before compilation:

```scss
// custom-spacing.sass
// Define your custom spacing scale
$space-1: 0.25rem   // 4px
$space-2: 0.5rem    // 8px
$space-3: 0.75rem   // 12px
$space-4: 1rem      // 16px
$space-5: 1.25rem   // 20px
$space-6: 1.5rem    // 24px
$space-7: 1.75rem   // 28px
$space-8: 2rem      // 32px

// Import UI kit after overrides
@use 'littlebrand-ui-kit/src/styles/main' as lb
```

### Method 3: Create a Custom Scale System

```css
/* custom-scale-system.css */
:root {
  /* Base unit */
  --space-unit: 0.25rem; /* 4px */
  
  /* Generate scale using calc() */
  --space-1: calc(var(--space-unit) * 1);    /* 4px */
  --space-2: calc(var(--space-unit) * 2);    /* 8px */
  --space-3: calc(var(--space-unit) * 3);    /* 12px */
  --space-4: calc(var(--space-unit) * 4);    /* 16px */
  --space-5: calc(var(--space-unit) * 5);    /* 20px */
  --space-6: calc(var(--space-unit) * 6);    /* 24px */
  --space-8: calc(var(--space-unit) * 8);    /* 32px */
  --space-10: calc(var(--space-unit) * 10);  /* 40px */
  --space-12: calc(var(--space-unit) * 12);  /* 48px */
  --space-16: calc(var(--space-unit) * 16);  /* 64px */
  --space-20: calc(var(--space-unit) * 20);  /* 80px */
  --space-24: calc(var(--space-unit) * 24);  /* 96px */
}
```

### Method 3: T-Shirt Size System

```css
/* tshirt-spacing.css */
:root {
  /* T-shirt sizes for easier mental model */
  --space-3xs: 0.125rem;  /* 2px */
  --space-2xs: 0.25rem;   /* 4px */
  --space-xs: 0.5rem;     /* 8px */
  --space-sm: 0.75rem;    /* 12px */
  --space-md: 1rem;       /* 16px */
  --space-lg: 1.5rem;     /* 24px */
  --space-xl: 2rem;       /* 32px */
  --space-2xl: 3rem;      /* 48px */
  --space-3xl: 4rem;      /* 64px */
  --space-4xl: 6rem;      /* 96px */
  --space-5xl: 8rem;      /* 128px */
  
  /* Map to numbered system for compatibility */
  --space-1: var(--space-3xs);
  --space-2: var(--space-2xs);
  --space-4: var(--space-xs);
  --space-5: var(--space-sm);
  --space-7: var(--space-md);
  --space-10: var(--space-lg);
  --space-11: var(--space-xl);
  --space-13: var(--space-2xl);
}
```

## Component Size Customization

### Button Sizes

```css
/* custom-button-sizes.css */
:root {
  /* Button heights */
  --btn-height-small: 2rem;      /* 32px - default: 2rem */
  --btn-height-medium: 2.5rem;   /* 40px - default: 2.5rem */
  --btn-height-large: 3.5rem;    /* 56px - default: 3rem */
  
  /* Button padding */
  --btn-padding-small: 0 0.75rem;
  --btn-padding-medium: 0 1.25rem;
  --btn-padding-large: 0 2rem;
}

/* Apply custom sizes */
.lb-button.small {
  height: var(--btn-height-small);
  padding: var(--btn-padding-small);
}

.lb-button.medium {
  height: var(--btn-height-medium);
  padding: var(--btn-padding-medium);
}

.lb-button.large {
  height: var(--btn-height-large);
  padding: var(--btn-padding-large);
}
```

### Input and Form Field Sizes

```css
/* custom-input-sizes.css */
:root {
  /* Input heights */
  --input-height-small: 2rem;
  --input-height-medium: 2.5rem;
  --input-height-large: 3rem;
  
  /* Input padding */
  --input-padding-y: 0.5rem;
  --input-padding-x: 0.75rem;
  
  /* Textarea specific */
  --textarea-min-height: 5rem;
  --textarea-padding: 0.75rem;
}

/* Apply to inputs */
.lb-input {
  height: var(--input-height-medium);
  padding: var(--input-padding-y) var(--input-padding-x);
}

.lb-input.small {
  height: var(--input-height-small);
  font-size: 0.875rem;
}

.lb-input.large {
  height: var(--input-height-large);
  font-size: 1.125rem;
}

/* Textarea sizing */
.lb-textarea {
  min-height: var(--textarea-min-height);
  padding: var(--textarea-padding);
}
```

### Icon Sizes

```css
/* custom-icon-sizes.css */
:root {
  /* Icon dimensions */
  --icon-size-xs: 0.75rem;   /* 12px */
  --icon-size-sm: 1rem;      /* 16px */
  --icon-size-md: 1.25rem;   /* 20px */
  --icon-size-lg: 1.5rem;    /* 24px */
  --icon-size-xl: 2rem;      /* 32px */
  --icon-size-2xl: 2.5rem;   /* 40px */
  --icon-size-3xl: 3rem;     /* 48px */
}

/* Apply to button icons */
.lb-button.small svg {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
}

.lb-button.medium svg {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
}

.lb-button.large svg {
  width: var(--icon-size-lg);
  height: var(--icon-size-lg);
}
```

## Border Radius System

**Important Note**: Border radius values are compiled from SASS variables, not exposed as CSS custom properties.

### Method 1: Direct CSS Overrides (Runtime)

```css
/* custom-radius.css */

/* Override component border radius */
.lb-button {
  border-radius: 0.75rem;  /* Override compiled value */
}

.lb-button.small {
  border-radius: 0.5rem;
}

.lb-button.large {
  border-radius: 1rem;
}

.lb-input,
.lb-select,
.lb-textarea {
  border-radius: 0.375rem;
}

.lb-dialog {
  border-radius: 1rem;
}

/* Create pill-shaped buttons */
.lb-button.pill {
  border-radius: 9999px;
}
```

### Method 2: Build-Time SASS Override

```scss
// custom-radius.sass
// Override radius values before compilation
$radius-xs: 0.125rem   // 2px
$radius-sm: 0.25rem    // 4px  
$radius-md: 0.5rem     // 8px
$radius-lg: 0.75rem    // 12px
$radius-xl: 1rem       // 16px
$radius-2xl: 1.5rem    // 24px
$radius-full: 9999px   // Pill

// Import UI kit
@use 'littlebrand-ui-kit/src/styles/main' as lb
```

### Theme-Based Radius

```css
/* radius-themes.css */

/* Sharp/Modern theme */
[data-radius="sharp"] {
  --radius-xs: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.375rem;
  --radius-xl: 0.5rem;
}

/* Rounded/Soft theme */
[data-radius="rounded"] {
  --radius-xs: 0.25rem;
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}

/* Pill/Playful theme */
[data-radius="pill"] {
  --radius-xs: 0.5rem;
  --radius-sm: 0.75rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --radius-xl: 9999px;
}
```

## Shadow System

### Customizing Shadows

```css
/* custom-shadows.css */
:root {
  /* Subtle shadows */
  --shadow-xs: 0 1px 2px hsla(0, 0%, 0%, 0.04);
  --shadow-sm: 0 2px 4px hsla(0, 0%, 0%, 0.06);
  --shadow-md: 0 4px 8px hsla(0, 0%, 0%, 0.08);
  --shadow-lg: 0 8px 16px hsla(0, 0%, 0%, 0.10);
  --shadow-xl: 0 16px 32px hsla(0, 0%, 0%, 0.12);
  
  /* Colored shadows */
  --shadow-primary: 0 4px 16px hsla(24, 100%, 50%, 0.2);
  --shadow-error: 0 4px 16px hsla(0, 100%, 50%, 0.2);
  
  /* Inset shadows */
  --shadow-inner: inset 0 2px 4px hsla(0, 0%, 0%, 0.06);
}

/* Apply shadows */
.lb-button:hover {
  box-shadow: var(--shadow-sm);
}

.lb-dialog {
  box-shadow: var(--shadow-xl);
}

.lb-input:focus {
  box-shadow: 0 0 0 3px var(--color-primary-a3);
}
```

### Material Design Shadows

```css
/* material-shadows.css */
:root {
  /* Material Design elevation */
  --shadow-elevation-1: 0 2px 1px -1px rgba(0,0,0,0.2),
                        0 1px 1px 0 rgba(0,0,0,0.14),
                        0 1px 3px 0 rgba(0,0,0,0.12);
  
  --shadow-elevation-2: 0 3px 1px -2px rgba(0,0,0,0.2),
                        0 2px 2px 0 rgba(0,0,0,0.14),
                        0 1px 5px 0 rgba(0,0,0,0.12);
  
  --shadow-elevation-3: 0 3px 3px -2px rgba(0,0,0,0.2),
                        0 3px 4px 0 rgba(0,0,0,0.14),
                        0 1px 8px 0 rgba(0,0,0,0.12);
  
  --shadow-elevation-4: 0 2px 4px -1px rgba(0,0,0,0.2),
                        0 4px 5px 0 rgba(0,0,0,0.14),
                        0 1px 10px 0 rgba(0,0,0,0.12);
}
```

## Layout & Gap Management

### CSS Grid Gap Customization

```css
/* custom-grid-gaps.css */
:root {
  /* Grid gap scale */
  --grid-gap-xs: 0.5rem;
  --grid-gap-sm: 0.75rem;
  --grid-gap-md: 1rem;
  --grid-gap-lg: 1.5rem;
  --grid-gap-xl: 2rem;
  --grid-gap-2xl: 3rem;
}

/* Apply to layouts */
.form-grid {
  display: grid;
  gap: var(--grid-gap-md);
}

.button-group {
  display: flex;
  gap: var(--grid-gap-sm);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--grid-gap-lg);
}
```

### Flexbox Gap Patterns

```css
/* flex-gap-patterns.css */
:root {
  /* Common gap patterns */
  --gap-inline: 0.5rem;      /* Horizontal gaps */
  --gap-stack: 0.75rem;      /* Vertical gaps */
  --gap-section: 2rem;       /* Between sections */
  --gap-component: 1rem;     /* Between components */
}

/* Utility classes */
.flex-inline {
  display: flex;
  gap: var(--gap-inline);
}

.flex-stack {
  display: flex;
  flex-direction: column;
  gap: var(--gap-stack);
}

.section-spacing > * + * {
  margin-top: var(--gap-section);
}
```

## Complete Examples

### Example 1: Compact Design System

```css
/* compact-spacing.css */
:root {
  /* Tighter spacing scale */
  --space-1: 0.0625rem;  /* 1px */
  --space-2: 0.125rem;   /* 2px */
  --space-3: 0.25rem;    /* 4px */
  --space-4: 0.375rem;   /* 6px */
  --space-5: 0.5rem;     /* 8px */
  --space-6: 0.625rem;   /* 10px */
  --space-7: 0.75rem;    /* 12px */
  --space-8: 1rem;       /* 16px */
  --space-9: 1.25rem;    /* 20px */
  --space-10: 1.5rem;    /* 24px */
  
  /* Smaller components */
  --btn-height-small: 1.75rem;
  --btn-height-medium: 2.25rem;
  --btn-height-large: 2.75rem;
  
  /* Tighter radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.375rem;
  
  /* Subtle shadows */
  --shadow-sm: 0 1px 2px hsla(0, 0%, 0%, 0.02);
  --shadow-md: 0 2px 4px hsla(0, 0%, 0%, 0.04);
}
```

### Example 2: Spacious Design System

```css
/* spacious-system.css */
:root {
  /* Generous spacing */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.5rem;     /* 24px */
  --space-6: 2rem;       /* 32px */
  --space-7: 2.5rem;     /* 40px */
  --space-8: 3rem;       /* 48px */
  --space-9: 4rem;       /* 64px */
  --space-10: 5rem;      /* 80px */
  
  /* Larger components */
  --btn-height-small: 2.5rem;
  --btn-height-medium: 3rem;
  --btn-height-large: 3.75rem;
  
  /* Rounded corners */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  
  /* Prominent shadows */
  --shadow-sm: 0 2px 8px hsla(0, 0%, 0%, 0.08);
  --shadow-md: 0 4px 16px hsla(0, 0%, 0%, 0.12);
  --shadow-lg: 0 8px 32px hsla(0, 0%, 0%, 0.16);
}
```

### Example 3: Adaptive Spacing

```css
/* adaptive-spacing.css */
:root {
  /* Base spacing unit that scales with viewport */
  --space-unit: clamp(0.25rem, 1vw, 0.5rem);
  
  /* Scale based on unit */
  --space-1: calc(var(--space-unit) * 0.5);
  --space-2: var(--space-unit);
  --space-3: calc(var(--space-unit) * 1.5);
  --space-4: calc(var(--space-unit) * 2);
  --space-5: calc(var(--space-unit) * 3);
  --space-6: calc(var(--space-unit) * 4);
  --space-7: calc(var(--space-unit) * 5);
  --space-8: calc(var(--space-unit) * 6);
  
  /* Responsive component sizes */
  --btn-height-medium: clamp(2.25rem, 5vw, 2.75rem);
  --input-padding-x: clamp(0.75rem, 2vw, 1.25rem);
}

/* Different spacing for different breakpoints */
@media (max-width: 768px) {
  :root {
    --space-unit: 0.25rem;
  }
}

@media (min-width: 1440px) {
  :root {
    --space-unit: 0.5rem;
  }
}
```

### Example 4: Custom Component Spacing

```css
/* component-spacing-overrides.css */

/* Button customization */
.lb-button {
  /* Custom padding based on size */
  &.small {
    padding: 0.375rem 0.875rem;
    gap: 0.375rem;
  }
  
  &.medium {
    padding: 0.625rem 1.375rem;
    gap: 0.5rem;
  }
  
  &.large {
    padding: 0.875rem 2rem;
    gap: 0.75rem;
  }
}

/* Form field spacing */
.lb-form-field {
  /* Space between label and input */
  gap: 0.625rem;
  
  /* Space after field */
  margin-bottom: 1.875rem;
}

/* Dialog spacing */
.lb-dialog {
  /* Header padding */
  &__header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  /* Content padding */
  &__content {
    padding: 0 1.5rem 1.5rem;
  }
  
  /* Footer padding */
  &__footer {
    padding: 1rem 1.5rem 1.5rem;
    gap: 0.75rem;
  }
}
```

## Best Practices

1. **Consistency**: Use a consistent scale throughout your application
2. **Responsive**: Consider how spacing scales on different devices
3. **Accessibility**: Ensure touch targets meet minimum size requirements (44x44px)
4. **Performance**: Use CSS custom properties for dynamic spacing
5. **Documentation**: Document your spacing scale for team consistency

## Debugging Tips

```css
/* spacing-debug.css */
/* Visualize spacing in development */
.debug-spacing * {
  outline: 1px solid rgba(255, 0, 0, 0.2);
}

.debug-spacing [class*="lb-"] {
  position: relative;
}

.debug-spacing [class*="lb-"]::before {
  content: attr(class);
  position: absolute;
  top: 0;
  left: 0;
  font-size: 10px;
  background: rgba(255, 0, 0, 0.1);
  padding: 2px 4px;
  pointer-events: none;
}
```