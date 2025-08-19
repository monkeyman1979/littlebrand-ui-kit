# LittleBrand UI Kit - Customization Guide

This guide covers all customization options available in the LittleBrand UI Kit.

## Table of Contents
- [Color Customization](#color-customization)
- [Typography](#typography)
- [Spacing & Sizing](#spacing--sizing)
- [Border Radius](#border-radius)
- [Shadows](#shadows)
- [Component-Specific Overrides](#component-specific-overrides)
- [Dark Mode](#dark-mode)

## Color Customization

### Option 1: JavaScript Runtime (Recommended)

The easiest way - no build step required!

```javascript
import { applyTheme } from 'littlebrand-ui-kit'

// Basic usage - just provide hex colors
applyTheme({
  primary: '#8b5cf6',    // Purple
  secondary: '#f59e0b',  // Orange
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Amber
  error: '#ef4444',      // Red
  info: '#3b82f6',       // Blue
  neutral: '#6b7280'     // Gray
})
```

#### What Gets Generated

From each single color, the system generates:

```
Input: #8b5cf6 (one color)
Output: 68+ CSS variables

Light Mode (12 steps):
--lb-primary-1: #faf5ff    // Subtle backgrounds
--lb-primary-2: #f3e8ff    // Slightly darker background
--lb-primary-3: #e9d5ff    // UI element backgrounds
--lb-primary-4: #d8b4fe    // Hover states
--lb-primary-5: #c084fc    // Active states
--lb-primary-6: #a855f7    // Subtle borders
--lb-primary-7: #9333ea    // UI borders
--lb-primary-8: #7e22ce    // Focused borders
--lb-primary-9: #8b5cf6    // YOUR COLOR - buttons, links
--lb-primary-10: #7c3aed   // Hover buttons
--lb-primary-11: #6d28d9   // Low contrast text
--lb-primary-12: #581c87   // High contrast text

Dark Mode (12 steps):
Automatically generated with proper contrast

Alpha Scales (24 steps):
Transparent versions for overlays

Semantic Tokens (20+):
--lb-fill-primary-normal
--lb-fill-primary-hover
--lb-border-primary-normal
--lb-text-primary-normal
... and more
```

#### Saturation Curves

Control the mood of your colors:

```javascript
// Natural (default) - Balanced saturation
applyTheme({ primary: '#6366f1' }, 'natural')

// Vivid - More saturated, bold, energetic
applyTheme({ primary: '#6366f1' }, 'vivid')

// Muted - Less saturated, subtle, professional
applyTheme({ primary: '#6366f1' }, 'muted')
```

### Option 2: CSS Variable Overrides

For simple overrides without JavaScript:

```css
/* your-custom.css */
:root {
  /* Override specific color steps */
  --lb-primary-9: #yourBrandColor;
  --lb-primary-10: #yourHoverColor;
  
  /* Override semantic tokens */
  --lb-fill-primary-normal: #8b5cf6;
  --lb-fill-primary-hover: #7c3aed;
  --lb-border-primary-normal: #8b5cf6;
  --lb-text-primary-normal: #8b5cf6;
  
  /* Override for specific variants */
  --lb-fill-success-normal: #10b981;
  --lb-fill-error-normal: #ef4444;
}
```

### Option 3: SASS Build-Time

For advanced users who want build-time generation:

```sass
// custom-colors.sass
@use 'littlebrand-ui-kit/src/styles/color-generator' as gen

// Method A: Single colors
$brand-purple: #8b5cf6
$scale: gen.generate-scale($brand-purple)

// Method B: Multiple colors at once
$my-colors: (
  'primary': #8b5cf6,
  'secondary': #f59e0b
)

@each $name, $color in $my-colors
  $light-scale: gen.generate-scale($color)
  $dark-scale: gen.generate-dark-scale($light-scale)
  
  \:root
    @each $step, $value in $light-scale
      --lb-#{$name}-#{$step}: #{$value}
```

## Typography

### Font Family

```css
:root {
  /* Base font for all text */
  --lb-font-family-base: 'Inter', -apple-system, sans-serif;
  
  /* Monospace for code */
  --lb-font-family-mono: 'Monaco', 'Courier New', monospace;
  
  /* Display font for headings (optional) */
  --lb-font-family-display: 'Poppins', var(--lb-font-family-base);
}
```

### Font Sizes

```css
:root {
  /* Base sizes */
  --lb-font-size-xs: 11px;
  --lb-font-size-sm: 13px;
  --lb-font-size-base: 14px;  /* Default */
  --lb-font-size-md: 16px;
  --lb-font-size-lg: 18px;
  --lb-font-size-xl: 20px;
  --lb-font-size-2xl: 24px;
  --lb-font-size-3xl: 30px;
  
  /* Component-specific */
  --lb-button-font-size: var(--lb-font-size-sm);
  --lb-input-font-size: var(--lb-font-size-base);
  --lb-label-font-size: var(--lb-font-size-sm);
}
```

### Font Weights

```css
:root {
  --lb-font-weight-normal: 400;
  --lb-font-weight-medium: 500;
  --lb-font-weight-semibold: 600;
  --lb-font-weight-bold: 700;
}
```

### Line Heights

```css
:root {
  --lb-line-height-tight: 1.25;
  --lb-line-height-normal: 1.5;
  --lb-line-height-relaxed: 1.75;
}
```

## Spacing & Sizing

### Spacing Scale

> **Note:** Spacing variables are defined as CSS custom properties but components currently use fixed SASS values at build time. These variables are provided for future extensibility.

```css
:root {
  /* Base spacing scale (defined but not actively used by components) */
  --lb-space-1: 0.25rem;  /* 4px */
  --lb-space-2: 0.5rem;   /* 8px */
  --lb-space-3: 0.75rem;  /* 12px */
  --lb-space-4: 1rem;     /* 16px */
  --lb-space-5: 1.25rem;  /* 20px */
  --lb-space-6: 1.5rem;   /* 24px */
  --lb-space-8: 2rem;     /* 32px */
  --lb-space-10: 2.5rem;  /* 40px */
  --lb-space-12: 3rem;    /* 48px */
  --lb-space-16: 4rem;    /* 64px */
}
```

### Component Sizes

```css
:root {
  /* Input heights */
  --lb-input-height-sm: 32px;
  --lb-input-height-md: 40px;  /* Default */
  --lb-input-height-lg: 48px;
  
  /* Button heights */
  --lb-button-height-sm: 32px;
  --lb-button-height-md: 40px;
  --lb-button-height-lg: 48px;
  
  /* Icon sizes */
  --lb-icon-size-sm: 16px;
  --lb-icon-size-md: 20px;
  --lb-icon-size-lg: 24px;
}
```

## Border Radius

```css
:root {
  /* Base radius scale */
  --lb-radius-none: 0;
  --lb-radius-sm: 4px;
  --lb-radius-md: 8px;    /* Default */
  --lb-radius-lg: 12px;
  --lb-radius-xl: 16px;
  --lb-radius-2xl: 24px;
  --lb-radius-full: 9999px;
  
  /* Component-specific */
  --lb-button-radius: var(--lb-radius-md);
  --lb-input-radius: var(--lb-radius-md);
  --lb-card-radius: var(--lb-radius-lg);
  --lb-dialog-radius: var(--lb-radius-xl);
}
```

## Shadows

```css
:root {
  /* Shadow scale */
  --lb-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --lb-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
  --lb-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --lb-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --lb-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  --lb-shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  
  /* Component shadows */
  --lb-button-shadow: var(--lb-shadow-sm);
  --lb-card-shadow: var(--lb-shadow-md);
  --lb-dialog-shadow: var(--lb-shadow-xl);
  --lb-dropdown-shadow: var(--lb-shadow-lg);
}
```

## Component-Specific Overrides

### Buttons

```css
:root {
  /* Button specific */
  --lb-button-font-weight: var(--lb-font-weight-medium);
  --lb-button-text-transform: none; /* or 'uppercase' */
  --lb-button-letter-spacing: normal;
  --lb-button-transition: all 0.2s ease;
  
  /* Variant-specific */
  --lb-button-filled-bg: var(--lb-fill-primary-normal);
  --lb-button-filled-hover-bg: var(--lb-fill-primary-hover);
  --lb-button-outline-border-width: 1px;
  --lb-button-ghost-hover-bg: var(--lb-surface-primary-hover);
}
```

### Inputs

```css
:root {
  /* Input specific */
  --lb-input-border-width: 1px;
  --lb-input-bg: white;
  --lb-input-border: var(--lb-border-neutral-normal);
  --lb-input-focus-border: var(--lb-border-primary-focus);
  --lb-input-placeholder-color: var(--lb-text-neutral-disabled);
  
  /* States */
  --lb-input-disabled-bg: var(--lb-surface-neutral-disabled);
  --lb-input-invalid-border: var(--lb-border-error-normal);
}
```

### Dialogs

```css
:root {
  /* Dialog specific */
  --lb-dialog-bg: white;
  --lb-dialog-backdrop: rgba(0, 0, 0, 0.5);
  --lb-dialog-max-width: 500px;
  --lb-dialog-padding: var(--lb-space-6);
  --lb-dialog-animation-duration: 0.3s;
}
```

## Dark Mode

### Automatic Dark Mode

The color generator automatically creates dark mode colors. Just add the `dark` class:

```html
<!-- On body or root element -->
<body class="dark">
  <!-- All components now use dark mode -->
</body>

<!-- Or on specific sections -->
<div class="dark">
  <!-- Only this section uses dark mode -->
</div>
```

### Manual Dark Mode Overrides

```css
/* Light mode (default) */
:root {
  --lb-bg-base: white;
  --lb-text-base: #333;
}

/* Dark mode overrides */
.dark {
  --lb-bg-base: #111;
  --lb-text-base: #e0e0e0;
  
  /* Component overrides */
  --lb-input-bg: #1a1a1a;
  --lb-dialog-bg: #222;
  --lb-card-bg: #1a1a1a;
}
```

## Complete Example

Here's a complete custom theme:

```css
/* my-theme.css */
:root {
  /* Colors - using runtime generation is easier! */
  /* But you can override individual variables */
  --lb-fill-primary-normal: #5b6eea;
  
  /* Typography */
  --lb-font-family-base: 'Roboto', sans-serif;
  --lb-font-size-base: 15px;
  --lb-font-weight-normal: 400;
  --lb-font-weight-medium: 500;
  
  /* Note: Spacing variables exist but aren't actively used by components */
  
  /* Borders */
  --lb-radius-md: 10px;
  --lb-border-width: 1px;
  
  /* Shadows */
  --lb-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  /* Component specific */
  --lb-button-height-md: 42px;
  --lb-input-height-md: 42px;
}
```

Or use JavaScript for colors:

```javascript
import { applyTheme } from 'littlebrand-ui-kit'

// Apply your brand colors
applyTheme({
  primary: '#5b6eea',
  secondary: '#ff6b6b'
})

// The CSS above handles typography, spacing, etc.
```

## Tips

1. **Start with JavaScript color generation** - It's the easiest way
2. **Override only what you need** - The defaults are carefully chosen
3. **Use CSS variables for runtime changes** - No rebuild needed
4. **Use SASS for build-time optimization** - If you need maximum performance
5. **Test in both light and dark modes** - Ensure good contrast
6. **Keep accessibility in mind** - The generator handles WCAG compliance

## Need Help?

- Check the [examples](./examples/) folder for complete implementations
- See [README.md](./README.md) for quick start guide
- Open an issue on [GitHub](https://github.com/monkeyman1979/littlebrand-ui-kit) for support