# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.8] - 2025-08-26

### Fixed
- **Font Weight CSS Variable Implementation**
  - Replaced all hardcoded SASS font-weight variables with CSS custom properties across all components
  - Components now properly respond to runtime CSS variable overrides
  - Fixed 18 components: LbButton, LbSegmentButtonItem, LbChip, LbLabel, LbCheckbox, LbRadio, LbSwitch, LbNavigationBarItem, LbAvatar, LbProgress, LbCalendar, LbBadge, LbSnackbar, and more
  - Components now use `var(--lb-font-weight-label)`, `var(--lb-font-weight-body)`, and `var(--lb-font-weight-semibold)` instead of SASS variables

- **Component Layout Issues**
  - Fixed LbChip and LbLabel components stretching to full width in flex containers
  - Added `align-self: flex-start` to prevent unwanted stretching
  - Ensures inline components maintain their intrinsic width

- **Search Input Border Radius**
  - Fixed oversized border radius (10px) on search inputs inside Select and Menu dropdowns
  - Changed to use `base.$radius-sm` (8px/0.5rem) for better visual hierarchy
  - Search inputs in dropdowns now have appropriately sized corners

### Added
- **Font Weight Testing Section**
  - Added interactive font weight testing section to examples/App.vue
  - Includes range sliders for dynamic adjustment of label, body, and heading weights
  - Live preview showing how font weights affect various components
  - Preset buttons for quick testing (Bold, Light, Reset to Defaults)

## [0.2.7] - 2025-08-26

### Fixed
- **Font Weight Variable Override Issue**
  - Fixed unified font weight variables using `var()` references that prevented proper overriding in external projects
  - Changed `--lb-font-weight-heading`, `--lb-font-weight-body`, and `--lb-font-weight-label` to use direct numeric values (600, 400, 500)
  - Removed duplicate typography variable definitions from dark theme (typography doesn't change between themes)

### Changed
- **Typography System**
  - Expanded font weight scale from 4 weights to full CSS standard 9-weight scale (100-900)
  - Renamed `--lb-font-weight-normal` to `--lb-font-weight-regular` for clarity and consistency
  - Added new font weights: thin (100), extralight (200), light (300), extrabold (800), black (900)
  - Updated all SASS variables to match the new naming convention

### Updated
- **Documentation & Type Definitions**
  - Updated `littlebrand-overrides-template.sass` with full font weight scale
  - Updated TypeScript definitions in `littlebrand.css.d.ts` with all 9 font weights
  - Updated `TYPOGRAPHY_CUSTOMIZATION_GUIDE.md` with new font weight variables
  - Updated `CSS_VARIABLES_REFERENCE.md` with complete weight scale
  - Updated README.md to use `--lb-font-weight-regular` instead of `--lb-font-weight-normal`

## [0.2.6] - 2025-01-25

### Changed
- **Documentation**
  - Updated README.md with comprehensive documentation section
  - Added links to all customization guides and references
  - Clarified that dark mode is opt-in by default

## [0.2.5] - 2025-01-25

### Added
- **Typography System Improvements**
  - Added unified font weight CSS variables for easier customization:
    - `--lb-font-weight-heading` - Controls all heading weights (h1-h6) at once
    - `--lb-font-weight-body` - Controls all body text weight
    - `--lb-font-weight-label` - Controls all label/UI text weight
  - Typography CSS variables now properly defined at `:root` level for global access

- **Comprehensive Documentation**
  - Created `CSS_VARIABLES_REFERENCE.md` - Complete reference of all 200+ CSS variables
  - Created `TYPOGRAPHY_CUSTOMIZATION_GUIDE.md` - Detailed guide for font customization
  - Created `littlebrand-overrides-template.sass` - Ready-to-use template with all variables
  - Created `littlebrand.css.d.ts` - TypeScript definitions for IDE IntelliSense support
  - Updated `CUSTOMIZATION.md` - Now serves as main hub with improved structure
  - Added Dark Mode documentation section clarifying opt-in behavior

### Changed
- **Typography Implementation**
  - All headings (h1-h6) now use unified `--lb-font-weight-heading` variable
  - Removed inconsistent font weights across heading levels
  - Removed SASS variable fallbacks from typography styles (CSS variables are now properly defined)
  - Body text and labels now use their respective unified weight variables

### Fixed
- **Typography Customization**
  - Fixed CSS variables not being accessible for runtime customization
  - Fixed need for override files to redefine heading styles
  - Typography variables now properly cascade without requiring `!important`

## [0.2.4] - 2025-08-23

### Fixed
- **Button Component Alignment**
  - Fixed button content not being properly centered by using `place-content: center` instead of `align-items: center`
  - Increased gap between button elements from `space-2xs` to `space-xs` for better visual balance
  - Fixed link variant buttons with icons showing baseline alignment - now uses `align-items: center` for proper vertical centering
  - Resolved issue where full-width buttons would show text pushed to the left

### Changed
- **Button Component Layout**
  - Changed grid layout from `align-items` to `place-content` for improved content centering
  - Updated link variant alignment from `baseline` to `center` for consistent icon positioning

## [0.2.3] - 2025-08-23

### Fixed
- **Focus State Improvements**
  - Input, Textarea, and Select components now use `:focus-visible` for keyboard-only focus indication
  - Fixed layout shifts from focus states by using transparent outlines
  - Resolved checkbox, switch, and radio focus ring scale animation issues
  - Fixed global `:focus` rules interfering with accessibility

- **Menu Component Navigation**
  - Fixed tab navigation issue where focus would jump to top of page after selection
  - Added proper focus management to return focus to trigger element after menu closes
  - Fixed selected item background disappearing when hovering over other items

- **Chip Dropdown Accessibility**
  - Fixed keyboard navigation not working in chip dropdowns
  - Arrow keys now properly navigate menu items instead of scrolling the page
  - Enter key now selects items as expected
  - Replaced plain div elements with LbMenu component for full keyboard support

### Changed
- **Focus Behavior**
  - All components now use `:focus-visible` instead of `:focus` for better UX
  - Border active color tokens changed from color-mode-8 to color-mode-9 for stronger contrast
  - Added subtle drop shadows (`base.$shadow-sm`) to focus states for better visibility

- **Selected Item Styling**
  - Menu, Select, and CustomSelect selected items now use neutral surface colors instead of primary
  - Selected item background changed to `var(--lb-surface-neutral-hover)` for subtle appearance
  - Checkmark icons in menus changed from primary to neutral text color (`var(--lb-text-neutral-contrast-low)`)

- **Component Architecture**
  - Chip dropdowns in examples now use LbMenu component instead of LbDropdown with plain divs
  - Improved CSS specificity for selected states to prevent style conflicts

### Added
- Focus management system in Menu component to track and restore trigger element focus
- Proper keyboard event handlers for chip dropdown menus
- Menu option arrays for chip dropdowns with proper value/label structure

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