// Reproduce the six PRIMARY SFCs from the independent agent's final answers.
// Source fixture only: imports are aliased to current Vue components/styles, never dist or npm.
// Investigation runner; a failed case reports an agent-answer gap and exits nonzero.
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const names = ['Save', 'Email', 'Notes', 'Validation', 'Confirmation', 'Frequency']
const reference = readFileSync(resolve('docs/MCP_AGENT_TRIAL_EVIDENCE.md'), 'utf8')
const fixture = mkdtempSync(resolve('tests/fixtures/.agent-trial-'))
const errors = []
let server
let browser

function primarySfc(name) {
  const start = `## ${name}\n\n**User request:**`
  const section = reference.slice(reference.indexOf(start) + start.length)
  assert.ok(reference.includes(start), `missing ${name} answer`)
  const answer = section.match(/\*\*Exact final answer:\*\*\n\n~~~~text\n([\s\S]*?)\n~~~~\n/)
  assert.ok(answer, `missing ${name} final answer`)
  const code = answer[1].match(/```vue\n([\s\S]*?)\n```/)
  assert.ok(code, `missing ${name} primary SFC`)
  return `${code[1]}\n`
}

const entry = `import { createApp, defineComponent, h, ref } from 'vue'
const name = new URLSearchParams(location.search).get('case')
const modules = import.meta.glob('./*.vue')
const events = window.__trialEvents = []
const pending = ref(false)
const value = ref(name === 'Frequency' ? 'daily' : '')
const opened = ref(false)
const initial = { initialNotes: 'Before', saveUrl: '/api/notes' }
const mod = await modules['./' + name + '.vue']()
const Component = mod.default
const App = defineComponent({
  setup() {
    return () => h('main', [
      name === 'Confirmation' ? h('button', { id: 'open', onClick: () => { opened.value = true } }, 'Ask to delete') : null,
      h(Component, {
        ...(name === 'Save' ? initial : {}),
        ...(name === 'Email' || name === 'Frequency' ? { modelValue: value.value, 'onUpdate:modelValue': v => { value.value = v; events.push(['update', v]) } } : {}),
        ...(name === 'Email' ? { required: true } : {}),
        ...(name === 'Confirmation' ? { modelValue: opened.value, busy: pending.value, 'onUpdate:modelValue': v => { opened.value = v; events.push(['open', v]) }, onConfirm: () => events.push(['confirm']), onCancel: () => events.push(['cancel']) } : {}),
        onSave: v => events.push(['save', v]),
        onSubmit: v => events.push(['submit', v])
      })
    ])
  }
})
createApp(App).mount('#app')
window.__trialReady = true
`

try {
  for (const name of names) writeFileSync(resolve(fixture, `${name}.vue`), primarySfc(name))
  writeFileSync(resolve(fixture, 'index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><div id="app"></div><script type="module" src="./entry.ts"></script></html>')
  writeFileSync(resolve(fixture, 'entry.ts'), entry)
  server = await createServer({
    logLevel: 'error',
    resolve: { alias: [
      { find: 'littlebrand-ui-kit/style.css', replacement: resolve('src/styles/index.sass') },
      { find: 'littlebrand-ui-kit', replacement: resolve('src/components/index.ts') }
    ] },
    server: { host: '127.0.0.1', port: 0 }
  })
  await server.listen()
  browser = await chromium.launch({ headless: true })
  const base = new URL(`${fixture.replace(/^.*?tests\//, '/tests/')}/index.html`, server.resolvedUrls.local[0])
  for (const name of names) {
    const context = await browser.newContext({ colorScheme: 'light' })
    const page = await context.newPage()
    const pageErrors = []
    let saveRequests = 0
    page.on('pageerror', e => pageErrors.push(e.message))
    page.on('response', r => { if (r.url().includes('/src/') && r.status() >= 400) pageErrors.push(`${r.status()} ${r.url()}`) })
    try {
      const url = new URL(base)
      url.searchParams.set('case', name)
      if (name === 'Save') await page.route('**/api/notes', route => {
        saveRequests += 1
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
      })
      await page.goto(url.href)
      await page.waitForFunction(() => window.__trialReady === true, null, { timeout: 8000 })
      assert.deepEqual(pageErrors, [], `${name}: browser errors`)
      switch (name) {
        case 'Save': {
          const textarea = page.locator('textarea[name="notes"]')
          assert.equal(await textarea.inputValue(), 'Before')
          await textarea.fill('After')
          const request = page.waitForRequest(req => req.url().endsWith('/api/notes'))
          await page.getByRole('button', { name: 'Save changes' }).click()
          assert.equal((await request).postDataJSON().notes, 'After')
          await page.getByRole('status').getByText('Saved').waitFor()
          assert.equal(saveRequests, 1, 'one click sends one save request')
          assert.equal(await page.getByRole('button', { name: 'Save changes' }).isDisabled(), true)
          break
        }
        case 'Email': {
          const input = page.locator('input[type="email"]')
          await input.focus(); await input.blur()
          await page.getByRole('alert').waitFor()
          await input.fill('person@example.com')
          assert.equal(await input.inputValue(), 'person@example.com')
          await page.getByRole('alert').waitFor({ state: 'detached' })
          break
        }
        case 'Notes': {
          const textarea = page.locator('textarea[name="notes"]')
          await page.getByRole('button', { name: 'Save notes' }).click()
          await page.getByText('Notes are required').waitFor()
          await textarea.fill('A note')
          await page.getByRole('button', { name: 'Save notes' }).click()
          const saves = await page.evaluate(() => window.__trialEvents.filter(([type]) => type === 'save'))
          assert.deepEqual(saves, [['save', 'A note']], 'one click must emit exactly one save')
          break
        }
        case 'Validation': {
          const input = page.locator('input[type="email"]')
          await input.focus(); await input.blur()
          await page.getByRole('alert').waitFor()
          assert.equal(await input.getAttribute('aria-invalid'), 'true')
          await input.fill('valid@example.com')
          await page.getByRole('alert').waitFor({ state: 'detached' })
          await page.getByRole('button', { name: 'Save' }).click()
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [['submit', 'valid@example.com']])
          break
        }
        case 'Confirmation': {
          await page.locator('#open').click()
          const dialog = page.getByRole('dialog')
          await dialog.waitFor()
          assert.equal(await dialog.getByRole('heading').textContent(), 'Delete this item?')
          await dialog.getByRole('button', { name: 'Delete' }).click()
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [['confirm']])
          await page.keyboard.press('Escape')
          await dialog.waitFor({ state: 'hidden' })
          assert.ok((await page.evaluate(() => window.__trialEvents)).some(([type]) => type === 'cancel'))
          break
        }
        case 'Frequency': {
          const daily = page.getByRole('radio', { name: /Daily/ })
          const weekly = page.getByRole('radio', { name: /Weekly/ })
          assert.equal(await daily.isChecked(), true)
          await weekly.check()
          assert.equal(await weekly.isChecked(), true)
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [['update', 'weekly']])
          break
        }
      }
      assert.deepEqual(pageErrors, [], `${name}: browser errors`)
      console.log(`PASS ${name}: primary SFC rendered and core interaction checked`)
    } catch (error) {
      errors.push({ name, reason: error.message, pageErrors })
      console.error(`FAIL ${name}: ${error.message.split('\n')[0]}`)
      if ('actual' in error) console.error('  observed:', JSON.stringify(error.actual))
      if (pageErrors.length) console.error('  page errors:', pageErrors)
    } finally { await context.close() }
  }
} finally {
  if (browser) await browser.close()
  if (server) await server.close()
  rmSync(fixture, { recursive: true, force: true })
}
if (errors.length) {
  console.error(`${errors.length} of ${names.length} primary agent answers failed this browser probe. These are agent-answer findings, not a release-package result.`)
  process.exitCode = 1
}
