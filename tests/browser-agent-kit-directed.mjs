// Replays the six FIRST (unaltered) Vue SFCs from the kit-directed agent trial.
// Source-only diagnostic: no npm package, dist, build, extraction or release artifact.
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const names = ['save', 'email', 'notes', 'validation', 'confirmation', 'frequency']
const evidence = readFileSync(resolve('docs/MCP_AGENT_KIT_DIRECTED_TRIAL.md'), 'utf8')
const fixture = mkdtempSync(resolve('tests/fixtures/.agent-kit-directed-'))
const results = []
let server
let browser

function primary(name) {
  const header = `## ${name[0].toUpperCase()}${name.slice(1)}\n\n**User request (exact):**`
  const start = evidence.indexOf(header)
  assert.ok(start >= 0, `missing ${name} evidence`)
  const answer = evidence.slice(start).match(/\*\*Exact final agent answer:\*\*\n\n~~~~text\n([\s\S]*?)\n~~~~\n/)
  assert.ok(answer, `missing ${name} final answer`)
  const block = answer[1].match(/```vue\n([\s\S]*?)\n```/)
  assert.ok(block, `missing ${name} first SFC`)
  return `${block[1]}\n`
}

const entry = `import { createApp, defineComponent, h, ref } from 'vue'
const name = new URLSearchParams(location.search).get('case')
const modules = import.meta.glob('./*.vue')
const Component = (await modules['./' + name + '.vue']()).default
const events = window.__trialEvents = []
const value = ref(name === 'frequency' ? 'weekly' : '')
const error = ref('Email is required')
const opened = ref(false)
const App = defineComponent({
  setup() {
    return () => h('main', [
      name === 'confirmation' ? h('button', { id: 'open-confirmation', onClick: () => { opened.value = true } }, 'Ask to delete') : null,
      h(Component, {
        ...(name === 'save' ? { initialName: '', onSave: async v => { events.push(['save', v]) } } : {}),
        ...(name === 'notes' ? { onSave: v => events.push(['save', v]) } : {}),
        ...(name === 'email' ? { onSubmit: v => events.push(['submit', v]) } : {}),
        ...(name === 'validation' ? { modelValue: value.value, label: 'Email address', name: 'email', type: 'email', hint: 'We will contact you.', error: error.value, required: true, 'onUpdate:modelValue': v => { value.value = v; error.value = ''; events.push(['update', v]) } } : {}),
        ...(name === 'confirmation' ? { itemName: 'Report', modelValue: opened.value, 'onUpdate:modelValue': v => { opened.value = v; events.push(['open', v]) }, onConfirm: () => events.push(['confirm']) } : {}),
        ...(name === 'frequency' ? { modelValue: value.value, 'onUpdate:modelValue': v => { value.value = v; events.push(['update', v]) } } : {})
      })
    ])
  }
})
createApp(App).mount('#app')
window.__trialReady = true
`

try {
  for (const name of names) writeFileSync(resolve(fixture, `${name}.vue`), primary(name))
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
  for (const name of names) {
    const context = await browser.newContext({ colorScheme: 'light' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    try {
      const url = new URL(`/tests/fixtures/${basename(fixture)}/index.html`, server.resolvedUrls.local[0])
      url.searchParams.set('case', name)
      await page.goto(url.href)
      await page.waitForFunction(() => window.__trialReady === true, null, { timeout: 8000 })
      assert.deepEqual(errors, [], `${name}: browser errors`)
      switch (name) {
        case 'save': {
          const button = page.getByRole('button', { name: 'Save changes' })
          await button.click()
          await page.getByText('Name is required').waitFor()
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [])
          await page.locator('input[name="name"]').fill('  Alex  ')
          await button.click()
          await page.getByText('Changes saved.').waitFor()
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [['save', { name: 'Alex' }]])
          break
        }
        case 'email': {
          const button = page.getByRole('button', { name: 'Subscribe' })
          await button.click()
          await page.getByText('Enter your email address.').waitFor()
          await page.locator('input[type="email"]').fill('person@example.com')
          await button.click()
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [['submit', 'person@example.com']])
          break
        }
        case 'notes': {
          const button = page.getByRole('button', { name: 'Save note' })
          await button.click()
          await page.getByText('Note is required').waitFor()
          await page.locator('textarea[name="note"]').fill('My notes')
          await button.click()
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [['save', 'My notes']])
          break
        }
        case 'validation': {
          const field = page.locator('.lb-form-field')
          const control = field.locator('input[name="email"]')
          await field.getByText('Email is required').waitFor()
          assert.equal(await field.locator('label').getAttribute('for'), await control.getAttribute('id'))
          assert.equal(await control.getAttribute('aria-invalid'), 'true')
          assert.equal(await control.getAttribute('aria-describedby'), await field.locator('.lb-hint-text').getAttribute('id'))
          await control.fill('person@example.com')
          await field.getByText('We will contact you.').waitFor()
          assert.equal(await control.getAttribute('aria-invalid'), null)
          assert.deepEqual(await page.evaluate(() => window.__trialEvents.at(-1)), ['update', 'person@example.com'])
          break
        }
        case 'confirmation': {
          await page.locator('#open-confirmation').click()
          const dialog = page.getByRole('dialog')
          await dialog.waitFor()
          assert.equal(await dialog.getAttribute('aria-label'), 'Delete “Report”?')
          await dialog.getByRole('button', { name: 'Delete' }).click()
          assert.deepEqual(await page.evaluate(() => window.__trialEvents.filter(([type]) => type === 'confirm')), [['confirm']])
          await dialog.getByRole('button', { name: 'Cancel' }).click()
          await dialog.waitFor({ state: 'detached' })
          assert.ok((await page.evaluate(() => window.__trialEvents)).some(([type, v]) => type === 'open' && v === false))
          break
        }
        case 'frequency': {
          const group = page.getByRole('radiogroup', { name: 'Update frequency' })
          await group.waitFor()
          const weekly = group.getByRole('radio', { name: 'Weekly' })
          const daily = group.getByRole('radio', { name: 'Daily' })
          assert.equal(await weekly.getAttribute('aria-checked'), 'true')
          await weekly.focus()
          await page.keyboard.press('ArrowLeft')
          assert.equal(await daily.getAttribute('aria-checked'), 'true')
          assert.deepEqual(await page.evaluate(() => window.__trialEvents), [['update', 'daily']])
          break
        }
      }
      assert.deepEqual(errors, [], `${name}: browser errors`)
      results.push({ name, passed: true })
      console.log(`PASS ${name}: source SFC rendered and core interaction checked`)
    } catch (error) {
      results.push({ name, passed: false, reason: error.message })
      console.error(`FAIL ${name}: ${error.message.split('\n')[0]}`)
      if ('actual' in error) console.error('  observed:', JSON.stringify(error.actual))
      if (errors.length) console.error('  browser errors:', errors)
    } finally {
      await context.close()
    }
  }
} finally {
  if (browser) await browser.close()
  if (server) await server.close()
  rmSync(fixture, { recursive: true, force: true })
}
const failed = results.filter(result => !result.passed)
console.log(`${results.length - failed.length}/${names.length} kit-directed primary SFCs passed this source Chromium probe`)
if (failed.length) process.exitCode = 1
