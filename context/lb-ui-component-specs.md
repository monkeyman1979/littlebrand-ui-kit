# LittleBrand UI Kit - Component Specifications

## Overview
Detailed specifications for each component in the LittleBrand UI Kit v1. Each component spec includes props, slots, events, and specific implementation notes.

## LbButton

### Purpose
Versatile button component with multiple variants and states.

### Props
- `variant`: 'primary' | 'secondary' | 'ghost' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `disabled`: Boolean (default: false)
- `loading`: Boolean (default: false)
- `fullWidth`: Boolean (default: false)

### Slots
- `default`: Button content
- `icon-leading`: Optional icon (left side)
- `icon-trailing`: Optional icon (right side)

### Events
- `click`: Native click event (not emitted when disabled/loading)

### Styling Notes
- Use CSS Grid for icon + text layout
- Ghost variant has transparent background
- Loading state shows subtle animation
- Full width uses `width: 100%` not margins

## LbInput

### Purpose
Text input field with validation states and flexible configuration.

### Props
- `modelValue`: String | Number (v-model)
- `type`: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' (default: 'text')
- `placeholder`: String
- `disabled`: Boolean (default: false)
- `readonly`: Boolean (default: false)
- `invalid`: Boolean (default: false)
- `required`: Boolean (default: false)

### Slots
- `icon-leading`: Optional icon (left of input)
- `icon-trailing`: Optional icon (right of input)

### Events
- `update:modelValue`: For v-model
- `input`: Native input event
- `change`: Native change event
- `focus`: Native focus event
- `blur`: Native blur event

### Styling Notes
- Border color changes for focus/invalid states
- Icons positioned with grid layout
- Input padding adjusted based on icon presence
- Grid template columns adjust for icon slots

## LbTextarea

### Purpose
Multi-line text input with auto-resize option.

### Props
- `modelValue`: String (v-model)
- `placeholder`: String
- `disabled`: Boolean (default: false)
- `readonly`: Boolean (default: false)
- `invalid`: Boolean (default: false)
- `required`: Boolean (default: false)
- `rows`: Number (default: 3)
- `maxRows`: Number (optional, for auto-resize)
- `autoResize`: Boolean (default: false)

### Slots
- `icon-leading`: Optional icon (top-left of textarea)
- `icon-trailing`: Optional icon (top-right of textarea)

### Events
- `update:modelValue`: For v-model
- `input`, `change`, `focus`, `blur`: Native events

### Styling Notes
- Same border/focus treatment as LbInput
- Min-height based on rows prop
- Resize handle styled consistently

## LbSelect

### Purpose
Dropdown selection with custom styling.

### Props
- `modelValue`: String | Number (v-model)
- `placeholder`: String (shows as first disabled option)
- `disabled`: Boolean (default: false)
- `invalid`: Boolean (default: false)
- `required`: Boolean (default: false)

### Slots
- `default`: Option elements
- `icon`: Custom dropdown icon (defaults to CSS chevron)

### Events
- `update:modelValue`: For v-model
- `change`: Native change event

### Styling Notes
- Custom dropdown arrow via CSS
- Icon slot replaces default arrow
- Consistent height with LbInput

## LbLabel

### Purpose
Form label with proper accessibility.

### Props
- `for`: String (ID of associated input)
- `required`: Boolean (shows indicator)
- `size`: 'small' | 'medium' | 'large' (default: 'medium')

### Slots
- `default`: Label text
- `hint`: Optional hint text (inline)
- `icon`: Optional icon (can be positioned with CSS)

### Styling Notes
- Font weight medium for clarity
- Required indicator as pseudo-element
- Size affects font-size only

## LbHintText

### Purpose
Helper/error text for form fields.

### Props
- `error`: Boolean (default: false)
- `warning`: Boolean (default: false)
- `success`: Boolean (default: false)
- `id`: String (for aria-describedby)

### Slots
- `default`: Message text
- `icon-leading`: Optional status icon (left side)
- `icon-trailing`: Optional action icon (right side)

### Styling Notes
- Color changes based on state
- Small font size
- Icon + text with flexbox gap

## LbCheckbox

### Purpose
Binary choice input with label.

### Props
- `modelValue`: Boolean (v-model)
- `value`: Any (for use in groups)
- `disabled`: Boolean (default: false)
- `indeterminate`: Boolean (default: false)
- `id`: String (auto-generated if not provided)

### Slots
- `default`: Label content

### Events
- `update:modelValue`: For v-model

### Styling Notes
- Custom checkbox design with CSS
- CSS-only checkmark (no icons)
- Label clickable for better UX
- Grid layout for alignment

## LbRadio

### Purpose
Single choice from multiple options.

### Props
- `modelValue`: Any (v-model, typically used with radio group)
- `value`: Any (this radio's value)
- `disabled`: Boolean (default: false)
- `name`: String (for native radio grouping)
- `id`: String (auto-generated if not provided)

### Slots
- `default`: Label content

### Events
- `update:modelValue`: For v-model

### Styling Notes
- Custom radio design with CSS
- CSS-only selected indicator
- Consistent size with checkbox

## LbSwitch

### Purpose
Toggle between two states.

### Props
- `modelValue`: Boolean (v-model)
- `disabled`: Boolean (default: false)
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `id`: String (auto-generated if not provided)

### Slots
- `default`: Label content

### Events
- `update:modelValue`: For v-model

### Styling Notes
- Smooth slide transition
- Clear on/off states
- Track and thumb with shadows
- Size affects overall scale

## LbModal

### Purpose
Overlay dialog for focused content.

### Props
- `modelValue`: Boolean (v-model for open state)
- `title`: String (optional)
- `showClose`: Boolean (default: true)
- `closeOnBackdrop`: Boolean (default: true)
- `closeOnEscape`: Boolean (default: true)
- `size`: 'small' | 'medium' | 'large' | 'full' (default: 'medium')

### Slots
- `default`: Modal body content
- `header`: Custom header (replaces title)
- `footer`: Footer content (typically actions)
- `close`: Custom close button

### Events
- `update:modelValue`: For v-model
- `open`: When modal opens
- `close`: When modal closes

### Styling Notes
- CSS Grid for centering
- Backdrop with semi-transparent background
- Smooth enter/leave transitions
- CSS-only close icon (×)
- Max dimensions prevent overflow
- Focus trapped while open

## General Implementation Notes

### All Components Must:
1. Use semantic HTML elements
2. Include proper ARIA attributes
3. Support keyboard navigation
4. Use CSS Grid/Flexbox for layout
5. Import only needed SASS files
6. Use CSS custom properties for theme colors
7. Never use margins for spacing
8. Include scoped styles
9. Generate unique IDs when needed
10. Forward native attributes with `v-bind="$attrs"`

### Accessibility Requirements:
- Focus visible states
- Keyboard support (Tab, Enter, Space, Escape)
- Screen reader friendly
- Proper ARIA labels and descriptions
- Associated labels for all inputs

### Theme Integration:
- All colors via CSS custom properties
- Automatic dark mode support
- No hard-coded color values
- Consistent state colors (error, success, etc.)