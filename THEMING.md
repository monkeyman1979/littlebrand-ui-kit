# LittleBrand UI Kit - Theming & Color System

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Color System Architecture](#color-system-architecture)
- [Token Structure](#token-structure)
- [Usage Methods](#usage-methods)
- [Configuration Options](#configuration-options)
- [Advanced Examples](#advanced-examples)
- [Color Scale Generation](#color-scale-generation)
- [Luminance & Contrast](#luminance--contrast)
- [Dark Mode](#dark-mode)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)
- [API Reference](#api-reference)

## Overview

The LittleBrand UI Kit features a sophisticated yet flexible theming system that supports:
- 🎨 **Traditional themes** with pre-defined colors
- 🔧 **Custom themes** with dynamic color generation
- 🌗 **Automatic dark mode** generation
- 📊 **12-step color scales** following RadixUI patterns
- 💡 **Intelligent contrast** calculation for text readability
- 🎯 **Semantic tokens** for consistent component styling

## Quick Start

### Using the Default Theme
```javascript
// In your main.js
import { createApp } from 'vue'
import App from './App.vue'
import { LittleBrandUI } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

const app = createApp(App)
app.use(LittleBrandUI)
app.mount('#app')

// That's it! You get orange primary, teal secondary, etc.
```

### Using a Custom Theme
```javascript
// In your main.js
import { createApp } from 'vue'
import App from './App.vue'
import { LittleBrandUI, applyTheme } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// Apply your custom colors - generates 68+ tokens automatically!
applyTheme({
  primary: '#FF6B6B',    // Your brand red
  secondary: '#4ECDC4'   // Your brand teal
})

const app = createApp(App)
app.use(LittleBrandUI)
app.mount('#app')
```

## Color System Architecture

### File Structure
```
src/styles/
├── _colors.sass           # OKLCH color definitions
├── _theme.sass            # Theme system using colors  
├── _base.sass             # Core spacing, sizing, layout variables
├── _typography.sass       # Typography using CSS custom properties
├── _component-variables.sass # Component-specific variables
├── _reset.sass            # CSS reset with stable values
├── index.sass             # Main entry point
└── main.sass             # Alternative entry point

src/utils/
├── oklch-utils.js         # OKLCH conversion and manipulation utilities
└── color-generator.js     # Main color generation API
```

### How the System Works

1. **`_colors.sass`** - Contains OKLCH color scales for all semantic colors
2. **`_theme.sass`** - Outputs CSS custom properties from color scales
3. **`color-generator.js`** - Provides runtime theming with `applyTheme()` function
4. **`oklch-utils.js`** - Core OKLCH color space utilities for generation

## Token Structure

The system generates four categories of semantic tokens:

### Border Tokens
Used for outlines, dividers, and borders
```css
--lb-border-[color]-line      /* Subtle lines */
--lb-border-[color]-normal    /* Default borders */
--lb-border-[color]-active    /* Active/pressed states */
--lb-border-[color]-focus     /* Focus rings */
--lb-border-[color]-disabled  /* Disabled states */
```

### Fill Tokens
Used for solid backgrounds (buttons, badges)
```css
--lb-fill-[color]-normal      /* Default fill */
--lb-fill-[color]-hover       /* Hover state */
--lb-fill-[color]-active      /* Active/pressed */
--lb-fill-[color]-focus       /* Focus state */
--lb-fill-[color]-disabled    /* Disabled state */
```

### Text Tokens
Used for text colors
```css
--lb-text-[color]-normal         /* Default text */
--lb-text-[color]-contrast-low   /* Subtle text */
--lb-text-[color]-contrast-high  /* High contrast text */
--lb-text-[color]-disabled       /* Disabled text */
--lb-text-on-[color]            /* Text on filled backgrounds */
```

### Surface Tokens
Used for subtle backgrounds (cards, tonal buttons)
```css
--lb-surface-[color]-normal   /* Default surface */
--lb-surface-[color]-hover    /* Hover state */
--lb-surface-[color]-active   /* Active state */
--lb-surface-[color]-subtle   /* Very subtle tint */
--lb-surface-[color]-raised   /* Elevated surface */
```

## Usage Methods

### Method 1: Default Theme

No configuration needed. Uses predefined OKLCH colors:
- Primary: Orange
- Secondary: Teal  
- Tertiary: Blue
- Success: Green
- Warning: Yellow
- Error: Red
- Info: Blue
- Neutral: Gray

```javascript
import 'littlebrand-ui-kit/style.css'
// That's it! Default theme is applied automatically
```

### Method 2: Runtime Theme with JavaScript

Provide single colors, and the system generates 12-step OKLCH scales automatically:

```javascript
import { applyTheme } from 'littlebrand-ui-kit'

applyTheme({
  primary: '#FF6B6B',      // Your brand red
  secondary: '#4ECDC4',    // Your brand teal
  success: '#51CF66',      // Custom success green
  warning: '#FFD43B',      // Custom warning yellow
  error: '#FF6B6B',        // Custom error red
  neutral: '#868E96'       // Custom neutral gray
})
```

### Method 3: Saturation Curves

Control the mood of your colors with different curves:

```javascript
import { applyTheme } from 'littlebrand-ui-kit'

// Natural curve (default) - balanced saturation
applyTheme({ primary: '#FF6B6B' }, 'natural')

// Vivid curve - more saturated, bold colors
applyTheme({ primary: '#FF6B6B' }, 'vivid')

// Muted curve - less saturated, subtle colors
applyTheme({ primary: '#FF6B6B' }, 'muted')
```

### Method 4: CSS Variable Overrides

For fine-grained control, override specific CSS variables:

```css
:root {
  /* Override specific tokens */
  --lb-fill-primary-normal: oklch(0.65 0.15 30);
  --lb-border-primary-normal: oklch(0.65 0.15 30);
  
  /* Or use hex colors that convert to OKLCH automatically */
  --lb-text-primary-normal: #ff6b6b;
  
  /* Background customization */
  --lb-background-page: oklch(0.98 0.005 30);
  --lb-background-surface: oklch(0.96 0.01 30);
}

/* Dark mode specific overrides */
[data-theme="dark"], .dark {
  --lb-fill-primary-normal: oklch(0.75 0.12 30);
  --lb-background-page: oklch(0.08 0.005 30);
}
```

### Method 5: Runtime Theme Changes

Change themes dynamically during runtime:

```javascript
// Theme switcher function
function applyBrandTheme(themeName) {
  const themes = {
    corporate: {
      primary: '#0066cc',
      secondary: '#6b7280',
      neutral: '#94a3b8'
    },
    playful: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      neutral: '#6b7280'
    },
    nature: {
      primary: '#059669',
      secondary: '#d97706',
      neutral: '#78716c'
    }
  }
  
  applyTheme(themes[themeName], 'natural')
}

// Usage
applyBrandTheme('corporate')
```

## Configuration Options

### Color Input Types

1. **Hex Color**: `'#FF6B6B'`
2. **RGB/HSL**: `rgb(255, 107, 107)` or `hsl(0, 100%, 71%)`
3. **Preset Name**: `'orange'`, `'teal'`, `'slate'`, etc.
4. **Full Scale Map**: 12-step scale definition
5. **Config Object**: Advanced configuration with curve

### Advanced Configuration Object

```sass
$theme-colors: (
  'primary': (
    'color': '#FF6B6B',
    'curve': 'vivid',        // 'natural', 'vivid', or 'muted'
    'overrides': (           // Override specific steps
      9: hsl(0, 100%, 65%),
      10: hsl(0, 100%, 60%)
    )
  )
)
```

### Adding Custom Semantic Colors

Beyond the standard semantic colors, add your own:

```sass
$theme-colors: (
  'primary': '#FF6B6B',
  'secondary': '#4ECDC4',
  // Custom semantic colors
  'brand': '#9333EA',
  'accent': '#F59E0B',
  'highlight': '#10B981'
)
```

These generate all token variations: `--lb-fill-brand-normal`, `--lb-text-accent-normal`, etc.

## Advanced Examples

### Example 1: Corporate Brand Theme

```sass
@use '@littlebrand/ui-kit/styles/theme' with (
  $use-custom-theme: true,
  $theme-colors: (
    'primary': '#003366',      // Corporate blue
    'secondary': '#66B2FF',    // Light blue
    'neutral': 'slate',        // Professional gray
    'success': '#00A86B',      // Corporate green
    'warning': '#FFA500',      // Safety orange
    'error': '#DC143C',        // Crimson
    'brand-gold': '#FFD700'    // Accent color
  )
)
```

### Example 2: Dark Theme Override

```sass
// For a custom dark theme, provide dark-specific colors
@use '@littlebrand/ui-kit/styles/theme' with (
  $use-custom-theme: true,
  $theme-colors: (
    'primary': (
      // Light mode scale
      1: hsl(24, 100%, 98%),
      // ... steps 2-12
    ),
    'primary-dark': (
      // Dark mode scale (optional override)
      1: hsl(24, 100%, 10%),
      // ... steps 2-12
    )
  )
)
```

### Example 3: Seasonal Themes

```sass
// Christmas Theme
$christmas-theme: (
  'primary': '#C41E3A',      // Christmas red
  'secondary': '#165B33',    // Christmas green
  'neutral': 'slate',
  'accent': '#FFD700'        // Gold
)

// Summer Theme
$summer-theme: (
  'primary': '#FF6B6B',      // Coral
  'secondary': '#4ECDC4',    // Turquoise
  'neutral': 'gray',
  'accent': '#FFE66D'        // Sunshine yellow
)

// Apply based on condition
@use '@littlebrand/ui-kit/styles/theme' with (
  $use-custom-theme: true,
  $theme-colors: $christmas-theme  // or $summer-theme
)
```

## Color Scale Generation

### How Scales Are Generated

When you provide a single color, the system generates a 12-step scale:

1. **Steps 1-3**: Very light tints (backgrounds)
2. **Steps 4-6**: Light shades (borders, dividers)
3. **Steps 7-9**: Core colors (main UI elements)
4. **Steps 10-12**: Dark shades (text, high contrast)

### Generation Algorithm

```sass
// Simplified version of the algorithm
@function generate-scale($color)
  $hue: color.hue($color)
  $base-saturation: color.saturation($color)
  $base-lightness: color.lightness($color)
  
  @for $i from 1 through 12
    @if $i <= 9
      // Lighter than base
      $lightness: 98% - (($i - 1) / 8 * (98% - $base-lightness))
    @else
      // Darker than base
      $lightness: $base-lightness - (($i - 9) / 3 * ($base-lightness - 15%))
```

### Curve Types

- **Natural**: Balanced saturation and lightness progression
- **Vivid**: Higher saturation, more vibrant colors
- **Muted**: Lower saturation, subtle colors

## Luminance & Contrast

### Automatic Text Color on Filled Backgrounds

The system automatically calculates whether to use light or dark text on filled backgrounds:

```sass
// How it works
@function get-luminance($color)
  // WCAG luminance calculation
  // Returns value between 0 (black) and 1 (white)

@function get-contrast-text($background)
  $luminance: get-luminance($background)
  @return if($luminance > 0.5, $dark-text, white)
```

### Text-On Tokens

These tokens are automatically generated:
- `--lb-text-on-primary`: Text color for primary filled backgrounds
- `--lb-text-on-primary-hover`: Text color for hovered primary fills
- Ensures WCAG AA compliance for contrast ratios

## Dark Mode

### Automatic Dark Mode Generation

The system automatically generates dark mode colors by:
1. Inverting the lightness scale (step 1 ↔ step 12)
2. Adjusting saturation for better contrast
3. Maintaining hue consistency

### Dark Mode Structure

```css
:root {
  /* Light mode tokens (OKLCH) */
  --lb-fill-primary-normal: oklch(0.679 0.200 41.4);
}

[data-theme="dark"], .dark {
  /* Dark mode tokens (automatically generated) */
  --lb-fill-primary-normal: oklch(0.545 0.180 41.4);
}
```

### Background Layering

The system provides three background layers:
- `--lb-background-page`: Main viewport background
- `--lb-background-surface`: Cards, panels (one level up)
- `--lb-background-overlay`: Modal backdrops

In light mode: Both page and surface are light
In dark mode: Progressive elevation through lighter shades

## Best Practices

### For Component Library Users

1. **Start Simple**: Use the default theme initially
2. **Brand Colors**: Switch to custom theme when needed
3. **Consistency**: Use semantic tokens, not raw colors
4. **Testing**: Test in both light and dark modes

### For Application Developers

1. **Semantic Usage**: Use tokens based on meaning, not appearance
   ```sass
   // Good
   color: var(--lb-text-primary-normal)
   
   // Bad
   color: #FF6B6B
   ```

2. **Component Variants**: Leverage the variant system
   ```vue
   <LbButton variant="filled" color="primary">
   ```

3. **Custom Colors**: Add brand-specific semantic colors
   ```sass
   $theme-colors: (
     'brand': '#9333EA',
     'accent': '#F59E0B'
   )
   ```

### For Theme Creators

1. **Test Contrast**: Ensure text remains readable
2. **Scale Balance**: Maintain visual hierarchy in scales
3. **Dark Mode**: Test both modes thoroughly
4. **Documentation**: Document custom color meanings

## Migration Guide

### From Traditional to Custom Theme

1. **Identify Current Colors**
   ```sass
   // Current: Using default orange/teal
   ```

2. **Create Configuration**
   ```sass
   $theme-colors: (
     'primary': '#FF8C42',    // Your orange
     'secondary': '#00BFA5'   // Your teal
   )
   ```

3. **Enable Custom Theme**
   ```sass
   @use '@littlebrand/ui-kit/styles/theme' with (
     $use-custom-theme: true,
     $theme-colors: $theme-colors
   )
   ```

4. **Test Components**: Verify all components render correctly

### From Hardcoded Colors to Tokens

```sass
// Before
.my-button
  background: #FF6B6B
  color: white

// After
.my-button
  background: var(--lb-fill-primary-normal)
  color: var(--lb-text-on-primary)
```

## API Reference

### SASS Functions

#### `generate-scale($color, $curve: 'natural')`
Generates a 12-step color scale from a single color.

#### `get-luminance($color)`
Calculates the relative luminance of a color (0-1).

#### `get-contrast-text($background)`
Returns appropriate text color (white or dark) for a background.

#### `process-color-config($config)`
Processes various color input types into a scale.

#### `generate-semantic-tokens($name, $scale)`
Generates all token variations for a color scale.

### SASS Mixins

#### `@include apply-theme($config)`
Applies a theme configuration and outputs CSS tokens.

#### `@include apply-dark-theme($config)`
Generates and applies dark mode tokens.

### Configuration Variables

#### `$use-custom-theme`
Boolean flag to enable custom theming (default: `false`).

#### `$theme-colors`
Map of color configurations for custom themes.

#### `$preset-scales`
Built-in color scales available as presets.

---

## Support

For issues, questions, or contributions related to theming:
- GitHub Issues: [littlebrand-ui-kit/issues](https://github.com/yourusername/littlebrand-ui-kit/issues)
- Documentation: [littlebrand-ui-kit.dev/theming](https://littlebrand-ui-kit.dev/theming)

## License

MIT License - See LICENSE file for details.