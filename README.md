# LittleBrand UI Kit

A modern Vue 3 UI component library with a powerful color generation system. Build beautiful, accessible interfaces with minimal effort.

See the [modernization roadmap](./docs/ROADMAP.md) for planned semantic-token, documentation, MCP, registry, and optional headless-integration work.

## ✨ Features

- 🎨 **Radix UI Color System** - Professional color scales with precise OKLCH values
- 🚀 **Runtime Theming** - Change colors instantly without rebuilding
- 📦 **20+ Components** - Buttons, forms, dialogs, navigation, and more
- 🌙 **Dark Mode** - Follows the system unless light or dark is explicitly selected
- 🎯 **Zero Config** - Works out of the box with beautiful defaults
- 🌳 **Named Imports** - Import components individually (bundle size varies; the global CSS remains shared)
- 💅 **SASS + Pug** - Clean, maintainable component code
- 📝 **312 CSS Variables** - Complete control over typography, spacing, and colors
- 🔤 **Flexible Typography** - Three independent font families for headings, body, and UI elements
- 🎭 **Alpha Scales** - Complete transparency scales for overlays and subtle backgrounds
- 🤖 **MCP Server Integration** - Bundled local stdio server; 0.9.0 distinguishes public component names from verified APIs/examples

## 📦 Installation

**0.9.0 runtime requirement:** Both manifests require **`^22.23.4 || ^24.22.1 || ^26.12.1`**, the supported Node release lines patched for the [October 2026 security advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases). Older patches, EOL odd-numbered majors and unreviewed future majors are unsupported. Upgrade/select Node before installing this package, even if you only use its Vue components. `.node-version` pins patched LTS **22.23.4** for development; `.npmrc` enforces package engines, and the MCP server refuses unsupported runtimes. A pin does not upgrade your installed Node or restart running clients. The Vue peer remains `^3.3.0`; earlier 0.8.3 supported a different Node range.

```bash
npm install littlebrand-ui-kit
```

**Version note:** The earlier 0.8.3 package has missing root TypeScript declarations and a broken CommonJS entry. This 0.9.0 source corrects those paths; use the matching package version when following these examples. Deep source imports are unsupported, and named imports do not imply per-component CSS tree-shaking.

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

The [first verified component slice](docs/STEP_08_COMPONENT_SLICE.md) documents source-level Button, Input, Dialog, and SegmentButton APIs with a checked Vue example. These changes ship in 0.9.0, not the earlier 0.8.3 package.

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

The **0.9.0** MCP server uses local stdio and three read-only tools (`lb_search`, `lb_get`, `lb_setup`). Search covers the 33 public source root-exported components and selected semantic tokens, marking catalog-only names distinctly from checked results. Only Button, Input, Textarea, FormField, Dialog, SegmentButton (with its child), and selected tokens have [verified references](./docs/reference/v1/README.md), API facts and tested Vue examples. Other components return a source path and purpose **without** inferred props or generated code; compound children name their parent. See the [catalog inventory](./reference/catalog.json). Generic code generation and unverified API claims have been removed.

**The earlier 0.8.3 package contains a different ten-tool server with generic, unverified examples.** Do not use its Dialog `variant="filled"` or a standalone SegmentButtonItem. Install version 0.9.0 or later to use the three reference-backed tools described here.

### Local MCP setup (0.9.0)

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

### MCP tools (0.9.0)

- `lb_search`: intent-based discovery across source root exports and selected checked tokens; results say `checked` or `catalog-only`.
- `lb_get`: exact item details; `detail="full"` includes the tested Vue example **only** for checked items. Catalog-only names return source paths, not unverified APIs.
- `lb_setup`: npm root/CSS import paths and release caveats.

Try: “Find a confirmation modal”, then request `component:LbDialog` with full detail. A query like “popover trigger” returns a catalog-only child with its parent, not a made-up example.

### Learn More

The local docs preview (`npm run dev:site`, then the **MCP guide** section) walks through connecting the source server and retrieving a verified example. See the [MCP Server README](./mcp-server/README.md) for packaged setup and source checks.

## 🛠️ Development

Use a security-patched Node version from `.node-version` / `package.json`.

```bash
npm ci --ignore-scripts
npm ci --ignore-scripts --prefix mcp-server
npm run dev        # component showcase
npm run dev:site   # local documentation
npm run check      # formatting, lint, strict types, unit tests, source MCP, reference freshness
npm run check:all  # the same checks plus Chromium theme/component/overlay/docs probes
```

**Vite+ 1.4.0 uses one central `vite.config.js`** for Vite, Vitest, Oxfmt, Oxlint, the existing ESLint rules, and validation tasks. There are no separate ESLint, Vitest or site Vite configs. TypeScript project/consumer-fixture configs remain separate deliberately.

Use `npm run check`, not bare `vp check`, for the full source gate: native `vp check` covers formatting and script linting, while the central task also runs the existing Vue-essential ESLint rules and strict `vue-tsc` / TypeScript 6 checks. Native TypeScript-Go checking is disabled rather than masking Vue imports with an `any` shim. The framework lint runner only consumes rules from the central config; it does not define another policy.

`npm run lint`, `npm run typecheck`, and `npm test` remain available individually. `npm run format` / `npm run format:check` cover tooling, tests, MCP source and the docs app; public library sources, generated references and captured historical answers are intentionally excluded to avoid an unrelated formatting migration. Validation task caching is disabled so checks execute on the current runtime.

Source checks do not build or extract metadata. Production builds still require explicit owner authorization and a fresh installed-tarball gate for each release; earlier 0.8.3 artifacts do not certify the 0.9.0 toolchain.

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