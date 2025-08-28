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
  return oklchUtils.generateOklchScale(hexColor, curve)
}

/**
 * Generate dark mode scale
 */
export function generateDarkScale(lightScale, originalHex) {
  return oklchUtils.generateOklchDarkScale(lightScale, originalHex)
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
  tokens[`--lb-text-${name}-disabled`] = scale[7]
  
  // Text-on tokens (determine if white or dark text needed)
  // Parse OKLCH lightness from scale[9]
  const match = scale[9].match(/oklch\(([\d.]+)/)
  const lightness = match ? parseFloat(match[1]) : 0.5
  const textColor = lightness > 0.6 ? 'var(--lb-text-neutral-contrast-high)' : 'white'
  
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
    // Generate scales
    const lightScale = generateScale(hexColor, curve)
    const darkScale = generateDarkScale(lightScale, hexColor)
    const alphaLight = generateAlphaScale(hexColor, 'light')
    const alphaDark = generateAlphaScale(hexColor, 'dark')
    
    // Generate semantic tokens
    const lightTokens = generateSemanticTokens(name, lightScale)
    const darkTokens = generateSemanticTokens(name, darkScale)
    
    // Apply appropriate tokens based on current mode
    const tokens = isDarkMode ? darkTokens : lightTokens
    const alpha = isDarkMode ? alphaDark : alphaLight
    const scale = isDarkMode ? darkScale : lightScale
    
    // Apply tokens
    Object.entries(tokens).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
    
    // Apply raw scale values
    Object.entries(scale).forEach(([step, value]) => {
      root.style.setProperty(`--lb-${name}-${step}`, value)
    })
    
    // Apply alpha values
    Object.entries(alpha).forEach(([step, value]) => {
      root.style.setProperty(`--lb-${name}-alpha-${step}`, value)
    })
  })
  
  // Handle background tokens
  const backgroundSource = colors.background || 'neutral'
  let backgroundScale = null
  
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
  
  // Apply backgrounds
  root.style.setProperty('--lb-background-page', backgroundScale[1])
  root.style.setProperty('--lb-background-surface', backgroundScale[2])
  root.style.setProperty('--lb-background-overlay', isDarkMode ? 
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