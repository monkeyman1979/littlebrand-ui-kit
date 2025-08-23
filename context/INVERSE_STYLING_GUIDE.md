# Inverse Theme Sections with LittleBrand UI Kit

## Overview

This guide documents how to create inverted theme sections that automatically display the opposite theme (light sections in dark mode, dark sections in light mode) while maintaining proper component theming with the LittleBrand UI Kit.

## The Problem

When building modern web applications, it's common to need sections that use the opposite theme for visual variety or emphasis. For example:
- A dark hero section on a light-themed page
- A light testimonial section on a dark-themed page
- Marketing pages with alternating light/dark sections (like Supersolid.agency)

The challenge is making all UI components (buttons, inputs, checkboxes, etc.) automatically adapt to these inverted contexts.

## The Solution

### Core Concept

The solution leverages CSS custom properties (variables) and theme detection to create "theme bubbles" where all components automatically use the opposite theme's colors.

### Implementation

#### 1. Basic HTML Structure

```html
<section class="component-section inverted-section">
  <h2>Inverted Section Title</h2>
  <p>This section will always display the opposite theme</p>
  
  <!-- Components automatically adapt -->
  <lb-button variant="filled">Button</lb-button>
  <lb-checkbox v-model="checked">Checkbox</lb-checkbox>
  <lb-input placeholder="Input field" />
</section>
```

#### 2. CSS Implementation

Add this CSS to your application:

```css
/* Base inverted section styles */
.inverted-section {
  padding: 2rem;
  border-radius: var(--lb-radius-lg);
  margin: 1.5rem 0;
  position: relative;
  isolation: isolate;
}

/* When in LIGHT mode, show DARK appearance */
html:not(.dark) .inverted-section {
  /* Dark background colors */
  background: #1A1D23;
  color: #F8FAFC;
  
  /* Override CSS variables for all child components */
  --lb-background-page: #0F1114;
  --lb-background-surface: #1A1D23;
  --lb-surface-neutral-subtle: #1E2228;
  --lb-surface-neutral-normal: #252931;
  --lb-surface-neutral-hover: #2C313A;
  --lb-surface-neutral-active: #353B46;
  --lb-text-neutral-contrast-high: #F8FAFC;
  --lb-text-neutral-normal: #CBD5E1;
  --lb-text-neutral-contrast-low: #94A3B8;
  --lb-border-neutral-normal: #475569;
  --lb-border-neutral-line: #334155;
  --lb-fill-neutral-normal: #64748B;
  --lb-fill-neutral-hover: #7C8BA0;
}

/* When in DARK mode, show LIGHT appearance */
html.dark .inverted-section {
  /* Light background colors */
  background: #FBFCFD;
  color: #1A1D23;
  
  /* Override CSS variables for all child components */
  --lb-background-page: #FFFFFF;
  --lb-background-surface: #FBFCFD;
  --lb-surface-neutral-subtle: #FBFCFD;
  --lb-surface-neutral-normal: #F7F9FB;
  --lb-surface-neutral-hover: #EFF2F5;
  --lb-surface-neutral-active: #E7EBEF;
  --lb-text-neutral-contrast-high: #1A1D23;
  --lb-text-neutral-normal: #475569;
  --lb-text-neutral-contrast-low: #64748B;
  --lb-border-neutral-normal: #CBD5E1;
  --lb-border-neutral-line: #E2E8F0;
  --lb-fill-neutral-normal: #94A3B8;
  --lb-fill-neutral-hover: #7C8BA0;
}

/* Ensure text colors inherit properly */
.inverted-section h1,
.inverted-section h2,
.inverted-section h3,
.inverted-section h4,
.inverted-section p {
  color: inherit;
}
```

#### 3. Dark Mode Toggle Setup

Ensure your application toggles the dark class on the HTML element:

```javascript
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
```

## How It Works

### 1. Theme Detection
- `html:not(.dark)` targets light mode
- `html.dark` targets dark mode
- The selectors detect the current theme state

### 2. CSS Variable Cascade
- CSS custom properties cascade down to child elements
- By redefining variables in `.inverted-section`, all child components automatically use the new values
- Components don't need to know they're in an inverted context

### 3. Automatic Component Adaptation
- LittleBrand UI components use CSS variables for colors
- When those variables are overridden locally, components automatically adapt
- Buttons, inputs, checkboxes, etc. all use the inverted theme colors

## Advanced Features

### Smooth Transitions

Add smooth transitions when toggling between themes:

```css
.inverted-section {
  transition: background-color 0.6s ease, color 0.6s ease;
}

.inverted-section * {
  transition: color 0.3s ease, 
              background-color 0.3s ease,
              border-color 0.3s ease;
}
```

### Scroll-Triggered Inversion

Make sections invert as they come into view:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const invertedSectionRef = ref(null)
const isInView = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        isInView.value = entry.isIntersecting
      })
    },
    { 
      threshold: 0.2,  // Trigger when 20% visible
      rootMargin: '-100px'  // Start 100px before fully in view
    }
  )
  
  if (invertedSectionRef.value) {
    observer.observe(invertedSectionRef.value)
  }
})
</script>

<template>
  <section 
    ref="invertedSectionRef"
    :class="['component-section', { 'inverted-section': isInView }]"
  >
    <!-- Content -->
  </section>
</template>
```

### Nested Cards with Depth

Create visual hierarchy within inverted sections:

```css
.inverted-section .sub-card {
  background: var(--lb-surface-neutral-normal);
  padding: 1.5rem;
  border-radius: var(--lb-radius-md);
  margin-top: 1.5rem;
}
```

## Custom Color Support

### Using Custom Neutral Colors

If you've customized the neutral color palette (e.g., with blue undertones like #94A3B8), update the hardcoded values to match:

```css
/* Example with blue-gray neutral colors */
html.dark .inverted-section {
  background: #FBFCFD;  /* Light with blue tint */
  color: #1A1D23;       /* Dark with blue tint */
  --lb-fill-neutral-normal: #94A3B8;  /* Your custom blue-gray */
}
```

### Supporting Other Color Tokens

For complete theme inversion including primary, secondary, error colors:

```css
html:not(.dark) .inverted-section {
  /* Neutral colors (as above) */
  
  /* Primary colors */
  --lb-fill-primary-normal: #6366F1;  /* Dark mode primary */
  --lb-fill-primary-hover: #5558E3;
  --lb-text-primary-normal: #9CA3FF;
  
  /* Secondary colors */
  --lb-fill-secondary-normal: #EC4899;
  --lb-fill-secondary-hover: #E03E8C;
  
  /* Add other color tokens as needed */
}
```

## Limitations & Considerations

### Current Limitations

1. **Hardcoded Values**: Color values are hardcoded rather than dynamically pulled from the theme
2. **Manual Maintenance**: If theme colors change, inverse values need manual updates
3. **Incomplete Coverage**: Only neutral colors are inverted by default; other colors need explicit handling

### Future Improvements

Ideally, this functionality would be built into the UI kit:

```html
<!-- Hypothetical future API -->
<lb-inverse>
  <!-- All content automatically inverted -->
</lb-inverse>

<!-- Or as a directive -->
<section v-lb-inverse>
  <!-- Content -->
</section>
```

## Best Practices

1. **Use Sparingly**: Inverted sections are powerful but should be used purposefully
2. **Maintain Contrast**: Ensure text remains readable in both themes
3. **Test Both Modes**: Always verify appearance in both light and dark modes
4. **Consider Accessibility**: Some users may find frequent theme changes jarring
5. **Performance**: Use CSS-only solutions when possible; avoid JavaScript for basic inversions

## Example Use Cases

### Hero Section
```html
<section class="hero inverted-section">
  <h1>Welcome to Our Product</h1>
  <p>Stand out with an inverted hero section</p>
  <lb-button variant="filled">Get Started</lb-button>
</section>
```

### Testimonial Cards
```html
<section class="testimonials inverted-section">
  <div class="sub-card">
    <p>"Great product!"</p>
    <cite>- Happy Customer</cite>
  </div>
</section>
```

### Feature Sections
```html
<section class="features inverted-section">
  <h2>Premium Features</h2>
  <div class="feature-grid">
    <lb-card>Feature 1</lb-card>
    <lb-card>Feature 2</lb-card>
  </div>
</section>
```

## Troubleshooting

### Section Not Inverting

1. **Check HTML class**: Ensure `dark` class is on `<html>` element, not `<body>`
2. **Verify selectors**: Use `html.dark` not `.dark` or `:root.dark`
3. **CSS specificity**: Make sure inverse styles aren't being overridden

### Components Not Adapting

1. **Variable names**: Ensure you're overriding the correct CSS variable names
2. **Scope**: Variables must be defined on the container, not individual components
3. **Cascade**: Check that components are actually children of the inverted section

### Colors Look Wrong

1. **Theme mismatch**: Verify the hardcoded colors match your theme
2. **Custom colors**: If using custom brand colors, update the inverse values
3. **Browser support**: Ensure browser supports CSS custom properties

## Conclusion

This inverse theming approach provides a flexible way to create visually interesting layouts while maintaining consistency with the LittleBrand UI Kit. The technique leverages modern CSS features to create theme-aware sections that automatically adapt all child components.

The key insight is using CSS custom properties as a "theme bubble" - by redefining variables in a local scope, all descendant components automatically adopt the new theme without needing individual styling or JavaScript manipulation.

While this implementation requires some manual setup, it provides a solid foundation for creating sophisticated, theme-aware designs that work seamlessly with the LittleBrand UI Kit component library.