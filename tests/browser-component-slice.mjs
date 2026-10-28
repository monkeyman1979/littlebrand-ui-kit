import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const browser = await chromium.launch({ headless: true })
const server = await createServer({ server: { host: '127.0.0.1', port: 0 } })
try {
  await server.listen()
  const url = new URL('/tests/fixtures/component-browser.html', server.resolvedUrls.local[0]).href
  const themeSurfaces = []
  for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: scheme, reducedMotion: 'reduce' })
    try {
      const page = await context.newPage()
      await page.goto(url)
      await page.locator('#icon-input').waitFor()
      const form = page.locator('#form-submit-example')
      const submit = form.getByRole('button', { name: 'Save biography' })
      await submit.click()
      await form.getByText('Biography is required').waitFor()
      assert.equal(
        await form.locator('output').textContent(),
        '0',
        `${scheme}: invalid form must not emit`
      )
      await form.locator('textarea').fill('A short biography')
      await submit.click()
      assert.equal(
        await form.locator('output').textContent(),
        '1',
        `${scheme}: one click must emit once`
      )
      await submit.focus()
      await page.keyboard.press('Enter')
      assert.equal(await form.locator('output').textContent(), '2', `${scheme}: Enter submits once`)
      assert.equal(await page.locator('input[name="displayName"]').getAttribute('required'), '')
      assert.equal(
        await page.locator('[role="radiogroup"]').getAttribute('aria-label'),
        'Frequency'
      )
      themeSurfaces.push(
        await page
          .locator('[role="radio"][aria-checked="true"]')
          .evaluate((el) => getComputedStyle(el).backgroundColor)
      )
      await page.locator('[role="radio"][aria-checked="true"]').focus()
      await page.keyboard.press('ArrowRight')
      assert.match(
        await page.locator('[role="radio"][aria-checked="true"]').textContent(),
        /Weekly/,
        `${scheme}: arrow selects next radio`
      )
      await page.getByRole('button', { name: 'Open preferences' }).click()
      await page.locator('[role="dialog"]').waitFor()
      assert.equal(await page.locator('[role="dialog"]').getAttribute('aria-label'), 'Preferences')
      await page.keyboard.press('Tab')
      const inDialog = await page.evaluate(() =>
        document.querySelector('[role="dialog"]').contains(document.activeElement)
      )
      assert.equal(inDialog, true, `${scheme}: Tab must stay in a dialog with controls`)
      await page.getByRole('button', { name: 'Done' }).click()
      await page.locator('[role="dialog"]').waitFor({ state: 'detached' })

      await page.locator('#empty-trigger').click()
      await page.locator('[role="dialog"]').waitFor()
      await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'dialog')
      await page.keyboard.press('Tab')
      assert.equal(
        await page.evaluate(() => document.activeElement?.getAttribute('role')),
        'dialog',
        `${scheme}: empty dialog must trap Tab`
      )
      await page.keyboard.press('Escape')
      await page.locator('[role="dialog"]').waitFor({ state: 'detached' })
      assert.equal(
        await page.evaluate(() => document.activeElement?.id),
        'empty-trigger',
        `${scheme}: focus returns to trigger`
      )

      const styles = await page.evaluate(() => {
        const input = document.querySelector('#icon-input')
        const icon = input.parentElement.querySelector('.icon-leading')
        const load = document.querySelector('#loading-button .spinner')
        const group = document.querySelector('#icon-input').closest('.lb-input')
        const probe = document.createElement('span')
        probe.style.color = 'var(--lb-text-neutral-contrast-high)'
        document.body.append(probe)
        const neutralText = getComputedStyle(probe).color
        probe.remove()
        return {
          iconLeft: Math.abs(
            icon.getBoundingClientRect().left - group.getBoundingClientRect().left
          ),
          inputTransition: getComputedStyle(input).transitionDuration,
          spinnerAnimation: getComputedStyle(load).animationDuration,
          warningText: getComputedStyle(document.querySelector('#warning-button')).color,
          neutralText
        }
      })
      assert.ok(styles.iconLeft <= 1, `${scheme}: medium leading icon must align to input`)
      assert.equal(
        styles.warningText,
        styles.neutralText,
        `${scheme}: warning text must follow the local theme`
      )
      // The shared reset caps motion at 0.01ms; our component selectors also disable it.
      assert.ok(
        parseFloat(styles.inputTransition) <= 0.00001,
        `${scheme}: input transition disabled for reduced motion`
      )
      assert.ok(
        parseFloat(styles.spinnerAnimation) <= 0.00001,
        `${scheme}: spinner animation disabled for reduced motion`
      )
      await page.locator('#icon-input').focus()
      assert.equal(
        await page.locator('#icon-input').evaluate((el) => getComputedStyle(el).outlineStyle),
        'solid'
      )
    } finally {
      await context.close()
    }
  }
  assert.notEqual(
    themeSurfaces[0],
    themeSurfaces[1],
    'selected segment follows light/dark surface tokens'
  )
  console.log(
    'Component slice browser checks passed (both schemes, Dialog focus, example, icon layout, reduced motion).'
  )
} finally {
  await server.close()
  await browser.close()
}
