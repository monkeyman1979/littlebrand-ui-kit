# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2025-08-21

### Fixed
- **Form Component Label Readability**
  - Increased label font size from 12px to 14px for Checkbox, Radio, and Switch components
  - Improved readability while maintaining consistent typography across form controls

## [0.2.1] - 2025-08-21

### Fixed
- **Build Warnings**
  - Resolved TypeScript configuration warnings
  - Fixed export configuration for proper module resolution
  - Improved build output structure

- **Checkbox Double-Click Issue**
  - Fixed checkbox toggling twice when clicked directly (would activate then immediately deactivate)
  - Changed Checkbox, Radio, and Switch components to use `<div>` wrapper instead of `<label>`
  - Only the control itself is now clickable, not the surrounding label text
  - Added `pointer-events: none` to inner elements for proper click handling
  - Users can still use separate `LbLabel` components with `for` attribute for clickable labels

## [0.2.0] - 2025-08-21

### Fixed
- **Critical UX Bugs in Form Components**
  - Checkbox: Fixed click area limited to icon only, now entire checkbox is clickable
  - Radio: Fixed click area limited to dot only, now entire radio button is clickable  
  - Switch: Fixed partial click area (only right half was clickable)
  - All form components refactored from hidden input overlay to button-based architecture

- **Color Customization Issues**
  - Neutral colors now properly apply to backgrounds (fixed hardcoded white/gray values)
  - Improved disabled text contrast by using scale[7] instead of scale[5]
  - Divider colors now respect custom neutral colors
  - Dark mode state preserved during runtime color updates
  - Fixed theme reset issue when calling applyTheme() at runtime

- **Component Behavior**
  - BottomSheet & Dialog: Added scroll locking to prevent background scrolling
  - DatePicker: Fixed closing behavior to only commit changes on OK button click
  - Typography: Fixed font inheritance issues with explicit element targeting

### Added
- **Typography CSS Variables** for runtime customization
  - `--lb-font-heading`, `--lb-font-body`, `--lb-font-mono`
  - `--lb-font-weight-*` variables for fine control
  - Font sizes and line heights as CSS variables
  - No more `!important` needed for font overrides

- **Enhanced Color System**
  - Background color override option in `applyTheme()`
  - Support for custom background sources (primary, secondary, hex colors)
  - Example: `applyTheme({ neutral: '#8b6339', background: 'primary' })`

- **Component Improvements**
  - Avatar: Added badge slot for better LbBadge integration
  - Form components: Added proper ARIA attributes and keyboard support
  - Form components: Smart form detection for conditional hidden input rendering

### Changed
- Form components now use modern button-based architecture following Radix/Shadcn patterns
- Background tokens derive from color scales instead of hardcoded values
- Divider component uses neutral border tokens for consistency

## [0.1.0] - 2024-01-19

### Added
- Initial release of LittleBrand UI Kit
- 20+ Vue 3 components with Pug templates and SASS styling
- Runtime color generation system with `applyTheme()` function
- Support for light and dark modes
- Comprehensive color system with 12-step scales
- Alpha/transparency color scales
- Semantic design tokens (border, fill, text, surface)
- Saturation curves (natural, vivid, muted)
- Form components: Input, Textarea, Select, Checkbox, Radio, Switch, FormField
- Button components: Button, SegmentButton
- Display components: Avatar, Badge, Chip, Divider, Progress
- Feedback components: Dialog, BottomSheet, Snackbar
- Navigation components: NavigationBar
- Utility components: Popover, Menu, Dropdown, Calendar, DatePicker
- CSS Grid-first layout approach
- Zero utility classes - semantic HTML
- Full TypeScript support for select components
- Comprehensive documentation and examples

### Features
- Tree-shakeable exports for optimal bundle size
- No external CSS framework dependencies
- RadixUI-inspired color system
- WCAG compliant color generation
- CSS custom properties for theming
- Both runtime and build-time customization options
- Support for Vue 3.3+

### Documentation
- README with quick start guide
- CUSTOMIZATION.md with detailed theming instructions
- Component examples
- External package testing suite