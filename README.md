# LittleBrand UI Kit

A modern Vue 3 UI component library with a powerful color generation system. Build beautiful, accessible interfaces with minimal effort.

## ✨ Features

- 🎨 **Smart Color System** - Provide one color, get 68+ design tokens automatically
- 🚀 **Runtime Theming** - Change colors instantly without rebuilding
- 📦 **20+ Components** - Buttons, forms, dialogs, navigation, and more
- 🌙 **Dark Mode** - Opt-in dark mode with optimized colors
- 🎯 **Zero Config** - Works out of the box with beautiful defaults
- 🌳 **Tree-Shakeable** - Only bundle what you use
- 💅 **SASS + Pug** - Clean, maintainable component code
- 📝 **200+ CSS Variables** - Complete control over typography, spacing, and colors
- 🔤 **Unified Typography** - Control all headings, body, or labels with single variables

## 📦 Installation

```bash
npm install littlebrand-ui-kit
```

## 🚀 Quick Start

### Method 1: Global Plugin Installation (All Components)

Register all components globally with the plugin:

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import { LittleBrandUI, applyTheme } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// OPTIONAL: Customize colors (one hex = entire color system!)
applyTheme({
  primary: '#AB4ABA',    // Your brand purple
  secondary: '#F76B15'   // Your brand orange
  // Generates all shades, dark mode, and semantic tokens automatically!
})

const app = createApp(App)
app.use(LittleBrandUI)  // Registers all components globally
app.mount('#app')
```

### Method 2: Import as Needed (Recommended - Tree-shaking)

Import only the components you need in each file:

```javascript
// main.js - Setup and theme customization
import { createApp } from 'vue'
import App from './App.vue'
import { applyTheme } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// OPTIONAL: Customize colors globally
applyTheme({
  primary: '#8b5cf6',
  secondary: '#f59e0b'
})

const app = createApp(App)
app.mount('#app')
```

```vue
<!-- Any component file -->
<script setup>
import { LbButton, LbInput } from 'littlebrand-ui-kit'
</script>

<template>
  <lb-button variant="filled" color="primary">
    Click Me
  </lb-button>
  <lb-input v-model="text" placeholder="Enter text" />
</template>
```

### Method 3: Manual Global Registration

Register specific components globally:

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import { 
  LbButton, 
  LbInput, 
  LbDialog,
  applyTheme 
} from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// Customize colors
applyTheme({
  primary: '#AB4ABA',
  secondary: '#F76B15',
  neutral: '#94a3b8',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
})

// Make applyTheme available globally for runtime theme changes
window.applyTheme = applyTheme

const app = createApp(App)

// Register only the components you need globally
app.component('LbButton', LbButton)
app.component('LbInput', LbInput)
app.component('LbDialog', LbDialog)

app.mount('#app')
```

### With SnackbarProvider

To use snackbars, wrap your app with `LbSnackbarProvider`:

```javascript
import { createApp, h } from 'vue'
import App from './App.vue'
import { LbSnackbarProvider, applyTheme } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// Customize colors
applyTheme({ primary: '#8b5cf6' })

const app = createApp({
  render() {
    return h(LbSnackbarProvider, () => h(App))
  }
})
app.mount('#app')
```

Then use snackbars anywhere:

```vue
<script setup>
import { useSnackbar } from 'littlebrand-ui-kit'

const { showSnackbar } = useSnackbar()

const handleClick = () => {
  showSnackbar({ 
    message: 'Action completed!',
    variant: 'success'
  })
}
</script>
```

## 🎨 Color Customization

### Method 1: Runtime JavaScript (Easiest)

Change colors instantly without any build step:

```javascript
import { applyTheme } from 'littlebrand-ui-kit'

// Just provide single colors - everything else is generated!
applyTheme({
  primary: '#8b5cf6',   // Your brand purple
  secondary: '#f59e0b'  // Your brand orange
})
```

That's it! This generates:
- 12-step color scales for each color
- Dark mode colors automatically
- Alpha/transparent versions
- All semantic tokens (borders, fills, text, surfaces)

### Method 2: CSS Variables

Override specific variables in your CSS:

```css
/* your-overrides.css */
:root {
  /* Change main colors */
  --lb-fill-primary-normal: #8b5cf6;
  --lb-border-primary-normal: #8b5cf6;
  --lb-text-primary-normal: #8b5cf6;
  
  /* Change typography */
  --lb-font-family-base: 'Inter', sans-serif;
  --lb-font-size-base: 15px;
  
  /* Change border radius */
  --lb-radius-md: 12px;
}
```

### Method 3: Advanced SASS Customization

For build-time generation with full control:

```sass
// custom-theme.sass
@use 'littlebrand-ui-kit/src/styles/color-generator' as gen

// Generate from single colors
$my-colors: (
  'primary': #8b5cf6,
  'secondary': #f59e0b
)

@each $name, $color in $my-colors
  $scale: gen.generate-scale($color)
  // ... generates everything
```

## 📚 Customization Guide

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for detailed customization options including:
- Color generation options
- Typography customization
- Border radius
- Component-specific overrides

## 🧩 Components

### Form Components
- `LbInput` - Text input with validation states
- `LbTextarea` - Multi-line text input
- `LbSelect` - Dropdown select
- `LbCheckbox` - Checkbox with label
- `LbRadio` - Radio button groups
- `LbSwitch` - Toggle switch
- `LbFormField` - Form field wrapper with label

### Button Components
- `LbButton` - Multiple variants (filled, outline, ghost, tonal, link)
- `LbSegmentButton` - Segmented button group

### Feedback Components
- `LbDialog` - Modal dialog
- `LbSnackbar` - Toast notifications
- `LbBottomSheet` - Mobile-style bottom sheet

### Navigation
- `LbNavigationBar` - App navigation bar

### Display Components
- `LbAvatar` - User avatars
- `LbBadge` - Status badges
- `LbChip` - Tag chips
- `LbDivider` - Content dividers
- `LbProgress` - Progress indicators

### Utility Components
- `LbPopover` - Popover container
- `LbMenu` - Dropdown menus
- `LbDropdown` - Generic dropdown

## 🌙 Dark Mode

Dark mode works automatically! Just add the `dark` class:

```html
<body class="dark">
  <!-- All components now use dark mode colors -->
</body>
```

The color generator creates optimized dark mode colors automatically.

## 🎯 Color System Features

### Automatic Generation

From ONE color, get:
- **12 Light Mode Steps**: From subtle backgrounds to high-contrast text
- **12 Dark Mode Steps**: Optimized for dark backgrounds
- **12 Alpha Light Steps**: Transparent versions for overlays
- **12 Alpha Dark Steps**: Dark mode transparencies
- **20+ Semantic Tokens**: Border, fill, text, and surface variants

### Saturation Curves

Choose the mood of your colors:

```javascript
// Natural (default) - balanced
applyTheme({ primary: '#6366f1' }, 'natural')

// Vivid - more saturated, bold
applyTheme({ primary: '#6366f1' }, 'vivid')

// Muted - less saturated, subtle
applyTheme({ primary: '#6366f1' }, 'muted')
```

## 📖 Examples

### Complete Theme Change

```javascript
import { applyTheme } from 'littlebrand-ui-kit'

// Corporate blue theme
applyTheme({
  primary: '#0066cc',
  secondary: '#6b7280',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
})

// Playful purple theme
applyTheme({
  primary: '#8b5cf6',
  secondary: '#ec4899',
  success: '#10b981'
}, 'vivid') // Use vivid curve for more saturation
```

### Override Specific Variables

```css
:root {
  /* Typography */
  --lb-font-family-base: 'Roboto', sans-serif;
  --lb-font-size-sm: 13px;
  --lb-font-size-base: 15px;
  --lb-font-size-lg: 18px;
  --lb-font-weight-normal: 400;
  --lb-font-weight-medium: 500;
  --lb-font-weight-bold: 700;
  
  /* Border Radius */
  --lb-radius-sm: 4px;
  --lb-radius-md: 8px;
  --lb-radius-lg: 12px;
  --lb-radius-full: 9999px;
  
  /* Shadows */
  --lb-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --lb-shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --lb-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build

# Preview production build
npm run preview
```

## 📄 License

MIT © LittleBrand

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📚 Documentation

- **[Customization Guide](./CUSTOMIZATION.md)** - Complete customization documentation
- **[CSS Variables Reference](./CSS_VARIABLES_REFERENCE.md)** - All 200+ customizable variables
- **[Typography Guide](./TYPOGRAPHY_CUSTOMIZATION_GUIDE.md)** - Font setup and typography
- **[Override Template](./littlebrand-overrides-template.sass)** - Ready-to-use starter file

## 🔗 Links

- [Examples](./examples/)
- [GitHub Repository](https://github.com/monkeyman1979/littlebrand-ui-kit)
- [NPM Package](https://www.npmjs.com/package/littlebrand-ui-kit)

---

Built with ❤️ using Vue 3, Vite, and SASS