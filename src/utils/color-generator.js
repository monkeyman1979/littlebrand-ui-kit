/**
 * LittleBrand UI Kit - Color Generator
 * 
 * Generates complete color scales using OKLCH color space.
 * OKLCH provides better perceptual uniformity than HSL.
 * No build step required - works directly in the browser.
 */

import * as oklchUtils from './oklch-utils.js'

// Re-export all OKLCH utilities
export * from './oklch-utils.js'

/**
 * Generate a 12-step color scale from a single color
 * Uses OKLCH for perceptually uniform scales
 */
export function generateScale(hexColor, curve = 'natural') {
  // Note: curve parameter is for future use, currently only using light mode
  return oklchUtils.generateOklchScale(hexColor, 'light')
}

/**
 * Generate dark mode scale
 */
export function generateDarkScale(lightScale, originalHex) {
  // Ensure we generate a proper dark scale
  return oklchUtils.generateOklchScale(originalHex, 'dark')
}

/**
 * Generate alpha scale for transparent colors
 */
export function generateAlphaScale(hexColor, mode = 'light') {
  return oklchUtils.generateOklchAlphaScale(hexColor, mode)
}

/**
 * Generate semantic tokens from a scale
 */
export function generateSemanticTokens(name, scale, darkScale = null) {
  const tokens = {}
  
  // Validate scale exists and has required properties
  if (!scale || typeof scale !== 'object') {
    console.warn(`generateSemanticTokens: Invalid scale for ${name}`)
    return tokens
  }
  
  // Helper function to safely get scale value with fallback
  const getScaleValue = (step, fallback = 'oklch(0.5 0.1 0)') => {
    return scale[step] || fallback
  }
  
  // Border tokens
  tokens[`--lb-border-${name}-line`] = getScaleValue(6)
  tokens[`--lb-border-${name}-normal`] = getScaleValue(7)
  tokens[`--lb-border-${name}-active`] = getScaleValue(8)
  tokens[`--lb-border-${name}-focus`] = getScaleValue(7)
  tokens[`--lb-border-${name}-disabled`] = getScaleValue(5)
  tokens[`--lb-border-${name}-subtle`] = getScaleValue(4)
  
  // Fill tokens
  tokens[`--lb-fill-${name}-normal`] = getScaleValue(9)
  tokens[`--lb-fill-${name}-hover`] = getScaleValue(10)
  tokens[`--lb-fill-${name}-active`] = getScaleValue(8)
  tokens[`--lb-fill-${name}-focus`] = getScaleValue(8)
  tokens[`--lb-fill-${name}-disabled`] = getScaleValue(4)
  
  // Text tokens
  tokens[`--lb-text-${name}-normal`] = getScaleValue(9)
  tokens[`--lb-text-${name}-contrast-low`] = getScaleValue(11)
  tokens[`--lb-text-${name}-contrast-high`] = getScaleValue(12)
  tokens[`--lb-text-${name}-disabled`] = getScaleValue(7)
  
  // Text-on tokens (determine if light or dark text needed)
  // Parse OKLCH lightness from scale[9]
  const scaleValue9 = getScaleValue(9)
  const match = scaleValue9.match(/oklch\(([\d.]+)/)
  const lightness = match ? parseFloat(match[1]) : 0.5
  
  // Improved OKLCH contrast calculation using stable text variables
  // Most colors need light text, but high lightness colors need dark text
  let textColor = 'var(--lb-text-light-normal)' // Default to stable light text
  
  if (lightness > 0.75) {
    // High lightness usually needs dark text
    textColor = 'var(--lb-text-dark-normal)'
  } else if (lightness > 0.65 && name === 'warning') {
    // Yellow/warning colors need dark text even at lower lightness
    textColor = 'var(--lb-text-dark-normal)'
  }
  // All other cases use stable light text
  
  tokens[`--lb-text-on-${name}`] = textColor
  tokens[`--lb-text-on-${name}-hover`] = textColor
  tokens[`--lb-text-on-${name}-active`] = textColor
  
  // Surface tokens
  tokens[`--lb-surface-${name}-normal`] = getScaleValue(2)
  tokens[`--lb-surface-${name}-hover`] = getScaleValue(3)
  tokens[`--lb-surface-${name}-active`] = getScaleValue(4)
  tokens[`--lb-surface-${name}-subtle`] = getScaleValue(1)
  tokens[`--lb-surface-${name}-raised`] = getScaleValue(1)
  tokens[`--lb-surface-${name}-disabled`] = getScaleValue(3)
  
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
  
  // Check for dark mode
  const isDarkMode = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark')
  
  // Default colors if not provided
  const defaultColors = {
    primary: '#ff8800',   // Orange
    secondary: '#00bfa5', // Teal
    tertiary: '#3b82f6',  // Blue
    success: '#22c55e',   // Green
    warning: '#f59e0b',   // Yellow
    error: '#ef4444',     // Red
    info: '#3b82f6',      // Blue
    neutral: '#6b7280'    // Gray
  }
  
  // Merge with defaults
  const finalColors = { ...defaultColors, ...colors }
  
  // Generate and apply each color
  Object.entries(finalColors).forEach(([name, hexColor]) => {
    try {
      // Validate hex color
      if (!hexColor || typeof hexColor !== 'string' || !hexColor.match(/^#[0-9A-Fa-f]{6}$/)) {
        console.warn(`applyTheme: Invalid hex color for ${name}: ${hexColor}`)
        return
      }
      
      // Generate scales with error handling
      let lightScale, darkScale, alphaLight, alphaDark
      
      try {
        lightScale = generateScale(hexColor, curve)
      } catch (err) {
        console.warn(`applyTheme: Failed to generate light scale for ${name}:`, err)
        return
      }
      
      try {
        darkScale = generateDarkScale(lightScale, hexColor)
      } catch (err) {
        console.warn(`applyTheme: Failed to generate dark scale for ${name}:`, err)
        darkScale = lightScale // Fallback to light scale
      }
      
      try {
        alphaLight = generateAlphaScale(hexColor, 'light')
      } catch (err) {
        console.warn(`applyTheme: Failed to generate light alpha scale for ${name}:`, err)
        alphaLight = {} // Empty object fallback
      }
      
      try {
        alphaDark = generateAlphaScale(hexColor, 'dark')
      } catch (err) {
        console.warn(`applyTheme: Failed to generate dark alpha scale for ${name}:`, err)
        alphaDark = {} // Empty object fallback
      }
      
      // Generate semantic tokens
      const lightTokens = generateSemanticTokens(name, lightScale)
      const darkTokens = generateSemanticTokens(name, darkScale)
      
      // Apply appropriate tokens based on current mode
      const tokens = isDarkMode ? darkTokens : lightTokens
      const alpha = isDarkMode ? alphaDark : alphaLight
      const scale = isDarkMode ? darkScale : lightScale
      
      // Apply tokens
      if (tokens && typeof tokens === 'object') {
        Object.entries(tokens).forEach(([property, value]) => {
          if (value) {
            root.style.setProperty(property, value)
          }
        })
      }
      
      // Apply raw scale values
      if (scale && typeof scale === 'object') {
        Object.entries(scale).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-${step}`, value)
          }
        })
      }
      
      // Apply alpha values
      if (alpha && typeof alpha === 'object') {
        Object.entries(alpha).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-alpha-${step}`, value)
          }
        })
      }
    } catch (err) {
      console.error(`applyTheme: Failed to process color ${name}:`, err)
    }
  })
  
  // Handle background tokens
  const backgroundSource = colors.background || 'neutral'
  let backgroundScale = null
  
  try {
    // Determine which scale to use for backgrounds
    if (typeof backgroundSource === 'string' && backgroundSource.startsWith('#')) {
      // Generate a scale from a custom hex color
      backgroundScale = isDarkMode 
        ? generateDarkScale(null, backgroundSource)
        : generateScale(backgroundSource, curve)
    } else {
      // Use an existing color scale
      const sourceColor = finalColors[backgroundSource] || finalColors.neutral
      backgroundScale = isDarkMode 
        ? generateDarkScale(null, sourceColor)
        : generateScale(sourceColor, curve)
    }
    
    // Apply surface tokens with validation
    if (backgroundScale && typeof backgroundScale === 'object') {
      if (backgroundScale[1]) {
        root.style.setProperty('--lb-surface-base', backgroundScale[1])
      }
      if (backgroundScale[2]) {
        root.style.setProperty('--lb-surface-subtle', backgroundScale[2])
      }
      if (backgroundScale[3]) {
        root.style.setProperty('--lb-surface-disabled', backgroundScale[3])
      }
    }
  } catch (err) {
    console.warn('applyTheme: Failed to generate background scale:', err)
    // Apply fallback surface colors
    root.style.setProperty('--lb-surface-base', 'oklch(0.98 0.01 0)')
    root.style.setProperty('--lb-surface-subtle', 'oklch(0.96 0.01 0)')
    root.style.setProperty('--lb-surface-disabled', 'oklch(0.94 0.01 0)')
  }
  
  root.style.setProperty('--lb-surface-overlay', isDarkMode ? 
    `oklch(0 0 0 / 0.7)` : `oklch(0 0 0 / 0.5)`)
  
  // Watch for dark mode changes
  if (!window.__lbThemeObserver) {
    window.__lbThemeObserver = new MutationObserver(() => {
      // Reapply theme when dark mode changes
      applyTheme(colors, curve)
    })
    
    window.__lbThemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    window.__lbThemeObserver.observe(document.body, {
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
  applyTheme,
  // Direct access to OKLCH utilities
  ...oklchUtils
}