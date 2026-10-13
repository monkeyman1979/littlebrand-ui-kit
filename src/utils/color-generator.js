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

let latestTheme = null
const preferredDark = () => window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false

// An explicit root choice takes precedence over the OS. Body and nested
// selectors are styled at their own scopes by CSS and the custom palette rule.
const rootIsDark = () => {
  const root = document.documentElement
  const explicit = root.getAttribute('data-theme')
  if (explicit === 'light') return false
  if (explicit === 'dark') return true
  return root.classList.contains('dark') || preferredDark()
}

const applyScopedPalette = (scopes) => {
  let style = document.querySelector('style[data-lb-custom-theme]')
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('data-lb-custom-theme', '')
    document.head.appendChild(style)
  }
  const declarations = (values) => Object.entries(values)
    .map(([name, value]) => `${name}: ${value};`).join('\n')
  style.textContent = `[data-theme="light"] { ${declarations(scopes.light)} }\n` +
    `[data-theme="dark"], .dark:not([data-theme="light"]) { ${declarations(scopes.dark)} }`
}

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
export function generateSemanticTokens(name, scale, darkScale = null, mode = 'light') {
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
  tokens[`--lb-border-${name}-line`] = getScaleValue(5)
  tokens[`--lb-border-${name}-normal`] = getScaleValue(7)
  tokens[`--lb-border-${name}-active`] = getScaleValue(9)
  tokens[`--lb-border-${name}-focus`] = getScaleValue(7)
  tokens[`--lb-border-${name}-disabled`] = name === 'neutral' ? `var(--lb-${name}-alpha-2)` : `var(--lb-${name}-alpha-4)`
  tokens[`--lb-border-${name}-subtle`] = getScaleValue(4)

  // Fill tokens
  tokens[`--lb-fill-${name}-normal`] = getScaleValue(9)
  tokens[`--lb-fill-${name}-hover`] = getScaleValue(10)
  tokens[`--lb-fill-${name}-active`] = getScaleValue(8)
  tokens[`--lb-fill-${name}-disabled`] = name === 'neutral' ? `var(--lb-${name}-alpha-2)` : `var(--lb-${name}-alpha-4)`
  
  // Text tokens
  tokens[`--lb-text-${name}-normal`] = getScaleValue(11)  // Fixed: was 9, should be 11
  tokens[`--lb-text-${name}-contrast-low`] = getScaleValue(9)  // Fixed: was 11, should be 9
  tokens[`--lb-text-${name}-contrast-high`] = getScaleValue(12)
  tokens[`--lb-text-${name}-disabled`] = getScaleValue(7)
  
  // Pick the higher-contrast stable anchor separately for each fill state.
  // Against true black/white, the WCAG AA dividing luminance is ~0.179.
  const onFill = (step) => {
    const match = getScaleValue(step).match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
    if (!match) return name === 'warning' ? 'var(--lb-text-dark-normal)' : 'var(--lb-text-light-normal)'
    const { r, g, b } = oklchUtils.oklchToRgb(...match.slice(1, 4).map(Number))
    const linear = [r, g, b].map(channel => {
      const value = channel / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
    return luminance >= 0.179 ? 'var(--lb-text-dark-normal)' : 'var(--lb-text-light-normal)'
  }
  tokens[`--lb-text-on-${name}`] = onFill(9)
  tokens[`--lb-text-on-${name}-hover`] = onFill(10)
  tokens[`--lb-text-on-${name}-active`] = onFill(8)
  
  // Keep the same 1/2/3/4/5 roles as the static theme in both modes.
  tokens[`--lb-surface-${name}-base`] = getScaleValue(1)
  tokens[`--lb-surface-${name}-subtle`] = getScaleValue(2)
  tokens[`--lb-surface-${name}-normal`] = getScaleValue(3)
  tokens[`--lb-surface-${name}-hover`] = getScaleValue(4)
  tokens[`--lb-surface-${name}-active`] = getScaleValue(5)
  for (const [state, step] of [['normal', 3], ['hover', 4], ['active', 5]]) {
    tokens[`--lb-surface-${name}-${state}-alpha`] = `var(--lb-${name}-alpha-${step})`
  }
  const inverseMode = mode === 'dark' ? 'light' : 'dark'
  tokens[`--lb-surface-${name}-base-inverse`] = `var(--lb-${name}-${inverseMode}-1)`
  tokens[`--lb-surface-${name}-subtle-inverse`] = `var(--lb-${name}-${inverseMode}-2)`
  // Legacy runtime-only names are retained without promoting them to static API.
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
  const isDarkMode = rootIsDark()
  latestTheme = { colors: { ...colors }, curve }
  const scopes = { light: {}, dark: {} }
  
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
  
  // Background chooses the global canvas; it is not a ninth color family.
  const { background = 'neutral', ...paletteColors } = colors
  const finalColors = { ...defaultColors, ...paletteColors }
  
  // Generate and apply each color
  Object.entries(finalColors).forEach(([name, hexColor]) => {
    try {
      // Only safe color-family names may appear in the scoped CSS rule.
      if (!/^[a-z][a-z0-9-]*$/.test(name) || !hexColor || typeof hexColor !== 'string' || !hexColor.match(/^#[0-9A-Fa-f]{6}$/)) {
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
      
      // Generate both palettes for explicit nested scopes and the active root.
      const lightTokens = generateSemanticTokens(name, lightScale, darkScale, 'light')
      const darkTokens = generateSemanticTokens(name, darkScale, lightScale, 'dark')
      for (const [mode, semantic, activeScale, activeAlpha] of [
        ['light', lightTokens, lightScale, alphaLight],
        ['dark', darkTokens, darkScale, alphaDark]
      ]) {
        Object.assign(scopes[mode], semantic)
        for (const [step, value] of Object.entries(activeScale)) {
          scopes[mode][`--lb-${name}-${step}`] = value
          scopes[mode][`--lb-${name}-${mode}-${step}`] = value
        }
        for (const [step, value] of Object.entries(activeAlpha)) {
          scopes[mode][`--lb-${name}-alpha-${step}`] = value
        }
        const opposite = mode === 'dark' ? 'light' : 'dark'
        for (const [step, value] of Object.entries(opposite === 'dark' ? darkScale : lightScale)) {
          scopes[mode][`--lb-${name}-${opposite}-${step}`] = value
        }
      }
      
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
      
      // Apply raw scale values (current mode)
      if (scale && typeof scale === 'object') {
        Object.entries(scale).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-${step}`, value)
          }
        })
      }

      // Apply BOTH light and dark scales (for inverse tokens)
      if (lightScale && typeof lightScale === 'object') {
        Object.entries(lightScale).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-light-${step}`, value)
          }
        })
      }

      if (darkScale && typeof darkScale === 'object') {
        Object.entries(darkScale).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-dark-${step}`, value)
          }
        })
      }

      // Apply alpha values (current mode)
      if (alpha && typeof alpha === 'object') {
        Object.entries(alpha).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-alpha-${step}`, value)
          }
        })
      }

      // Apply BOTH light and dark alpha scales (for potential future use)
      if (alphaLight && typeof alphaLight === 'object') {
        Object.entries(alphaLight).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-light-alpha-${step}`, value)
          }
        })
      }

      if (alphaDark && typeof alphaDark === 'object') {
        Object.entries(alphaDark).forEach(([step, value]) => {
          if (value) {
            root.style.setProperty(`--lb-${name}-dark-alpha-${step}`, value)
          }
        })
      }
    } catch (err) {
      console.error(`applyTheme: Failed to process color ${name}:`, err)
    }
  })
  
  // The background family is independent from other tinted surface roles.
  try {
    const backgroundHex = typeof background === 'string' && background.startsWith('#')
      ? background : finalColors[background] || finalColors.neutral
    const backgrounds = {
      light: generateScale(backgroundHex, curve),
      dark: generateDarkScale(null, backgroundHex)
    }
    for (const [mode, backgroundScale] of Object.entries(backgrounds)) {
      for (const [token, step] of [['base', 1], ['subtle', 2], ['disabled', 3]]) {
        scopes[mode][`--lb-surface-${token}`] = backgroundScale[step]
      }
    }
    for (const [token, step] of [['base', 1], ['subtle', 2], ['disabled', 3]]) {
      root.style.setProperty(`--lb-surface-${token}`, backgrounds[isDarkMode ? 'dark' : 'light'][step])
    }
  } catch (err) {
    console.warn('applyTheme: Failed to generate background scale:', err)
    root.style.setProperty('--lb-surface-base', 'oklch(0.98 0.01 0)')
    root.style.setProperty('--lb-surface-subtle', 'oklch(0.96 0.01 0)')
    root.style.setProperty('--lb-surface-disabled', 'oklch(0.94 0.01 0)')
  }

  scopes.light['--lb-surface-overlay'] = 'oklch(0 0 0 / 0.5)'
  scopes.dark['--lb-surface-overlay'] = 'oklch(0 0 0 / 0.7)'
  root.style.setProperty('--lb-surface-overlay', scopes[isDarkMode ? 'dark' : 'light']['--lb-surface-overlay'])
  applyScopedPalette(scopes)
  document.dispatchEvent(new Event('lb-theme-change'))

  // Only the document root requires inline recomputation. Body and nested
  // choices are handled immediately by mode-scoped CSS rules above.
  if (!window.__lbThemeObserver) {
    window.__lbThemeObserver = new MutationObserver(() => {
      if (latestTheme) applyTheme(latestTheme.colors, latestTheme.curve)
    })
    window.__lbThemeObserver.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })
  }
  if (!window.__lbThemeMediaListener && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    if (media?.addEventListener) {
      const handle = () => { if (latestTheme) applyTheme(latestTheme.colors, latestTheme.curve) }
      media.addEventListener('change', handle)
      window.__lbThemeMediaListener = { media, handle }
    }
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