import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { compile } from 'sass'
import { resolve } from 'node:path'
import { applyTheme, generateAlphaScale, generateDarkScale, generateScale, generateSemanticTokens } from '../src/utils/color-generator.js'

const families = {
  primary: '#ff8800', secondary: '#00bfa5', tertiary: '#3b82f6',
  neutral: '#6b7280', success: '#22c55e', warning: '#f59e0b',
  error: '#ef4444', info: '#3b82f6'
}
const roles = {
  surface: { base: 1, subtle: 2, normal: 3, hover: 4, active: 5 },
  fill: { normal: 9, hover: 10, active: 8 },
  border: { line: 5, normal: 7, active: 9, focus: 7 },
  text: { normal: 11, 'contrast-high': 12, 'contrast-low': 9, disabled: 7 }
}

// Compare authored SASS output with the runtime API; no generated metadata or
// dist files are written by this test.
const css = compile(resolve('src/styles/_theme.sass'), {
  loadPaths: [resolve('src/styles')],
  logger: { warn() {}, debug() {} }
}).css
const staticModes = { light: new Map(), dark: new Map() }
for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const mode = selector.trim() === ':root' ? 'light'
    : selector.trim() === '[data-theme=dark], .dark' ? 'dark' : null
  if (!mode) continue
  for (const [, token, value] of body.matchAll(/(--lb-[a-z0-9-]+):\s*([^;]+);/g)) {
    staticModes[mode].set(token, value.trim())
  }
}

const root = () => document.documentElement
const inline = (name) => root().style.getPropertyValue(name)
const stopObserver = () => {
  window.__lbThemeObserver?.disconnect()
  delete window.__lbThemeObserver
}

beforeEach(() => {
  stopObserver()
  root().className = ''
  root().style.cssText = ''
})
afterEach(stopObserver)

describe('Step 06 static and custom-palette token alignment', () => {
  test('every family uses the same documented role steps in static light/dark and runtime', () => {
    for (const [family, hex] of Object.entries(families)) {
      const light = generateScale(hex)
      const dark = generateDarkScale(light, hex)
      for (const [mode, scale] of [['light', light], ['dark', dark]]) {
        const staticTokens = staticModes[mode]
        const generated = generateSemanticTokens(family, scale, mode === 'light' ? dark : light, mode)
        for (const [role, mapping] of Object.entries(roles)) {
          for (const [state, step] of Object.entries(mapping)) {
            const name = `--lb-${role}-${family}-${state}`
            expect(staticTokens.get(name), `${mode} static ${name}`).toBe(`var(--lb-${family}-${step})`)
            expect(generated[name], `${mode} runtime ${name}`).toBe(scale[step])
          }
        }
        const disabledAlpha = family === 'neutral' ? 2 : 4
        for (const role of ['border', 'fill']) {
          const name = `--lb-${role}-${family}-disabled`
          const reference = `var(--lb-${family}-alpha-${disabledAlpha})`
          expect(staticTokens.get(name)).toBe(reference)
          expect(generated[name]).toBe(reference)
        }
        for (const [state, step] of Object.entries({ normal: 3, hover: 4, active: 5 })) {
          const name = `--lb-surface-${family}-${state}-alpha`
          const reference = `var(--lb-${family}-alpha-${step})`
          expect(staticTokens.get(name)).toBe(reference)
          expect(generated[name]).toBe(reference)
          expect(staticTokens.has(`--lb-${family}-alpha-${step}`)).toBe(true)
        }
        for (const [state, step] of [['base', 1], ['subtle', 2]]) {
          const name = `--lb-surface-${family}-${state}-inverse`
          const opposite = mode === 'dark' ? 'light' : 'dark'
          const raw = `--lb-${family}-${opposite}-${step}`
          expect(staticTokens.get(name)).toBe(`var(${raw})`)
          expect(generated[name]).toBe(`var(${raw})`)
          expect(staticModes.light.get(raw), `${raw} defined without JS`).toBeTruthy()
          expect(staticModes.light.get(raw)).toBe(staticModes[opposite].get(`--lb-${family}-${step}`))
        }
        // Existing on-fill anchors are candidates; Step 07 measures contrast.
        for (const state of ['', '-hover', '-active']) {
          const name = `--lb-text-on-${family}${state}`
          expect(generated[name]).toBe(staticTokens.get(name))
        }
      }
    }
    for (const mode of ['light', 'dark']) {
      // Shadows are defined once in :root and inherited unchanged in dark mode.
      for (const shadow of ['sm', 'md', 'lg']) expect(staticModes.light.has(`--lb-shadow-${shadow}`)).toBe(true)
      expect(staticModes[mode].get('--lb-surface-base')).toBe('var(--lb-neutral-1)')
      expect(staticModes[mode].get('--lb-surface-subtle')).toBe('var(--lb-neutral-2)')
      expect(staticModes[mode].get('--lb-surface-disabled')).toBe('var(--lb-neutral-3)')
    }
  })

  test('applyTheme writes matching raw alpha/inverse palettes and background canvas in both modes', () => {
    for (const mode of ['light', 'dark']) {
      stopObserver()
      root().className = mode === 'dark' ? 'dark' : ''
      root().style.cssText = ''
      applyTheme({ primary: '#8b5cf6', background: 'primary' })
      const active = mode === 'dark' ? generateDarkScale(null, '#8b5cf6') : generateScale('#8b5cf6')
      const inverse = mode === 'dark' ? generateScale('#8b5cf6') : generateDarkScale(null, '#8b5cf6')
      const alpha = generateAlphaScale('#8b5cf6', mode)
      expect(inline('--lb-surface-primary-base')).toBe(active[1])
      expect(inline('--lb-surface-primary-subtle')).toBe(active[2])
      expect(inline('--lb-surface-primary-normal')).toBe(active[3])
      expect(inline('--lb-surface-primary-hover')).toBe(active[4])
      expect(inline('--lb-surface-primary-active')).toBe(active[5])
      expect(inline('--lb-surface-base')).toBe(active[1])
      expect(inline('--lb-surface-subtle')).toBe(active[2])
      expect(inline('--lb-surface-disabled')).toBe(active[3])
      const opposite = mode === 'dark' ? 'light' : 'dark'
      for (const step of [1, 2]) {
        expect(inline(`--lb-primary-${opposite}-${step}`)).toBe(inverse[step])
      }
      expect(inline('--lb-surface-primary-base-inverse')).toBe(`var(--lb-primary-${opposite}-1)`)
      expect(inline('--lb-surface-primary-subtle-inverse')).toBe(`var(--lb-primary-${opposite}-2)`)
      for (const [state, step] of Object.entries({ normal: 3, hover: 4, active: 5 })) {
        expect(inline(`--lb-primary-alpha-${step}`)).toBe(alpha[step])
        expect(inline(`--lb-surface-primary-${state}-alpha`)).toBe(`var(--lb-primary-alpha-${step})`)
      }
      expect(inline('--lb-background-1')).toBe('')
    }
  })

  test('a custom background hex changes global canvas but not family surface roles', () => {
    applyTheme({ primary: '#8b5cf6', background: '#2f5d63' })
    expect(inline('--lb-surface-base')).toBe(generateScale('#2f5d63')[1])
    expect(inline('--lb-surface-subtle')).toBe(generateScale('#2f5d63')[2])
    expect(inline('--lb-surface-primary-base')).toBe(generateScale('#8b5cf6')[1])
    expect(inline('--lb-background-1')).toBe('')
  })
})
