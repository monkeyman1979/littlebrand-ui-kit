import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { applyTheme, generateScale, generateDarkScale, generateSemanticTokens } from '../src/utils/color-generator.js'

const primary = '#8b5cf6'
const root = () => document.documentElement
const css = (name) => root().style.getPropertyValue(name)
const settle = () => new Promise(resolve => setTimeout(resolve, 0))

beforeEach(() => {
  window.__lbThemeObserver?.disconnect()
  delete window.__lbThemeObserver
  root().className = ''
  document.body.className = ''
  root().removeAttribute('data-theme')
  document.body.removeAttribute('data-theme')
  root().style.cssText = ''
})

afterEach(() => {
  window.__lbThemeObserver?.disconnect()
  delete window.__lbThemeObserver
})

describe('runtime theme contracts — current successes and explicit legacy gaps', () => {
  test('class switching recomputes primary raw scale light → dark → light', async () => {
    applyTheme({ primary })
    const light = generateScale(primary)[2]
    const dark = generateDarkScale(null, primary)[2]
    expect(light).not.toBe(dark)
    expect(css('--lb-primary-2')).toBe(light)
    root().classList.add('dark')
    await settle()
    expect(css('--lb-primary-2')).toBe(dark)
    root().classList.remove('dark')
    await settle()
    expect(css('--lb-primary-2')).toBe(light)
  })

  test('approved surface mapping and data-theme handling expose only pinned baseline gaps', () => {
    const lightScale = generateScale(primary)
    const generated = generateSemanticTokens('primary', lightScale)
    const gaps = []
    if (generated['--lb-surface-primary-normal'] !== lightScale[3]) gaps.push('surface-normal-step')
    if (generated['--lb-surface-primary-hover'] !== lightScale[4]) gaps.push('surface-hover-step')
    if (generated['--lb-surface-primary-active'] !== lightScale[5]) gaps.push('surface-active-step')
    if (!('--lb-surface-primary-normal-alpha' in generated)) gaps.push('surface-alpha-missing')
    root().dataset.theme = 'dark'
    applyTheme({ primary })
    if (css('--lb-primary-2') !== generateDarkScale(null, primary)[2]) gaps.push('attribute-dark-not-detected')
    expect(gaps.sort()).toEqual([
      'attribute-dark-not-detected', 'surface-active-step', 'surface-alpha-missing',
      'surface-hover-step', 'surface-normal-step'
    ])
  })

  test('a later applyTheme palette should survive a mode toggle (known legacy observer gap)', async () => {
    applyTheme({ primary })
    applyTheme({ primary: '#0ea5e9' })
    expect(css('--lb-primary-9')).toBe(generateScale('#0ea5e9')[9])
    root().classList.add('dark')
    await settle()
    expect(css('--lb-primary-2')).toBe(generateDarkScale(null, primary)[2]) // first-call palette: legacy gap
  })
})
