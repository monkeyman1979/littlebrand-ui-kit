# LittleBrand UI Kit - Customization Guide

Your complete guide to customizing the LittleBrand UI Kit for your project.

## 📚 Quick Links

- **[Typography Customization Guide](./TYPOGRAPHY_CUSTOMIZATION_GUIDE.md)** - Detailed font setup and typography customization
- **[CSS Variables Reference](./CSS_VARIABLES_REFERENCE.md)** - Complete list of all 200+ customizable variables
- **[Override Template](./littlebrand-overrides-template.sass)** - Ready-to-use starter file with all variables 🎯
- **[TypeScript Definitions](./littlebrand.css.d.ts)** - IntelliSense support for VS Code

> **💡 Pro Tip:** Start with the `littlebrand-overrides-template.sass` file! It has all 200+ variables organized and commented - just uncomment what you need to customize.

## 🚀 Quick Start

### Method 1: JavaScript Runtime (Easiest for Colors)

The simplest way to customize colors - no CSS needed!

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { LittleBrandUI, applyTheme } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// Customize colors - one color generates 68+ tokens!
applyTheme({
  primary: '#6B46C1',    // Your brand purple
  secondary: '#10B981',  // Your brand green
  // Optional: customize any/all semantic colors
  // tertiary: '#F59E0B',
  // neutral: '#6B7280',
  // success: '#10B981',
  // warning: '#F59E0B',
  // error: '#EF4444',
  // info: '#3B82F6'
})

const app = createApp(App)
app.use(LittleBrandUI)  // Register all components
app.mount('#app')
```

### Method 2: CSS Variable Overrides

For complete control over all aspects (typography, spacing, etc.):

#### Option A: Use the Template (Recommended) 🎯

The easiest way - we've created a template with ALL 200+ variables ready to customize:

1. **Copy the template file** to your project:
   ```bash
   cp node_modules/littlebrand-ui-kit/littlebrand-overrides-template.sass _littlebrand-overrides.sass
   ```

2. **Open the file and uncomment only what you need**:
   ```sass
   // The template has everything organized by category
   :root
     // TYPOGRAPHY - Uncomment what you need
     --lb-font-heading: 'Inter', sans-serif
     --lb-font-weight-heading: 700
     
     // COLOR TOKENS - Already organized by variant
     --lb-fill-primary-normal: #6B46C1
     
     // SPACING - All options listed
     --lb-radius-md: 12px
   ```

#### Option B: Create From Scratch (Minimal)

If you prefer a minimal file with only your overrides:

1. **Create your override file** (`_littlebrand-overrides.sass`):

```sass
// Load custom fonts (optional)
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')

// Override CSS variables
:root
  // Typography
  --lb-font-heading: 'Inter', sans-serif
  --lb-font-body: 'Inter', sans-serif
  --lb-font-weight-heading: 700
  
  // Colors (if not using applyTheme)
  --lb-fill-primary-normal: #6B46C1
  --lb-fill-primary-hover: #7C52D9
  --lb-border-primary-normal: #6B46C1
  
  // Spacing
  --lb-radius-md: 12px
```

2. **Import AFTER the UI kit styles** (for both options):

```sass
// main.sass
@import 'littlebrand-ui-kit/style'
@import 'littlebrand-overrides'  // Must come AFTER
```

### Method 3: Combine Both Approaches

Use JavaScript for colors, CSS for everything else:

```javascript
// main.js - Handle colors
import { applyTheme } from 'littlebrand-ui-kit'

applyTheme({
  primary: '#6B46C1',
  secondary: '#10B981'
})
```

```sass
// _littlebrand-overrides.sass - Handle typography, spacing, etc.
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')

:root
  --lb-font-heading: 'Inter', sans-serif
  --lb-font-weight-heading: 700
  --lb-radius-md: 12px
```

## 🎨 What Can Be Customized?

### Typography System
- **Font families** - Separate fonts for headings, body, and code
- **Font weights** - Unified control for all headings, body text, and labels
- **Font sizes** - Responsive sizing system with body and label scales
- **Line heights** - From tight to relaxed spacing
- **Letter spacing** - Fine-tune character spacing

### Color System
- **8 Semantic Colors** - primary, secondary, tertiary, neutral, success, warning, error, info
- **5 Token Types per Color**:
  - `border-*` - Outlines and dividers
  - `fill-*` - Backgrounds for buttons and interactive elements
  - `text-*` - Text colors with contrast variants
  - `surface-*` - Card and panel backgrounds
  - `text-on-*` - Text colors for filled backgrounds
- **5 States per Token** - normal, hover, active, focus, disabled
- **Dark Mode** - All colors auto-adjust with `[data-theme="dark"]` or `.dark` class

### Spacing & Layout
- **15-step spacing scale** - From 2px to 120px
- **14 border radius options** - From 4px to full circle
- **Icon sizes** - Small, medium, large
- **Input heights** - Medium and large variants
- **Border widths** - 1px and 2px options

### Special Tokens
- **Backgrounds** - Page, surface, and overlay backgrounds
- **Focus ring** - Customizable focus indicator color
- **Dividers** - Separator line color

## 📋 Common Customization Scenarios

### Scenario 1: Brand Colors Only

Just want to change the primary brand color?

```sass
:root
  --lb-fill-primary-normal: #8B5CF6
  --lb-fill-primary-hover: #9F7AEA
  --lb-border-primary-normal: #8B5CF6
  --lb-text-primary-normal: #8B5CF6
```

### Scenario 2: Custom Font Family

Using a custom font from Google Fonts:

```sass
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap')

:root
  --lb-font-heading: 'Poppins', sans-serif
  --lb-font-body: 'Poppins', sans-serif
  --lb-font-weight-heading: 600
```

### Scenario 3: Different Heading and Body Fonts

Want a serif font for headings and sans-serif for body?

```sass
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap')

:root
  --lb-font-heading: 'Playfair Display', serif
  --lb-font-body: 'Inter', sans-serif
  --lb-font-weight-heading: 700
  --lb-font-weight-body: 400
```

### Scenario 4: Rounded Corners

Want more rounded components?

```sass
:root
  --lb-radius-sm: 6px
  --lb-radius-md: 12px
  --lb-radius-lg: 16px
  --lb-radius-xl: 20px
```

### Scenario 5: Larger Typography

Need bigger text throughout?

```sass
:root
  --lb-font-size-body-base: 1.125rem  // 18px instead of 16px
  --lb-font-size-body-large: 1.25rem   // 20px instead of 18px
  --lb-line-height-normal: 1.6         // More spacing between lines
```

### Scenario 6: Dark Mode Specific Overrides

Need different values for dark mode?

```sass
// Light mode defaults
:root
  --lb-fill-primary-normal: #6B46C1

// Dark mode overrides
[data-theme="dark"], .dark
  --lb-fill-primary-normal: #8B5CF6  // Brighter in dark mode
  --lb-background-page: #0A0A0A      // Darker background
```

### Scenario 7: Component-Level Overrides

Want different styles for a specific section?

```sass
.marketing-section
  --lb-font-heading: 'Impact', sans-serif
  --lb-font-weight-heading: 900
  --lb-font-size-body-base: 1.25rem
```

## 🌙 Dark Mode

### Default Behavior

**Dark mode is OFF by default.** The UI kit includes dark mode styles, but they are never activated unless you explicitly enable them.

### For Light-Only Projects

**Nothing to do!** If you never enable dark mode, your site will always use the light theme colors. The dark mode CSS is included but has zero impact on light-only projects.

### How to Enable Dark Mode

If you want dark mode, you need to explicitly opt-in using one of these methods:

#### Method 1: Manual Toggle (JavaScript)

```javascript
// Enable dark mode
document.documentElement.setAttribute('data-theme', 'dark')
// OR
document.documentElement.classList.add('dark')

// Disable dark mode (back to light)
document.documentElement.removeAttribute('data-theme')
// OR
document.documentElement.classList.remove('dark')

// Toggle function
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
}
```

#### Method 2: Static HTML

```html
<!-- Apply dark mode to entire page -->
<html data-theme="dark">
  <!-- All content will use dark theme -->
</html>

<!-- OR using class -->
<body class="dark">
  <!-- All content will use dark theme -->
</body>

<!-- Apply to specific sections only -->
<div class="dark">
  <!-- Only this section uses dark theme -->
</div>
```

#### Method 3: Auto-Detect System Preference

```javascript
// Add this to your app initialization
// Respects user's OS dark mode setting
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark')
}

// Optional: Listen for changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
  })
```

#### Method 4: Save User Preference

```javascript
// Complete dark mode implementation with localStorage
function initTheme() {
  // Check for saved preference or default to light
  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

// Initialize on page load
initTheme()
```

### Dark Mode CSS Variables

All color variables automatically switch when dark mode is active. You can also customize dark mode specifically:

```sass
// Light mode overrides
:root
  --lb-fill-primary-normal: #6B46C1
  --lb-background-page: #FFFFFF

// Dark mode specific overrides
[data-theme="dark"], .dark
  --lb-fill-primary-normal: #8B5CF6  // Brighter purple in dark
  --lb-background-page: #0A0A0A      // Darker background
```

### Summary

- **Default:** Light mode only (dark mode is OFF)
- **Light-only projects:** Do nothing - it just works
- **Want dark mode:** Must explicitly enable using one of the methods above
- **Customizable:** Can override dark mode colors separately from light mode

## 🛠️ Advanced Customization

### Using the Override Template

For comprehensive customization:

1. Copy `littlebrand-overrides-template.sass` to your project
2. Rename it to `_littlebrand-overrides.sass`
3. Uncomment only the variables you want to change
4. Import it after the UI kit styles

The template contains ALL 200+ variables, organized by category with helpful comments.

### TypeScript Support

For IntelliSense in VS Code:

1. Copy `littlebrand.css.d.ts` to your project
2. Get autocomplete for all CSS variables
3. See descriptions on hover

### Variable Naming Convention

All variables follow this pattern:
```
--lb-[category]-[variant]-[state]

Examples:
--lb-fill-primary-normal
--lb-border-success-hover
--lb-text-error-disabled
```

## 📖 Best Practices

1. **Start Small** - Override only what you need
2. **Use :root** - Always use `:root` for global overrides
3. **Import Order** - Your overrides must come AFTER the UI kit
4. **Test Dark Mode** - Verify your overrides work in both themes
5. **Use Semantic Colors** - Prefer semantic tokens over direct colors
6. **Maintain Contrast** - Ensure text remains readable
7. **Use the Template** - Start with the override template for complex customizations

## 🔍 Finding Variables

Not sure what variable to override?

1. **Check the Reference** - See [CSS Variables Reference](./CSS_VARIABLES_REFERENCE.md) for the complete list
2. **Use Browser DevTools** - Inspect elements to see which variables they use
3. **Use the Template** - Browse `littlebrand-overrides-template.sass` with all variables
4. **TypeScript Helps** - Use `littlebrand.css.d.ts` for autocomplete

## 💡 Tips & Tricks

### Quickly Change All Headings Weight
```sass
:root
  --lb-font-weight-heading: 400  // Makes ALL h1-h6 regular weight
```

### Use System Fonts for Performance
```sass
:root
  --lb-font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
  --lb-font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

### Variable Fonts for Flexibility
```sass
@font-face
  font-family: 'VariableFont'
  src: url('/fonts/Variable.woff2') format('woff2-variations')
  font-weight: 100 900

:root
  --lb-font-heading: 'VariableFont', sans-serif
  --lb-font-weight-heading: 650  // Any value in range
```

## ❓ Troubleshooting

### Changes Not Applying?
- Check import order (overrides must come AFTER UI kit)
- Verify you're using `:root` selector
- Check browser DevTools for CSS specificity issues

### Font Not Loading?
- Check Network tab in DevTools
- Ensure all needed weights are loaded (400, 500, 600, 700)
- Verify font URL is correct

### Dark Mode Issues?
- Use `[data-theme="dark"], .dark` for dark mode overrides
- Test with both selectors
- Check contrast ratios

## 📚 More Resources

- **[Typography Customization Guide](./TYPOGRAPHY_CUSTOMIZATION_GUIDE.md)** - Deep dive into typography
- **[CSS Variables Reference](./CSS_VARIABLES_REFERENCE.md)** - Every single variable documented
- **[Examples](./examples/)** - See it in action
- **[GitHub Issues](https://github.com/monkeyman1979/littlebrand-ui-kit/issues)** - Get help

---

Remember: The LittleBrand UI Kit is designed to be customizable without touching component files. All customization happens through CSS variables, making updates and maintenance easy.