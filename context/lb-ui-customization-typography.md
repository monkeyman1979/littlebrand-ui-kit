# LittleBrand UI Kit - Typography Customization Guide

This guide explains how to customize typography in the LittleBrand UI Kit, including fonts, sizes, line heights, and other typographic properties.

## Table of Contents
1. [Understanding the Typography System](#understanding-the-typography-system)
2. [Changing Font Families](#changing-font-families)
3. [Customizing Font Sizes](#customizing-font-sizes)
4. [Adjusting Line Heights & Letter Spacing](#adjusting-line-heights--letter-spacing)
5. [Responsive Typography](#responsive-typography)
6. [Complete Examples](#complete-examples)

## Understanding the Typography System

The UI kit uses SASS variables for typography, which are compiled into CSS. The main typography variables are defined in `src/styles/_typography.sass`:

- **Font Stacks**: `$font-heading`, `$font-body`, `$font-mono`
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: 1.25 (compact), 1.5 (normal), 1.75 (relaxed)
- **Label Sizes**: 0.75rem (small), 0.875rem (base), 1rem (large)

## Changing Font Families

### Method 1: Direct CSS Override (Runtime)

Since font families are compiled from SASS variables, you need to override the CSS directly:

```css
/* custom-typography.css */

/* Override heading fonts */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
}

/* Override body text */
body, p, .label {
  font-family: 'Inter', sans-serif;
}

/* Override monospace fonts */
code, pre {
  font-family: 'JetBrains Mono', monospace;
}

/* Override specific components */
.lb-button {
  font-family: 'Inter', sans-serif;
}

.lb-input,
.lb-select,
.lb-textarea {
  font-family: 'Inter', sans-serif;
}
```

### Method 2: Google Fonts Integration

Add Google Fonts to your HTML:

```html
<!-- In your index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

Or import in your CSS:

```css
/* At the top of your custom CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
```

### Method 3: Build-Time SASS Override

For build-time customization, create a custom SASS file:

```scss
// custom-build.sass
// Override SASS variables before importing UI kit
$font-heading: 'Playfair Display', serif
$font-body: 'Inter', sans-serif  
$font-mono: 'JetBrains Mono', monospace

// Then import the UI kit styles
@use 'littlebrand-ui-kit/src/styles/main' as lb
```

This requires building your own version of the CSS.

### Method 4: Self-Hosted Fonts

```css
/* custom-fonts.css */
@font-face {
  font-family: 'Custom Sans';
  src: url('./fonts/CustomSans-Regular.woff2') format('woff2'),
       url('./fonts/CustomSans-Regular.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Custom Sans';
  src: url('./fonts/CustomSans-Bold.woff2') format('woff2'),
       url('./fonts/CustomSans-Bold.woff') format('woff');
  font-weight: 700;
  font-display: swap;
}

/* Apply the custom font */
:root {
  --font-body: 'Custom Sans', sans-serif;
}
```

## Customizing Font Sizes

### Override Heading Sizes

```css
/* custom-typography.css */
h1 {
  font-size: 3.5rem; /* Default uses clamp() for responsiveness */
}

h2 {
  font-size: 2.75rem;
}

h3 {
  font-size: 2.25rem;
}

/* For responsive sizing, use clamp() */
h1 {
  font-size: clamp(2.5rem, 4vw + 1rem, 4rem);
}
```

### Override Label Sizes

```css
/* Customize component text sizes */
:root {
  --label-size-small: 0.8125rem;  /* 13px instead of 12px */
  --label-size-base: 0.9375rem;   /* 15px instead of 14px */
  --label-size-large: 1.125rem;   /* 18px instead of 16px */
}

/* Apply to buttons */
.lb-button.small {
  font-size: var(--label-size-small);
}

.lb-button.medium {
  font-size: var(--label-size-base);
}

.lb-button.large {
  font-size: var(--label-size-large);
}
```

### Create a Custom Type Scale

```css
/* custom-type-scale.css */
:root {
  /* Base size */
  --text-base: 1rem;
  
  /* Scale ratio (1.25 = Major Third) */
  --text-scale-ratio: 1.25;
  
  /* Calculate sizes */
  --text-xs: calc(var(--text-base) / var(--text-scale-ratio));
  --text-sm: var(--text-base);
  --text-md: calc(var(--text-base) * var(--text-scale-ratio));
  --text-lg: calc(var(--text-md) * var(--text-scale-ratio));
  --text-xl: calc(var(--text-lg) * var(--text-scale-ratio));
  --text-2xl: calc(var(--text-xl) * var(--text-scale-ratio));
  --text-3xl: calc(var(--text-2xl) * var(--text-scale-ratio));
}

/* Apply the scale */
h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl); }
h4 { font-size: var(--text-lg); }
h5 { font-size: var(--text-md); }
h6 { font-size: var(--text-sm); }
p { font-size: var(--text-base); }
small { font-size: var(--text-xs); }
```

## Adjusting Line Heights & Letter Spacing

### Line Height Customization

```css
/* custom-line-heights.css */
:root {
  --line-height-tight: 1.2;
  --line-height-snug: 1.375;
  --line-height-normal: 1.6;
  --line-height-relaxed: 1.8;
  --line-height-loose: 2;
}

/* Apply to specific elements */
h1, h2, h3 {
  line-height: var(--line-height-tight);
}

p {
  line-height: var(--line-height-normal);
}

.body-large {
  line-height: var(--line-height-relaxed);
}
```

### Letter Spacing Adjustments

```css
/* custom-letter-spacing.css */
:root {
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
}

/* Apply to headings for tighter spacing */
h1, h2 {
  letter-spacing: var(--letter-spacing-tighter);
}

/* Apply to labels for wider spacing */
.label, button {
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase; /* Optional */
}
```

## Responsive Typography

### Fluid Typography with Custom Properties

```css
/* responsive-typography.css */
:root {
  /* Viewport widths for calculations */
  --viewport-min: 320; /* Mobile */
  --viewport-max: 1200; /* Desktop */
  
  /* Font size ranges */
  --font-min: 16; /* Minimum font size in px */
  --font-max: 20; /* Maximum font size in px */
}

/* Fluid base font size */
html {
  font-size: calc(
    (var(--font-min) * 1px) + 
    (var(--font-max) - var(--font-min)) * 
    ((100vw - (var(--viewport-min) * 1px)) / 
    (var(--viewport-max) - var(--viewport-min)))
  );
}

/* Clamp for better control */
html {
  font-size: clamp(16px, 2vw + 14px, 20px);
}
```

### Responsive Heading Sizes

```css
/* responsive-headings.css */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
}

h2 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
}

h3 {
  font-size: clamp(1.25rem, 3vw, 2rem);
  line-height: 1.3;
}

/* Responsive display sizes */
.display-1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.04em;
}

.display-2 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}
```

## Complete Examples

### Example 1: Modern Tech Style

```css
/* modern-tech-typography.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  --font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* Tighter, more modern spacing */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

p {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: -0.01em;
}

/* Adjust button text */
.lb-button {
  font-weight: 500;
  letter-spacing: -0.01em;
}
```

### Example 2: Editorial/Blog Style

```css
/* editorial-typography.css */
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Source+Sans+Pro:wght@400;600;700&display=swap');

:root {
  --font-heading: 'Merriweather', Georgia, serif;
  --font-body: 'Source Sans Pro', sans-serif;
}

/* Serif headings with generous spacing */
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 300;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

/* Comfortable reading experience */
p {
  font-family: var(--font-body);
  font-size: 1.125rem;
  line-height: 1.8;
  letter-spacing: 0;
}

/* Larger body text for articles */
.article-content p {
  font-size: 1.25rem;
  line-height: 1.9;
  max-width: 65ch; /* Optimal line length */
}
```

### Example 3: Playful/Creative Style

```css
/* playful-typography.css */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

:root {
  --font-heading: 'Fredoka', 'Comic Sans MS', cursive;
  --font-body: 'Nunito', sans-serif;
}

/* Rounded, friendly headings */
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

/* Slightly larger, friendlier body text */
p {
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.7;
  letter-spacing: 0.01em;
}

/* Playful button text */
.lb-button {
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: none;
}
```

## Best Practices

1. **Performance**: When using web fonts, always include font-display: swap
2. **Fallbacks**: Always provide system font fallbacks
3. **Variable Fonts**: Consider using variable fonts for more flexibility with smaller file sizes
4. **Accessibility**: Ensure sufficient line height (minimum 1.5 for body text)
5. **Testing**: Test your typography across different devices and screen sizes
6. **Loading**: Preconnect to font services and preload critical fonts

## Import Order

When customizing typography, ensure your custom CSS is loaded AFTER the UI kit's styles:

```html
<!-- In your HTML -->
<link rel="stylesheet" href="path/to/littlebrand-ui-kit/style.css">
<link rel="stylesheet" href="path/to/your-custom-typography.css">
```

Or in your main CSS/SASS file:

```css
/* main.css */
@import 'littlebrand-ui-kit/style.css';
@import './custom-typography.css';
```