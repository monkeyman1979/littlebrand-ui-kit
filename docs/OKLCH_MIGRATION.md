# OKLCH Color System Migration

## Overview

The LittleBrand UI Kit has been upgraded to use the OKLCH color space for improved perceptual uniformity and better color handling. This migration provides better color scales, smoother gradients, and more predictable color adjustments while maintaining full backward compatibility.

## What is OKLCH?

OKLCH is a cylindrical representation of the OKLab color space that provides:
- **L (Lightness)**: 0 to 1 (black to white) - perceptually uniform
- **C (Chroma)**: 0 to ~0.4 (gray to vibrant) - absolute saturation
- **H (Hue)**: 0 to 360 degrees - color wheel position

## Benefits

1. **Perceptual Uniformity**: OKLCH lightness corresponds directly to perceived brightness
2. **Better Gradients**: Color transitions are smoother and more natural
3. **Consistent Saturation**: Chroma remains consistent when adjusting lightness
4. **Wide Gamut Support**: Can represent colors beyond sRGB on modern displays
5. **Predictable Adjustments**: Changing lightness doesn't affect perceived hue

## Browser Support

- **Chrome 111+** (March 2023)
- **Firefox 113+** (May 2023)
- **Safari 15.4+** (March 2022)
- **Edge 111+** (March 2023)

The UI kit requires modern browsers with OKLCH support. No HSL fallback is provided.

## Implementation Details

### File Structure

```
src/styles/
├── _colors.sass           # OKLCH color definitions
├── _color-generator.sass  # Color scale generation functions
├── oklch-overrides.css   # CSS custom properties for colors
└── _theme.sass            # Theme system using colors

src/utils/
└── oklch-utils.js         # OKLCH conversion and manipulation utilities
```

### Usage in Components

Components don't need any changes. The color system automatically uses OKLCH when supported:

```sass
// In your component
@use '@/styles/colors' as colors

.my-component
  background: colors.$orange-3  // Automatically uses OKLCH or HSL
  color: colors.$gray-12
```

### CSS Output

The compiled CSS includes both formats with feature detection:

```css
/* Modern browsers with OKLCH support */
@supports (color: oklch(0.5 0.2 120)) {
  :root {
    --lb-fill-primary-normal: oklch(0.500 0.200 70);
  }
}

/* Fallback for older browsers */
@supports not (color: oklch(0.5 0.2 120)) {
  :root {
    --lb-fill-primary-normal: hsl(24, 100%, 50%);
  }
}
```

### JavaScript API

The color generator utilities automatically detect and use OKLCH when available:

```javascript
import colorGenerator from '@/utils/color-generator.js';

// Automatically uses OKLCH if supported, HSL otherwise
const scale = colorGenerator.generateScale('#ff6600');

// Check if OKLCH is supported
if (colorGenerator.supportsOklch) {
  console.log('Using OKLCH color space');
}

// Direct OKLCH utilities (when supported)
if (colorGenerator.oklch) {
  const oklch = colorGenerator.oklch.hexToOklch('#ff6600');
  console.log(oklch); // { L: 0.5, C: 0.2, H: 70 }
}
```

## Custom Theme Colors

When creating custom themes, you can now use OKLCH values directly:

```javascript
// Using OKLCH directly (modern browsers)
const customTheme = {
  primary: 'oklch(0.6 0.2 30)',   // Custom orange
  secondary: 'oklch(0.5 0.15 200)', // Custom blue
};

// Or use hex (automatically converted to OKLCH)
const customTheme = {
  primary: '#ff7733',
  secondary: '#3377ff',
};

colorGenerator.applyTheme(customTheme);
```

## Migration Notes

### For Library Users

No action required! The migration is transparent and backward compatible. Your existing code will continue to work while automatically benefiting from OKLCH in supported browsers.

### For Contributors

When adding new colors:

1. **Define colors in OKLCH format** in `_colors.sass`
2. **Use the conversion utilities** for hex to OKLCH conversion
3. **Test in modern browsers** with OKLCH support

### Color Conversion

To convert between formats:

```javascript
import { hexToOklch, oklchToHex } from '@/utils/oklch-utils.js';

// Convert hex to OKLCH
const oklch = hexToOklch('#ff6600');
// Result: { L: 0.679, C: 0.200, H: 41.4 }

// Convert OKLCH to hex
const hex = oklchToHex(0.679, 0.200, 41.4);
// Result: '#ff6600'
```

## Testing

Test the OKLCH implementation:

1. Open `examples/oklch-test.html` in a modern browser
2. Verify color scales appear smooth and consistent
3. Check browser console for OKLCH support status
4. Test in an older browser to verify HSL fallback works

## Performance

OKLCH has minimal performance impact:
- **CSS**: No runtime overhead (browser native support)
- **JavaScript**: Conversion utilities are lightweight (<2KB gzipped)
- **Build time**: No additional build steps required

## Future Enhancements

- **Color mixing**: Leverage OKLCH for better color interpolation
- **Dynamic themes**: Use OKLCH for runtime theme generation
- **Accessibility**: Implement APCA contrast calculations using OKLCH
- **Wide gamut**: Support Display P3 and Rec.2020 colors

## Resources

- [OKLCH Color Space](https://oklch.com/)
- [MDN: oklch()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [OKLCH Color Picker](https://oklch.com/)

## Questions?

For questions or issues related to the OKLCH implementation, please open an issue on GitHub.