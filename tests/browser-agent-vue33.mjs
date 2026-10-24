// Optional source-only Vue 3.3.13 probe for the exact two agent wrappers.
// Supply VUE33_NODE_MODULES from a disposable temp install; never uses dist/npm kit.
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

const modules = process.env.VUE33_NODE_MODULES
assert.ok(modules, 'Set VUE33_NODE_MODULES to a temp node_modules with Vue/compiler-sfc 3.3.13, pug and sass')
const requireFromFixture = createRequire(resolve(modules, 'vue/package.json'))
const compiler = requireFromFixture('@vue/compiler-sfc')
assert.equal(requireFromFixture('vue/package.json').version, '3.3.13')
assert.equal(requireFromFixture('@vue/compiler-sfc/package.json').version, '3.3.13')
const evidence = readFileSync(resolve('docs/VUE33_AGENT_COMPAT_RETRIAL.md'), 'utf8')
const fixture = mkdtempSync(resolve('tests/fixtures/.agent-vue33-consumer-'))
let server
let browser

function primary(name) {
  const heading = `## ${name[0].toUpperCase()}${name.slice(1)}\n\n**User request (exact):**`
  const start = evidence.indexOf(heading)
  assert.ok(start >= 0, `missing ${name} trial`)
  const answer = evidence.slice(start).match(/\*\*Exact final agent answer \(unaltered\):\*\*\n\n~~~~text\n([\s\S]*?)\n~~~~\n/)?.[1]
  const code = answer?.match(/```vue\n([\s\S]*?)\n```/)?.[1]
  assert.ok(code && !code.includes('defineModel'), `${name}: first code block missing or uses defineModel`)
  const parsed = compiler.parse(code, { filename: `${name}.vue` })
  assert.deepEqual(parsed.errors, [])
  assert.ok(compiler.compileScript(parsed.descriptor, { id: `trial-${name}` }).content.includes('update:modelValue'))
  return `${code}\n`
}

const entry = `import { createApp, defineComponent, h, ref, version } from 'vue'
const name = new URLSearchParams(location.search).get('case')
const files = import.meta.glob('./*.vue')
const Component = (await files['./' + name + '.vue']()).default
const value = ref(name === 'confirmation' ? false : 'daily')
window.__vueVersion = version
const events = window.__events = []
createApp(defineComponent({ setup() { return () => h('main', [
  name === 'confirmation' ? h('button', { id: 'open', onClick: () => { value.value = true } }, 'Ask to delete') : null,
  h(Component, {
    ...(name === 'confirmation' ? { itemName: 'Report' } : {}),
    modelValue: value.value,
    'onUpdate:modelValue': v => { value.value = v; events.push(['update', v]) },
    onConfirm: () => events.push(['confirm'])
  })
]) } })).mount('#app')
window.__ready = true
`

try {
  for (const name of ['confirmation', 'frequency']) writeFileSync(resolve(fixture, `${name}.vue`), primary(name))
  writeFileSync(resolve(fixture, 'index.html'), '<html><div id="app"></div><script type="module" src="./entry.ts"></script></html>')
  writeFileSync(resolve(fixture, 'entry.ts'), entry)
  server = await createServer({
    configFile: false, root: process.cwd(), logLevel: 'error',
    plugins: [vuePlugin({ compiler, template: { preprocessOptions: { pug: { doctype: 'html' } } } })],
    resolve: { dedupe: ['vue'], alias: [
      { find: 'littlebrand-ui-kit/style.css', replacement: resolve('src/styles/index.sass') },
      { find: 'littlebrand-ui-kit', replacement: resolve('src/components/index.ts') },
      { find: '@', replacement: resolve('src') },
      { find: /^vue$/, replacement: resolve(modules, 'vue/dist/vue.runtime.esm-bundler.js') }
    ] },
    server: { host: '127.0.0.1', port: 0 }
  })
  await server.listen()
  browser = await chromium.launch({ headless: true })
  for (const name of ['confirmation', 'frequency']) {
    const page = await browser.newPage()
    try {
      const errors = []
      page.on('pageerror', e => errors.push(e.message))
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
      const url = new URL(`/tests/fixtures/${basename(fixture)}/index.html`, server.resolvedUrls.local[0])
      url.searchParams.set('case', name)
      await page.goto(url.href)
      await page.waitForFunction(() => window.__ready === true, null, { timeout: 10000 })
      assert.equal(await page.evaluate(() => window.__vueVersion), '3.3.13', 'host runtime version')
      if (name === 'confirmation') {
        await page.locator('#open').click()
        const dialog = page.getByRole('dialog')
        await dialog.waitFor()
        assert.equal(await dialog.getAttribute('aria-label'), 'Delete Report?')
        await dialog.getByRole('button', { name: 'Delete' }).click()
        assert.deepEqual(await page.evaluate(() => window.__events), [['confirm']])
        await dialog.getByRole('button', { name: 'Cancel' }).click()
        await dialog.waitFor({ state: 'detached' })
        assert.deepEqual(await page.evaluate(() => window.__events), [['confirm'], ['update', false]])
      } else {
        const group = page.getByRole('radiogroup', { name: 'Update frequency' })
        await group.waitFor()
        const daily = group.getByRole('radio', { name: 'Daily' })
        const weekly = group.getByRole('radio', { name: 'Weekly' })
        assert.equal(await daily.getAttribute('aria-checked'), 'true')
        await daily.focus()
        await page.keyboard.press('ArrowRight')
        assert.equal(await weekly.getAttribute('aria-checked'), 'true')
        assert.deepEqual(await page.evaluate(() => window.__events), [['update', 'weekly']])
      }
      assert.deepEqual(errors, [], `${name}: browser errors`)
      console.log(`PASS ${name}: exact source SFC, compiler/runtime Vue 3.3.13, Chromium core interaction`)
    } finally { await page.close() }
  }
} finally {
  if (browser) await browser.close()
  if (server) await server.close()
  rmSync(fixture, { recursive: true, force: true })
}
