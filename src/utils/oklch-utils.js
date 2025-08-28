/**
 * LittleBrand UI Kit - OKLCH Color Utilities
 * 
 * Conversion utilities for OKLCH color space
 * OKLCH provides better perceptual uniformity than HSL
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
 * Determine optimal lightness range based on color properties
 */
function getOptimalLightnessRange(oklch) {
  const { L, C, H } = oklch;
  
  // Determine color category based on hue
  let minDarkness = 0.10; // Default minimum darkness
  
  // Yellow/amber range (80-120°) - can't go as dark
  if (H >= 80 && H <= 120) {
    minDarkness = 0.20;
  }
  // Green/teal range (140-200°) - moderate darkness
  else if (H >= 140 && H <= 200) {
    minDarkness = 0.15;
  }
  // Blue range (200-260°) - can go quite dark
  else if (H >= 200 && H <= 260) {
    minDarkness = 0.18;
  }
  // Red/pink range (0-30° or 330-360°) - moderate darkness
  else if ((H >= 0 && H <= 30) || (H >= 330 && H <= 360)) {
    minDarkness = 0.18;
  }
  // Orange range (30-80°) - can go darker
  else if (H >= 30 && H <= 80) {
    minDarkness = 0.20;
  }
  // Purple/violet range (260-330°) - can go quite dark
  else if (H >= 260 && H <= 330) {
    minDarkness = 0.15;
  }
  
  // Adjust based on chroma - high chroma colors can't go as dark
  if (C > 0.15) {
    minDarkness = Math.min(minDarkness + 0.05, 0.25);
  }
  
  return minDarkness;
}

/**
 * Generate a 12-step color scale in OKLCH with enhanced dynamic range
 */
export function generateOklchScale(baseColor, curve = 'natural') {
  let oklch;
  
  // Handle different input types
  if (typeof baseColor === 'string') {
    oklch = hexToOklch(baseColor);
  } else if (baseColor.L !== undefined) {
    oklch = baseColor;
  } else if (baseColor.r !== undefined) {
    oklch = rgbToOklch(baseColor.r, baseColor.g, baseColor.b);
  } else {
    throw new Error('Invalid color input');
  }
  
  const scale = {};
  
  // Get optimal darkness for this color
  const minDarkness = getOptimalLightnessRange(oklch);
  
  // Ensure step 9 is in a usable range (0.4-0.7 lightness)
  let targetLightness9 = oklch.L;
  if (oklch.L > 0.7) {
    targetLightness9 = 0.65;
  } else if (oklch.L < 0.4) {
    targetLightness9 = 0.45;
  }
  
  // Calculate enhanced dynamic range
  const maxLightness = 0.995; // Nearly white
  const lightnessRange = maxLightness - minDarkness;
  
  // Create exponential curve for better distribution
  const getExponentialStep = (step, total, exp = 2.2) => {
    const normalized = (step - 1) / (total - 1);
    return Math.pow(normalized, exp);
  };
  
  // Generate lightness stops with enhanced range
  const lightnessStops = [];
  for (let i = 1; i <= 12; i++) {
    if (i <= 8) {
      // Steps 1-8: Light range with exponential distribution
      const t = getExponentialStep(9 - i, 8, 2.0);
      lightnessStops.push(targetLightness9 + (maxLightness - targetLightness9) * t);
    } else if (i === 9) {
      // Step 9: Base color
      lightnessStops.push(targetLightness9);
    } else {
      // Steps 10-12: Dark range with exponential distribution
      const t = getExponentialStep(i - 9, 3, 1.8);
      lightnessStops.push(targetLightness9 - (targetLightness9 - minDarkness) * t);
    }
  }
  
  // Enhanced chroma multipliers with more variation
  let chromaMultipliers;
  
  if (curve === 'vivid') {
    chromaMultipliers = [
      0.10, 0.20, 0.40, 0.60, 0.80,
      0.95, 1.05, 1.10, 1.00, 1.05,
      0.85, 0.60
    ];
  } else if (curve === 'muted') {
    chromaMultipliers = [
      0.08, 0.15, 0.25, 0.40, 0.55,
      0.70, 0.80, 0.85, 0.85, 0.80,
      0.65, 0.45
    ];
  } else { // natural - enhanced variation
    chromaMultipliers = [
      0.10, 0.25, 0.45, 0.65, 0.80,
      0.90, 0.95, 1.00, 1.00, 0.95,
      0.80, 0.55
    ];
  }
  
  // Generate each step with subtle hue shifts for warmth/coolness
  for (let i = 1; i <= 12; i++) {
    const lightness = lightnessStops[i - 1];
    const chromaMultiplier = chromaMultipliers[i - 1];
    let chroma = oklch.C * chromaMultiplier;
    let hue = oklch.H;
    
    // Subtle hue shifts at extremes
    if (i <= 2) {
      // Very light: shift slightly warmer
      hue = oklch.H + 1;
    } else if (i >= 11) {
      // Very dark: shift slightly cooler
      hue = oklch.H - 2;
    }
    
    // Reduce chroma at extremes for better appearance
    if (lightness > 0.9 || lightness < 0.2) {
      chroma = chroma * 0.7;
    }
    
    // Step 9 keeps original properties
    if (i === 9) {
      chroma = oklch.C;
      hue = oklch.H;
    }
    
    // Cap chroma for practical use
    chroma = Math.min(chroma, 0.35);
    
    scale[i] = formatOklchCSS(lightness, chroma, hue);
  }
  
  return scale;
}

/**
 * Generate dark mode scale in OKLCH with enhanced dynamic range
 */
export function generateOklchDarkScale(lightScale, originalColor) {
  let oklch;
  
  if (typeof originalColor === 'string') {
    oklch = hexToOklch(originalColor);
  } else {
    oklch = originalColor;
  }
  
  const darkScale = {};
  
  // Get optimal darkness for this color (same as light mode)
  const minDarkness = getOptimalLightnessRange(oklch);
  
  // For dark mode, we invert: dark backgrounds to light text
  const maxDarkLightness = 0.95; // Nearly white for text
  const minDarkBackground = Math.min(minDarkness, 0.12); // Very dark background
  
  // Ensure step 9 is in a usable range
  let targetLightness9 = oklch.L;
  if (oklch.L > 0.65) {
    targetLightness9 = 0.60;
  } else if (oklch.L < 0.45) {
    targetLightness9 = 0.50;
  }
  
  // Create exponential curve for better distribution
  const getExponentialStep = (step, total, exp = 2.2) => {
    const normalized = (step - 1) / (total - 1);
    return Math.pow(normalized, exp);
  };
  
  // Generate lightness stops with enhanced range for dark mode
  const darkLightnessStops = [];
  for (let i = 1; i <= 12; i++) {
    if (i <= 8) {
      // Steps 1-8: Dark backgrounds with exponential distribution
      const t = getExponentialStep(i, 8, 1.8);
      darkLightnessStops.push(minDarkBackground + (targetLightness9 - minDarkBackground) * t);
    } else if (i === 9) {
      // Step 9: Base color (slightly adjusted for dark mode)
      darkLightnessStops.push(targetLightness9);
    } else {
      // Steps 10-12: Light text range with exponential distribution
      const t = getExponentialStep(i - 9, 3, 1.5);
      darkLightnessStops.push(targetLightness9 + (maxDarkLightness - targetLightness9) * t);
    }
  }
  
  // Enhanced dark mode chroma multipliers with more variation
  const darkChromaMultipliers = [
    0.30, 0.40, 0.50, 0.60, 0.70,  // Lower chroma for dark backgrounds
    0.85, 0.95, 1.05, 1.00, 1.00,  // Full chroma in mid-range
    0.80, 0.60  // Reduced chroma for light text
  ];
  
  // Generate dark scale with subtle hue shifts
  for (let i = 1; i <= 12; i++) {
    const lightness = darkLightnessStops[i - 1];
    const chromaMultiplier = darkChromaMultipliers[i - 1];
    let chroma = oklch.C * chromaMultiplier;
    let hue = oklch.H;
    
    // Subtle hue shifts at extremes (opposite of light mode)
    if (i <= 2) {
      // Very dark: shift slightly cooler
      hue = oklch.H - 1;
    } else if (i >= 11) {
      // Very light: shift slightly warmer
      hue = oklch.H + 2;
    }
    
    // Reduce chroma at extremes for better appearance
    if (lightness > 0.85 || lightness < 0.15) {
      chroma = chroma * 0.7;
    }
    
    // Step 9 keeps original chroma
    if (i === 9) {
      chroma = oklch.C;
      hue = oklch.H;
    }
    
    // Cap chroma for practical use
    chroma = Math.min(chroma, 0.35);
    
    darkScale[i] = formatOklchCSS(lightness, chroma, hue);
  }
  
  return darkScale;
}

/**
 * Generate alpha scale in OKLCH
 */
export function generateOklchAlphaScale(baseColor, mode = 'light') {
  let oklch;
  
  if (typeof baseColor === 'string') {
    oklch = hexToOklch(baseColor);
  } else {
    oklch = baseColor;
  }
  
  const alphaScale = {};
  
  // Alpha values for light and dark modes
  const lightAlphas = [
    0.012, 0.027, 0.047, 0.071, 0.090, 0.114,
    0.141, 0.220, 0.439, 0.478, 0.565, 0.910
  ];
  
  const darkAlphas = [
    0.017, 0.034, 0.056, 0.085, 0.110, 0.135,
    0.165, 0.250, 0.480, 0.520, 0.620, 0.930
  ];
  
  const alphas = mode === 'dark' ? darkAlphas : lightAlphas;
  
  for (let i = 1; i <= 12; i++) {
    const alpha = alphas[i - 1];
    alphaScale[i] = formatOklchCSS(oklch.L, oklch.C, oklch.H, alpha);
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