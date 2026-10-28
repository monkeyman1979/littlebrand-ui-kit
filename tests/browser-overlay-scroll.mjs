// Source-only overlay probe; optional isolated Vue/compiler host via VUE_COMPAT_NODE_MODULES.
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

const modules = resolve(process.env.VUE_COMPAT_NODE_MODULES || 'node_modules')
const host = createRequire(resolve(modules, 'vue/package.json'))
const version = host('vue/package.json').version
assert.equal(host('@vue/compiler-sfc/package.json').version, version)
const fixture = mkdtempSync(resolve('tests/fixtures/.overlay-scroll-'))
let server
let browser
try {
  writeFileSync(
    resolve(fixture, 'index.html'),
    '<html><body style="overflow-y:scroll"><div id="app"></div><script type="module" src="./entry.ts"></script></body></html>'
  )
  writeFileSync(
    resolve(fixture, 'entry.ts'),
    `
import { createApp, h, ref, version } from 'vue'
import Dialog from '@/components/Dialog/LbDialog.vue'
import BottomSheet from '@/components/BottomSheet/LbBottomSheet.vue'
import '@/styles/index.sass'
const dialog = ref(true), sheet = ref(true), mounted = ref(true)
window.__overlay = { version, dialog, sheet, mounted }
createApp({ setup() { return () => h('main', { style: { height: '3000px' } }, [
  mounted.value ? h(Dialog, { modelValue: dialog.value, title: 'Scroll test', showClose: false }, () => 'Dialog') : null,
  mounted.value ? h(BottomSheet, { modelValue: sheet.value }, () => h('div', { style: { height: '1800px' } }, 'Scrollable sheet')) : null
]) } }).mount('#app')
`
  )
  server = await createServer({
    configFile: false,
    root: process.cwd(),
    logLevel: 'error',
    plugins: [
      vuePlugin({
        compiler: host('@vue/compiler-sfc'),
        template: { preprocessOptions: { pug: { doctype: 'html' } } }
      })
    ],
    resolve: {
      dedupe: ['vue'],
      alias: [
        { find: '@', replacement: resolve('src') },
        { find: /^vue$/, replacement: resolve(modules, 'vue/dist/vue.runtime.esm-bundler.js') }
      ]
    },
    server: { host: '127.0.0.1', port: 0 }
  })
  await server.listen()
  browser = await chromium.launch({ headless: true })
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      isMobile: mobile,
      hasTouch: mobile
    })
    try {
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      await page.goto(
        new URL(`/tests/fixtures/${basename(fixture)}/index.html`, server.resolvedUrls.local[0])
          .href
      )
      await page.waitForFunction(() => window.__overlay?.version)
      assert.equal(await page.evaluate(() => window.__overlay.version), version)
      assert.equal(
        await page.evaluate(() => document.body.style.overflow),
        'hidden',
        'initially open overlays lock body'
      )
      await page.evaluate(() => {
        window.__overlay.dialog.value = false
      })
      await page.locator('.lb-dialog-overlay').waitFor({ state: 'detached' })
      assert.equal(
        await page.evaluate(() => document.body.style.overflow),
        'hidden',
        'closing Dialog must not unlock BottomSheet'
      )
      const content = page.locator('.sheet-content')
      await content.evaluate((el) => {
        el.scrollTop = 100
      })
      assert.ok(
        await content.evaluate((el) => el.scrollTop > 0),
        'sheet content remains scrollable'
      )
      await page.mouse.move(2, 2)
      await page.mouse.wheel(0, 200)
      // Allow the compositor to deliver the wheel event before checking the document.
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      )
      assert.equal(await page.evaluate(() => window.scrollY), 0, 'background stays locked')
      await page.evaluate(() => {
        window.__overlay.sheet.value = false
      })
      await page.locator('.lb-bottom-sheet-overlay').waitFor({ state: 'detached' })
      assert.equal(
        await page.evaluate(() => document.body.style.overflowY),
        'scroll',
        'last close restores host overflow'
      )
      await page.evaluate(() => {
        window.__overlay.dialog.value = true
      })
      await page.waitForFunction(() => document.body.style.overflow === 'hidden')
      await page.evaluate(() => {
        window.__overlay.mounted.value = false
      })
      await page.waitForFunction(() => document.body.style.overflowY === 'scroll')
      assert.deepEqual(errors, [])
      console.log(
        `PASS overlay scroll: Vue ${version}, ${mobile ? 'mobile-emulated' : 'desktop'} Chromium, overlapping owners/close/unmount`
      )
    } finally {
      await context.close()
    }
  }
} finally {
  if (browser) await browser.close()
  if (server) await server.close()
  rmSync(fixture, { recursive: true, force: true })
}
