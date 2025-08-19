# LittleBrand UI Kit - Component Patterns Guide

## Overview
This guide establishes the coding patterns and standards for all LittleBrand UI Kit components. Every component must follow these patterns for consistency.

## Component File Structure

```vue
<template lang="pug">
// Semantic HTML with meaningful class names
// NO utility classes, NO unnecessary divs
</template>

<script setup>
// Composition API only
// Props, emits, slots clearly defined
</script>

<style lang="sass" scoped>
// Import only needed SASS files
// Use CSS custom properties for ALL values
// Grid/Flexbox for ALL layouts
// No hardcoded sizes, spacing, or colors
</style>
```

## Template Patterns (Pug)

### Semantic HTML Requirements
```pug
// ✅ CORRECT - Semantic elements
button(@click="handleClick" :disabled="disabled")
  span.icon(v-if="$slots.icon")
    slot(name="icon")
  span.text
    slot

// ❌ WRONG - Divs everywhere
.button-wrapper
  .button-container
    .button(@click="handleClick")
      .icon-wrapper
        slot(name="icon")
      .text
        slot
```

### Class Naming Convention
- Component root: `.lb-[component]`
- Component parts: `.lb-[component]__[part]`
- Component states: `.lb-[component]--[state]`

```pug
// Root component
section.lb-modal(:class="{ 'lb-modal--open': isOpen }")
  // Component parts
  .backdrop(@click="close")
  .content
    header.header
    .body
      slot
```

### Required Attributes
Every interactive element needs proper attributes:
```pug
button.lb-button(
  :type="type"
  :disabled="disabled"
  :aria-label="ariaLabel || undefined"
  :aria-pressed="pressed || undefined"
)

input.lb-input(
  :id="inputId"
  :type="type"
  :value="modelValue"
  :disabled="disabled"
  :required="required"
  :aria-invalid="invalid || undefined"
  :aria-describedby="hintId || undefined"
)
```

## Script Patterns

### Props Definition
```javascript
// Group props by purpose with clear comments
const props = defineProps({
  // Content
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  
  // State
  disabled: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  
  // Behavior
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'tel', 'url'].includes(value)
  }
})
```

### Emits Definition
```javascript
// Always define emits explicitly
const emit = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'change'
])
```

### Computed Properties for Classes
```javascript
// Use computed for complex class logic
const buttonClasses = computed(() => ({
  'lb-button--primary': props.variant === 'primary',
  'lb-button--secondary': props.variant === 'secondary',
  'lb-button--disabled': props.disabled,
  'lb-button--loading': props.loading
}))
```

### ID Generation for Accessibility
```javascript
import { useId } from 'vue'

// Generate unique IDs for form associations
const inputId = useId()
const hintId = props.hint ? useId() : null
```

## Style Patterns

### CSS Variable Usage
All runtime values MUST use CSS custom properties:
```sass
// ✅ CORRECT - CSS variables for runtime values
.lb-input
  padding: var(--space-sm)
  border: var(--border-sm) solid var(--color-input-border)
  border-radius: var(--radius-md)
  font-size: var(--font-size-label-base)
  
// ❌ WRONG - SASS variables for runtime values
.lb-input
  padding: $space-sm  // These compile to fixed values!
  border: $border-thin solid $color-border
```

Available CSS Variable Categories:
- **Spacing**: `--space-2xs` through `--space-10xl`
- **Sizing**: `--size-xs` through `--size-6xl`
- **Borders**: `--border-xs` through `--border-2xl`
- **Radii**: `--radius-xs` through `--radius-2xl`
- **Opacity**: `--opacity-0` through `--opacity-100` (by tens)
- **Colors**: All color variables
- **Typography**: Font sizes, weights, line heights
- **Component-specific**: Input heights, icon sizes, etc.

### Import Strategy
```sass
// Import only what this component needs
@use '@/styles/base' as base     // For SASS variables and mixins
@use '@/styles/typography' as typography // If setting typography

// Never import main.sass in components
// All actual values come from CSS variables at runtime
```

### Component Root Styles
```sass
.lb-button
  // Layout with Grid/Flexbox
  display: inline-flex
  align-items: center
  gap: var(--space-sm)
  
  // Spacing with padding, never margin
  padding: var(--space-sm) var(--space-md)
  
  // Visual styles using CSS variables
  background: var(--color-primary)
  color: var(--color-on-primary)
  border: var(--border-md) solid transparent
  border-radius: var(--radius-md)
  
  // Typography
  font-family: var(--font-body)
  font-size: var(--font-size-label-base)
  font-weight: var(--font-weight-medium)
  
  // Transitions
  transition: all var(--transition)
  
  // States
  &:hover:not(:disabled)
    background: var(--color-primary-hover)
    
  &:focus-visible
    outline: var(--focus-ring-width) solid var(--color-focus-ring)
    outline-offset: calc(var(--space-2xs) * -1)
    
  &:disabled
    opacity: var(--opacity-60)
    cursor: not-allowed
```

### Layout Patterns

#### Form Layout with Grid
```sass
.lb-form-field
  display: grid
  gap: var(--space-xs)
  
  // Label above input
  grid-template-areas:
    "label"
    "input"
    "hint"
```

#### Button Group with Flexbox
```sass
.lb-button-group
  display: flex
  gap: var(--space-sm)
  
  // Wrap on small screens naturally
  flex-wrap: wrap
```

#### Modal Centering with Grid
```sass
.lb-modal
  display: grid
  place-items: center
  position: fixed
  inset: 0
  
  &__content
    display: grid
    gap: var(--space-md)
    max-width: min(90vw, 600px)
    max-height: 90vh
```

### Never Use These Patterns
```sass
// ❌ WRONG - No margins for spacing
.lb-button
  margin-bottom: 1rem
  margin-right: 0.5rem

// ❌ WRONG - No utility-like classes
.mb-4
  margin-bottom: 1rem

// ❌ WRONG - No pixel values
.lb-input
  padding: 8px 16px
  
// ❌ WRONG - No SASS variables for runtime values
.lb-button
  padding: $space-sm $space-md  // Use var(--space-sm) instead
  
// ❌ WRONG - No !important
.lb-modal
  z-index: 9999 !important
```

## Slot Patterns

### Icon Slots
```pug
// Provide icon slots for flexibility
.lb-input-wrapper
  input.lb-input(v-bind="inputProps")
  .lb-input__icon(v-if="$slots.icon")
    slot(name="icon")
```

### Content Slots with Defaults
```pug
// Provide sensible defaults
.lb-modal__header
  h2.lb-modal__title
    slot(name="title") {{ title }}
  button.lb-modal__close(
    v-if="showClose"
    @click="close"
    aria-label="Close"
  )
    slot(name="close")
      // CSS-only X icon
```

## Accessibility Patterns

### Form Components
- Always associate labels with inputs
- Provide aria-describedby for hints
- Set aria-invalid for error states
- Include proper keyboard support

### Interactive Components
- Proper focus management
- Keyboard navigation (Tab, Arrow keys, Escape)
- Screen reader announcements
- ARIA attributes where needed

## Event Handling Patterns

### v-model Support
```javascript
// Standard v-model pattern
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
```

### Event Forwarding
```pug
input.lb-input(
  @input="$emit('update:modelValue', $event.target.value)"
  @focus="$emit('focus', $event)"
  @blur="$emit('blur', $event)"
)
```

## Component Composition

### Using Multiple Components Together
```pug
// Example: Form field composition
.form-field
  LbLabel(:for="inputId") Email Address
  LbInput(
    :id="inputId"
    v-model="email"
    type="email"
    placeholder="you@example.com"
    :invalid="hasError"
    :aria-describedby="hintId"
  )
  LbHintText(
    :id="hintId"
    :error="hasError"
  ) {{ hasError ? errorMessage : 'We\'ll never share your email' }}
```

## Testing Patterns (Future)
- Each component should be testable in isolation
- Props should have sensible defaults
- Events should be clearly documented
- Accessibility should be verifiable