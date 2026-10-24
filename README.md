# LittleBrand UI Kit

A modern Vue 3 UI component library with a powerful color generation system. Build beautiful, accessible interfaces with minimal effort.

See the [modernization roadmap](./docs/ROADMAP.md) for planned semantic-token, documentation, MCP, registry, and optional headless-integration work.

## ✨ Features

- 🎨 **Radix UI Color System** - Professional color scales with precise OKLCH values
- 🚀 **Runtime Theming** - Change colors instantly without rebuilding
- 📦 **20+ Components** - Buttons, forms, dialogs, navigation, and more
- 🌙 **Dark Mode** - Opt-in dark mode with optimized colors
- 🎯 **Zero Config** - Works out of the box with beautiful defaults
- 🌳 **Named Imports** - Import components individually (bundle size varies; the global CSS remains shared)
- 💅 **SASS + Pug** - Clean, maintainable component code
- 📝 **312 CSS Variables** - Complete control over typography, spacing, and colors
- 🔤 **Flexible Typography** - Three independent font families for headings, body, and UI elements
- 🎭 **Alpha Scales** - Complete transparency scales for overlays and subtle backgrounds
- 🤖 **MCP Server Integration** - Bundled local stdio server; verified-slice discovery is in unreleased source (published 0.8.3 still has generic metadata)

## 📦 Installation

**Unreleased runtime migration:** The root npm package and bundled MCP CLI now require **Node.js 22 or newer** (`node >=22` in both manifests). Upgrade Node before installing this package, even if you only use its Vue components. Use a patched supported LTS release. Repository development needs **Node 22.12+** for Vite. The Vue peer range remains `^3.3.0`; published npm 0.8.3 is unchanged.

```bash
npm install littlebrand-ui-kit
```

**Packaging status:** The currently published 0.8.3 package resolves named ESM root imports and the `style.css` path in a Node consumer, but its root TypeScript declarations are not discoverable and its declared CommonJS `require` target is missing. Fixes have passed a local build and clean consumer check but remain **Unreleased** until separately reviewed and published. Do not assume deep source imports or tree-shaking until validated in a consumer.

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

### Method 2: Import as Needed (Recommended)

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
  
  /* Change typography - separate fonts for different contexts */
  --lb-font-heading: 'Playfair Display', serif;
  --lb-font-body: 'Inter', sans-serif;
  --lb-font-label: 'Inter', sans-serif;  /* UI elements */
  --lb-font-size-body-base: 1rem;  /* 16px */
  
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

The [first verified component slice](docs/STEP_08_COMPONENT_SLICE.md) documents source-level Button, Input, Dialog, and SegmentButton APIs with a checked Vue example. These Step 08 fixes are **unreleased** and are not present in the currently published npm package.

### Form Components
- `LbInput` - Text input with validation states
- `LbTextarea` - Multi-line text input
- `LbSelect` - Dropdown select
- `LbCheckbox` - Checkbox with label
- `LbRadio` - Radio button groups
- `LbSwitch` - Toggle switch
- `LbFormField` - Form field wrapper with label
- `LbChatInput` - Chat/LLM-style input with auto-grow and actions

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
- `LbChip` - Versatile chips for actions, filtering, and input (assist/filter/input types with tonal/filled/outline variants)
- `LbDivider` - Content dividers
- `LbProgress` - Progress indicators

### Utility Components
- `LbPopover` - Popover container
- `LbMenu` - Dropdown menus
- `LbDropdown` - Generic dropdown

## 🌙 Dark Mode

Without an explicit choice, the kit follows your system light/dark preference, including subsequent changes. To keep an app light regardless of the OS, set `<html data-theme="light">`. To force dark, use `data-theme="dark"` or the existing `.dark` class:

```html
<!-- Using class -->
<body class="dark">
  <!-- All components now use dark mode colors -->
</body>

<!-- Using data attribute -->
<html data-theme="dark">
  <!-- All components now use dark mode colors -->
</html>
```

The nearest explicit theme scope wins, including inside previews. On the same element, `data-theme="light"` takes precedence over `.dark`. `applyTheme()` retains the latest custom colors across mode changes; a teleported Dialog inherits its opening scope's theme while open. Your application owns persistence of any user-selected mode.

## 🎯 Color System Features

### Automatic Generation

From ONE color, get:
- **12 Light Mode Steps**: From subtle backgrounds to high-contrast text
- **12 Dark Mode Steps**: Optimized for dark backgrounds
- **12 Alpha Light Steps**: Transparent versions for overlays
- **12 Alpha Dark Steps**: Dark mode transparencies
- **20+ Semantic Tokens**: Border, fill, text, and surface variants

### Saturation Curves

The optional curve argument is retained for compatibility, but the current generator uses its natural scale for all values. Do not rely on `'vivid'` or `'muted'` changing the output until implemented.

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
}) // A new call replaces the previous custom palette
```

### Override Specific Variables

```css
:root {
  /* Typography - Three independent font families */
  --lb-font-heading: 'Playfair Display', serif;
  --lb-font-body: 'Roboto', sans-serif;
  --lb-font-label: 'Inter', sans-serif;
  
  /* Font sizes and weights */
  --lb-font-size-body-sm: 0.875rem;   /* 14px */
  --lb-font-size-body-base: 1rem;     /* 16px */
  --lb-font-size-body-lg: 1.125rem;   /* 18px */
  --lb-font-weight-regular: 400;
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

## 🤖 AI Assistant Integration

The **unreleased source** MCP server uses local stdio and the [verified component/token reference](./docs/reference/v1/README.md). Three read-only tools (`lb_search`, `lb_get`, `lb_setup`) return concise intent matches, exact checked details with tested Vue examples on demand, and npm setup guidance. Only Button, Input, Textarea, FormField, Dialog, SegmentButton (with its child), and selected tokens have verified references. Generic code generation and all-catalog claims have been removed from the source server.

**Published npm 0.8.3 still contains the older ten-tool server and generic examples.** Its artifact has not been refreshed or verified against the new source reference; do not treat its examples as verified (in particular, Dialog `variant="filled"` and a standalone SegmentButtonItem are invalid). A future owner-authorized release build/extraction and installed-package check are required before promising the new tools through npm.

### Planned setup after a verified release

npm remains the primary distribution path. The package declares MCP runtime dependencies, which npm installs separately; they are not bundled into the UI library.

#### For MCP-compatible agents

Configure your agent's MCP client to run the bundled stdio server from your installed project. The location and format of the client configuration vary by agent; a common server entry looks like:

```json
{
  "littlebrand-ui-kit": {
    "command": "node",
    "args": ["./node_modules/littlebrand-ui-kit/mcp-server/dist/index.js"]
  }
}
```

Use your project's `AGENTS.md` for tool-agnostic guidance about when to consult component and token references.

#### For Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "littlebrand-ui-kit": {
      "command": "node",
      "args": [
        "/absolute/path/to/your-project/node_modules/littlebrand-ui-kit/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Replace `/absolute/path/to/your-project/` with your actual project path.

### Source tools (not yet in npm)

- `lb_search`: intent-based discovery over the verified slice, returning stable IDs.
- `lb_get`: exact component/token details; `detail="full"` includes the checked Vue example.
- `lb_setup`: npm root/CSS import paths and release caveats.

Try: “Find a confirmation modal”, then request `component:LbDialog` with full detail. Other components/tokens must not be treated as verified by these source tools.

### Learn More

See the [MCP Server README](./mcp-server/README.md) for detailed documentation and troubleshooting.

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
- **[CSS Variables Reference](./CSS_VARIABLES_REFERENCE.md)** - All 312 customizable variables
- **[Typography Guide](./TYPOGRAPHY_CUSTOMIZATION_GUIDE.md)** - Font setup and typography
- **[Override Template](./littlebrand-overrides-template.sass)** - Ready-to-use starter file

## 🔗 Links

- [Examples](./examples/)
- [GitHub Repository](https://github.com/monkeyman1979/littlebrand-ui-kit)
- [NPM Package](https://www.npmjs.com/package/littlebrand-ui-kit)

---

Built with ❤️ using Vue 3, Vite, and SASS