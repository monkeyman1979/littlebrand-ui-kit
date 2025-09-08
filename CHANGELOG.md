# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.7] - 2025-09-08

### Added
- **Typography Enhancement**
  - Added `--lb-font-size-body-xlarge` CSS variable with responsive clamp sizing
  - New `.body-xlarge` CSS class for extra-large body text
  - Responsive size: clamp(1.25rem, 0.284vw + 0.5rem, 1.5rem) (20px-24px)
  - Added to override template for customization

### Changed
- Updated `.body-large` and `.body-xlarge` classes to use normal line-height instead of relaxed

## [0.5.6] - 2025-09-03

### Fixed
- **Critical: applyTheme() Bug Fix**
  - Fixed "Cannot read properties of undefined (reading '10')" error
  - Root cause: `generateScale` was passing 'natural' as mode instead of 'light'/'dark'
  - Added proper mode validation in `generateOklchScale`
  - Added comprehensive error handling and fallbacks throughout color generation
  - Now works correctly with minimal configuration (just primary/secondary colors)
  - Prevents crashes and provides graceful fallbacks for invalid inputs

## [0.5.5] - 2025-09-03

### Added
- **LbChatInput Component**
  - New chat input component for LLM-style interfaces
  - Auto-growing textarea with configurable max rows (default: 10)
  - Smart action button that toggles between microphone and send
  - Plus menu with dropdown for attachments/actions
  - Flexible middle slot for custom action buttons
  - Keyboard support: Enter to send, Shift+Enter for new line
  - Optional voice input with `showVoice` prop

- **Muted Prop for Visual Hierarchy**
  - Added `muted` prop to LbButton component for subtle buttons
  - Added `muted` prop to LbChip component for less prominent chips
  - Muted elements use `--lb-text-neutral-contrast-low` color
  - Hover states transition to `--lb-text-neutral-contrast-high`
  - Applied to auxiliary buttons in chat input (plus, microphone)

### Changed
- **Typography Consistency**
  - Standardized font size to 1rem for LbTextarea component
  - Chat input uses consistent 1rem font size for better readability

### Fixed
- **Style Compliance**
  - Replaced hardcoded box-shadow with CSS variable (--lb-shadow-sm)
  - Removed margin usage in chat input, using flexbox for layout
  - Fixed SVG icon sizing issues by removing hardcoded dimensions

## [0.5.0] - 2025-09-02

### Added
- **Radix UI Color System Integration**
  - Converted all color scales to exact Radix UI values in OKLCH format
  - Added complete 12-step scales for Orange, Teal, Sky, Blue, Gray, Green, Amber, and Red
  - Implemented Sky as new Tertiary color option across all components
  - Blue now dedicated to Info semantic color
  - All colors include precise OKLCH values with original hex in comments for reference

- **Professional Color Generator Upgrade**
  - Implemented Radix-inspired lightness curves for professional color scales
  - Added smooth chroma progression patterns matching Radix UI quality
  - Generator now preserves exact input color at step 9
  - Includes hue-specific adjustments for optimal appearance
  - Supports generation of solid, dark mode, and alpha scales

- **Complete Alpha Scales**
  - Added full 12-step alpha scales for all semantic colors
  - Light mode: 0.012 to 0.830 transparency progression
  - Dark mode: 0.015 to 0.860 transparency progression
  - Perfect for overlays, borders, and subtle backgrounds
  - Consistent visual weight across different color hues

- **Favicon Support**
  - Added SVG and ICO favicons with UI kit branding
  - Orange background with abstract UI component shapes
  - Properly configured in index.html

### Fixed
- **Calendar Component**
  - Fixed month dropdown truncation issue
  - Prevented scroll propagation when scrolling within dropdowns
  - Increased month dropdown width for better readability
  - Added `matchWidth` prop to Select component for flexible dropdown sizing

### Changed
- **Color System Architecture**
  - All colors now use precise OKLCH values from Radix UI
  - Improved color accuracy and consistency across the system
  - Better perceptual uniformity in color progressions
  - Enhanced contrast ratios for accessibility

### Technical
- Added culori as dependency for accurate color space conversions
- Updated oklch-utils.js with Radix-quality generation algorithms
- Cleaned up temporary conversion scripts

## [0.4.0] - 2025-09-02

### Changed
- **Color Scale Standardization**
  - Standardized lightness progression across all color scales with mathematical precision
  - Light mode steps 1-8: Fixed progression (99.8%, 98.8%, 97.3%, 95.8%, 94.3%, 92.8%, 91.3%, 89.8%)
  - Dark mode: Applied inverse percentage progression for proper contrast
  - Steps 10-11 now use percentage-based calculations relative to Step 9 for consistency
  - Updated both hardcoded SASS values and dynamic OKLCH generation functions

- **Component Background Updates**
  - Calendar, Select, Dropdown, Menu, Popover, and NavigationBar now use `--lb-surface-base` instead of `--lb-surface-subtle`
  - Creates more consistent visual hierarchy across floating and overlay components
  - Provides better integration with the overall design system

- **Contextual Hover/Active States**
  - Implemented smart contextual rules for hover and active states based on background
  - Components on surface-base backgrounds use surface-neutral-normal for hover
  - Components on surface-base backgrounds use surface-neutral-hover for active
  - Ensures proper visual hierarchy and contrast across different background contexts

- **Form Input Backgrounds**
  - Removed default background colors from Input and Textarea components
  - Form inputs now have transparent backgrounds in both default and focus states
  - Creates cleaner, more minimal appearance that adapts to container backgrounds

### Added
- **Style Optimization Auditor Enhancement**
  - Added contextual hover/active state validation rules to the style auditor
  - Auditor now enforces proper visual hierarchy based on component background context
  - Ensures consistent implementation of the new contextual state system

### Fixed
- **Dark Mode Color Scale Progression**
  - Fixed Steps 10-12 in dark mode to use inverse percentages of light mode
  - Ensures consistent visual progression across light and dark themes
  - Improved contrast ratios for better accessibility

## [0.3.6] - 2025-08-29

### Fixed
- **Text-On Color Contrast in Dark Mode**
  - Fixed dark text appearing on dark buttons in dark mode
  - All text-on colors now use stable text variables (`--lb-text-light-normal` and `--lb-text-dark-normal`)
  - Text on colored backgrounds maintains proper contrast in both light and dark modes
  - Warning/yellow colors correctly use dark text for accessibility
  - Updated color-generator.js to use stable text variables for runtime theme changes

- **BottomSheet Component Background**
  - Changed background from `--lb-background-surface` to `--lb-background-page`
  - BottomSheet now blends seamlessly with page background
  - Provides better visual consistency across light and dark modes

## [0.3.5] - 2025-08-29

### Added
- **Stable Text Color Variables**
  - New non-flipping text color variables for overlays and hero sections with dark backgrounds
  - `--lb-text-light-normal` and `--lb-text-light-contrast-low` - Always render as light text regardless of theme mode
  - `--lb-text-dark-normal` and `--lb-text-dark-contrast-low` - Always render as dark text regardless of theme mode
  - Variables automatically swap internal references to maintain consistent appearance across light/dark modes
  - Follows existing naming pattern for consistency with other text tokens (normal, contrast-high, contrast-low)

- **Display Typography Classes**
  - Added `.display-1` and `.display-2` classes for hero sections and large headings
  - Both classes use the tightest line height (`--lb-line-height-tight: 1.1`) for maximum visual impact
  - Responsive font sizing using clamp() for optimal display across all screen sizes
  - Automatically inherits heading font family, weight, and letter spacing

- **Line Height CSS Variables**
  - Added complete line height variables to theme system for runtime customization
  - `--lb-line-height-tight: 1.1` - For display text and hero sections
  - `--lb-line-height-compact: 1.25` - For headings
  - `--lb-line-height-normal: 1.5` - For body text
  - `--lb-line-height-relaxed: 1.75` - For increased readability

## [0.3.4] - 2025-08-29

### Added
- **Complete Dark Mode Implementation**
  - Full dark mode support with 200+ semantic token mappings
  - All color tokens (border, fill, text, surface) properly switch between light and dark modes
  - Dark mode automatically adapts all 8 semantic colors (primary, secondary, tertiary, neutral, success, warning, error, info)
  - Dark mode remains opt-in - no breaking changes for existing projects
  - Activation via `data-theme="dark"` attribute or `.dark` class

### Fixed
- **Text-On Color Tokens**
  - Replaced hardcoded `white` values with `var(--lb-neutral-1)` for better adaptability
  - Text on colored backgrounds now adapts to custom neutral color schemes
  - Maintains proper contrast while respecting user's neutral color customizations
  - Updated `applyTheme()` function in color-generator.js to use consistent values with CSS

## [0.3.3] - 2025-08-28

### Added
- **Dedicated Font Variable for UI Elements**
  - New `--lb-font-label` CSS variable for independent typography control of UI elements
  - Enables three distinct font families: headings (`--lb-font-heading`), body content (`--lb-font-body`), and UI/labels (`--lb-font-label`)
  - Applied to all UI components: buttons, labels, hints, badges, chips, and avatar fallback text
  - Added to littlebrand-overrides-template.sass for easy customization
  - Allows better typography separation between content and interface elements

## [0.3.2] - 2025-08-28

### Fixed
- **OKLCH Contrast Calculation Algorithm**
  - Fixed incorrect text color selection on filled buttons across all color variants
  - Raised contrast threshold from 0.6 to 0.75 for better OKLCH lightness evaluation
  - Added special handling for warning/yellow colors that require dark text at lower lightness values (>0.65)
  - Primary buttons now correctly display white text on dark orange backgrounds (was incorrectly showing black)
  - All other dark filled buttons (secondary, success, error, info, neutral) maintain proper white text
  - Warning buttons correctly keep dark text for accessibility on yellow backgrounds
  - Eliminated the need for manual `--lb-text-on-primary` overrides in user projects
  - Ensured consistency between static theme defaults and dynamic color generation

## [0.3.1] - 2025-08-28

### Improved
- **OKLCH Color System Enhancements**
  - Corrected yellow color hue from 110° to 95° for purer yellow tone without green tint
  - Enhanced typography contrast by improving lightness values for better text readability:
    - Light mode steps 1-2: Better contrast against white backgrounds
    - Dark mode steps 11-12: Enhanced contrast for high-contrast text on dark backgrounds
  - Interactive Theme Playground now uses centralized OKLCH utilities instead of redundant HSL functions

### Changed
- **Architecture Simplification**
  - Consolidated style system by removing 3 obsolete SASS files: `_color-generator.sass`, `_theme-config.sass`, `configure.sass`
  - Streamlined `_theme.sass` by removing branching theme configuration system
  - Updated color-generator.js to use consolidated OKLCH utilities for better maintainability

### Fixed
- **Component Consistency**
  - Fixed Interactive Theme Playground name collision between imported and local color functions
  - Removed redundant HSL color generation code in favor of OKLCH utilities
  - Improved text-on-color contrast calculation using OKLCH-based lightness detection

## [0.3.0] - 2025-08-27

### Fixed
- **Scroll Lock Implementation**
  - Replaced manual scroll lock implementation with VueUse's `useScrollLock` composable for better reliability
  - Fixed background scrolling issues on iOS Safari and mobile devices
  - Eliminated content shift when scrollbar disappears on desktop
  - Fixed scroll position loss when closing dialogs/sheets
  - Improved BottomSheet overlay to support scrolling for tall content
  - Added proper touch event handling for mobile devices

### Added
- **Dependencies**
  - Added `@vueuse/core` (v13.8.0) as a dependency for robust scroll lock functionality
  
### Changed
- **Component Architecture**
  - LbDialog and LbBottomSheet now use battle-tested VueUse composable instead of custom implementation
  - BottomSheet overlay CSS changed from `overflow: hidden` to `overflow-y: auto` for better UX with long content
  - Both components now handle scroll locking internally - no user configuration needed

## [0.2.9] - 2025-08-27

### Fixed
- **Responsive Layout Issues**
  - Fixed overflow in Font Weight Testing section by adding `flex-wrap` to control buttons
  - Improved Dialog component responsiveness by using `width: min(dialog-width-medium, 90%)` instead of complex calc()
  - Removed unnecessary media query overrides in Dialog component
  - Changed BottomSheet default maxHeight from `80vh` to `80dvh` to prevent jumping when mobile address bar toggles
  - Added fallback for browsers that don't support dvh units

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