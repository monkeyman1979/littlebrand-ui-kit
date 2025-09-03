/**
 * LittleBrand UI Kit - OKLCH Color Utilities
 * 
 * Professional color scale generator with Radix UI quality
 * Uses OKLCH color space for perceptual uniformity
 */

/**
 * Convert RGB to linear RGB (remove gamma correction)
 */
function rgbToLinear(val) {
  const normalized = val / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB back to sRGB (apply gamma correction)
 */
function linearToRgb(val) {
  const clamped = Math.max(0, Math.min(1, val));
  const rgb = clamped <= 0.0031308
    ? clamped * 12.92
    : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(rgb * 255);
}

/**
 * Convert RGB to OKLab color space
 */
function rgbToOklab(r, g, b) {
  // Convert to linear RGB
  const lr = rgbToLinear(r);
  const lg = rgbToLinear(g);
  const lb = rgbToLinear(b);

  // Linear RGB to XYZ (D65 illuminant)
  // Using sRGB to XYZ matrix
  const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
  const y = 0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb;
  const z = 0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb;

  // XYZ to OKLab
  const l = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const s = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);

  return {
    L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  };
}

/**
 * Convert OKLab to RGB
 */
function oklabToRgb(L, a, b) {
  // OKLab to LMS
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);

  // LMS to linear RGB
  const lr =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Convert to sRGB
  return {
    r: linearToRgb(lr),
    g: linearToRgb(lg),
    b: linearToRgb(lb)
  };
}

/**
 * Convert OKLab to OKLCH
 */
function oklabToOklch(L, a, b) {
  const C = Math.sqrt(a * a + b * b);
  let H = Math.atan2(b, a) * (180 / Math.PI);
  
  // Normalize hue to 0-360 range
  if (H < 0) H += 360;
  
  return { L, C, H };
}

/**
 * Convert OKLCH to OKLab
 */
function oklchToOklab(L, C, H) {
  const hRad = H * (Math.PI / 180);
  return {
    L,
    a: C * Math.cos(hRad),
    b: C * Math.sin(hRad)
  };
}

/**
 * Convert RGB to OKLCH
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} OKLCH values {L: 0-1, C: 0-~0.4, H: 0-360}
 */
export function rgbToOklch(r, g, b) {
  const oklab = rgbToOklab(r, g, b);
  return oklabToOklch(oklab.L, oklab.a, oklab.b);
}

/**
 * Convert OKLCH to RGB
 * @param {number} L - Lightness (0-1)
 * @param {number} C - Chroma (0-~0.4)
 * @param {number} H - Hue (0-360)
 * @returns {Object} RGB values {r: 0-255, g: 0-255, b: 0-255}
 */
export function oklchToRgb(L, C, H) {
  const oklab = oklchToOklab(L, C, H);
  return oklabToRgb(oklab.L, oklab.a, oklab.b);
}

/**
 * Convert hex color to OKLCH
 */
export function hexToOklch(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return rgbToOklch(r, g, b);
}

/**
 * Convert OKLCH to hex color
 */
export function oklchToHex(L, C, H) {
  const rgb = oklchToRgb(L, C, H);
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Format OKLCH values for CSS
 */
export function formatOklchCSS(L, C, H, alpha = 1) {
  // CSS can accept lightness as percentage or decimal
  const lightness = L; // Keep as decimal 0-1
  const chroma = C.toFixed(3);
  const hue = H.toFixed(1);
  
  if (alpha < 1) {
    return `oklch(${lightness} ${chroma} ${hue} / ${alpha})`;
  }
  return `oklch(${lightness} ${chroma} ${hue})`;
}

/**
 * Calculate relative luminance using OKLCH lightness
 * OKLCH lightness is perceptually uniform, so we can use it directly
 */
export function getOklchLuminance(L) {
  return L; // OKLCH lightness is already perceptually uniform
}

/**
 * Determine if white or dark text should be used on a given OKLCH color
 */
export function getContrastText(L, C, H) {
  // OKLCH lightness is perceptually uniform
  // Use 0.6 as threshold (equivalent to ~50% perceived brightness)
  return L > 0.6 ? '#000000' : '#ffffff';
}

/**
 * Adjust OKLCH lightness while preserving chroma and hue
 */
export function adjustLightness(L, C, H, amount) {
  return {
    L: Math.max(0, Math.min(1, L + amount)),
    C,
    H
  };
}

/**
 * Adjust OKLCH chroma while preserving lightness and hue
 */
export function adjustChroma(L, C, H, amount) {
  return {
    L,
    C: Math.max(0, Math.min(0.4, C + amount)),
    H
  };
}

/**
 * Radix-inspired lightness curves for professional color scales
 * Based on analysis of Radix UI color system
 */
const RADIX_LIGHTNESS_CURVES = {
  light: {
    // Fixed lightness values for consistency
    1: 0.994,
    2: 0.982,
    3: 0.960,
    4: 0.935,
    5: 0.905,
    6: 0.860,
    7: 0.800,
    8: 0.735,
    // Step 9 is the input color
    10: (step9) => step9 * 0.95,
    11: (step9) => step9 * 0.85,
    12: (step9, hue) => {
      // Hue-specific darkness for optimal contrast
      if (hue >= 30 && hue <= 80) return 0.35;  // Orange
      if (hue >= 80 && hue <= 120) return 0.38; // Yellow
      if (hue >= 140 && hue <= 200) return 0.32; // Green/Teal
      if (hue >= 200 && hue <= 260) return 0.32; // Blue
      return 0.33; // Default
    }
  },
  dark: {
    // Starting darkness varies by hue
    1: (hue) => {
      if (hue >= 30 && hue <= 80) return 0.187;  // Orange
      if (hue >= 80 && hue <= 120) return 0.185; // Yellow
      if (hue >= 140 && hue <= 200) return 0.187; // Green/Teal
      if (hue >= 200 && hue <= 260) return 0.194; // Blue
      return 0.190; // Default
    },
    2: (step1) => step1 + 0.025,
    3: (step1) => step1 + 0.070,
    4: (step1) => step1 + 0.110,
    5: (step1) => step1 + 0.155,
    6: (step1) => step1 + 0.210,
    7: (step1) => step1 + 0.270,
    8: (step1) => step1 + 0.345,
    // Step 9 is the input color
    10: (step9) => Math.min(step9 * 1.06, 0.75),
    11: (step9) => Math.min(step9 * 1.20, 0.82),
    12: (hue) => {
      // Very light for text
      if (hue >= 30 && hue <= 80) return 0.925;  // Orange
      if (hue >= 80 && hue <= 120) return 0.920; // Yellow
      return 0.910; // Default
    }
  }
};

/**
 * Radix-inspired chroma patterns for smooth progression
 */
const RADIX_CHROMA_PATTERNS = {
  light: [
    0.02,  // Step 1: Very low
    0.08,  // Step 2: Subtle increase
    0.18,  // Step 3: Building
    0.32,  // Step 4: Growing
    0.45,  // Step 5: Mid-range
    0.60,  // Step 6: Increasing
    0.75,  // Step 7: Near peak
    0.90,  // Step 8: Almost full
    1.00,  // Step 9: Full chroma (input)
    1.02,  // Step 10: Slight boost
    0.90,  // Step 11: Reduced for contrast
    0.40   // Step 12: Much lower for dark text
  ],
  dark: [
    0.06,  // Step 1: Very low for dark bg
    0.10,  // Step 2: Subtle
    0.22,  // Step 3: Building
    0.35,  // Step 4: Growing
    0.45,  // Step 5: Mid-range
    0.52,  // Step 6: Increasing
    0.60,  // Step 7: Building to peak
    0.75,  // Step 8: Near peak
    1.00,  // Step 9: Full chroma (input)
    0.95,  // Step 10: Slight reduction
    0.85,  // Step 11: Reduced for light text
    0.30   // Step 12: Much lower for light text
  ]
};

/**
 * Radix alpha values for consistent transparency
 */
const RADIX_ALPHA_VALUES = {
  light: [
    0.012, 0.024, 0.041, 0.062, 0.090, 0.121,
    0.156, 0.220, 0.439, 0.478, 0.565, 0.830
  ],
  dark: [
    0.015, 0.031, 0.055, 0.085, 0.114, 0.148,
    0.187, 0.268, 0.470, 0.516, 0.615, 0.860
  ]
};

/**
 * Generate a fallback scale for error cases
 */
function generateFallbackScale() {
  const scale = {};
  // Generate a neutral gray scale as fallback
  for (let i = 1; i <= 12; i++) {
    const lightness = 1 - (i - 1) * 0.075;
    scale[i] = formatOklchCSS(lightness, 0.01, 0);
  }
  return scale;
}

/**
 * Generate a Radix-quality 12-step color scale in OKLCH
 * Produces professional color scales matching Radix UI quality
 */
export function generateOklchScale(baseColor, mode = 'light') {
  let oklch;
  
  // Handle different input types
  if (typeof baseColor === 'string') {
    oklch = hexToOklch(baseColor);
    if (!oklch) {
      console.error('generateOklchScale: Failed to parse hex color:', baseColor);
      return generateFallbackScale();
    }
  } else if (baseColor && baseColor.L !== undefined) {
    oklch = baseColor;
  } else if (baseColor && baseColor.r !== undefined) {
    oklch = rgbToOklch(baseColor.r, baseColor.g, baseColor.b);
  } else {
    console.error('generateOklchScale: Invalid color input:', baseColor);
    return generateFallbackScale();
  }
  
  const scale = {};
  
  // Validate mode parameter
  if (mode !== 'light' && mode !== 'dark') {
    console.warn(`generateOklchScale: Invalid mode '${mode}', defaulting to 'light'`);
    mode = 'light';
  }
  
  const curves = RADIX_LIGHTNESS_CURVES[mode];
  const chromaPattern = RADIX_CHROMA_PATTERNS[mode];
  
  // Calculate step 1 for dark mode
  let step1Lightness;
  if (mode === 'dark') {
    step1Lightness = curves[1](oklch.H);
  }
  
  // Generate each step with Radix-quality curves
  for (let i = 1; i <= 12; i++) {
    let lightness, chroma, hue = oklch.H;
    
    if (i === 9) {
      // Step 9 is always the exact input color
      lightness = oklch.L;
      chroma = oklch.C;
    } else if (i <= 8 && mode === 'light') {
      // Light mode: use fixed lightness values
      lightness = curves[i];
      chroma = oklch.C * chromaPattern[i - 1];
    } else if (i <= 8 && mode === 'dark') {
      // Dark mode: calculate from step 1
      if (i === 1) {
        lightness = step1Lightness;
      } else {
        lightness = curves[i](step1Lightness);
      }
      chroma = oklch.C * chromaPattern[i - 1];
    } else if (i === 10 || i === 11) {
      // Steps 10-11: relative to step 9
      lightness = curves[i](oklch.L);
      chroma = oklch.C * chromaPattern[i - 1];
    } else if (i === 12) {
      // Step 12: specific handling
      lightness = mode === 'light' ? curves[i](oklch.L, oklch.H) : curves[i](oklch.H);
      chroma = oklch.C * chromaPattern[i - 1];
    }
    
    // Apply subtle hue shifts at extremes (Radix pattern)
    if (mode === 'light') {
      if (i <= 2) hue = oklch.H + 2;  // Slightly warmer
      if (i >= 11) hue = oklch.H - 3; // Slightly cooler
    } else {
      if (i <= 2) hue = oklch.H - 2;  // Slightly cooler
      if (i >= 11) hue = oklch.H + 3; // Slightly warmer
    }
    
    // Ensure values are in valid ranges
    lightness = Math.max(0, Math.min(1, lightness));
    chroma = Math.max(0, Math.min(0.4, chroma));
    if (hue < 0) hue += 360;
    if (hue > 360) hue -= 360;
    
    scale[i] = formatOklchCSS(lightness, chroma, hue);
  }
  
  return scale;
}

/**
 * Generate dark mode scale using Radix patterns
 */
export function generateOklchDarkScale(lightScale, originalColor) {
  // Validate input
  if (!originalColor) {
    console.error('generateOklchDarkScale: Missing original color');
    return generateFallbackScale();
  }
  
  // Dark mode uses same algorithm with 'dark' mode parameter
  return generateOklchScale(originalColor, 'dark');
}

/**
 * Generate alpha scale with Radix-quality transparency
 */
export function generateOklchAlphaScale(baseColor, mode = 'light') {
  let oklch;
  
  if (typeof baseColor === 'string') {
    oklch = hexToOklch(baseColor);
    if (!oklch) {
      console.error('generateOklchAlphaScale: Failed to parse hex color:', baseColor);
      // Return empty object as alpha scales are optional
      return {};
    }
  } else if (baseColor && baseColor.L !== undefined) {
    oklch = baseColor;
  } else {
    console.error('generateOklchAlphaScale: Invalid color input:', baseColor);
    return {};
  }
  
  const alphaScale = {};
  const alphas = RADIX_ALPHA_VALUES[mode];
  
  // Adjust base color for better alpha appearance
  let alphaLightness = oklch.L;
  let alphaChroma = oklch.C;
  
  if (mode === 'light') {
    // For light mode, use slightly darker version for better visibility
    alphaLightness = oklch.L * 0.85;
  } else {
    // For dark mode, use slightly lighter version
    alphaLightness = Math.min(oklch.L * 1.15, 0.9);
  }
  
  for (let i = 1; i <= 12; i++) {
    const alpha = alphas[i - 1];
    
    // Adjust chroma based on step for visual consistency
    let stepChroma = alphaChroma;
    if (i <= 3) {
      stepChroma = alphaChroma * 0.7; // Reduced for subtle steps
    } else if (i >= 10) {
      stepChroma = alphaChroma * 0.9; // Slightly reduced for strong steps
    }
    
    alphaScale[i] = formatOklchCSS(alphaLightness, stepChroma, oklch.H, alpha);
  }
  
  return alphaScale;
}

// Export all functions as default object too
export default {
  rgbToOklch,
  oklchToRgb,
  hexToOklch,
  oklchToHex,
  formatOklchCSS,
  getOklchLuminance,
  getContrastText,
  adjustLightness,
  adjustChroma,
  generateOklchScale,
  generateOklchDarkScale,
  generateOklchAlphaScale
};