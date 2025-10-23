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
npm run dev      # Start development server (runs vite dev server on port 5173)
npm run build    # Build the library for production (includes prebuild extraction)
npm run preview  # Preview the production build

# Extraction scripts (run automatically during prebuild)
npm run extract            # Run all extraction scripts
npm run extract:tokens     # Extract CSS tokens to TOKENS.md and MCP data
npm run extract:components # Extract component metadata from .vue.d.ts files
npm run sync:versions      # Sync version between main and MCP server package.json

# MCP Server
npm run build:mcp          # Build the MCP server (TypeScript compilation)
```

## Architecture Overview

### Technology Stack
- **Vue 3** with Composition API and TypeScript
- **Pug** for template syntax
- **SASS** (indented syntax) for styling
- **Vite** for build tooling

### Color Token System
The UI kit uses a LittleBrand-enhanced token structure based on RadixUI:

#### 12-Step Color Scale
- **Steps 1-3**: Subtle backgrounds and surfaces
- **Steps 4-6**: Interactive element states (hover, borders)
- **Steps 7-8**: Component borders and separators
- **Step 9**: Solid backgrounds (fills, buttons)
- **Steps 10-12**: Text colors
  - **Step 11 (text-normal)**: Enhanced with fixed gap from step 12 for better readability
    - Light mode: 0.106 lighter than step 12
    - Dark mode: 0.089 darker than step 12
  - **Step 12 (text-contrast-high)**: High contrast text

#### Token Categories (--lb-* prefix)
1. **Border** tokens: line (5), normal (7), active (9), focus (7), disabled, subtle (4)
2. **Fill** tokens: normal (9), hover (10), active (8), disabled
3. **Text** tokens: contrast-low (9), normal (11), contrast-high (12), disabled (7)
4. **Surface** tokens: normal (2), hover (3), active (4), subtle (1), raised (1)

#### Color Variants
Each category supports: primary, secondary, tertiary, neutral, success, warning, error, info

Example usage:
- `--lb-border-primary-line` (step 5, subtle borders)
- `--lb-fill-success-normal` (step 9, solid fills)
- `--lb-text-neutral-normal` (step 11, default text)
- `--lb-surface-error-hover` (step 3, hover states)

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
- Use consistent height variables: `--lb-input-height-md/lg`

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

## Build Output Structure

This is a dual-output library:

1. **Main Library** (`dist/`)
   - `littlebrand-ui.js` - ES module build
   - `littlebrand-ui.umd.js` - UMD build for CDN/legacy
   - `littlebrand-ui.css` - Compiled styles with 312 CSS tokens

2. **MCP Server** (`mcp-server/dist/`)
   - Binary executable: `littlebrand-mcp`
   - Provides AI assistant tools for component/token discovery
   - Auto-generated from `.vue.d.ts` files and CSS

## Color Generation System

### OKLCH Color Space
Uses OKLCH (Oklab + Chroma + Hue) for perceptually uniform color generation:
- **Better than HSL**: More accurate perceptual brightness
- **Automatic dark mode**: Generates optimized dark variants
- **Alpha scales**: Transparent versions for overlays

### Runtime Theme Generation
`applyTheme(colors)` in `src/utils/color-generator.js`:
- Takes single hex colors as input
- Generates complete 12-step scales (light + dark)
- Creates all semantic tokens automatically
- LittleBrand enhancements are the default (not standard Radix)

### SASS Color Definitions
`src/styles/_colors.sass`:
- Contains the enhanced step 11 values
- Source of truth for static builds
- 8 color palettes × 12 steps × light/dark modes

## Component TypeScript Declarations

Each component must have a `.vue.d.ts` file:
- Defines props, slots, and emits interfaces
- Used by extraction scripts for MCP server data
- Must be kept in sync with component implementation
- Slot names with hyphens need quotes: `'item-icon-leading'?: ...`

## Release Process

1. Make changes on feature branches
2. PR to `develop` branch
3. Run extraction scripts: `npm run extract`
4. Update `CHANGELOG.md` with version changes
5. Version bump: `npm version x.x.x --no-git-tag-version`
6. Build: `npm run build`
7. Merge to `main` and tag: `git tag vx.x.x`
8. Publish: `npm publish`

## MCP Server Integration

The project includes a Model Context Protocol server for AI assistants:
- Automatically extracts component metadata from `.vue.d.ts` files
- Extracts all CSS tokens from compiled styles
- Enables accurate code generation without hallucination
- Binary available as `littlebrand-mcp` after npm install