# New Issues and Findings

This document tracks new issues discovered during testing that are not yet in IMPLEMENTATION_NOTES.md

## Color Customization Testing

### Date: 2025-08-20

#### applyTheme() Function Status
- **Testing**: Checking if `applyTheme` is properly exported from 'littlebrand-ui-kit'
- **Expected**: Function should be available to customize colors at runtime
- **Initial Test Colors**: 
  - Primary: `#8b5cf6` (Purple)
  - Secondary: `#f59e0b` (Orange)

#### Issues Found:

1. **applyTheme() Function Export**
   - Status: ✅ WORKING
   - The function IS exported from 'littlebrand-ui-kit'
   - Successfully imported and used in main.js
   - Applies theme colors to all components

2. **Color Generation**
   - The built-in `applyTheme()` generates all color variations automatically
   - Accepts hex color values for primary and secondary
   - Creates fill, text, border, and surface variations
   - Properly handles HSL color space conversions

#### Observations:

1. **Implementation Method**
   - Successfully using Method 1 (Runtime JavaScript) from npm docs
   - Colors can be changed dynamically at runtime
   - No need for CSS preprocessing or build-time configuration

2. **Fallback Strategy**
   - Created `/src/color-generator.js` as fallback (not needed but good to have)
   - Mimics the built-in color generation logic
   - Could be useful if the built-in function changes in future versions

3. **Color Controls in UI**
   - Added color input fields for primary and secondary colors
   - "Apply Colors" button triggers `applyTheme()` with new values
   - "Reset Colors" button restores defaults (#8b5cf6 and #f59e0b)
   - Colors update immediately across all components

## Runtime Color Application Issue

### Issue:
Calling `applyTheme()` at runtime (after initial load) causes the theme to reset to light mode, even if dark mode is currently active.

### Observation:
- The `applyTheme()` function works correctly when called once during app initialization in `main.js`
- Dynamic color changes at runtime interfere with dark mode state
- This suggests `applyTheme()` might be overwriting theme-related CSS classes or variables

### Current Status:
- Color customization works properly via `main.js` configuration
- Testing with green (#10b981) primary and red (#ef4444) secondary confirms the function works
- Runtime color changes have been removed from the UI to avoid theme state issues

### Recommendation:
Use `applyTheme()` only during initialization in `main.js`. For dynamic color changes, the UI kit would need to expose a method that preserves the current theme mode.

## Neutral Color Not Applied to Component Backgrounds

### Issue:
The custom neutral color (#8b6339 - brown) is not being applied to various component backgrounds. These components continue to show the default gray color instead.

### Affected Components:
1. **LbSelect** - Dropdown content backgrounds remain gray
2. **LbInput** - Input field backgrounds show default gray
3. **LbTextarea** - Textarea backgrounds likely affected
4. **LbMenu** - Menu dropdown backgrounds use hardcoded colors
5. **LbDialog** - Modal/dialog backgrounds may be affected
6. **LbPopover** - Popover content backgrounds
7. **LbBottomSheet** - Sheet backgrounds
8. **LbSnackbar** - Snackbar backgrounds might be affected
9. **LbNavigationBar** - Navigation bar background remains gray instead of using custom neutral color
10. **LbCalendar** - Calendar component background remains gray instead of using custom neutral color

### Root Cause:
The `applyTheme()` function in the UI kit correctly generates surface colors for each semantic color (primary, secondary, etc.) from their base colors using the scale system. However, the main background variables are **hardcoded** in the color-generator.js file:

**Light mode (lines 385-387):**
```javascript
root.style.setProperty('--lb-surface-base', 'white')
root.style.setProperty('--lb-surface-subtle', '#fafafa')
```

**Dark mode (lines 391-395):**
```javascript
'--lb-surface-base': '#0a0a0a',
'--lb-surface-subtle': '#1a1a1a',
```

These hardcoded values ignore the custom neutral color completely. They should be derived from the neutral color scale (e.g., `neutral[1]` for page background, `neutral[2]` for surface background) to properly respect custom neutral colors.

### Expected Behavior:
When providing `neutral: '#8b6339'` in the color configuration, all components should use this brown color for their neutral backgrounds.

### Actual Behavior:
Components continue to use the default gray color for backgrounds, making the neutral color customization ineffective.

### Recommendation:
The UI kit needs to:
1. Ensure the neutral color override properly applies to all surface and background variables
2. Remove any hardcoded background colors in components
3. Ensure all components use the CSS variables for backgrounds rather than fixed values

### Proposed Solution:
Implement a flexible background color system that defaults to the neutral scale but allows overrides:

```javascript
applyTheme({
  primary: '#10b981',
  secondary: '#ef4444',
  neutral: '#8b6339',     // brown neutral
  background: 'neutral'   // optional, defaults to 'neutral'
})
```

**How it would work:**

1. **Default Behavior (90% of use cases):**
   - If `background` is not specified, it defaults to `'neutral'`
   - `--lb-surface-base` would use `neutral[1]` (lightest tint)
   - `--lb-surface-subtle` would use `neutral[2]` (slightly darker)
   - Dark mode would use the corresponding dark scale values
   - This ensures backgrounds harmonize with the neutral color automatically

2. **Override Options:**
   - `background: 'primary'` - Use primary color scale for backgrounds
   - `background: 'secondary'` - Use secondary color scale for backgrounds  
   - `background: '#ffffff'` - Use specific hex color (generates scale from it)
   - `background: { page: '#f5f5dc', surface: '#ebe5d6' }` - Explicit control

**Benefits:**
- Backwards compatible (defaults to neutral if not specified)
- Solves the current issue where brown neutral still has gray backgrounds
- Flexible enough for edge cases (brand requirements, special themes)
- Intuitive API that follows existing patterns in the UI kit

**Example Usage:**
```javascript
// Most common - backgrounds derived from neutral
applyTheme({ 
  neutral: '#8b6339' 
})

// Special case - pure white/black backgrounds
applyTheme({ 
  neutral: '#8b6339',
  background: '#ffffff' 
})

// Creative case - primary-tinted backgrounds
applyTheme({ 
  neutral: '#8b6339',
  background: 'primary' 
})
```

## Border Color Coordination with Backgrounds

### Issue:
Border colors (like `--lb-border-neutral-line`) are currently always derived from the neutral color scale, which can create visual mismatches when backgrounds use a different color source.

### Problem Scenario:
```javascript
applyTheme({
  neutral: '#8b6339',    // brown
  background: 'primary'   // backgrounds use primary color scale
})
// Results in: primary-tinted backgrounds with brown borders (visual mismatch)
```

### Proposed Solution:
Borders should coordinate with backgrounds by default, following the same color source:

**Default Cascade Logic:**
1. If no `background` specified → borders use neutral scale (both default to neutral)
2. If `background: 'primary'` → borders also use primary scale  
3. If `background: '#ffffff'` → borders use a generated scale from that color

**With Override Option:**
```javascript
applyTheme({
  neutral: '#8b6339',
  background: 'primary',  // primary-tinted backgrounds
  borders: 'neutral'      // explicitly keep neutral borders (rare but possible)
})
```

### Benefits:
- **Visual Coherence:** Borders, backgrounds, and surfaces remain in the same color family by default
- **Flexibility:** Can be overridden for special design requirements
- **Intuitive:** Follows the principle that canvas-layer elements (backgrounds, borders, surfaces) should harmonize

### Example Usage:
```javascript
// Most common - everything derives from neutral
applyTheme({ 
  neutral: '#8b6339'
  // background defaults to 'neutral'
  // borders default to match background source
})

// Coordinated non-neutral theme
applyTheme({
  neutral: '#8b6339',
  background: 'primary'
  // borders automatically use primary scale too
})

// Special case with override
applyTheme({
  neutral: '#8b6339',
  background: '#ffffff',   // pure white backgrounds
  borders: 'neutral'       // but keep colored borders
})
```

## Focus Ring, Divider, and Overlay Color Implementation

### Current Implementation:
- **Focus ring**: Tied to primary color with alpha (`hsla(24, 100%, 50%, .182)`)
- **Divider**: Hardcoded gray (`hsl(0, 0%, 88.7%)`)
- **Overlay**: Hardcoded black with opacity (`rgba(0, 0, 0, 0.5)`)

### Issues:
1. **Divider color** doesn't respect custom neutral color - stays gray even with brown neutral
2. **Background overlay** is always black, doesn't adapt to theme colors
3. **Focus ring** is tied to primary, which may not always be desired

### Proposed Solution:

**1. Focus Ring Color**
- **Default**: Keep as primary (current behavior - good for brand consistency)
- **Make configurable** with primary as default:
```javascript
applyTheme({
  neutral: '#8b6339',
  focusRing: 'primary'  // or 'accent', 'neutral', or custom hex
})
```

**2. Divider Color**
Should follow the same cascade as borders:
- Default: derives from whatever borders use (which defaults to neutral)
- Uses the lightest border variant (`border[line]`)
- Coordinates with background and border choices automatically

**3. Background Overlay**
Should be smarter about color choice:
- **Default**: Derive from the darkest value of the background color source
- **Make configurable**:
```javascript
applyTheme({
  neutral: '#8b6339',
  overlay: 'auto'    // derives from background (default)
  // or
  overlay: 'black'   // always black
  // or
  overlay: '#custom' // custom color
})
```

### Color Cascade Logic:
```
background → borders → dividers (all from same source)
                    ↘ overlay (darkest variant or black)
```

This ensures all "canvas layer" elements (backgrounds, borders, dividers, overlays) remain visually coordinated.

### Example Usage:
```javascript
// Everything coordinated from neutral
applyTheme({
  neutral: '#8b6339'
  // focusRing defaults to primary
  // dividers follow borders (which follow background = neutral)
  // overlay derives from neutral darkest
})

// Custom configuration
applyTheme({
  neutral: '#8b6339',
  background: 'primary',
  focusRing: 'accent',    // different focus color
  overlay: 'black'         // force black overlay
})
```

## Disabled State Contrast Issues

### Issue:
Disabled text is nearly invisible, especially on neutral/tonal buttons. The contrast ratio between disabled text and button backgrounds is far too low.

### Current Values (Light Mode):
- `--lb-text-neutral-disabled`: `hsl(0, 0%, 85.8%)` (very light gray)
- `--lb-surface-neutral-*`: ~`hsl(0, 0%, 97%)` (near white)
- **Contrast difference**: Only ~11% lightness difference (fails WCAG even for disabled states)

### Problem Areas:
1. **Neutral/Tonal buttons**: Gray text on gray background is almost invisible
2. **Disabled inputs**: Text becomes unreadable
3. **All disabled states**: Using `scale[5]` for disabled text is too light

### Root Cause:
The color generator uses `scale[5]` for disabled text, which is designed to be a very light tint. This works for borders or backgrounds but not for text that needs to be readable.

### Proposed Solution:
Disabled states still need to meet minimum contrast requirements (WCAG suggests 3:1 for disabled controls):

```javascript
// Current (problematic):
tokens[`--lb-text-${name}-disabled`] = scale[5]  // Too light

// Proposed:
tokens[`--lb-text-${name}-disabled`] = scale[7]  // More visible
// OR use opacity on normal color:
tokens[`--lb-text-${name}-disabled`] = `${scale[9]} with 40% opacity`
```

**Better approach:** Use opacity on the normal color rather than a lighter shade:
- Maintains color identity
- Automatically adjusts for light/dark themes
- More consistent with modern UI patterns

### Example Fix:
```css
/* Instead of: */
--lb-text-neutral-disabled: hsl(0, 0%, 85.8%);

/* Use: */
--lb-text-neutral-disabled: rgba(var(--lb-text-neutral-normal-rgb), 0.4);
```

This would make disabled text 40% opacity of the normal text color, maintaining readability while clearly indicating the disabled state.