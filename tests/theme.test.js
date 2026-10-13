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

  test('surface steps/alpha are aligned, while data-theme detection remains a Step 07 gap', () => {
    const lightScale = generateScale(primary)
    const generated = generateSemanticTokens('primary', lightScale)
    expect(generated['--lb-surface-primary-normal']).toBe(lightScale[3])
    expect(generated['--lb-surface-primary-hover']).toBe(lightScale[4])
    expect(generated['--lb-surface-primary-active']).toBe(lightScale[5])
    expect(generated['--lb-surface-primary-normal-alpha']).toBe('var(--lb-primary-alpha-3)')
    root().dataset.theme = 'dark'
    applyTheme({ primary })
    expect(css('--lb-primary-2')).toBe(lightScale[2]) // attribute selector is not detected yet
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
