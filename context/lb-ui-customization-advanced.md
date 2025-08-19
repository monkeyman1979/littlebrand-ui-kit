# LittleBrand UI Kit - Advanced Customization Guide

This guide covers advanced customization techniques including build-time SASS customization, creating custom themes, performance optimization, and architectural best practices.

## Table of Contents
1. [Build-Time SASS Customization](#build-time-sass-customization)
2. [Creating Custom Component Variants](#creating-custom-component-variants)
3. [Advanced Theme Architecture](#advanced-theme-architecture)
4. [Performance Optimization](#performance-optimization)
5. [Build Tool Integration](#build-tool-integration)
6. [Testing Custom Themes](#testing-custom-themes)
7. [Best Practices & Patterns](#best-practices--patterns)

## Build-Time SASS Customization

### Setting Up SASS Overrides

Create a custom SASS file that imports and overrides UI kit variables:

```scss
// custom-ui-kit.sass
// 1. Override SASS variables BEFORE importing
$orange-9: #your-brand-color
$teal-9: #your-secondary-color
$font-heading: 'Your Font', sans-serif
$space-4: 0.75rem
$radius-md: 0.75rem

// 2. Import the UI kit styles
@use 'littlebrand-ui-kit/src/styles/main' as lb

// 3. Add your custom styles
.custom-component
  background: lb.$orange-4
  padding: lb.$space-6
  border-radius: lb.$radius-lg
```

### Creating a Custom Build

Set up your build process to compile custom SASS:

```javascript
// vite.config.custom.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `
          // Override variables before they're used
          $orange-9: #e11d48
          $font-heading: 'Montserrat', sans-serif
          
          // Import UI kit
          @use '${path.resolve(__dirname, 'node_modules/littlebrand-ui-kit/src/styles/main')}' as *
        `
      }
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/custom-ui-kit.js'),
      name: 'CustomUIKit',
      fileName: 'custom-ui-kit'
    }
  }
})
```

### Custom SASS Module Structure

```scss
// styles/custom-theme/index.sass
// Your custom theme module

// 1. Define your variables
@forward 'variables'

// 2. Override UI kit modules
@forward 'overrides'

// 3. Add custom components
@forward 'components'

// 4. Add utilities
@forward 'utilities'
```

```scss
// styles/custom-theme/_variables.sass
// Define all your custom variables

// Brand colors
$brand-primary: #5b21b6
$brand-secondary: #0891b2
$brand-accent: #f59e0b

// Custom spacing scale
$spacing-unit: 0.25rem
$spacing-scale: 1.5

// Typography
$font-primary: 'Inter', sans-serif
$font-display: 'Poppins', sans-serif
$font-mono: 'JetBrains Mono', monospace

// Component specific
$button-height-ratio: 2.5
$input-padding-ratio: 0.75
$card-shadow-blur: 24px
```

## Creating Custom Component Variants

### Extending Existing Components

```scss
// custom-components.sass
@use 'littlebrand-ui-kit/src/styles/base' as base
@use 'littlebrand-ui-kit/src/styles/colors' as colors

// Custom button variant
.lb-button
  // Gradient variant
  &.gradient
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)
    border: none
    color: white
    
    &:hover
      background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-secondary-hover) 100%)
      transform: translateY(-1px)
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
    
  // Glow variant
  &.glow
    position: relative
    overflow: hidden
    
    &::before
      content: ''
      position: absolute
      top: 50%
      left: 50%
      width: 0
      height: 0
      border-radius: 50%
      background: rgba(255, 255, 255, 0.5)
      transform: translate(-50%, -50%)
      transition: width 0.6s, height 0.6s
    
    &:active::before
      width: 300px
      height: 300px
```

### Creating New Components

```vue
<!-- CustomCard.vue -->
<template lang="pug">
.custom-card(
  :class="[variant, { elevated: elevated }]"
  :style="customStyle"
)
  .custom-card__media(v-if="$slots.media")
    slot(name="media")
  
  .custom-card__content
    h3.custom-card__title(v-if="title") {{ title }}
    .custom-card__body
      slot
  
  .custom-card__actions(v-if="$slots.actions")
    slot(name="actions")
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'outlined', 'filled', 'gradient'].includes(v)
  },
  elevated: Boolean,
  title: String,
  color: String
})

const customStyle = computed(() => ({
  '--card-color': props.color || 'var(--color-primary)'
}))
</script>

<style lang="sass" scoped>
@use 'littlebrand-ui-kit/src/styles/base' as base
@use 'littlebrand-ui-kit/src/styles/typography' as typography

.custom-card
  border-radius: base.$radius-lg
  overflow: hidden
  transition: all base.$transition
  
  &__content
    padding: base.$space-8
    
  &__title
    font-family: typography.$font-heading
    margin-bottom: base.$space-4
    
  &__actions
    padding: base.$space-6 base.$space-8
    border-top: 1px solid var(--color-border)
    display: flex
    gap: base.$space-4
    justify-content: flex-end
    
  // Variants
  &.default
    background: var(--color-surface)
    border: 1px solid var(--color-border)
    
  &.filled
    background: var(--card-color)
    color: white
    
  &.gradient
    background: linear-gradient(135deg, var(--card-color) 0%, var(--color-secondary) 100%)
    color: white
    
  &.elevated
    box-shadow: base.$shadow-lg
    
    &:hover
      transform: translateY(-2px)
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15)
</style>
```

## Advanced Theme Architecture

### Theme Configuration System

```javascript
// theme-config.js
export class ThemeConfig {
  constructor(config = {}) {
    this.config = {
      name: config.name || 'custom',
      colors: config.colors || {},
      typography: config.typography || {},
      spacing: config.spacing || {},
      components: config.components || {},
      ...config
    }
  }
  
  // Generate CSS variables from config
  generateCSS() {
    let css = `:root[data-theme="${this.config.name}"] {\n`
    
    // Colors
    Object.entries(this.config.colors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        // Handle color scales
        Object.entries(value).forEach(([scale, color]) => {
          css += `  --color-${key}-${scale}: ${color};\n`
        })
      } else {
        css += `  --color-${key}: ${value};\n`
      }
    })
    
    // Typography
    Object.entries(this.config.typography).forEach(([key, value]) => {
      css += `  --font-${key}: ${value};\n`
    })
    
    // Spacing
    Object.entries(this.config.spacing).forEach(([key, value]) => {
      css += `  --space-${key}: ${value};\n`
    })
    
    css += '}\n'
    
    // Component overrides
    if (this.config.components) {
      Object.entries(this.config.components).forEach(([component, styles]) => {
        css += `\n[data-theme="${this.config.name}"] .lb-${component} {\n`
        Object.entries(styles).forEach(([prop, value]) => {
          css += `  ${prop}: ${value};\n`
        })
        css += '}\n'
      })
    }
    
    return css
  }
  
  // Apply theme dynamically
  apply() {
    const styleId = `theme-${this.config.name}`
    let styleEl = document.getElementById(styleId)
    
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    
    styleEl.textContent = this.generateCSS()
    document.documentElement.setAttribute('data-theme', this.config.name)
  }
}

// Example usage
const techTheme = new ThemeConfig({
  name: 'tech',
  colors: {
    primary: '#00d4ff',
    secondary: '#ff0080',
    background: '#0a0e27',
    surface: '#151932',
    text: '#ffffff'
  },
  typography: {
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Fira Code', monospace"
  },
  spacing: {
    unit: '0.25rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.5rem',
    6: '2rem',
    7: '3rem',
    8: '4rem'
  },
  components: {
    button: {
      'text-transform': 'uppercase',
      'letter-spacing': '0.05em',
      'font-weight': '600'
    },
    input: {
      'background': 'rgba(255, 255, 255, 0.05)',
      'border': '1px solid rgba(255, 255, 255, 0.1)',
      'backdrop-filter': 'blur(10px)'
    }
  }
})

techTheme.apply()
```

### Theme Composition

```javascript
// theme-composer.js
export class ThemeComposer {
  constructor() {
    this.baseTheme = {}
    this.modifiers = []
  }
  
  // Set base theme
  setBase(theme) {
    this.baseTheme = theme
    return this
  }
  
  // Add modifier functions
  addModifier(modifier) {
    this.modifiers.push(modifier)
    return this
  }
  
  // Color modifiers
  static darken(amount = 10) {
    return (theme) => {
      const newTheme = { ...theme }
      // Darken all colors
      Object.keys(newTheme.colors).forEach(key => {
        if (typeof newTheme.colors[key] === 'string') {
          newTheme.colors[key] = this.adjustColor(newTheme.colors[key], -amount)
        }
      })
      return newTheme
    }
  }
  
  static saturate(amount = 20) {
    return (theme) => {
      const newTheme = { ...theme }
      // Increase saturation
      Object.keys(newTheme.colors).forEach(key => {
        if (typeof newTheme.colors[key] === 'string') {
          newTheme.colors[key] = this.adjustSaturation(newTheme.colors[key], amount)
        }
      })
      return newTheme
    }
  }
  
  // Compose final theme
  compose() {
    let theme = { ...this.baseTheme }
    
    // Apply each modifier
    this.modifiers.forEach(modifier => {
      theme = modifier(theme)
    })
    
    return new ThemeConfig(theme)
  }
}

// Usage
const darkTechTheme = new ThemeComposer()
  .setBase(techTheme.config)
  .addModifier(ThemeComposer.darken(20))
  .addModifier(ThemeComposer.saturate(10))
  .addModifier((theme) => ({
    ...theme,
    name: 'tech-dark',
    colors: {
      ...theme.colors,
      background: '#000000'
    }
  }))
  .compose()

darkTechTheme.apply()
```

## Performance Optimization

### CSS Variable Optimization

```javascript
// css-var-optimizer.js
export class CSSVarOptimizer {
  constructor() {
    this.usedVars = new Set()
    this.definedVars = new Map()
  }
  
  // Scan DOM for used variables
  scanUsage() {
    const elements = document.querySelectorAll('*')
    const regex = /var\(([^)]+)\)/g
    
    elements.forEach(el => {
      const computed = getComputedStyle(el)
      
      for (let prop of computed) {
        const value = computed.getPropertyValue(prop)
        let match
        
        while ((match = regex.exec(value)) !== null) {
          this.usedVars.add(match[1].trim())
        }
      }
    })
    
    return this.usedVars
  }
  
  // Extract defined variables
  extractDefined() {
    const sheets = document.styleSheets
    
    for (let sheet of sheets) {
      try {
        const rules = sheet.cssRules || sheet.rules
        
        for (let rule of rules) {
          if (rule.style) {
            for (let prop of rule.style) {
              if (prop.startsWith('--')) {
                this.definedVars.set(prop, rule.style.getPropertyValue(prop))
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheets
        continue
      }
    }
    
    return this.definedVars
  }
  
  // Find unused variables
  findUnused() {
    const unused = []
    
    this.definedVars.forEach((value, key) => {
      if (!this.usedVars.has(key)) {
        unused.push(key)
      }
    })
    
    return unused
  }
  
  // Generate optimized CSS
  generateOptimized() {
    this.scanUsage()
    this.extractDefined()
    
    let css = ':root {\n'
    
    this.usedVars.forEach(varName => {
      if (this.definedVars.has(varName)) {
        css += `  ${varName}: ${this.definedVars.get(varName)};\n`
      }
    })
    
    css += '}\n'
    
    return css
  }
}
```

### Lazy Theme Loading

```javascript
// lazy-theme-loader.js
export class LazyThemeLoader {
  constructor() {
    this.loadedThemes = new Map()
    this.loadingThemes = new Map()
  }
  
  async loadTheme(themeName) {
    // Check if already loaded
    if (this.loadedThemes.has(themeName)) {
      return this.loadedThemes.get(themeName)
    }
    
    // Check if currently loading
    if (this.loadingThemes.has(themeName)) {
      return this.loadingThemes.get(themeName)
    }
    
    // Start loading
    const loadPromise = this._loadThemeModule(themeName)
    this.loadingThemes.set(themeName, loadPromise)
    
    try {
      const theme = await loadPromise
      this.loadedThemes.set(themeName, theme)
      this.loadingThemes.delete(themeName)
      return theme
    } catch (error) {
      this.loadingThemes.delete(themeName)
      throw error
    }
  }
  
  async _loadThemeModule(themeName) {
    // Dynamic import
    const module = await import(`./themes/${themeName}.js`)
    const theme = module.default || module[themeName]
    
    // Create and inject styles
    const styleEl = document.createElement('style')
    styleEl.id = `theme-${themeName}`
    styleEl.textContent = theme.css || new ThemeConfig(theme).generateCSS()
    document.head.appendChild(styleEl)
    
    return theme
  }
  
  async switchTheme(themeName) {
    const theme = await this.loadTheme(themeName)
    document.documentElement.setAttribute('data-theme', themeName)
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: themeName, config: theme }
    }))
  }
  
  preloadThemes(themeNames) {
    return Promise.all(themeNames.map(name => this.loadTheme(name)))
  }
}

// Usage
const themeLoader = new LazyThemeLoader()

// Preload common themes
themeLoader.preloadThemes(['light', 'dark'])

// Load theme on demand
document.getElementById('theme-select').addEventListener('change', async (e) => {
  await themeLoader.switchTheme(e.target.value)
})
```

## Build Tool Integration

### Vite Plugin for Theme Generation

```javascript
// vite-plugin-theme-generator.js
export function themeGeneratorPlugin(options = {}) {
  const {
    themes = {},
    outputDir = 'dist/themes',
    generateTypes = true
  } = options
  
  return {
    name: 'theme-generator',
    
    async buildStart() {
      // Generate theme files
      for (const [name, config] of Object.entries(themes)) {
        const theme = new ThemeConfig({ name, ...config })
        const css = theme.generateCSS()
        
        // Emit theme CSS
        this.emitFile({
          type: 'asset',
          fileName: `themes/${name}.css`,
          source: css
        })
        
        // Emit theme JSON
        this.emitFile({
          type: 'asset',
          fileName: `themes/${name}.json`,
          source: JSON.stringify(config, null, 2)
        })
      }
      
      // Generate TypeScript types
      if (generateTypes) {
        const types = this.generateThemeTypes(themes)
        this.emitFile({
          type: 'asset',
          fileName: 'themes/types.d.ts',
          source: types
        })
      }
    },
    
    generateThemeTypes(themes) {
      let types = '// Auto-generated theme types\n\n'
      types += 'export interface Theme {\n'
      types += '  name: string\n'
      types += '  colors: Record<string, string>\n'
      types += '  typography: Record<string, string>\n'
      types += '  spacing: Record<string, string>\n'
      types += '  components?: Record<string, Record<string, string>>\n'
      types += '}\n\n'
      
      types += 'export type ThemeName = '
      types += Object.keys(themes).map(name => `'${name}'`).join(' | ')
      types += '\n\n'
      
      types += 'export const themes: Record<ThemeName, Theme>\n'
      
      return types
    }
  }
}

// vite.config.js
import { defineConfig } from 'vite'
import { themeGeneratorPlugin } from './vite-plugin-theme-generator'

export default defineConfig({
  plugins: [
    themeGeneratorPlugin({
      themes: {
        ocean: {
          colors: {
            primary: '#006994',
            secondary: '#00a8cc'
          }
        },
        forest: {
          colors: {
            primary: '#2d5016',
            secondary: '#7cb342'
          }
        }
      }
    })
  ]
})
```

### Webpack Configuration

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  entry: {
    main: './src/index.js',
    'theme-ocean': './src/themes/ocean.js',
    'theme-forest': './src/themes/forest.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true
              },
              additionalData: `
                @use '${path.resolve(__dirname, 'src/styles/theme-vars')}' as *
              `
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}
```

## Testing Custom Themes

### Visual Regression Testing

```javascript
// theme-visual-tests.js
import { test, expect } from '@playwright/test'

const themes = ['light', 'dark', 'ocean', 'forest']
const components = ['button', 'input', 'card', 'dialog']

themes.forEach(theme => {
  test.describe(`Theme: ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test-page')
      await page.evaluate((themeName) => {
        document.documentElement.setAttribute('data-theme', themeName)
      }, theme)
    })
    
    components.forEach(component => {
      test(`${component} component`, async ({ page }) => {
        const element = await page.locator(`.lb-${component}`)
        await expect(element).toHaveScreenshot(`${theme}-${component}.png`)
      })
    })
    
    test('full page', async ({ page }) => {
      await expect(page).toHaveScreenshot(`${theme}-full-page.png`)
    })
  })
})
```

### Theme Validation Testing

```javascript
// theme-validation.test.js
import { validateTheme } from './theme-validator'

describe('Theme Validation', () => {
  const customTheme = {
    name: 'custom',
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
      background: '#ffffff',
      text: '#000000'
    },
    typography: {
      heading: 'Arial, sans-serif',
      body: 'Georgia, serif'
    }
  }
  
  test('validates required colors', () => {
    const result = validateTheme(customTheme)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
  
  test('checks color contrast', () => {
    const result = validateTheme(customTheme, { checkContrast: true })
    expect(result.contrast.textOnBackground).toBeGreaterThan(4.5)
    expect(result.contrast.primaryOnBackground).toBeGreaterThan(3)
  })
  
  test('validates color format', () => {
    const invalidTheme = {
      ...customTheme,
      colors: {
        ...customTheme.colors,
        primary: 'not-a-color'
      }
    }
    
    const result = validateTheme(invalidTheme)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Invalid color format: primary')
  })
})
```

## Best Practices & Patterns

### 1. Theme Structure Pattern

```javascript
// theme-structure.js
export const themeStructure = {
  // Metadata
  meta: {
    name: 'theme-name',
    version: '1.0.0',
    author: 'Your Name',
    description: 'Theme description'
  },
  
  // Core design tokens
  tokens: {
    colors: {
      // Semantic colors
      brand: {},
      ui: {},
      text: {},
      
      // Utility colors
      states: {},
      
      // Scales
      scales: {}
    },
    
    typography: {
      fonts: {},
      sizes: {},
      weights: {},
      lineHeights: {}
    },
    
    spacing: {
      base: {},
      component: {},
      layout: {}
    },
    
    effects: {
      shadows: {},
      blurs: {},
      transitions: {}
    }
  },
  
  // Component overrides
  components: {
    button: {},
    input: {},
    card: {}
  },
  
  // Utilities
  utilities: {
    animations: {},
    helpers: {}
  }
}
```

### 2. Theme Migration Pattern

```javascript
// theme-migrator.js
export class ThemeMigrator {
  constructor(migrations) {
    this.migrations = migrations
  }
  
  migrate(theme, fromVersion, toVersion) {
    let migratedTheme = { ...theme }
    
    const relevantMigrations = this.migrations
      .filter(m => m.version > fromVersion && m.version <= toVersion)
      .sort((a, b) => a.version - b.version)
    
    for (const migration of relevantMigrations) {
      migratedTheme = migration.up(migratedTheme)
    }
    
    return migratedTheme
  }
}

// Define migrations
const migrations = [
  {
    version: '2.0.0',
    up: (theme) => ({
      ...theme,
      colors: {
        ...theme.colors,
        // Rename old color names
        primary: theme.colors.brand || theme.colors.primary,
        secondary: theme.colors.accent || theme.colors.secondary
      }
    })
  },
  {
    version: '3.0.0',
    up: (theme) => ({
      ...theme,
      // Add new required properties
      spacing: theme.spacing || {
        unit: '0.25rem',
        scale: 1.5
      }
    })
  }
]

const migrator = new ThemeMigrator(migrations)
```

### 3. Theme Documentation Generator

```javascript
// theme-docs-generator.js
export class ThemeDocsGenerator {
  generateDocs(theme) {
    let markdown = `# ${theme.meta.name} Theme\n\n`
    markdown += `${theme.meta.description}\n\n`
    
    // Color palette
    markdown += '## Color Palette\n\n'
    markdown += this.generateColorTable(theme.tokens.colors)
    
    // Typography
    markdown += '\n## Typography\n\n'
    markdown += this.generateTypographyTable(theme.tokens.typography)
    
    // Component examples
    markdown += '\n## Component Examples\n\n'
    markdown += this.generateComponentExamples(theme.components)
    
    return markdown
  }
  
  generateColorTable(colors) {
    let table = '| Color | Value | Preview |\n'
    table += '|-------|-------|---------||\n'
    
    Object.entries(colors).forEach(([name, value]) => {
      if (typeof value === 'string') {
        table += `| ${name} | ${value} | <div style="background:${value};width:50px;height:20px"></div> |\n`
      }
    })
    
    return table
  }
}
```

## Summary

Advanced customization of the LittleBrand UI Kit involves:

1. **Build-time customization** through SASS variable overrides
2. **Runtime customization** through CSS custom properties
3. **Theme architecture** for managing multiple brands/themes
4. **Performance optimization** through lazy loading and tree-shaking
5. **Testing strategies** for validating custom themes
6. **Build tool integration** for automated theme generation
7. **Best practices** for maintainable theme systems

The key is to choose the right level of customization for your needs - from simple CSS overrides to complete build-time theme systems.