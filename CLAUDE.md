# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## General Development Guidelines

- Do not prompt to try to build (npm run build). Only build when I ask you to.

## CSS Rules and Conventions

- Never use "!important" on any css
- Don't use BEM css, keep it simple naming
- Always use flexbox or css grids with components and layout. Never add margins to create spacing between components and elements. You need to use the gap property for spacing between components and elements
- Use CSS variables from the token system (--lb-* prefix) instead of hardcoded values

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build the library for production
npm run preview  # Preview the production build
```

## Architecture Overview

### Technology Stack
- **Vue 3** with Composition API and TypeScript
- **Pug** for template syntax
- **SASS** (indented syntax) for styling
- **Vite** for build tooling

### Color Token System
The UI kit uses a RadixUI-inspired token structure with semantic categorization:

#### Token Categories (--lb-* prefix)
1. **Border** tokens: line, normal, active, focus, disabled, subtle
2. **Fill** tokens: normal, hover, active, focus, disabled
3. **Text** tokens: normal, contrast-low, contrast-high, disabled
4. **Surface** tokens: normal, hover, active, subtle, raised

#### Color Variants
Each category supports: primary, secondary, tertiary, neutral, success, warning, error, info

Example usage:
- `--lb-border-primary-normal`
- `--lb-fill-success-hover`
- `--lb-text-neutral-contrast-high`
- `--lb-surface-error-subtle`

### Component Structure Patterns

#### Standard Component Pattern
```vue
<template lang="pug">
  // Use semantic HTML elements
  // Apply classes for styling, not inline styles
</template>

<script setup lang="ts">
  // Use Composition API with TypeScript
  // Define props with withDefaults
  // Use computed for reactive classes
  // Inject context when nested (e.g., FormField, NavigationBar)
</script>

<style lang="sass" scoped>
  @use '@/styles/base' as base
  // Use token variables: var(--lb-*)
  // Use base.$ for SASS variables (spacing, sizes)
</style>
```

#### Component Conventions
- Components provide their own TypeScript declarations (.vue.d.ts files)
- Use `v-model` for two-way binding on form components
- Support size variants: medium (default) and large (small removed from inputs/selects)
- Icon slots use `template(#icon)` or `template(#icon-leading/trailing)`
- Components detect slot content properly (check for actual content, not just slot existence)

### Key Style Files
- `src/styles/_theme-tokens.sass` - Main token definitions with light/dark themes
- `src/styles/_base.sass` - Core spacing, sizing, and layout variables
- `src/styles/_colors.sass` - RadixUI color scale definitions
- `src/styles/_typography.sass` - Typography using CSS custom properties
- `src/styles/_reset.sass` - CSS reset with hardcoded stable values

### Component Categories

#### Form Components
Input, Select, Checkbox, Radio, Switch, Textarea
- Support `invalid`, `disabled`, `required` states
- Integrate with LbFormField for labels and hints
- Use consistent height variables: `--lb-input-height-medium/large`

#### Button Components
LbButton, LbSegmentButton
- Variants: filled, tonal, outline, ghost, link
- Colors: primary, secondary, neutral, success, warning, error, info
- Icon-only detection for proper centering

#### Feedback Components
Snackbar, Dialog, BottomSheet
- Use Teleport for portal rendering
- Support transition animations
- Dialog close button uses LbButton component

#### Layout Components
NavigationBar, Divider
- NavigationBar supports multiple active colors
- Divider supports horizontal/vertical orientation

### Size Variables
Use CSS variables or base.$ references:
- Icons: `var(--lb-icon-size-sm)` (18px), `var(--lb-icon-size-md)` (20px)
- Spacing: `base.$space-*` or `var(--lb-space-*)`
- Radius: `base.$radius-*` or `var(--lb-radius-*)`
- Borders: `base.$border-sm` (1px), `var(--lb-border-sm)`

### Testing Components
The main demo page is in `examples/App.vue` using a comprehensive component showcase.