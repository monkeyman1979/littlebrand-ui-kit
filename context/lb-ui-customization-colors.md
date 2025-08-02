# LittleBrand UI Kit - Color System Customization Guide

This guide explains how to customize the color system in the LittleBrand UI Kit, including brand colors, utility colors, and theme variations.

## Table of Contents
1. [Understanding the Color System](#understanding-the-color-system)
2. [Customizing Primary & Secondary Colors](#customizing-primary--secondary-colors)
3. [Customizing Utility Colors](#customizing-utility-colors)
4. [Dark Mode Customization](#dark-mode-customization)
5. [Creating Custom Color Themes](#creating-custom-color-themes)
6. [Complete Examples](#complete-examples)

## Understanding the Color System

The UI kit uses a sophisticated color system based on Radix UI's approach:

- **12-step scales**: Each color has 12 shades (1-12) for nuanced design
- **Semantic naming**: Colors are named by purpose (primary, secondary, error, etc.)
- **Alpha variants**: Transparent versions for overlays and subtle backgrounds
- **Dark mode**: Complete dark theme with adjusted color scales
- **CSS Custom Properties**: All colors are exposed as CSS variables

### Color Scale Structure

Each color follows this pattern:
- Steps 1-2: Backgrounds
- Steps 3-5: Interactive component backgrounds
- Steps 6-8: Borders and separators
- Steps 9-10: Solid colors (primary use)
- Steps 11-12: Text colors

## Customizing Primary & Secondary Colors

### Method 1: Simple Color Override

For basic customization, override the main color values:

```css
/* custom-colors.css */
:root {
  /* Primary Color (Default: Orange) */
  --color-primary: #6366f1;        /* Indigo */
  --color-primary-hover: #4f46e5;
  --color-primary-active: #4338ca;
  --color-primary-subtle: #e0e7ff;
  --color-primary-text: white;
  
  /* Secondary Color (Default: Teal) */
  --color-secondary: #ec4899;      /* Pink */
  --color-secondary-hover: #db2777;
  --color-secondary-active: #be185d;
  --color-secondary-subtle: #fce7f3;
  --color-secondary-text: white;
}

/* Dark mode overrides */
[data-theme="dark"] {
  --color-primary: #818cf8;
  --color-primary-hover: #6366f1;
  --color-primary-active: #4f46e5;
  --color-primary-subtle: #312e81;
  
  --color-secondary: #f472b6;
  --color-secondary-hover: #ec4899;
  --color-secondary-active: #db2777;
  --color-secondary-subtle: #831843;
}
```

### Method 2: Full 12-Step Scale Override

For complete control, override the entire color scale:

```css
/* custom-color-scales.css */
:root {
  /* Custom Blue Primary Scale */
  --color-primary-1: hsl(214, 100%, 99%);
  --color-primary-2: hsl(214, 100%, 97%);
  --color-primary-3: hsl(214, 100%, 94%);
  --color-primary-4: hsl(214, 100%, 90%);
  --color-primary-5: hsl(214, 100%, 84%);
  --color-primary-6: hsl(214, 100%, 76%);
  --color-primary-7: hsl(214, 100%, 65%);
  --color-primary-8: hsl(214, 100%, 52%);
  --color-primary-9: hsl(214, 100%, 45%);
  --color-primary-10: hsl(214, 100%, 40%);
  --color-primary-11: hsl(214, 100%, 30%);
  --color-primary-12: hsl(214, 100%, 15%);
  
  /* Map to semantic variables */
  --color-primary: var(--color-primary-9);
  --color-primary-hover: var(--color-primary-10);
  --color-primary-active: var(--color-primary-11);
  --color-primary-subtle: var(--color-primary-4);
  
  /* Interactive states */
  --color-primary-3: var(--color-primary-3);
  --color-primary-4: var(--color-primary-4);
  --color-primary-5: var(--color-primary-5);
}
```

### Method 3: Using Radix Colors

Install and use Radix Colors for professional color scales:

```bash
npm install @radix-ui/colors
```

```css
/* Using Radix Colors */
@import '@radix-ui/colors/violet.css';
@import '@radix-ui/colors/violet-dark.css';

:root {
  /* Map Radix colors to UI kit variables */
  --color-primary: var(--violet9);
  --color-primary-hover: var(--violet10);
  --color-primary-active: var(--violet11);
  --color-primary-subtle: var(--violet4);
  --color-primary-3: var(--violet3);
  --color-primary-4: var(--violet4);
  --color-primary-5: var(--violet5);
}

[data-theme="dark"] {
  --color-primary: var(--violet9);
  --color-primary-hover: var(--violet10);
  --color-primary-active: var(--violet11);
  --color-primary-subtle: var(--violet4);
}
```

## Customizing Utility Colors

### Error, Success, Warning, and Info Colors

```css
/* custom-utility-colors.css */
:root {
  /* Error (Red) */
  --color-error: #dc2626;
  --color-error-hover: #b91c1c;
  --color-error-background: #fee2e2;
  --color-error-border: #f87171;
  --color-error-text: #7f1d1d;
  
  /* Success (Green) */
  --color-success: #16a34a;
  --color-success-hover: #15803d;
  --color-success-background: #dcfce7;
  --color-success-border: #86efac;
  --color-success-text: #14532d;
  
  /* Warning (Amber/Yellow) */
  --color-warning: #f59e0b;
  --color-warning-hover: #d97706;
  --color-warning-background: #fef3c7;
  --color-warning-border: #fcd34d;
  --color-warning-text: #451a03;
  --color-warning-contrast-text: #451a03; /* For yellow backgrounds */
  
  /* Info (Blue) */
  --color-info: #3b82f6;
  --color-info-hover: #2563eb;
  --color-info-background: #dbeafe;
  --color-info-border: #93c5fd;
  --color-info-text: #1e3a8a;
}
```

### Neutral Colors (Grays)

```css
/* custom-neutral-colors.css */
:root {
  /* Background hierarchy */
  --color-background: #fafafa;
  --color-surface: #ffffff;
  --color-surface-raised: #ffffff;
  --color-surface-overlay: rgba(0, 0, 0, 0.05);
  
  /* Border hierarchy */
  --color-border: #e5e5e5;
  --color-border-subtle: #f5f5f5;
  --color-border-strong: #d4d4d4;
  
  /* Text hierarchy */
  --color-text: #171717;
  --color-text-secondary: #525252;
  --color-text-tertiary: #737373;
  --color-text-disabled: #a3a3a3;
}
```

## Dark Mode Customization

### Method 1: Override Dark Theme Variables

```css
/* custom-dark-theme.css */
[data-theme="dark"] {
  /* Custom dark backgrounds */
  --color-background: #0a0a0a;
  --color-surface: #171717;
  --color-surface-raised: #262626;
  --color-surface-overlay: rgba(255, 255, 255, 0.05);
  
  /* Adjusted text colors for better contrast */
  --color-text: #fafafa;
  --color-text-secondary: #e5e5e5;
  --color-text-tertiary: #a3a3a3;
  
  /* Brighter primary for dark mode */
  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;
  --color-primary-active: #2563eb;
}
```

### Method 2: Create Alternative Dark Themes

```css
/* dark-theme-variants.css */

/* High Contrast Dark */
[data-theme="dark-high-contrast"] {
  --color-background: #000000;
  --color-surface: #0a0a0a;
  --color-text: #ffffff;
  --color-border: #404040;
  --color-primary: #60a5fa;
  --color-error: #f87171;
}

/* Midnight Blue Dark */
[data-theme="dark-midnight"] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-surface-raised: #334155;
  --color-text: #f1f5f9;
  --color-primary: #38bdf8;
  --color-secondary: #a78bfa;
}

/* Warm Dark */
[data-theme="dark-warm"] {
  --color-background: #1a1612;
  --color-surface: #27241f;
  --color-text: #faf8f5;
  --color-primary: #fb923c;
  --color-secondary: #fbbf24;
}
```

Apply themes with JavaScript:

```javascript
// theme-switcher.js
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('preferred-theme') || 'light';
setTheme(savedTheme);
```

## Creating Custom Color Themes

### Theme 1: Corporate Blue

```css
/* theme-corporate.css */
:root {
  /* Primary: Professional Blue */
  --color-primary: #0051a3;
  --color-primary-hover: #003d7a;
  --color-primary-active: #002952;
  --color-primary-subtle: #e6f0fa;
  
  /* Secondary: Complementary Gray */
  --color-secondary: #64748b;
  --color-secondary-hover: #475569;
  --color-secondary-active: #334155;
  --color-secondary-subtle: #f1f5f9;
  
  /* Muted utility colors */
  --color-error: #b91c1c;
  --color-success: #15803d;
  --color-warning: #a16207;
  --color-info: #0369a1;
}
```

### Theme 2: Vibrant Startup

```css
/* theme-startup.css */
:root {
  /* Primary: Electric Purple */
  --color-primary: #7c3aed;
  --color-primary-hover: #6d28d9;
  --color-primary-active: #5b21b6;
  --color-primary-subtle: #f3e8ff;
  
  /* Secondary: Lime Green */
  --color-secondary: #84cc16;
  --color-secondary-hover: #65a30d;
  --color-secondary-active: #4d7c0f;
  --color-secondary-subtle: #f7fee7;
  
  /* Bright utility colors */
  --color-error: #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}
```

### Theme 3: Minimalist Mono

```css
/* theme-minimal.css */
:root {
  /* Primary: Pure Black */
  --color-primary: #000000;
  --color-primary-hover: #171717;
  --color-primary-active: #262626;
  --color-primary-subtle: #f5f5f5;
  --color-primary-text: white;
  
  /* Secondary: Also Black (monochrome) */
  --color-secondary: #000000;
  --color-secondary-hover: #171717;
  --color-secondary-active: #262626;
  --color-secondary-subtle: #f5f5f5;
  --color-secondary-text: white;
  
  /* Grayscale utility colors */
  --color-error: #000000;
  --color-success: #000000;
  --color-warning: #000000;
  --color-info: #000000;
  
  /* Differentiate with backgrounds */
  --color-error-background: #fee2e2;
  --color-success-background: #dcfce7;
  --color-warning-background: #fef3c7;
  --color-info-background: #dbeafe;
}
```

## Complete Examples

### Example 1: Brand Color System

```css
/* brand-colors.css */
:root {
  /* Brand Colors */
  --brand-primary: #ff6b35;    /* Coral */
  --brand-secondary: #004e89;  /* Navy */
  --brand-accent: #ffd23f;     /* Yellow */
  
  /* Map to UI Kit */
  --color-primary: var(--brand-primary);
  --color-primary-hover: #ff5722;
  --color-primary-active: #e64a19;
  --color-primary-subtle: #ffe5db;
  
  --color-secondary: var(--brand-secondary);
  --color-secondary-hover: #003a6b;
  --color-secondary-active: #00264d;
  --color-secondary-subtle: #e3f2fd;
  
  /* Use accent for warnings */
  --color-warning: var(--brand-accent);
  --color-warning-hover: #ffcc00;
  --color-warning-text: #333333;
}
```

### Example 2: Seasonal Themes

```css
/* seasonal-themes.css */

/* Spring Theme */
[data-theme="spring"] {
  --color-primary: #10b981;      /* Emerald */
  --color-secondary: #ec4899;    /* Pink */
  --color-background: #f0fdf4;
  --color-surface: #ffffff;
}

/* Summer Theme */
[data-theme="summer"] {
  --color-primary: #f59e0b;      /* Amber */
  --color-secondary: #06b6d4;    /* Cyan */
  --color-background: #fffbeb;
  --color-surface: #ffffff;
}

/* Autumn Theme */
[data-theme="autumn"] {
  --color-primary: #dc2626;      /* Red */
  --color-secondary: #f97316;    /* Orange */
  --color-background: #fef2f2;
  --color-surface: #ffffff;
}

/* Winter Theme */
[data-theme="winter"] {
  --color-primary: #3b82f6;      /* Blue */
  --color-secondary: #6366f1;    /* Indigo */
  --color-background: #eff6ff;
  --color-surface: #ffffff;
}
```

### Example 3: Accessibility-Focused Colors

```css
/* accessible-colors.css */
:root {
  /* High contrast colors meeting WCAG AAA standards */
  --color-primary: #0046a6;      /* 7:1 contrast on white */
  --color-primary-hover: #003478;
  --color-primary-text: #ffffff;
  
  /* Error color with better visibility */
  --color-error: #c41230;        /* Darker red */
  --color-error-background: #fce4e9;
  
  /* Improved text contrast */
  --color-text: #000000;
  --color-text-secondary: #374151;  /* 7:1 contrast */
  --color-text-tertiary: #4b5563;   /* 4.5:1 contrast */
}

/* Focus indicators with high visibility */
:root {
  --color-focus-ring: #ff00ff;    /* High contrast purple */
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
}
```

## Color Functions & Utilities

### CSS Color Mix for Variations

```css
/* color-utilities.css */
:root {
  /* Base brand color */
  --brand-hue: 220;
  --brand-saturation: 90%;
  --brand-lightness: 50%;
  --brand-base: hsl(var(--brand-hue), var(--brand-saturation), var(--brand-lightness));
  
  /* Generate variations */
  --color-primary: var(--brand-base);
  --color-primary-hover: hsl(var(--brand-hue), var(--brand-saturation), 40%);
  --color-primary-active: hsl(var(--brand-hue), var(--brand-saturation), 30%);
  --color-primary-subtle: hsl(var(--brand-hue), 30%, 95%);
}

/* Modern browsers: color-mix() */
@supports (color: color-mix(in srgb, red 50%, blue)) {
  :root {
    --color-primary-hover: color-mix(in srgb, var(--color-primary) 80%, black);
    --color-primary-active: color-mix(in srgb, var(--color-primary) 60%, black);
    --color-primary-subtle: color-mix(in srgb, var(--color-primary) 10%, white);
  }
}
```

## Best Practices

1. **Contrast**: Always check color contrast ratios for accessibility (WCAG AA minimum)
2. **Consistency**: Use the same color for the same purpose throughout the app
3. **Testing**: Test colors in both light and dark modes
4. **Color Blindness**: Consider color blind users - don't rely on color alone
5. **Performance**: Use CSS custom properties for runtime theme switching

## Tools & Resources

- [Radix UI Colors](https://www.radix-ui.com/colors) - Professional color scales
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG compliance
- [Accessible Colors](https://accessible-colors.com/) - Generate accessible palettes
- [Color Box](https://colorbox.io/) - Create color systems
- [Leonardo](https://leonardocolor.io/) - Adobe's color contrast tool