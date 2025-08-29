# LittleBrand UI Kit - CSS Variables Reference

Complete reference of all CSS custom properties available for customization in the LittleBrand UI Kit.

## Quick Navigation

- [Color Tokens](#color-tokens)
  - [Border Tokens](#border-tokens)
  - [Fill Tokens](#fill-tokens)
  - [Text Tokens](#text-tokens)
  - [Surface Tokens](#surface-tokens)
  - [Text-On Tokens](#text-on-tokens)
- [Typography Tokens](#typography-tokens)
- [Spacing & Sizing](#spacing--sizing)
- [Background & Special](#background--special)

## Color Tokens

The color system supports 8 semantic color variants:
- **primary** - Main brand color
- **secondary** - Secondary brand color  
- **tertiary** - Third brand color
- **neutral** - Grays and neutrals
- **success** - Green/positive states
- **warning** - Yellow/caution states
- **error** - Red/negative states
- **info** - Blue/informational states

Each color variant has multiple token types (border, fill, text, surface) with different states (normal, hover, active, focus, disabled).

### Border Tokens

Border colors for outlines, dividers, and stroke styles.

```css
/* Primary Borders */
--lb-border-primary-line        /* Subtle line */
--lb-border-primary-normal      /* Default border */
--lb-border-primary-active      /* Active state */
--lb-border-primary-focus       /* Focus state */
--lb-border-primary-disabled    /* Disabled state */

/* Secondary Borders */
--lb-border-secondary-line
--lb-border-secondary-normal
--lb-border-secondary-active
--lb-border-secondary-focus
--lb-border-secondary-disabled

/* Tertiary Borders */
--lb-border-tertiary-line
--lb-border-tertiary-normal
--lb-border-tertiary-active
--lb-border-tertiary-focus
--lb-border-tertiary-disabled

/* Neutral Borders */
--lb-border-neutral-line
--lb-border-neutral-normal
--lb-border-neutral-active
--lb-border-neutral-focus
--lb-border-neutral-disabled

/* Success Borders */
--lb-border-success-line
--lb-border-success-normal
--lb-border-success-active
--lb-border-success-focus
--lb-border-success-disabled

/* Warning Borders */
--lb-border-warning-line
--lb-border-warning-normal
--lb-border-warning-active
--lb-border-warning-focus
--lb-border-warning-disabled

/* Error Borders */
--lb-border-error-line
--lb-border-error-normal
--lb-border-error-active
--lb-border-error-focus
--lb-border-error-disabled

/* Info Borders */
--lb-border-info-line
--lb-border-info-normal
--lb-border-info-active
--lb-border-info-focus
--lb-border-info-disabled
```

### Fill Tokens

Background fill colors for buttons, badges, and interactive elements.

```css
/* Primary Fills */
--lb-fill-primary-normal      /* Default fill */
--lb-fill-primary-hover       /* Hover state */
--lb-fill-primary-active      /* Active/pressed state */
--lb-fill-primary-focus       /* Focus state */
--lb-fill-primary-disabled    /* Disabled state */

/* Secondary Fills */
--lb-fill-secondary-normal
--lb-fill-secondary-hover
--lb-fill-secondary-active
--lb-fill-secondary-focus
--lb-fill-secondary-disabled

/* Tertiary Fills */
--lb-fill-tertiary-normal
--lb-fill-tertiary-hover
--lb-fill-tertiary-active
--lb-fill-tertiary-focus
--lb-fill-tertiary-disabled

/* Neutral Fills */
--lb-fill-neutral-normal
--lb-fill-neutral-hover
--lb-fill-neutral-active
--lb-fill-neutral-focus
--lb-fill-neutral-disabled

/* Success Fills */
--lb-fill-success-normal
--lb-fill-success-hover
--lb-fill-success-active
--lb-fill-success-focus
--lb-fill-success-disabled

/* Warning Fills */
--lb-fill-warning-normal
--lb-fill-warning-hover
--lb-fill-warning-active
--lb-fill-warning-focus
--lb-fill-warning-disabled

/* Error Fills */
--lb-fill-error-normal
--lb-fill-error-hover
--lb-fill-error-active
--lb-fill-error-focus
--lb-fill-error-disabled

/* Info Fills */
--lb-fill-info-normal
--lb-fill-info-hover
--lb-fill-info-active
--lb-fill-info-focus
--lb-fill-info-disabled
```

### Text Tokens

Text colors with different contrast levels for accessibility.

```css
/* Primary Text */
--lb-text-primary-normal           /* Default text color */
--lb-text-primary-contrast-high    /* High contrast */
--lb-text-primary-contrast-low     /* Low contrast */
--lb-text-primary-disabled         /* Disabled state */

/* Secondary Text */
--lb-text-secondary-normal
--lb-text-secondary-contrast-high
--lb-text-secondary-contrast-low
--lb-text-secondary-disabled

/* Tertiary Text */
--lb-text-tertiary-normal
--lb-text-tertiary-contrast-high
--lb-text-tertiary-contrast-low
--lb-text-tertiary-disabled

/* Neutral Text */
--lb-text-neutral-normal
--lb-text-neutral-contrast-high
--lb-text-neutral-contrast-low
--lb-text-neutral-disabled

/* Success Text */
--lb-text-success-normal
--lb-text-success-contrast-high
--lb-text-success-contrast-low
--lb-text-success-disabled

/* Warning Text */
--lb-text-warning-normal
--lb-text-warning-contrast-high
--lb-text-warning-contrast-low
--lb-text-warning-disabled

/* Error Text */
--lb-text-error-normal
--lb-text-error-contrast-high
--lb-text-error-contrast-low
--lb-text-error-disabled

/* Info Text */
--lb-text-info-normal
--lb-text-info-contrast-high
--lb-text-info-contrast-low
--lb-text-info-disabled

/* Stable Text Colors (non-flipping, v0.3.5+) */
--lb-text-light-normal         /* Always light text */
--lb-text-light-contrast-low   /* Always light, lower contrast */
--lb-text-dark-normal          /* Always dark text */
--lb-text-dark-contrast-low    /* Always dark, lower contrast */
```

### Surface Tokens

Background colors for cards, panels, and container surfaces.

```css
/* Primary Surfaces */
--lb-surface-primary-normal    /* Default surface */
--lb-surface-primary-hover     /* Hover state */
--lb-surface-primary-active    /* Active state */
--lb-surface-primary-subtle    /* Subtle background */
--lb-surface-primary-raised    /* Elevated surface */

/* Secondary Surfaces */
--lb-surface-secondary-normal
--lb-surface-secondary-hover
--lb-surface-secondary-active
--lb-surface-secondary-subtle
--lb-surface-secondary-raised

/* Tertiary Surfaces */
--lb-surface-tertiary-normal
--lb-surface-tertiary-hover
--lb-surface-tertiary-active
--lb-surface-tertiary-subtle
--lb-surface-tertiary-raised

/* Neutral Surfaces */
--lb-surface-neutral-normal
--lb-surface-neutral-hover
--lb-surface-neutral-active
--lb-surface-neutral-subtle
--lb-surface-neutral-raised
--lb-surface-neutral-disabled

/* Success Surfaces */
--lb-surface-success-normal
--lb-surface-success-hover
--lb-surface-success-active
--lb-surface-success-subtle
--lb-surface-success-raised

/* Warning Surfaces */
--lb-surface-warning-normal
--lb-surface-warning-hover
--lb-surface-warning-active
--lb-surface-warning-subtle
--lb-surface-warning-raised

/* Error Surfaces */
--lb-surface-error-normal
--lb-surface-error-hover
--lb-surface-error-active
--lb-surface-error-subtle
--lb-surface-error-raised

/* Info Surfaces */
--lb-surface-info-normal
--lb-surface-info-hover
--lb-surface-info-active
--lb-surface-info-subtle
--lb-surface-info-raised
```

### Text-On Tokens

Text colors for use on filled backgrounds (ensures proper contrast).

```css
/* Text on Primary backgrounds */
--lb-text-on-primary
--lb-text-on-primary-hover
--lb-text-on-primary-active

/* Text on Secondary backgrounds */
--lb-text-on-secondary
--lb-text-on-secondary-hover
--lb-text-on-secondary-active

/* Text on Tertiary backgrounds */
--lb-text-on-tertiary
--lb-text-on-tertiary-hover
--lb-text-on-tertiary-active

/* Text on Neutral backgrounds */
--lb-text-on-neutral
--lb-text-on-neutral-hover
--lb-text-on-neutral-active

/* Text on Success backgrounds */
--lb-text-on-success
--lb-text-on-success-hover
--lb-text-on-success-active

/* Text on Warning backgrounds */
--lb-text-on-warning
--lb-text-on-warning-hover
--lb-text-on-warning-active

/* Text on Error backgrounds */
--lb-text-on-error
--lb-text-on-error-hover
--lb-text-on-error-active

/* Text on Info backgrounds */
--lb-text-on-info
--lb-text-on-info-hover
--lb-text-on-info-active
```

## Typography Tokens

### Font Families

```css
--lb-font-heading    /* Heading font family */
--lb-font-body       /* Body text font family */
--lb-font-mono       /* Monospace font family */
```

### Font Weights

```css
/* Full font weight scale */
--lb-font-weight-thin        /* 100 */
--lb-font-weight-extralight  /* 200 */
--lb-font-weight-light       /* 300 */
--lb-font-weight-regular     /* 400 */
--lb-font-weight-medium      /* 500 */
--lb-font-weight-semibold    /* 600 */
--lb-font-weight-bold        /* 700 */
--lb-font-weight-extrabold   /* 800 */
--lb-font-weight-black       /* 900 */

/* Unified weights for easy customization */
--lb-font-weight-heading     /* Weight for all headings */
--lb-font-weight-body        /* Weight for body text */
--lb-font-weight-label       /* Weight for labels/UI text */
```

> **Note:** As of v0.2.8, all components use CSS custom properties for font weights, enabling runtime customization via JavaScript or CSS overrides.

### Font Sizes

```css
/* Body text sizes */
--lb-font-size-body-small     /* 0.875rem (14px) */
--lb-font-size-body-base      /* 1rem (16px) */
--lb-font-size-body-large     /* 1.125rem (18px) */

/* Label/UI text sizes */
--lb-font-size-label-xsmall   /* 0.625rem (10px) */
--lb-font-size-label-small    /* 0.75rem (12px) */
--lb-font-size-label-base     /* 0.875rem (14px) */
--lb-font-size-label-large    /* 1rem (16px) */

/* Display sizes (responsive) */
--lb-display-1                /* clamp(3rem, 5vw + 1rem, 5rem) */
--lb-display-2                /* clamp(2.5rem, 4vw + 1rem, 4rem) */
```

### Line Heights

```css
--lb-line-height-tight      /* 1.1 - For display/hero text */
--lb-line-height-compact    /* 1.25 - For headings */
--lb-line-height-normal     /* 1.5 - For body text */
--lb-line-height-relaxed    /* 1.75 - For enhanced readability */
```

### Letter Spacing

```css
--lb-letter-spacing-tighter   /* -0.025em */
--lb-letter-spacing-tight     /* -0.01em */
--lb-letter-spacing-normal    /* normal */
--lb-letter-spacing-wide      /* 0.025em */
```

## Spacing & Sizing

### Spacing Scale

```css
--lb-space-2xs     /* 2px */
--lb-space-xs      /* 4px */
--lb-space-sm      /* 8px */
--lb-space-md      /* 12px */
--lb-space-lg      /* 16px */
--lb-space-xl      /* 20px */
--lb-space-2xl     /* 24px */
--lb-space-3xl     /* 32px */
--lb-space-4xl     /* 40px */
--lb-space-5xl     /* 48px */
--lb-space-6xl     /* 56px */
--lb-space-7xl     /* 64px */
--lb-space-8xl     /* 72px */
--lb-space-9xl     /* 96px */
--lb-space-10xl    /* 120px */
```

### Border Radius

```css
--lb-radius-xs      /* 4px */
--lb-radius-sm      /* 8px */
--lb-radius-md      /* 10px */
--lb-radius-lg      /* 12px */
--lb-radius-xl      /* 16px */
--lb-radius-2xl     /* 24px */
--lb-radius-3xl     /* 32px */
--lb-radius-4xl     /* 40px */
--lb-radius-5xl     /* 48px */
--lb-radius-6xl     /* 56px */
--lb-radius-7xl     /* 64px */
--lb-radius-8xl     /* 72px */
--lb-radius-9xl     /* 80px */
--lb-radius-full    /* 9999px */
```

### Sizing

```css
/* Icon sizes */
--lb-icon-size-sm    /* 18px */
--lb-icon-size-md    /* 20px */
--lb-icon-size-lg    /* 24px */

/* Border widths */
--lb-border-sm       /* 1px */
--lb-border-md       /* 2px */

/* Input heights */
--lb-input-height-medium    /* 40px */
--lb-input-height-large     /* 44px */
```

## Background & Special

### Background Colors

```css
--lb-background-page       /* Main page background */
--lb-background-surface    /* Card/panel background */
--lb-background-overlay    /* Modal overlay background */
```

### Special Purpose

```css
--lb-focus-ring-color    /* Focus outline color */
--lb-divider-color       /* Divider/separator color */
```

## Usage Examples

### Basic Color Override

```sass
:root
  --lb-fill-primary-normal: #6B46C1
  --lb-fill-primary-hover: #7C52D9
  --lb-border-primary-normal: #6B46C1
```

### Typography Customization

```sass
:root
  --lb-font-heading: 'Inter', sans-serif
  --lb-font-weight-heading: 700
  --lb-font-size-body-base: 1.125rem
```

### Spacing Adjustment

```sass
:root
  --lb-space-lg: 20px
  --lb-space-xl: 28px
  --lb-radius-md: 12px
```

### Complete Theme Override

```sass
// Import custom fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')

:root
  // Typography
  --lb-font-heading: 'Inter', sans-serif
  --lb-font-body: 'Inter', sans-serif
  --lb-font-weight-heading: 600
  
  // Primary color overrides
  --lb-fill-primary-normal: #8B5CF6
  --lb-fill-primary-hover: #9F7AEA
  --lb-border-primary-normal: #8B5CF6
  --lb-text-primary-normal: #8B5CF6
  
  // Spacing
  --lb-space-lg: 18px
  --lb-radius-md: 8px
```

## Dark Mode

All color tokens automatically adjust for dark mode when:
- `[data-theme="dark"]` attribute is set
- `.dark` class is applied

The dark mode values are pre-configured using RadixUI dark color scales for optimal contrast and accessibility.

## Tips

1. **Start small** - Override only the variables you need
2. **Use semantic colors** - Prefer semantic tokens (primary, success) over direct colors
3. **Test dark mode** - Always verify your overrides work in both light and dark themes
4. **Maintain contrast** - Ensure text remains readable when changing colors
5. **Use the template** - Start with `littlebrand-overrides-template.sass` for easier customization