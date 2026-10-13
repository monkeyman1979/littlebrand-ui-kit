import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { compile } from 'sass'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const browser = await chromium.launch({ headless: true })
const server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
try {
  const css = compile(resolve('src/styles/index.sass'), {
    loadPaths: [resolve('src/styles')], logger: { warn() {}, debug() {} }
  }).css
  const context = await browser.newContext({ colorScheme: 'dark' })
  const page = await context.newPage()
  const read = (selector, token = '--lb-primary-1') => page.evaluate(({ selector, token }) => {
    const style = getComputedStyle(document.querySelector(selector))
    return { value: style.getPropertyValue(token).trim(), scheme: style.colorScheme }
  }, { selector, token })

  // CSS-only initial paint and nested precedence; no app scripts or applyTheme.
  await page.setContent(`<style>${css}</style><div id="light" data-theme="light"><div id="dark" data-theme="dark"></div></div>`)
  const systemDark = await read('html')
  const explicitLight = await read('#light')
  assert.equal(systemDark.scheme, 'dark')
  assert.equal(explicitLight.scheme, 'light')
  assert.notEqual(systemDark.value, explicitLight.value)
  assert.deepEqual(await read('#dark'), systemDark)
  await page.emulateMedia({ colorScheme: 'light' })
  assert.deepEqual(await read('html'), explicitLight)
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
    document.documentElement.dataset.theme = 'light'
  })
  assert.deepEqual(await read('html'), explicitLight) // attribute beats class on same node
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark' })
  assert.deepEqual(await read('html'), systemDark)
  await page.evaluate(() => {
    document.body.classList.add('dark')
    document.body.dataset.theme = 'light'
  })
  assert.deepEqual(await read('body'), explicitLight) // nearest attr beats same-node .dark and html dark
  await page.evaluate(() => {
    document.body.removeAttribute('data-theme')
    document.body.classList.remove('dark')
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark')
  })
  assert.deepEqual(await read('html'), explicitLight)
  const measureOnFill = (mode) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d')
    const sample = (color) => {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3)
    }
    const luminance = (rgb) => {
      const [r, g, b] = rgb.map(channel => {
        const v = channel / 255
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const families = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info']
    const out = []
    const computed = getComputedStyle(document.documentElement)
    for (const family of families) for (const state of ['normal', 'hover', 'active']) {
        const fill = sample(computed.getPropertyValue(`--lb-fill-${family}-${state}`).trim())
        const name = `--lb-text-on-${family}${state === 'normal' ? '' : `-${state}`}`
        const text = sample(computed.getPropertyValue(name).trim())
        const a = luminance(fill), b = luminance(text)
      out.push({ mode, family, state, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) })
    }
    return out
  }
  const contrast = []
  for (const mode of ['light', 'dark']) {
    await page.evaluate(mode => { document.documentElement.dataset.theme = mode }, mode)
    contrast.push(...await page.evaluate(measureOnFill, mode))
  }
  assert.deepEqual(contrast.filter(entry => entry.ratio < 4.5), [], 'static on-fill text must meet 4.5:1 in all 48 family × mode × state cases')
  console.log('Static on-fill contrast: 48/48 cases at or above 4.5:1')
  await context.close()

  // Actual SFC + Teleport in a Vite dev consumer. This is not a production build.
  await server.listen()
  const appContext = await browser.newContext({ colorScheme: 'dark' })
  const app = await appContext.newPage()
  const errors = []
  app.on('pageerror', error => errors.push(error.message))
  await app.goto(`${server.resolvedUrls.local[0]}tests/fixtures/theme-browser.html`)
  await app.waitForFunction(() => Boolean(window.__themeFixture && document.querySelector('.lb-dialog-overlay')))
  const values = () => app.evaluate(() => {
    const property = (selector, name) => getComputedStyle(document.querySelector(selector)).getPropertyValue(name).trim()
    const token = '--lb-surface-primary-normal'
    return {
      root: property('html', token),
      preview: property('#preview', token),
      portal: property('.lb-dialog-overlay', token),
      canvas: property('.lb-dialog-overlay', '--lb-surface-base'),
      backdrop: getComputedStyle(document.querySelector('.lb-dialog-overlay')).backgroundColor,
      scheme: getComputedStyle(document.querySelector('.lb-dialog-overlay')).colorScheme
    }
  })
  await app.evaluate(() => window.__themeFixture.applyTheme({ primary: '#8b5cf6', background: 'primary' }))
  await app.waitForFunction(() => getComputedStyle(document.querySelector('.lb-dialog-overlay')).getPropertyValue('--lb-surface-primary-normal').trim() === getComputedStyle(document.querySelector('#preview')).getPropertyValue('--lb-surface-primary-normal').trim())
  const lightPreview = await values()
  assert.notEqual(lightPreview.root, lightPreview.preview)
  assert.equal(lightPreview.portal, lightPreview.preview)
  assert.equal(lightPreview.scheme, 'light')
  assert.ok(lightPreview.canvas)
  assert.match(lightPreview.backdrop, /0\.5\)/) // light-scope alpha over the actual dark page
  const composite = () => app.evaluate(() => {
    const tokens = getComputedStyle(document.querySelector('#preview'))
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d')
    const paint = (background, alpha) => {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, 1, 1)
      if (alpha) {
        ctx.fillStyle = alpha
        ctx.fillRect(0, 0, 1, 1)
      }
      return [...ctx.getImageData(0, 0, 1, 1).data]
    }
    const base = tokens.getPropertyValue('--lb-surface-base').trim()
    const subtle = tokens.getPropertyValue('--lb-surface-subtle').trim()
    const alpha = tokens.getPropertyValue('--lb-surface-primary-normal-alpha').trim()
    const text = paint(tokens.getPropertyValue('--lb-text-primary-normal').trim())
    const overBase = paint(base, alpha), overSubtle = paint(subtle, alpha)
    const luminance = (rgb) => rgb.slice(0, 3).map(byte => {
      const v = byte / 255
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
    const contrast = (background) => {
      const a = luminance(text), b = luminance(background)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    }
    return { raw: alpha, base: paint(base), overBase, overSubtle, contrastBase: contrast(overBase), contrastSubtle: contrast(overSubtle) }
  })
  const lightAlpha = await composite()
  assert.match(lightAlpha.raw, /\/\s*[\d.]+\)/)
  assert.notDeepEqual(lightAlpha.overBase, lightAlpha.base)
  assert.notDeepEqual(lightAlpha.overBase, lightAlpha.overSubtle)
  assert.ok(lightAlpha.contrastBase >= 4.5 && lightAlpha.contrastSubtle >= 4.5, 'light text over composited alpha must meet 4.5:1 on both canvases')
  await app.evaluate(() => { window.__themeFixture.mode.value = 'dark' })
  await app.waitForFunction(() => getComputedStyle(document.querySelector('.lb-dialog-overlay')).colorScheme === 'dark')
  const darkPreview = await values()
  assert.equal(darkPreview.portal, darkPreview.preview)
  assert.equal(darkPreview.root, darkPreview.preview)
  assert.match(darkPreview.backdrop, /0\.7\)/)
  const darkAlpha = await composite()
  assert.notEqual(darkAlpha.raw, lightAlpha.raw)
  assert.notDeepEqual(darkAlpha.overBase, darkAlpha.base)
  assert.ok(darkAlpha.contrastBase >= 4.5 && darkAlpha.contrastSubtle >= 4.5, 'dark text over composited alpha must meet 4.5:1 on both canvases')
  await app.evaluate(() => { window.__themeFixture.mode.value = 'light'; window.__themeFixture.applyTheme({ primary: '#0ea5e9', background: 'primary' }) })
  await app.waitForFunction(previous => getComputedStyle(document.querySelector('.lb-dialog-overlay')).getPropertyValue('--lb-surface-primary-normal').trim() !== previous, darkPreview.portal)
  const nextPalette = await values()
  assert.equal(nextPalette.portal, nextPalette.preview)
  assert.notEqual(nextPalette.portal, lightPreview.portal)
  await app.emulateMedia({ colorScheme: 'light' })
  await app.waitForFunction(() => getComputedStyle(document.documentElement).colorScheme === 'light')
  assert.equal((await values()).portal, (await values()).preview)
  const customContrast = []
  for (const mode of ['light', 'dark']) {
    await app.evaluate(mode => {
      document.documentElement.dataset.theme = mode
      window.__themeFixture.applyTheme({ primary: '#0ea5e9', background: 'primary' })
    }, mode)
    await app.waitForFunction(mode => getComputedStyle(document.documentElement).colorScheme === mode, mode)
    customContrast.push(...await app.evaluate(measureOnFill, mode))
  }
  assert.deepEqual(customContrast.filter(entry => entry.ratio < 4.5), [], 'runtime custom-palette on-fill text must meet 4.5:1')
  await app.keyboard.press('Tab')
  await app.locator('#focus-button').focus()
  const focusMeasurement = () => {
    const button = document.querySelector('#focus-button')
    const style = getComputedStyle(button)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext('2d')
    const luminance = (color) => {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      const channels = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map(byte => {
        const v = byte / 255
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      })
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
    }
    const ring = luminance(style.outlineColor)
    const surface = luminance(getComputedStyle(document.querySelector('#preview')).getPropertyValue('--lb-surface-base').trim())
    return { visible: button.matches(':focus-visible'), width: parseFloat(style.outlineWidth), color: style.outlineColor, contrast: (Math.max(ring, surface) + 0.05) / (Math.min(ring, surface) + 0.05) }
  }
  const focus = await app.evaluate(focusMeasurement)
  assert.equal(focus.visible, true, 'keyboard focus must be visible')
  assert.ok(focus.width >= 2, 'keyboard focus needs a visible outline')
  assert.notEqual(focus.color, 'transparent')
  assert.ok(focus.contrast >= 3, `light focus outline contrast ${focus.contrast.toFixed(2)} must meet 3:1`)
  await app.evaluate(() => { window.__themeFixture.mode.value = 'dark' })
  await app.waitForFunction(() => getComputedStyle(document.querySelector('#preview')).colorScheme === 'dark')
  const darkFocus = await app.evaluate(focusMeasurement)
  assert.ok(darkFocus.contrast >= 3, `dark focus outline contrast ${darkFocus.contrast.toFixed(2)} must meet 3:1`)
  await app.evaluate(() => {
    document.documentElement.removeAttribute('data-theme')
    window.__themeFixture.rootOpen.value = true
  })
  await app.waitForFunction(() => Boolean(document.querySelector('#root-dialog-probe')))
  const documentDialogScheme = () => app.evaluate(() => {
    const overlay = document.querySelector('#root-dialog-probe').closest('.lb-dialog-overlay')
    return getComputedStyle(overlay).colorScheme
  })
  assert.equal(await documentDialogScheme(), 'light')
  await app.emulateMedia({ colorScheme: 'dark' })
  await app.waitForFunction(() => getComputedStyle(document.documentElement).colorScheme === 'dark' && getComputedStyle(document.querySelector('#root-dialog-probe').closest('.lb-dialog-overlay')).colorScheme === 'dark')
  assert.equal(await documentDialogScheme(), 'dark')
  await app.evaluate(() => { document.body.dataset.theme = 'light' })
  await app.waitForFunction(() => getComputedStyle(document.querySelector('#root-dialog-probe').closest('.lb-dialog-overlay')).colorScheme === 'light')
  assert.equal(await documentDialogScheme(), 'light')
  const bodyPalette = await app.evaluate(() => {
    const token = '--lb-surface-primary-normal'
    const overlay = document.querySelector('#root-dialog-probe').closest('.lb-dialog-overlay')
    return [getComputedStyle(document.body).getPropertyValue(token).trim(), getComputedStyle(overlay).getPropertyValue(token).trim()]
  })
  assert.equal(bodyPalette[0], bodyPalette[1])
  await app.evaluate(() => { document.body.removeAttribute('data-theme') })
  await app.waitForFunction(() => getComputedStyle(document.querySelector('#root-dialog-probe').closest('.lb-dialog-overlay')).colorScheme === 'dark')
  assert.deepEqual(errors, [])
  await appContext.close()

  // The real demo must compile and must not pin the OS preference as .dark.
  const demoContext = await browser.newContext({ colorScheme: 'dark' })
  const demo = await demoContext.newPage()
  const demoErrors = []
  demo.on('pageerror', error => demoErrors.push(error.message))
  await demo.goto(server.resolvedUrls.local[0])
  const toggle = demo.locator('.theme-toggle-fixed button')
  await toggle.waitFor()
  assert.match(await toggle.innerText(), /Dark Mode/)
  await demo.emulateMedia({ colorScheme: 'light' })
  await demo.waitForFunction(() => document.querySelector('.theme-toggle-fixed button')?.textContent?.includes('Light Mode'))
  await toggle.click()
  assert.equal(await demo.evaluate(() => document.documentElement.dataset.theme), 'dark')
  await demo.emulateMedia({ colorScheme: 'dark' })
  await demo.emulateMedia({ colorScheme: 'light' })
  assert.equal(await demo.evaluate(() => document.documentElement.dataset.theme), 'dark')
  assert.deepEqual(demoErrors, [])
  await demoContext.close()
  console.log('Browser theme checks passed (CSS-only selectors, custom palette, nested Dialog portal, demo).')
} finally {
  await server.close()
  await browser.close()
}
