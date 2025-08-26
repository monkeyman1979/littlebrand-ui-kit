# LittleBrand UI Kit - Typography Customization Guide

## Overview

The LittleBrand UI Kit uses CSS custom properties (CSS variables) for all typography settings, making it easy to customize fonts, weights, sizes, and other typographic properties globally without modifying the core library files.

## Typography CSS Variables

### Core Font Variables

The UI kit provides these main typography variables that you can override:

```css
:root {
  /* Font Families */
  --lb-font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  --lb-font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  --lb-font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  
  /* Unified Font Weights (NEW - v0.2.4+) */
  --lb-font-weight-heading: 600;  /* Controls ALL heading weights (h1-h6) */
  --lb-font-weight-body: 400;     /* Controls paragraph/body text weight */
  --lb-font-weight-label: 500;    /* Controls form labels and UI text weight */
  
  /* Full Font Weight Scale */
  --lb-font-weight-thin: 100;
  --lb-font-weight-extralight: 200;
  --lb-font-weight-light: 300;
  --lb-font-weight-regular: 400;
  --lb-font-weight-medium: 500;
  --lb-font-weight-semibold: 600;
  --lb-font-weight-bold: 700;
  --lb-font-weight-extrabold: 800;
  --lb-font-weight-black: 900;
}
```

### Additional Typography Variables

```css
:root {
  /* Line Heights */
  --lb-line-height-tight: 1.1;
  --lb-line-height-compact: 1.25;
  --lb-line-height-normal: 1.5;
  --lb-line-height-relaxed: 1.75;
  
  /* Font Sizes - Body Text */
  --lb-font-size-body-small: 0.875rem;   /* 14px */
  --lb-font-size-body-base: 1rem;        /* 16px */
  --lb-font-size-body-large: 1.125rem;   /* 18px */
  
  /* Font Sizes - Labels/UI Text */
  --lb-font-size-label-xsmall: 0.625rem; /* 10px */
  --lb-font-size-label-small: 0.75rem;   /* 12px */
  --lb-font-size-label-base: 0.875rem;   /* 14px */
  --lb-font-size-label-large: 1rem;      /* 16px */
  
  /* Letter Spacing */
  --lb-letter-spacing-tighter: -0.025em;
  --lb-letter-spacing-tight: -0.01em;
  --lb-letter-spacing-normal: normal;
  --lb-letter-spacing-wide: 0.025em;
}
```

## Best Practices for Customization

### 1. Create an Override File

Create a dedicated file for your LittleBrand customizations (e.g., `_littlebrand-overrides.sass`):

```sass
// _littlebrand-overrides.sass
// This file should be imported AFTER the LittleBrand UI Kit styles

// Load your custom fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')

// Override the CSS variables
:root
  --lb-font-heading: 'Inter', sans-serif
  --lb-font-body: 'Inter', sans-serif
  --lb-font-weight-heading: 700  // Makes ALL headings bold
  --lb-font-weight-body: 400
  --lb-font-weight-label: 500
```

### 2. Import Order Matters

Always import your overrides AFTER the LittleBrand UI Kit:

```sass
// main.sass
@import 'littlebrand-ui-kit/style'
@import 'littlebrand-overrides'  // Must come AFTER
```

### 3. Use :root for Global Overrides

Always use `:root` selector for global typography overrides to ensure proper specificity:

```sass
:root
  --lb-font-heading: 'Your Font', fallback-font
```

## Font Loading Methods

### Method 1: Google Fonts via @import

```sass
// Simple and quick
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap')

:root
  --lb-font-heading: 'Poppins', sans-serif
  --lb-font-body: 'Poppins', sans-serif
```

### Method 2: Self-Hosted Fonts

```sass
// For better performance and control
@font-face
  font-family: 'CustomFont'
  src: url('/assets/fonts/CustomFont.woff2') format('woff2')
  font-weight: 400
  font-display: swap

@font-face
  font-family: 'CustomFont'
  src: url('/assets/fonts/CustomFont-Bold.woff2') format('woff2')
  font-weight: 700
  font-display: swap

:root
  --lb-font-heading: 'CustomFont', sans-serif
  --lb-font-body: 'CustomFont', sans-serif
```

### Method 3: Variable Fonts

```sass
// For maximum flexibility with file size efficiency
@font-face
  font-family: 'VariableFont'
  src: url('/assets/fonts/VariableFont.woff2') format('woff2-variations')
  font-weight: 100 900  // Variable weight range
  font-display: swap

:root
  --lb-font-heading: 'VariableFont', sans-serif
  --lb-font-body: 'VariableFont', sans-serif
  --lb-font-weight-heading: 650  // Any value in the range
  --lb-font-weight-body: 380
```

## Complete Example

Here's a complete example of a typical override file:

```sass
// _littlebrand-overrides.sass
// Custom typography and theme overrides for LittleBrand UI Kit

// ============================================
// FONT LOADING
// ============================================

// Option A: Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap')
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap')

// Option B: Local Variable Font (commented out)
// @font-face
//   font-family: 'BrandFont'
//   src: url('/fonts/BrandFont-Variable.woff2') format('woff2-variations')
//   font-weight: 300 900
//   font-display: swap

// ============================================
// CSS VARIABLE OVERRIDES
// ============================================

:root
  // Font families
  --lb-font-heading: 'Space Grotesk', system-ui, sans-serif
  --lb-font-body: 'Inter', system-ui, sans-serif
  --lb-font-mono: 'JetBrains Mono', monospace
  
  // Unified font weights (simplest approach)
  --lb-font-weight-heading: 700  // All headings will be bold
  --lb-font-weight-body: 400     // All body text will be regular
  --lb-font-weight-label: 500    // All labels will be medium
  
  // Optional: Adjust specific heading sizes if needed
  // Note: The UI kit already has responsive clamp() values
  // --lb-display-1: 4rem
  // --lb-display-2: 3rem
  
  // Optional: Adjust line heights for your font
  --lb-line-height-compact: 1.2  // Tighter for Space Grotesk
  
  // Brand colors (bonus - while we're customizing)
  --lb-font-heading: 'Space Grotesk', sans-serif
  --lb-primary-9: #6B46C1  // Your brand purple
```

## Common Scenarios

### Scenario 1: Simple Font Change

Just want to change the font family? This is all you need:

```sass
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap')

:root
  --lb-font-heading: 'Raleway', sans-serif
  --lb-font-body: 'Raleway', sans-serif
```

### Scenario 2: Different Fonts for Headings and Body

```sass
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400;500&display=swap')

:root
  --lb-font-heading: 'Playfair Display', serif
  --lb-font-body: 'Source Sans Pro', sans-serif
  --lb-font-weight-heading: 700
  --lb-font-weight-body: 400
```

### Scenario 3: Making All Headings Lighter

```sass
:root
  --lb-font-weight-heading: 400  // Changes h1-h6 to regular weight
```

### Scenario 4: Component-Level Override

For specific sections only:

```sass
.marketing-section
  --lb-font-heading: 'Impact', sans-serif
  --lb-font-weight-heading: 900
```

## What NOT to Do

### ❌ Don't use Sass variables for runtime customization

```sass
// DON'T DO THIS
$my-font: 'Helvetica'
h1
  font-family: $my-font  // This won't cascade to components
```

### ❌ Don't override individual heading styles

```sass
// DON'T DO THIS - Unnecessary and breaks the system
h1, h2, h3, h4, h5, h6
  font-family: 'MyFont'  // Use --lb-font-heading instead
```

### ❌ Don't create intermediate Sass variables

```sass
// DON'T DO THIS - Unnecessarily complex
$font-heading: 'MyFont'
:root
  --lb-font-heading: #{$font-heading}  // Just set it directly
```

### ✅ DO THIS Instead

```sass
// Simple, clean, direct
:root
  --lb-font-heading: 'MyFont', sans-serif
```

## Troubleshooting

### Q: My font changes aren't applying
**A:** Check that:
1. Your override file is imported AFTER the LittleBrand styles
2. You're using `:root` selector
3. The font is actually loaded (check Network tab in DevTools)

### Q: The font weight looks wrong
**A:** Make sure you're loading all necessary font weights:
- Heading weight: typically 600 or 700
- Body weight: typically 400
- Label weight: typically 500

### Q: Can I use system fonts?
**A:** Yes! Use system font stacks:
```sass
:root
  --lb-font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Q: How do I know what variables are available?
**A:** All typography variables are defined in:
- `/src/styles/_theme.sass` (lines 338-374 for light mode, 648-684 for dark mode)
- They all start with `--lb-font-` or `--lb-line-height-` or `--lb-letter-spacing-`

## Summary

The LittleBrand UI Kit makes typography customization simple:

1. **All typography is controlled by CSS variables** defined in `:root`
2. **Three main weight variables** control all text: `--lb-font-weight-heading`, `--lb-font-weight-body`, `--lb-font-weight-label`
3. **Override in one place** - create a single override file imported after the UI kit
4. **No need to touch component files** - the system cascades everywhere

This approach gives you complete control while maintaining the simplicity and consistency of the design system.