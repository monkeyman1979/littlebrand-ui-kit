# LittleBrand UI Kit - Implementation Notes

This document contains important implementation details and solutions for common issues encountered when using the LittleBrand UI Kit.

## Table of Contents
- [Snackbar Implementation](#snackbar-implementation)
- [Popover Implementation](#popover-implementation)
- [Component Registration](#component-registration)
- [Common Issues and Solutions](#common-issues-and-solutions)

## Snackbar Implementation

### Problem
The snackbar component requires a provider context pattern, but calling `useSnackbar()` or `inject('snackbar')` directly in the main App.vue component results in an error:
```
Error: useSnackbar() was called but no LbSnackbarProvider was found in the component tree
```

### Root Cause
The injection happens during the component setup phase, but the provider context is only available to child components of `<lb-snackbar-provider>`, not to the component that contains the provider itself.

### Solution
Create a separate handler component that lives inside the provider:

1. **Create SnackbarHandler.vue** - A component that properly injects the snackbar context:
```vue
<script setup>
import { inject, onMounted, onUnmounted } from 'vue'

const snackbarContext = inject('snackbar', null)

const handleShowSnackbar = (event) => {
  if (snackbarContext && snackbarContext.showSnackbar) {
    const { message, variant, duration } = event.detail
    snackbarContext.showSnackbar({
      message,
      variant,
      duration
    })
  }
}

onMounted(() => {
  window.addEventListener('show-snackbar', handleShowSnackbar)
})

onUnmounted(() => {
  window.removeEventListener('show-snackbar', handleShowSnackbar)
})
</script>
```

2. **Use custom events** in the parent component to trigger snackbars:
```javascript
const showSnackbar = (variant = 'info') => {
  window.dispatchEvent(new CustomEvent('show-snackbar', { 
    detail: { 
      message: `This is a ${variant} snackbar notification!`,
      variant,
      duration: 3000
    } 
  }))
}
```

3. **Structure the template** with the handler inside the provider:
```vue
<template>
  <lb-snackbar-provider>
    <snackbar-handler />
    <!-- Rest of your app content -->
  </lb-snackbar-provider>
</template>
```

## Popover Implementation

### Problem
Multiple popover instances on the same page were not working independently. Only the first popover would open, while others remained unresponsive.

### Root Cause
Each popover instance needs its own state management. Without explicit state binding, the popovers don't track their open/closed state properly.

### Solution
Create separate reactive state for each popover instance:

```javascript
// Define separate states for each popover
const popoverOpen = ref(false)
const popoverTopOpen = ref(false)
const popoverRightOpen = ref(false)
```

Then bind each popover to its respective state:
```vue
<!-- Controlled popover with v-model:open -->
<lb-popover v-model:open="popoverOpen">
  <lb-popover-trigger>
    <lb-button variant="outline">
      Show Popover ({{ popoverOpen ? 'Open' : 'Closed' }})
    </lb-button>
  </lb-popover-trigger>
  <lb-popover-content>
    <div style="padding: 1rem; min-width: 200px;">
      <h4>Popover Title</h4>
      <p>This is popover content.</p>
      <lb-button size="small" @click="popoverOpen = false">Close</lb-button>
    </div>
  </lb-popover-content>
</lb-popover>

<!-- Popover with placement prop -->
<lb-popover v-model:open="popoverTopOpen" placement="top">
  <!-- content -->
</lb-popover>
```

### Styling Considerations
- The popover component already provides background, border, and shadow styling
- Don't add duplicate styling to the content inside `<lb-popover-content>`
- The popover uses `Teleport` to render outside the DOM hierarchy for proper positioning

## Component Registration

### Global Registration Pattern
Instead of importing components individually in each file, register them globally in `main.js`:

```javascript
import {
  LbButton,
  LbSnackbar,
  LbSnackbarProvider,
  LbPopover,
  LbPopoverContent,
  LbPopoverTrigger,
  // ... other components
} from 'littlebrand-ui-kit'

const app = createApp(App)

// Register each component globally
app.component('LbButton', LbButton)
app.component('LbSnackbar', LbSnackbar)
app.component('LbSnackbarProvider', LbSnackbarProvider)
app.component('LbPopover', LbPopover)
app.component('LbPopoverContent', LbPopoverContent)
app.component('LbPopoverTrigger', LbPopoverTrigger)
// ... register other components

app.mount('#app')
```

This allows you to use the components anywhere in your templates without importing them.

## Common Issues and Solutions

### Issue: Badge Component Colors Not Working
**Solution**: Use the correct prop syntax. Instead of `variant="filled" color="primary"`, use just `variant="primary"`.

### Issue: Chip Component Missing States
**Solution**: Chips support `selectable` and `deletable` props:
```vue
<lb-chip 
  selectable 
  v-model:selected="chipSelected1"
  @delete="handleDelete"
>
  Selectable Chip
</lb-chip>
```

### Issue: Navigation Bar Fixed at Bottom
**Solution**: Add `:fixed="false"` prop to prevent fixed positioning:
```vue
<lb-navigation-bar :fixed="false">
  <!-- navigation items -->
</lb-navigation-bar>
```

### Issue: Horizontal Page Overflow
**Solution**: Add proper CSS to prevent overflow:
```css
html {
  overflow-x: hidden;
  width: 100%;
}

body {
  overflow-x: hidden;
  width: 100%;
}

* {
  box-sizing: border-box;
}
```

### Issue: Components Not Using Theme Variables
**Solution**: Use the UI kit's CSS variables for consistent theming:
- Backgrounds: `var(--lb-background-page)`, `var(--lb-surface-neutral-subtle)`
- Text: `var(--lb-text-neutral-contrast-high)`, `var(--lb-text-neutral-normal)`
- Borders: `var(--lb-border-neutral-line)`
- Spacing: `var(--lb-space-sm)`, `var(--lb-space-md)`
- Radius: `var(--lb-radius-sm)`, `var(--lb-radius-md)`

## Known Bugs in UI Kit Components

### LbCustomSelect Component
**Issue**: Template error with `aria-haspopup` attribute
**Error**: `Property "listbox" was accessed during render but is not defined on instance`
**Root Cause**: Line 18 of LbCustomSelect.vue has `:aria-haspopup="listbox"` but should be `:aria-haspopup="'listbox'"` (string literal)
**Workaround**: Component is currently commented out in the showcase until fixed

### LbSelect Component
**Issue**: Placeholder text is center-aligned
**Symptom**: The placeholder text in the select dropdown appears centered instead of left-aligned
**Root Cause**: Missing `text-align: left` on the `.select-value` class
**Workaround**: Add CSS override:
```css
.lb-select .select-value {
  text-align: left;
}
```

### LbRadio Component
**Issue**: No default slot for label text
**Symptom**: Text passed as children to LbRadio doesn't render, radio buttons aren't clickable
**Root Cause**: The component only renders the radio input and visual indicator, but doesn't have a slot for label text
**Workaround**: Wrap each LbRadio with a `<label>` element and put the text in a sibling `<span>`
**Example**:
```vue
<label class="radio-label">
  <lb-radio v-model="value" value="option1" name="group" />
  <span>Option 1</span>
</label>
```

### LbCheckbox Component
**Issue**: No default slot for label text (same as LbRadio)
**Symptom**: Text passed as children to LbCheckbox doesn't render, clickable area is limited to checkbox icon only
**Root Cause**: The component only renders the checkbox input and visual indicator, but doesn't have a slot for label text
**Workaround**: Wrap each LbCheckbox with a `<label>` element and put the text in a sibling `<span>`
**Example**:
```vue
<label class="checkbox-label">
  <lb-checkbox v-model="checked" />
  <span>Checkbox label text</span>
</label>
```

### LbSwitch Component
**Issue 1**: No default slot for label text (same as LbRadio and LbCheckbox)
**Symptom**: Text passed as children to LbSwitch doesn't render, clickable area is limited to switch toggle only
**Root Cause**: The component only renders the switch input and visual indicator, but doesn't have a slot for label text
**Workaround**: Wrap each LbSwitch with a `<label>` element and put the text in a sibling `<span>`
**Example**:
```vue
<label class="switch-label">
  <lb-switch v-model="enabled" />
  <span>Enable feature</span>
</label>
```

**Issue 2**: Partial click area (Critical Bug)
**Symptom**: Only the right half of the switch is clickable when no label is present
**Root Cause**: The hidden input element likely isn't positioned/sized correctly to cover the entire visual switch area
**Impact**: Poor user experience - the component should be fully functional standalone without requiring a label wrapper
**Use Cases Affected**: 
- Switches in data tables
- Icon-only interfaces
- Custom label layouts
- Settings panels with separated labels
**Suggested Fix**: Ensure the hidden checkbox input has `width: 100%` and `height: 100%` with proper absolute positioning to cover the entire switch visual area

### LbDivider Component (Vertical Orientation)
**Issue**: No prop to control stretch behavior in flex containers
**Symptom**: Vertical dividers have a hardcoded height of 24px, which prevents them from stretching to match parent container height
**Root Cause**: 
- Line 71 in LbDivider.vue sets `height: base.$space-2xl` (24px) which overrides the `align-self: stretch` behavior
- No prop available to control whether the divider should stretch or maintain fixed height
- Current props only include: `orientation`, `size`, and `inset`
**Impact**: 
- Dividers don't match the height of adjacent buttons (32px) or other content
- In toolbars or nav bars, dividers appear too short
- Cannot properly separate content without using workarounds
**Current Behavior**: Vertical dividers always render at 24px height regardless of container
**Suggested Fix**: 
1. Add a `stretch` or `fluid` boolean prop to allow dividers to fill parent height
2. OR: Remove the fixed height and use `height: auto` with `align-self: stretch` as default
3. OR: Add a `height` prop that accepts 'auto' | 'default' | custom values
**Example of desired usage**:
```vue
<!-- Should stretch to match button height automatically -->
<div style="display: flex; align-items: stretch;">
  <lb-button>Button</lb-button>
  <lb-divider orientation="vertical" :stretch="true" />
  <lb-button>Button</lb-button>
</div>
```

### LbBottomSheet & LbDialog Components
**Issue**: Background scrolls while scrolling inside the bottom sheet/dialog
**Symptoms**: 
- When scrolling content inside an open bottom sheet, the background page also scrolls
- This is especially noticeable with the expandable bottom sheet
- Creates a poor user experience and breaks the modal paradigm
**Root Cause**: The component doesn't implement scroll locking on the body element
**Best Practices for Fix**:
1. Apply `overflow: hidden` to body when sheet opens
2. Remove `overflow: hidden` when sheet closes
3. Preserve and restore scroll position
4. Handle iOS Safari edge cases with proper touch handling
**Example Implementation**:
```javascript
// When opening
const scrollY = window.scrollY;
document.body.style.position = 'fixed';
document.body.style.top = `-${scrollY}px`;
document.body.style.overflow = 'hidden';

// When closing
document.body.style.position = '';
document.body.style.top = '';
document.body.style.overflow = '';
window.scrollTo(0, scrollY);
```
**Impact**: Users experience unwanted background scrolling, making the component feel unpolished

### LbDatePicker Component
**Issue**: Closing behavior may not work as expected in some cases
**Symptoms**: 
- Clicking outside the DatePicker should close it (this works)
- Cancel button should close the picker (this should work but may need testing)
- When trigger button goes out of viewport, picker should close (not implemented)
**Root Cause Analysis**:
1. The DatePicker uses LbPopover internally with `close-on-click-outside="true"`
2. The Popover sets up event listeners globally on mount (not conditionally)
3. The DatePicker has its own `isOpen` ref that controls the popover's open state
4. The closing behavior on click-outside works through the popover's handleClickOutside
5. The Cancel button calls `handleCancel` which sets `isOpen.value = false` and should close the picker
6. There's an auto-commit behavior: when closing via click-outside, if the internal date differs from the model value, it commits the change (lines 260-265)
**Notes**:
- The viewport trigger visibility closing is NOT implemented - this would require IntersectionObserver or scroll event handling
- The popover correctly uses v-model:open binding between DatePicker's isOpen and Popover's open prop
- Event listeners are properly cleaned up on unmount
**Recommendation**: 
- If Cancel button isn't working, check if the button click is being captured/prevented elsewhere
- For viewport-based closing, would need to add IntersectionObserver to detect when trigger leaves viewport
- Consider if auto-commit on close behavior (lines 260-265) is desired UX

### LbAvatar + LbBadge Integration
**Issue**: No built-in support for badge positioning on avatars
**Current Behavior**: 
- Avatar has a `status` prop for built-in status indicators (online, offline, away, busy)
- Badge has a `position` prop for absolute positioning (top-right, top-left, bottom-right, bottom-left)
- However, Badge requires a positioned parent container to work with absolute positioning
**Workaround Required**: Must wrap Avatar and Badge in a relative-positioned container
```vue
<div style="position: relative; display: inline-flex;">
  <lb-avatar name="User" size="lg" />
  <lb-badge variant="error" position="top-right">3</lb-badge>
</div>
```
**Suggested Fix**: 
1. Add a badge slot to LbAvatar component
2. OR create an LbAvatarBadge wrapper component that handles the positioning
3. OR have Avatar component automatically provide positioning context when used with badges
**Impact**: Users need to add wrapper elements with positioning styles, which goes against the "no custom CSS" principle

## Missing/Unavailable Components

### LbDropdown Component
**Status**: Not exported from package
**Location**: Exists in `/src/components/Dropdown/` but not exported in main index
**Internal Usage**: Used as a base component by:
  - **LbSelect** - Wraps dropdown for select functionality
  - **LbCustomSelect** - Uses dropdown for custom select behavior
  - **LbMenu** - Uses dropdown for menu popups
  - **LbCalendar** - Uses LbSelect (which uses LbDropdown) for month/year selection
**Impact**: Cannot be used directly by consumers of the UI kit for custom dropdown needs
**Recommendation**: Either export it for public use or document it as an internal-only component

## Typography System Issues

### Current Problem
**Issue**: No CSS variables for typography customization
**Impact**: Users must use `!important` to override fonts (bad practice)
**Root Cause**: Fonts are hardcoded in the UI kit CSS instead of using CSS variables
**Verification**: Confirmed by searching the entire UI kit codebase - the variables `--lb-font-heading`, `--lb-font-body`, and `--lb-font-label` do NOT exist

### Required CSS Variables
The UI kit should expose these CSS variables that users can override:

#### Font Family Variables
```css
:root {
  --lb-font-heading: system-ui, sans-serif;  /* For h1-h6 */
  --lb-font-body: system-ui, sans-serif;     /* For paragraphs, general text */
  --lb-font-label: system-ui, sans-serif;    /* For buttons, labels, UI elements */
  --lb-font-mono: monospace;                 /* For code blocks */
}
```

#### Font Weight Variables
```css
:root {
  --lb-font-weight-heading: 600;  /* Weight for all headings */
  --lb-font-weight-body: 400;     /* Weight for body text */
  --lb-font-weight-label: 500;    /* Weight for buttons, labels, badges, chips */
  
  /* Optional: Individual heading weights for fine control */
  --lb-font-weight-h1: 700;
  --lb-font-weight-h2: 600;
  --lb-font-weight-h3: 600;
  --lb-font-weight-h4: 600;
  --lb-font-weight-h5: 500;
  --lb-font-weight-h6: 500;
}
```

**Important**: 
- Font families should accept ANY type (serif, sans-serif, display, cursive, etc.)
- Font weights should be numeric values (100-900) for maximum flexibility
- These variables should be used consistently across all components

### How Components Should Use Them
```css
/* Instead of hardcoding fonts */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--lb-font-heading);
  font-weight: var(--lb-font-weight-heading);
}

/* IMPORTANT: Must explicitly target text elements, not just body */
body, p, li, td, th, dd, dt, address, blockquote {
  font-family: var(--lb-font-body);
  font-weight: var(--lb-font-weight-body);
}

.lb-button, .lb-label, .lb-badge, .lb-chip {
  font-family: var(--lb-font-label);
  font-weight: var(--lb-font-weight-label);
}
```

**Implementation Note**: 
- Simply applying styles to `body` is NOT sufficient due to CSS specificity
- Text elements (`p`, `li`, etc.) must be explicitly targeted
- This ensures font-weight changes actually apply to all body text

### User Customization (No !important needed)
```css
/* Users just override the variables */
:root {
  --lb-font-heading: 'Playfair Display', serif;
  --lb-font-body: 'Inter', sans-serif;
  --lb-font-label: 'Inter', sans-serif;
}
```

### Current Workaround Issues
- Requires `!important` declarations (bad practice)
- Fighting against hardcoded values
- Not maintainable
- Breaks cascade and specificity rules

## Tips for Future Development

1. **Provider Pattern Components**: Always check if a component requires a provider (like SnackbarProvider). If it does, child components need to be inside the provider to access the context.

2. **State Management**: For components that can have multiple instances (like popovers, dialogs), ensure each instance has its own state variable.

3. **Component Props**: Check the component source code or documentation for the exact prop names and values. Some components combine props (like Badge using just `variant` instead of `variant` + `color`).

4. **Teleport Components**: Components that use Teleport (like popover, dialog, snackbar) render outside their parent DOM hierarchy. Don't rely on parent styling or positioning for these components.

5. **Event Handling**: When a component needs to communicate across the provider boundary, consider using custom events or a state management solution rather than trying to inject contexts where they're not available.