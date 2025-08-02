# LittleBrand UI Kit - Project Overview

## Project Mission
Create a clean, simple, and highly customizable Vue.js UI kit using Pug (HTML) and SASS (CSS) that prioritizes semantic HTML, CSS Grid layouts, and zero utility classes. This is an open-source project that allows developers to easily customize the styling to match their brand.

## Core Philosophy

### What This Project IS:
- **Semantic HTML First**: Every element has meaning and purpose
- **CSS Grid & Flexbox**: Layout with modern CSS, primarily Grid
- **Component-Based**: Self-contained Vue components
- **Customizable**: Easy to modify via SASS variables
- **Icon-Agnostic**: Bring your own icon library
- **Theme-Ready**: Built-in light/dark mode support
- **Zero Dependencies**: No required icon or animation libraries

### What This Project IS NOT:
- **NOT Tailwind-like**: No utility classes in HTML
- **NOT Margin-Based**: Use Grid/Flexbox for spacing
- **NOT Opinionated on Icons**: You choose your icons
- **NOT Framework-Heavy**: Minimal abstractions

## Critical Development Rules

### 1. **NO Utility Classes**
```pug
// ❌ WRONG
button.px-4.py-2.bg-blue-500.rounded
  
// ✅ CORRECT
button.lb-button
```

### 2. **NO Margin for Spacing**
```sass
// ❌ WRONG
.lb-button
  margin-bottom: 1rem

// ✅ CORRECT - Use Grid/Flexbox in parent
.form-group
  display: grid
  gap: 1rem
```

### 3. **Semantic HTML Always**
```pug
// ❌ WRONG
.container
  .wrapper
    .inner
      div Click me

// ✅ CORRECT
section.login-form
  form
    button.lb-button Click me
```

### 4. **Every Element Must Have Purpose**
- Every div must have a class or ID
- Class names describe purpose, not appearance
- Use proper HTML5 elements (nav, section, article, etc.)

### 5. **CSS Grid First, Flexbox Second**
```sass
// Prefer Grid for layouts
.form-layout
  display: grid
  grid-template-columns: 1fr
  gap: 1.5rem

// Flexbox only for linear arrangements
.button-group
  display: flex
  gap: 0.5rem
```

### 6. **SASS Syntax (Not SCSS)**
```sass
// ✅ CORRECT - SASS syntax
.lb-button
  padding: $space-sm $space-md
  background: var(--color-primary)
  
  &:hover
    background: var(--color-primary-hover)

// ❌ WRONG - SCSS syntax
.lb-button {
  padding: $space-sm $space-md;
}
```

## Technical Stack
- **Vue 3** with Composition API
- **Vite** for building
- **Pug** for templates
- **SASS** for styles (not SCSS)
- **CSS Custom Properties** for runtime theming and customization
- **CSS Grid** for layouts
- **Unit-based design system** (base unit: 0.0625rem = 1px)

## Component Prefix
All components use the `Lb` prefix (for LittleBrand):
- `<LbButton>`
- `<LbInput>`
- `<LbModal>`
- etc.

## Project Structure
```
littlebrand-ui/
├── src/
│   ├── components/      # Vue components
│   ├── styles/          # SASS foundation
│   └── composables/     # Vue composables
├── examples/            # Demo app
└── dist/               # Built package
```

## Distribution Strategy
- **Dual distribution**: Simple imports OR Vue plugin
- **Raw SASS files** included for maximum customization
- **No compiled CSS** - users compile with their build tools

## Customization Strategy
Runtime customization via CSS variables:
```css
/* Override any value at runtime */
:root {
  --space-md: 1.5rem;  /* Change medium spacing */
  --color-primary: hsl(250, 95%, 60%);  /* Change brand color */
  --radius-md: 0.75rem;  /* Change border radius */
}

/* Component-specific overrides */
.my-app {
  --input-height-medium: 3rem;  /* Larger inputs */
  --font-size-label-base: 0.875rem;  /* Smaller text */
}
```

No recompilation needed - just change CSS variables!

## V1 Scope
Form-focused components with full theme support:
- Button, Input, Textarea, Select
- Label, HintText  
- Checkbox, Radio, Switch
- Modal

## Key Decisions
1. **No breakpoints** - Content-driven responsive design
2. **No animations library** - Users choose their own
3. **System fonts default** - Easy to override
4. **HSL colors** with 1-12 scale (Radix-inspired)
5. **Icon slots** - Bring your own icons
6. **300ms transitions** - Single, consistent timing
7. **CSS Variables for everything** - Runtime customization without recompiling
8. **T-shirt sizing convention** - Intuitive scale (2xs through 10xl) for spacing, sizing, borders, and radii
9. **Unit-based system** - All measurements based on rem units for accessibility

## Success Criteria
- Zero learning curve for Vue developers
- Customizable without touching node_modules
- Semantic, accessible HTML output
- Modern CSS with no hacks
- Beautiful defaults that scale