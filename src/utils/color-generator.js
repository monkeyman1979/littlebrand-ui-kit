/**
 * LittleBrand UI Kit - JavaScript Color Generator
 * 
 * Generates complete color scales from single hex colors at runtime.
 * No build step required - works directly in the browser.
 */

/**
 * Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h, s, l) {
  h = h / 360
  s = s / 100
  l = l / 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getLuminance(r, g, b) {
  const rsRGB = r / 255
  const gsRGB = g / 255
  const bsRGB = b / 255
  
  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)
  
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin
}

/**
 * Generate a 12-step color scale from a single color
 */
export function generateScale(hexColor, curve = 'natural') {
  const rgb = hexToRgb(hexColor)
  if (!rgb) throw new Error('Invalid hex color')
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const scale = {}
  
  // Ensure step 9 is in a usable range (40-60% lightness)
  // This matches our SASS generator behavior
  let targetLightness9 = hsl.l
  if (hsl.l > 60) {
    targetLightness9 = 52
  } else if (hsl.l < 40) {
    targetLightness9 = 48
  }
  
  // Lightness stops (matching our SASS generator)
  const lightnessStops = [
    99,  // 1: App background
    98,  // 2: Subtle background
    96,  // 3: UI element background
    93,  // 4: Hovered UI element
    88,  // 5: Active UI element
    78,  // 6: Subtle borders
    68,  // 7: UI borders
    58,  // 8: Hovered borders
    targetLightness9, // 9: Solid color (buttons, etc) - adjusted to usable range
    Math.max(targetLightness9 - 10, 35), // 10: Hovered solid
    Math.max(targetLightness9 - 18, 25), // 11: Low contrast text
    Math.max(targetLightness9 - 28, 15)  // 12: High contrast text
  ]
  
  // Saturation multipliers based on curve
  let saturationMultipliers
  
  if (curve === 'vivid') {
    saturationMultipliers = [
      0.30, 0.45, 0.60, 0.75, 0.90,
      1.00, 1.05, 1.10, 1.10, 1.12,
      1.05, 1.00
    ]
  } else if (curve === 'muted') {
    saturationMultipliers = [
      0.15, 0.25, 0.35, 0.50, 0.65,
      0.75, 0.80, 0.85, 0.85, 0.85,
      0.80, 0.75
    ]
  } else { // natural
    saturationMultipliers = [
      0.20, 0.32, 0.48, 0.64, 0.80,
      0.90, 0.95, 1.00, 1.00, 1.02,
      0.95, 0.90
    ]
  }
  
  // Generate each step
  for (let i = 1; i <= 12; i++) {
    const lightness = lightnessStops[i - 1]
    const satMultiplier = saturationMultipliers[i - 1]
    let saturation = Math.min(hsl.s * satMultiplier, 100)
    
    // Step 9 keeps original saturation
    if (i === 9) {
      saturation = hsl.s
    }
    
    const stepRgb = hslToRgb(hsl.h, saturation, lightness)
    scale[i] = `rgb(${stepRgb.r}, ${stepRgb.g}, ${stepRgb.b})`
  }
  
  return scale
}

/**
 * Generate dark mode scale
 */
export function generateDarkScale(lightScale, originalHex) {
  const rgb = hexToRgb(originalHex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const darkScale = {}
  
  // Ensure step 9 is in a usable range (40-60% lightness)
  let targetLightness9 = hsl.l
  if (hsl.l > 60) {
    targetLightness9 = 52
  } else if (hsl.l < 40) {
    targetLightness9 = 48
  }
  
  // Dark mode lightness stops
  const darkLightnessStops = [
    8,   // 1: Very dark app background
    11,  // 2: Slightly lighter
    15,  // 3: More noticeable difference
    19,  // 4: Hovered dark UI
    24,  // 5: Active dark UI
    30,  // 6: Dark subtle borders
    38,  // 7: Dark UI borders
    46,  // 8: Dark hovered borders
    targetLightness9, // 9: Keep consistent with light mode
    Math.min(targetLightness9 + 8, 65), // 10: Slightly lighter
    85,  // 11: Very bright for text
    96   // 12: Near white for high contrast
  ]
  
  // Dark mode saturation multipliers
  const darkSaturationMultipliers = [
    0.35, 0.45, 0.55, 0.65, 0.75,
    0.85, 0.95, 1.05, 1.00, 1.00,
    1.10, 0.95
  ]
  
  // Generate dark scale
  for (let i = 1; i <= 12; i++) {
    const lightness = darkLightnessStops[i - 1]
    const satMultiplier = darkSaturationMultipliers[i - 1]
    const saturation = Math.min(hsl.s * satMultiplier, 100)
    
    const stepRgb = hslToRgb(hsl.h, saturation, lightness)
    darkScale[i] = `rgb(${stepRgb.r}, ${stepRgb.g}, ${stepRgb.b})`
  }
  
  return darkScale
}

/**
 * Generate alpha scale for transparent colors
 */
export function generateAlphaScale(hexColor, mode = 'light') {
  const rgb = hexToRgb(hexColor)
  if (!rgb) throw new Error('Invalid hex color')
  
  const alphaScale = {}
  
  // Alpha values for light and dark modes
  const lightAlphas = [
    0.012, 0.027, 0.047, 0.071, 0.090, 0.114,
    0.141, 0.220, 0.439, 0.478, 0.565, 0.910
  ]
  
  const darkAlphas = [
    0.017, 0.034, 0.056, 0.085, 0.110, 0.135,
    0.165, 0.250, 0.480, 0.520, 0.620, 0.930
  ]
  
  const alphas = mode === 'dark' ? darkAlphas : lightAlphas
  
  for (let i = 1; i <= 12; i++) {
    const alpha = alphas[i - 1]
    alphaScale[i] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
  }
  
  return alphaScale
}

/**
 * Generate semantic tokens from a scale
 */
export function generateSemanticTokens(name, scale, darkScale = null) {
  const tokens = {}
  
  // Border tokens
  tokens[`--lb-border-${name}-line`] = scale[6]
  tokens[`--lb-border-${name}-normal`] = scale[7]
  tokens[`--lb-border-${name}-active`] = scale[8]
  tokens[`--lb-border-${name}-focus`] = scale[7]
  tokens[`--lb-border-${name}-disabled`] = scale[5]
  tokens[`--lb-border-${name}-subtle`] = scale[4]
  
  // Fill tokens
  tokens[`--lb-fill-${name}-normal`] = scale[9]
  tokens[`--lb-fill-${name}-hover`] = scale[10]
  tokens[`--lb-fill-${name}-active`] = scale[8]
  tokens[`--lb-fill-${name}-focus`] = scale[8]
  tokens[`--lb-fill-${name}-disabled`] = scale[4]
  
  // Text tokens
  tokens[`--lb-text-${name}-normal`] = scale[9]
  tokens[`--lb-text-${name}-contrast-low`] = scale[11]
  tokens[`--lb-text-${name}-contrast-high`] = scale[12]
  tokens[`--lb-text-${name}-disabled`] = scale[5]
  
  // Text-on tokens (determine if white or dark text needed)
  const rgb9 = scale[9].match(/\d+/g)
  const luminance = getLuminance(rgb9[0], rgb9[1], rgb9[2])
  const textColor = luminance > 0.5 ? 'var(--lb-text-neutral-contrast-high)' : 'white'
  
  tokens[`--lb-text-on-${name}`] = textColor
  tokens[`--lb-text-on-${name}-hover`] = textColor
  tokens[`--lb-text-on-${name}-active`] = textColor
  
  // Surface tokens
  tokens[`--lb-surface-${name}-normal`] = scale[2]
  tokens[`--lb-surface-${name}-hover`] = scale[3]
  tokens[`--lb-surface-${name}-active`] = scale[4]
  tokens[`--lb-surface-${name}-subtle`] = scale[1]
  tokens[`--lb-surface-${name}-raised`] = scale[1]
  tokens[`--lb-surface-${name}-disabled`] = scale[3]
  
  return tokens
}

/**
 * Apply a complete theme to the document
 * 
 * @param {Object} colors - Object with color names and hex values
 * @param {string} colors.primary - Primary brand color
 * @param {string} colors.secondary - Secondary color
 * @param {string} colors.success - Success color
 * @param {string} colors.warning - Warning color
 * @param {string} colors.error - Error color
 * @param {string} colors.info - Info color
 * @param {string} colors.neutral - Neutral/gray color
 * @param {string} curve - Saturation curve: 'natural', 'vivid', or 'muted'
 * 
 * @example
 * applyTheme({
 *   primary: '#8b5cf6',
 *   secondary: '#f59e0b'
 * })
 */
export function applyTheme(colors, curve = 'natural') {
  const root = document.documentElement
  
  // Default colors if not provided
  const defaultColors = {
    primary: '#6366f1',   // Indigo
    secondary: '#64748b', // Slate
    tertiary: '#8b5cf6',  // Purple
    success: '#22c55e',   // Green
    warning: '#f59e0b',   // Amber
    error: '#ef4444',     // Red
    info: '#3b82f6',      // Blue
    neutral: '#6b7280'    // Gray
  }
  
  // Merge with defaults
  const finalColors = { ...defaultColors, ...colors }
  
  // Generate and apply each color
  Object.entries(finalColors).forEach(([name, hexColor]) => {
    // Generate scales
    const lightScale = generateScale(hexColor, curve)
    const darkScale = generateDarkScale(lightScale, hexColor)
    const alphaLight = generateAlphaScale(hexColor, 'light')
    const alphaDark = generateAlphaScale(hexColor, 'dark')
    
    // Generate semantic tokens
    const lightTokens = generateSemanticTokens(name, lightScale)
    const darkTokens = generateSemanticTokens(name, darkScale)
    
    // Apply light mode tokens to :root
    Object.entries(lightTokens).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
    
    // Apply raw scale values
    Object.entries(lightScale).forEach(([step, value]) => {
      root.style.setProperty(`--lb-${name}-${step}`, value)
    })
    
    // Apply alpha values
    Object.entries(alphaLight).forEach(([step, value]) => {
      root.style.setProperty(`--lb-${name}-alpha-${step}`, value)
    })
    
    // Store dark mode values for when .dark class is added
    // This is a simplified approach - in production we'd handle this better
    if (!window.__lbDarkTheme) window.__lbDarkTheme = {}
    window.__lbDarkTheme[name] = {
      tokens: darkTokens,
      scale: darkScale,
      alpha: alphaDark
    }
  })
  
  // Also apply background tokens which are not color-specific
  // Light mode backgrounds
  root.style.setProperty('--lb-background-page', 'white')
  root.style.setProperty('--lb-background-surface', '#fafafa')
  root.style.setProperty('--lb-background-overlay', 'rgba(0, 0, 0, 0.5)')
  
  // Store dark mode backgrounds
  if (!window.__lbDarkTheme) window.__lbDarkTheme = {}
  window.__lbDarkTheme.backgrounds = {
    '--lb-background-page': '#0a0a0a',
    '--lb-background-surface': '#1a1a1a',
    '--lb-background-overlay': 'rgba(0, 0, 0, 0.7)'
  }
  
  // Add event listener for dark mode if not already added
  if (!window.__lbDarkListener) {
    window.__lbDarkListener = true
    
    // Watch for dark class changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark')
      
      if (isDark && window.__lbDarkTheme) {
        // Apply dark theme
        Object.entries(window.__lbDarkTheme).forEach(([name, data]) => {
          // Skip backgrounds, handle them separately
          if (name === 'backgrounds') return
          
          Object.entries(data.tokens).forEach(([property, value]) => {
            root.style.setProperty(property, value)
          })
          Object.entries(data.scale).forEach(([step, value]) => {
            root.style.setProperty(`--lb-${name}-${step}`, value)
          })
          Object.entries(data.alpha).forEach(([step, value]) => {
            root.style.setProperty(`--lb-${name}-alpha-${step}`, value)
          })
        })
        
        // Apply dark backgrounds
        if (window.__lbDarkTheme.backgrounds) {
          Object.entries(window.__lbDarkTheme.backgrounds).forEach(([property, value]) => {
            root.style.setProperty(property, value)
          })
        }
      } else {
        // Reapply light theme
        applyTheme(colors, curve)
      }
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
}

// Export as default for convenience
export default {
  generateScale,
  generateDarkScale,
  generateAlphaScale,
  generateSemanticTokens,
  applyTheme
}