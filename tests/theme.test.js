import { afterEach, beforeEach, describe, expect, test } from 'vite-plus/test'
import {
  applyTheme,
  generateScale,
  generateDarkScale,
  generateSemanticTokens
} from '../src/utils/color-generator.js'

const primary = '#8b5cf6'
const root = () => document.documentElement
const css = (name) => root().style.getPropertyValue(name)
const settle = () => new Promise((resolve) => setTimeout(resolve, 0))
const originalMatchMedia = window.matchMedia
let prefersDark = false
let mediaListeners

const setSystemDark = async (dark) => {
  prefersDark = dark
  for (const listener of mediaListeners) listener({ matches: dark })
  await settle()
}

beforeEach(() => {
  window.__lbThemeObserver?.disconnect()
  delete window.__lbThemeObserver
  window.__lbThemeMediaListener?.media.removeEventListener(
    'change',
    window.__lbThemeMediaListener.handle
  )
  delete window.__lbThemeMediaListener
  document.querySelector('style[data-lb-custom-theme]')?.remove()
  mediaListeners = new Set()
  prefersDark = false
  window.matchMedia = () => ({
    get matches() {
      return prefersDark
    },
    addEventListener: (_name, listener) => mediaListeners.add(listener),
    removeEventListener: (_name, listener) => mediaListeners.delete(listener)
  })
  root().className = ''
  document.body.className = ''
  root().removeAttribute('data-theme')
  document.body.removeAttribute('data-theme')
  root().style.cssText = ''
})

afterEach(() => {
  window.__lbThemeObserver?.disconnect()
  delete window.__lbThemeObserver
  window.__lbThemeMediaListener?.media.removeEventListener(
    'change',
    window.__lbThemeMediaListener.handle
  )
  delete window.__lbThemeMediaListener
  document.querySelector('style[data-lb-custom-theme]')?.remove()
  window.matchMedia = originalMatchMedia
})

describe('runtime theme modes and palette persistence', () => {
  test('follows the system until an explicit root choice wins, then resumes following it', async () => {
    applyTheme({ primary })
    const light = generateScale(primary)[2]
    const dark = generateDarkScale(null, primary)[2]
    expect(css('--lb-primary-2')).toBe(light)
    await setSystemDark(true)
    expect(css('--lb-primary-2')).toBe(dark)
    root().dataset.theme = 'light'
    await settle()
    expect(css('--lb-primary-2')).toBe(light)
    root().classList.add('dark')
    await settle()
    expect(css('--lb-primary-2')).toBe(light) // data-theme wins on the same node
    root().dataset.theme = 'dark'
    await settle()
    expect(css('--lb-primary-2')).toBe(dark)
    await setSystemDark(false)
    expect(css('--lb-primary-2')).toBe(dark)
    root().removeAttribute('data-theme')
    await settle()
    expect(css('--lb-primary-2')).toBe(dark) // .dark is still explicit
    root().classList.remove('dark')
    await settle()
    expect(css('--lb-primary-2')).toBe(light)
  })

  test('surface steps and alpha remain aligned when an attribute selects dark', async () => {
    const generated = generateSemanticTokens('primary', generateScale(primary))
    expect(generated['--lb-surface-primary-normal']).toBe(generateScale(primary)[3])
    expect(generated['--lb-surface-primary-normal-alpha']).toBe('var(--lb-primary-alpha-3)')
    root().dataset.theme = 'dark'
    applyTheme({ primary })
    expect(css('--lb-primary-2')).toBe(generateDarkScale(null, primary)[2])
    root().dataset.theme = 'light'
    await settle()
    expect(css('--lb-primary-2')).toBe(generateScale(primary)[2])
  })

  test('a new palette replaces the first call through class and system toggles', async () => {
    applyTheme({ primary })
    applyTheme({ primary: '#0ea5e9' })
    expect(css('--lb-primary-9')).toBe(generateScale('#0ea5e9')[9])
    root().classList.add('dark')
    await settle()
    expect(css('--lb-primary-2')).toBe(generateDarkScale(null, '#0ea5e9')[2])
    root().classList.remove('dark')
    await settle()
    await setSystemDark(true)
    expect(css('--lb-primary-2')).toBe(generateDarkScale(null, '#0ea5e9')[2])
    expect(css('--lb-secondary-9')).toBe(generateDarkScale(null, '#00bfa5')[9])
  })
})
