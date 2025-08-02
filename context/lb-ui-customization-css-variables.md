# LittleBrand UI Kit - CSS Variable Override Methods Guide

This guide explains the various methods for overriding CSS variables in the LittleBrand UI Kit, including best practices for specificity, organization, and maintainability.

## Table of Contents
1. [Understanding CSS Variable Architecture](#understanding-css-variable-architecture)
2. [Basic Override Methods](#basic-override-methods)
3. [Advanced Override Techniques](#advanced-override-techniques)
4. [Import Order & Specificity](#import-order--specificity)
5. [Component-Scoped Overrides](#component-scoped-overrides)
6. [Theme Management](#theme-management)
7. [Performance Considerations](#performance-considerations)
8. [Complete Examples](#complete-examples)

## Understanding CSS Variable Architecture

The LittleBrand UI Kit exposes all customizable properties as CSS variables. These are defined at the `:root` level and scoped to specific themes using `[data-theme]` selectors.

### Variable Categories

1. **Color Variables**: `--color-*`
2. **Spacing Variables**: `--space-*`
3. **Typography Variables**: `--font-*`, `--text-*`
4. **Component Variables**: `--btn-*`, `--input-*`, etc.
5. **Layout Variables**: `--radius-*`, `--shadow-*`

## Basic Override Methods

### Method 1: External CSS File

Create a separate CSS file for overrides:

```css
/* littlebrand-overrides.css */
:root {
  /* Color overrides */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  
  /* Spacing overrides */
  --space-4: 0.75rem;
  --space-7: 1.25rem;
  
  /* Typography overrides */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```

Include after the UI kit styles:

```html
<!-- index.html -->
<link rel="stylesheet" href="node_modules/littlebrand-ui-kit/dist/style.css">
<link rel="stylesheet" href="css/littlebrand-overrides.css">
```

### Method 2: Inline Style Tag

For quick prototyping or small overrides:

```html
<!-- In your HTML head -->
<style>
  :root {
    --color-primary: #10b981;
    --color-secondary: #8b5cf6;
    --radius-md: 0.75rem;
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

### Method 3: CSS-in-JS

For Vue.js applications using CSS-in-JS:

```vue
<template>
  <div class="app">
    <!-- Your app content -->
  </div>
</template>

<style>
:root {
  --color-primary: #f59e0b;
  --color-primary-hover: #d97706;
}

/* Scoped to component */
.app {
  --space-component: 2rem;
  --radius-component: 1rem;
}
</style>
```

## Advanced Override Techniques

### Cascading Variable Overrides

Create cascading overrides that build on each other:

```css
/* base-overrides.css */
:root {
  /* Define base brand colors */
  --brand-hue: 220;
  --brand-saturation: 90%;
  
  /* Generate color scale */
  --color-primary: hsl(var(--brand-hue), var(--brand-saturation), 50%);
  --color-primary-hover: hsl(var(--brand-hue), var(--brand-saturation), 40%);
  --color-primary-active: hsl(var(--brand-hue), var(--brand-saturation), 30%);
  --color-primary-subtle: hsl(var(--brand-hue), 30%, 95%);
}

/* theme-overrides.css */
[data-theme="ocean"] {
  --brand-hue: 200;
  --brand-saturation: 85%;
}

[data-theme="sunset"] {
  --brand-hue: 20;
  --brand-saturation: 95%;
}
```

### Computed Variable Values

Use calc() and var() for dynamic relationships:

```css
/* dynamic-overrides.css */
:root {
  /* Base unit system */
  --base-size: 16px;
  --scale-ratio: 1.25;
  
  /* Computed font sizes */
  --text-xs: calc(var(--base-size) / var(--scale-ratio));
  --text-sm: var(--base-size);
  --text-md: calc(var(--base-size) * var(--scale-ratio));
  --text-lg: calc(var(--text-md) * var(--scale-ratio));
  
  /* Computed spacing */
  --space-unit: 0.25rem;
  --space-1: var(--space-unit);
  --space-2: calc(var(--space-unit) * 2);
  --space-3: calc(var(--space-unit) * 3);
  --space-4: calc(var(--space-unit) * 4);
}
```

### Media Query Overrides

Responsive variable overrides:

```css
/* responsive-overrides.css */
:root {
  /* Mobile first defaults */
  --container-width: 100%;
  --grid-columns: 1;
  --space-section: 2rem;
  --text-scale: 1;
}

@media (min-width: 640px) {
  :root {
    --container-width: 640px;
    --grid-columns: 2;
    --space-section: 3rem;
    --text-scale: 1.1;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-width: 1024px;
    --grid-columns: 3;
    --space-section: 4rem;
    --text-scale: 1.2;
  }
}
```

## Import Order & Specificity

### Correct Import Order

```css
/* main.css */

/* 1. UI Kit base styles */
@import 'littlebrand-ui-kit/dist/style.css';

/* 2. Your base overrides */
@import './overrides/base-overrides.css';

/* 3. Theme-specific overrides */
@import './overrides/theme-overrides.css';

/* 4. Component-specific overrides */
@import './overrides/component-overrides.css';

/* 5. Utility overrides (highest priority) */
@import './overrides/utility-overrides.css';
```

### Managing Specificity

```css
/* specificity-examples.css */

/* Low specificity - easily overridden */
:root {
  --color-primary: blue;
}

/* Medium specificity - theme-specific */
[data-theme="custom"] {
  --color-primary: green;
}

/* High specificity - component + theme */
[data-theme="custom"] .lb-button {
  --color-primary: red;
}

/* Highest specificity - ID selector (avoid if possible) */
#app {
  --color-primary: purple;
}

/* Using !important (last resort) */
:root {
  --color-primary: orange !important;
}
```

### CSS Layers for Organization

```css
/* Using @layer for predictable cascade */
@layer base, theme, components, utilities;

@layer base {
  :root {
    --color-primary: #3b82f6;
    --space-4: 1rem;
  }
}

@layer theme {
  [data-theme="dark"] {
    --color-primary: #60a5fa;
  }
}

@layer components {
  .lb-button {
    --button-padding: var(--space-4);
  }
}

@layer utilities {
  .custom-primary {
    --color-primary: #8b5cf6;
  }
}
```

## Component-Scoped Overrides

### Scoping Variables to Components

```css
/* component-scoped.css */

/* Global defaults */
:root {
  --button-radius: 0.375rem;
  --input-radius: 0.25rem;
  --card-radius: 0.5rem;
}

/* Component-specific overrides */
.lb-button {
  --radius: var(--button-radius);
  border-radius: var(--radius);
}

.lb-input {
  --radius: var(--input-radius);
  border-radius: var(--radius);
}

/* Contextual overrides */
.form-modern .lb-input {
  --input-radius: 0;
}

.cta-section .lb-button {
  --button-radius: 9999px; /* Pill shape */
}
```

### Component Modifier Classes

```css
/* component-modifiers.css */

/* Size modifiers with scoped variables */
.lb-button.size-compact {
  --btn-height: 2rem;
  --btn-padding-x: 0.75rem;
  --btn-font-size: 0.875rem;
}

.lb-button.size-comfortable {
  --btn-height: 2.75rem;
  --btn-padding-x: 1.5rem;
  --btn-font-size: 1rem;
}

.lb-button.size-spacious {
  --btn-height: 3.5rem;
  --btn-padding-x: 2rem;
  --btn-font-size: 1.125rem;
}

/* Apply the variables */
.lb-button {
  height: var(--btn-height, 2.5rem);
  padding: 0 var(--btn-padding-x, 1rem);
  font-size: var(--btn-font-size, 0.875rem);
}
```

### Nested Component Overrides

```css
/* nested-overrides.css */

/* Card component with nested elements */
.custom-card {
  --card-padding: 1.5rem;
  --card-gap: 1rem;
  --card-radius: 0.75rem;
  --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  
  /* Nested button inherits card context */
  .lb-button {
    --color-primary: var(--card-accent-color, var(--color-primary));
    --radius-md: calc(var(--card-radius) * 0.5);
  }
  
  /* Nested input styling */
  .lb-input {
    --input-background: var(--card-input-bg, transparent);
    --input-border: var(--card-input-border, var(--color-border));
  }
}
```

## Theme Management

### Creating Theme Classes

```css
/* theme-classes.css */

/* Light theme (default) */
.theme-light {
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-text: #171717;
  --color-primary: #f97316;
  --color-secondary: #0891b2;
}

/* Dark theme */
.theme-dark {
  --color-background: #0a0a0a;
  --color-surface: #171717;
  --color-text: #fafafa;
  --color-primary: #fb923c;
  --color-secondary: #22d3ee;
}

/* Brand themes */
.theme-brand-a {
  --color-primary: #dc2626;
  --color-secondary: #16a34a;
  --font-heading: 'Montserrat', sans-serif;
  --radius-md: 0.25rem;
  --shadow-md: 0 2px 4px rgba(220, 38, 38, 0.1);
}

.theme-brand-b {
  --color-primary: #7c3aed;
  --color-secondary: #f59e0b;
  --font-heading: 'Poppins', sans-serif;
  --radius-md: 1rem;
  --shadow-md: 0 4px 12px rgba(124, 58, 237, 0.15);
}
```

### Dynamic Theme Switching

```javascript
// theme-switcher.js
class ThemeManager {
  constructor() {
    this.root = document.documentElement;
    this.themes = ['light', 'dark', 'brand-a', 'brand-b'];
    this.currentTheme = this.loadTheme() || 'light';
    this.applyTheme(this.currentTheme);
  }
  
  applyTheme(theme) {
    // Remove all theme classes
    this.themes.forEach(t => this.root.classList.remove(`theme-${t}`));
    
    // Apply new theme
    this.root.classList.add(`theme-${theme}`);
    this.root.setAttribute('data-theme', theme);
    
    // Save preference
    this.saveTheme(theme);
    this.currentTheme = theme;
  }
  
  loadTheme() {
    return localStorage.getItem('preferred-theme');
  }
  
  saveTheme(theme) {
    localStorage.setItem('preferred-theme', theme);
  }
  
  toggle() {
    const currentIndex = this.themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.applyTheme(this.themes[nextIndex]);
  }
}

// Initialize
const themeManager = new ThemeManager();
```

### CSS Variable Validation

```javascript
// validate-variables.js
function validateCSSVariables() {
  const computedStyle = getComputedStyle(document.documentElement);
  const requiredVariables = [
    '--color-primary',
    '--color-secondary',
    '--color-text',
    '--color-background'
  ];
  
  const missing = [];
  
  requiredVariables.forEach(variable => {
    const value = computedStyle.getPropertyValue(variable);
    if (!value || value.trim() === '') {
      missing.push(variable);
    }
  });
  
  if (missing.length > 0) {
    console.warn('Missing CSS variables:', missing);
  }
  
  return missing.length === 0;
}
```

## Performance Considerations

### Minimize Repaints

```css
/* performance-optimized.css */

/* Group related variable changes */
.theme-switch {
  /* All color changes at once */
  --color-primary: #new-color;
  --color-secondary: #new-color;
  --color-background: #new-color;
  --color-text: #new-color;
  
  /* Trigger single repaint */
  will-change: color, background-color;
}

/* Avoid frequent variable updates */
.animated-element {
  /* Bad: Causes repaints */
  /* --dynamic-color: hsl(var(--hue), 50%, 50%); */
  
  /* Good: Use CSS animations instead */
  animation: color-shift 3s infinite;
}

@keyframes color-shift {
  0% { color: var(--color-primary); }
  50% { color: var(--color-secondary); }
  100% { color: var(--color-primary); }
}
```

### Variable Fallbacks

```css
/* fallback-patterns.css */

/* Always provide fallbacks */
.lb-button {
  /* With fallback values */
  background-color: var(--color-primary, #f97316);
  color: var(--color-primary-text, white);
  border-radius: var(--radius-md, 0.5rem);
  
  /* Nested fallbacks */
  padding: var(--btn-padding, var(--space-4, 1rem));
  
  /* Complex fallback */
  box-shadow: var(
    --btn-shadow,
    var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))
  );
}
```

### Lazy Loading Themes

```javascript
// lazy-theme-loader.js
async function loadTheme(themeName) {
  try {
    // Dynamically import theme CSS
    await import(`./themes/${themeName}.css`);
    
    // Apply theme class
    document.documentElement.className = `theme-${themeName}`;
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('themeloaded', {
      detail: { theme: themeName }
    }));
  } catch (error) {
    console.error(`Failed to load theme: ${themeName}`, error);
  }
}
```

## Complete Examples

### Example 1: Complete Override Setup

```css
/* complete-override-setup.css */

/* 1. Reset some defaults */
:root {
  /* Clear default transitions for instant theme switching */
  --transition: none;
}

/* 2. Define your design tokens */
:root {
  /* Brand colors */
  --brand-primary: #1a56db;
  --brand-secondary: #10b981;
  --brand-accent: #f59e0b;
  
  /* Neutral scale */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Typography scale */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Merriweather', Georgia, serif;
  --font-mono: 'Fira Code', monospace;
  
  /* Spacing scale */
  --space-0: 0;
  --space-px: 1px;
  --space-0_5: 0.125rem;
  --space-1: 0.25rem;
  --space-1_5: 0.375rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
}

/* 3. Map to LittleBrand variables */
:root {
  /* Colors */
  --color-primary: var(--brand-primary);
  --color-primary-hover: color-mix(in srgb, var(--brand-primary) 90%, black);
  --color-secondary: var(--brand-secondary);
  --color-secondary-hover: color-mix(in srgb, var(--brand-secondary) 90%, black);
  
  /* Typography */
  --font-heading: var(--font-serif);
  --font-body: var(--font-sans);
  
  /* Surfaces */
  --color-background: var(--gray-50);
  --color-surface: white;
  --color-border: var(--gray-200);
  
  /* Text */
  --color-text: var(--gray-900);
  --color-text-secondary: var(--gray-600);
}

/* 4. Dark theme overrides */
[data-theme="dark"] {
  --color-background: var(--gray-900);
  --color-surface: var(--gray-800);
  --color-border: var(--gray-700);
  --color-text: var(--gray-50);
  --color-text-secondary: var(--gray-400);
  
  /* Adjusted brand colors for dark mode */
  --color-primary: color-mix(in srgb, var(--brand-primary) 80%, white);
  --color-secondary: color-mix(in srgb, var(--brand-secondary) 80%, white);
}

/* 5. Component-specific overrides */
.lb-button {
  --btn-font-weight: 500;
  --btn-letter-spacing: 0.025em;
  --btn-transition: all 200ms ease;
}

.lb-input {
  --input-background: var(--color-surface);
  --input-border-width: 2px;
  --input-focus-ring: 0 0 0 3px var(--color-primary-a3);
}
```

### Example 2: Multi-Brand Setup

```css
/* multi-brand.css */

/* Brand A Configuration */
[data-brand="brand-a"] {
  /* Colors */
  --brand-primary-hue: 350;
  --brand-secondary-hue: 200;
  
  /* Derived colors */
  --color-primary: hsl(var(--brand-primary-hue), 80%, 50%);
  --color-secondary: hsl(var(--brand-secondary-hue), 70%, 50%);
  
  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
  
  /* Personality */
  --radius-base: 0.25rem;
  --shadow-color: hsla(var(--brand-primary-hue), 60%, 40%, 0.1);
}

/* Brand B Configuration */
[data-brand="brand-b"] {
  /* Colors */
  --brand-primary-hue: 260;
  --brand-secondary-hue: 40;
  
  /* Derived colors */
  --color-primary: hsl(var(--brand-primary-hue), 70%, 60%);
  --color-secondary: hsl(var(--brand-secondary-hue), 90%, 60%);
  
  /* Typography */
  --font-heading: 'Fredoka', cursive;
  --font-body: 'Nunito', sans-serif;
  
  /* Personality */
  --radius-base: 1rem;
  --shadow-color: hsla(var(--brand-primary-hue), 50%, 50%, 0.15);
}

/* Apply brand-specific component styles */
[data-brand] .lb-button {
  --radius-md: var(--radius-base);
  box-shadow: 0 2px 8px var(--shadow-color);
}
```

## Best Practices

1. **Organization**: Group related variables together
2. **Naming**: Use consistent, semantic naming conventions
3. **Documentation**: Comment complex calculations or relationships
4. **Testing**: Test overrides across different browsers
5. **Performance**: Minimize the number of custom properties
6. **Fallbacks**: Always provide fallback values
7. **Validation**: Verify variables are applied correctly
8. **Maintainability**: Use CSS layers or clear import order

## Debugging CSS Variables

```javascript
// debug-css-vars.js
function debugCSSVariables(element = document.documentElement) {
  const computed = getComputedStyle(element);
  const variables = {};
  
  // Get all CSS properties
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    if (prop.startsWith('--')) {
      variables[prop] = computed.getPropertyValue(prop);
    }
  }
  
  console.table(variables);
  return variables;
}

// Debug specific component
debugCSSVariables(document.querySelector('.lb-button'));
```