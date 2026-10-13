import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const reference = JSON.parse(readFileSync(resolve('reference/v1.json'), 'utf8'))

const server = await createServer({ configFile: resolve('site/vite.config.js'), server: { host: '127.0.0.1', port: 0 } })
const browser = await chromium.launch({ headless: true })
try {
  await server.listen()
  const base = server.resolvedUrls.local[0]
  const context = await browser.newContext({ colorScheme: 'light', permissions: ['clipboard-read', 'clipboard-write'] })
  try {
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base)
    await page.getByRole('heading', { name: 'Good interfaces start with a known contract.' }).waitFor()
    assert.equal(await page.locator('.component-link').count(), 4)
    assert.equal(await page.locator('.token-list li').count(), 9)
    assert.equal(await page.locator('th[scope="row"]').count(), reference.components[0].props.length, 'Button props derived from machine reference')
    await page.getByRole('button', { name: 'Save changes' }).click()
    assert.equal(await page.getByRole('status').filter({ hasText: 'Saved' }).count(), 1)
    await page.getByRole('checkbox', { name: 'Disabled' }).check()
    assert.equal(await page.getByRole('button', { name: 'Save changes' }).isDisabled(), true)
    await page.getByRole('checkbox', { name: 'Disabled' }).uncheck()
    await page.getByRole('checkbox', { name: 'Loading' }).check()
    assert.equal(await page.getByRole('button', { name: 'Save changes' }).getAttribute('aria-busy'), 'true')
    await page.getByRole('link', { name: /LbInput/ }).first().click()
    await page.getByRole('heading', { name: 'LbInput' }).waitFor()
    assert.equal(await page.locator('#reference-title').evaluate(el => el === document.activeElement), true)
    await page.locator('#site-email').fill('hello@example.com')
    assert.match(await page.locator('.preview-status').innerText(), /hello@example.com/)
    await page.getByRole('checkbox', { name: 'Invalid' }).check()
    assert.equal(await page.locator('#site-email').getAttribute('aria-invalid'), 'true')
    await page.getByRole('link', { name: /LbDialog/ }).first().click()
    assert.equal(await page.locator('pre').first().innerText().then(text => text.includes('variant="filled"')), false)
    await page.getByRole('button', { name: 'Open preferences' }).click()
    await page.locator('[role="dialog"]').waitFor()
    assert.equal(await page.locator('[role="dialog"]').getAttribute('aria-label'), 'Preferences')
    await page.keyboard.press('Escape')
    await page.locator('[role="dialog"]').waitFor({ state: 'detached' })
    await page.getByRole('link', { name: /LbSegmentButton/ }).first().click()
    await page.getByRole('radio', { name: 'Weekly' }).click()
    assert.match(await page.locator('.preview-status').innerText(), /weekly/)
    assert.equal(await page.getByRole('radio', { name: 'Weekly' }).getAttribute('aria-checked'), 'true')
    await page.getByRole('checkbox', { name: 'Disabled' }).check()
    assert.equal(await page.getByRole('radio', { name: 'Weekly' }).isDisabled(), true)
    const segmentExample = await page.locator('.code-column pre').innerText()
    assert.match(segmentExample, /<LbSegmentButtonItem/)
    assert.match(segmentExample, /<LbSegmentButton /)
    await page.getByRole('button', { name: 'Copy example' }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), segmentExample.trim() + '\n')
    await page.getByRole('button', { name: 'dark', exact: true }).click()
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
    const defaultFill = await page.locator('.swatch').first().evaluate(el => getComputedStyle(el).backgroundColor)
    await page.getByRole('button', { name: 'cobalt' }).click()
    const customFill = await page.locator('.swatch').first().evaluate(el => getComputedStyle(el).backgroundColor)
    assert.notEqual(defaultFill, customFill, 'brand switch changes token swatch in dark mode')
    await page.getByRole('button', { name: 'system' }).click()
    assert.equal(await page.locator('html').getAttribute('data-theme'), null)
    for (const viewport of [{ width: 320, height: 640 }, { width: 375, height: 760 }, { width: 1280, height: 800 }]) {
      await page.setViewportSize(viewport)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal overflow at ${viewport.width}`)
    }
    for (const file of ['README.md', 'ai-index.md', 'components/LbButton.md', 'components/LbInput.md', 'components/LbDialog.md', 'components/LbSegmentButton.md', 'components/LbSegmentButtonItem.md', 'TOKENS.md']) {
      const response = await page.request.get(new URL(`/reference/v1/${file}`, base).href)
      assert.equal(response.status(), 200, `Markdown ${file} served with site`)
      assert.equal(await response.text(), readFileSync(resolve('site/public/reference/v1', file), 'utf8'))
    }
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
  console.log('Documentation site browser checks passed (4 previews, API, themes, copy, responsive layout, 8 Markdown routes).')
} finally {
  await server.close()
  await browser.close()
}
