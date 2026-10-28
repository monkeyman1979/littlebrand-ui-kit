// Explicitly invoked installed-tarball check. Does not build/extract the kit or publish.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { chromium } from 'playwright'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')
assert.ok(
  process.env.LB_TARBALL,
  'Set LB_TARBALL to an already built local npm tarball; this check never builds the kit'
)
const tarball = realpathSync(resolve(process.env.LB_TARBALL))
const engineRange = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8')).engines.node
const root = mkdtempSync(join(tmpdir(), 'lb-installed-consumer-'))
const report = {
  tarball,
  sha256: createHash('sha256').update(readFileSync(tarball)).digest('hex'),
  node: process.version,
  consumers: []
}
const names = ['LbButton', 'LbInput', 'LbTextarea', 'LbFormField', 'LbDialog', 'LbSegmentButton']
const intents = [
  'save changes',
  'email address',
  'multiline notes',
  'validation field',
  'confirmation modal',
  'choose frequency'
]
let browser

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: 120000,
    env: { ...process.env, NODE_PATH: '' }
  })
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(' ')}:\n${result.stdout}\n${result.stderr}`
  )
  return result.stdout
}

async function mcp(consumer, reference, catalog, runtime) {
  const command = join(consumer, 'node_modules/.bin/littlebrand-mcp')
  assert.ok(existsSync(command), 'npm must install the executable bin link')
  const client = new Client({ name: 'installed-tarball-probe', version: '1.0.0' })
  try {
    // Execute the npm-installed bin link with the selected real Node binary, not tsx/source.
    await client.connect(
      new StdioClientTransport({ command: runtime, args: [command], cwd: consumer, stderr: 'pipe' })
    )
    assert.deepEqual(
      (await client.listTools()).tools.map((t) => t.name),
      ['lb_search', 'lb_get', 'lb_setup']
    )
    const setup = await client.callTool({ name: 'lb_setup', arguments: {} })
    const setupBody = JSON.parse(setup.content[0].text)
    assert.equal(setupBody.packageVersion, reference.packageVersion)
    assert.ok(setupBody.supported.includes(engineRange))
    assert.match(setupBody.supported, /Vue peer \^3\.3\.0/)
    for (const [index, name] of names.entries()) {
      const search = await client.callTool({
        name: 'lb_search',
        arguments: { query: intents[index] }
      })
      assert.equal(JSON.parse(search.content[0].text).results[0]?.id, `component:${name}`)
      const result = await client.callTool({
        name: 'lb_get',
        arguments: { id: `component:${name}`, detail: 'full' }
      })
      assert.equal(
        JSON.parse(result.content[0].text).testedVueExample,
        reference.components.find((c) => c.name === name).usage
      )
    }
    for (const item of catalog.components) {
      const search = await client.callTool({
        name: 'lb_search',
        arguments: { query: item.name }
      })
      assert.equal(JSON.parse(search.content[0].text).results[0]?.id, `component:${item.name}`)
      const result = await client.callTool({
        name: 'lb_get',
        arguments: { id: `component:${item.name}`, detail: 'full' }
      })
      const body = JSON.parse(result.content[0].text)
      assert.equal(body.verification, 'catalog-only')
      assert.equal(body.sourcePath, item.source)
      assert.equal(body.testedVueExample, undefined)
      assert.equal(body.props, undefined)
    }
    const child = await client.callTool({
      name: 'lb_search',
      arguments: { query: 'segment item' }
    })
    assert.equal(JSON.parse(child.content[0].text).results[0]?.parent, 'LbSegmentButton')
    const invalid = await client.callTool({ name: 'lb_search', arguments: { query: 'x' } })
    assert.equal(invalid.isError, true)
  } finally {
    await client.close()
  }
}

async function interactions(page, version, scheme) {
  await page.waitForFunction(() => window.__consumerVueVersion)
  assert.equal(await page.evaluate(() => window.__consumerVueVersion), version)
  await page.locator('#save').getByRole('button', { name: 'Save changes' }).click()
  await page.locator('#save').getByRole('status').filter({ hasText: 'Saved' }).waitFor()
  const email = page.locator('#email').getByRole('textbox', { name: 'Email' })
  await email.fill('reader@example.com')
  assert.equal(await email.getAttribute('type'), 'email')
  assert.equal(await email.inputValue(), 'reader@example.com')
  await page
    .locator('#notes-example')
    .getByRole('textbox', { name: 'Notes' })
    .fill('Installed package notes')
  const form = page.locator('#form')
  const save = form.getByRole('button', { name: 'Save biography' })
  await save.click()
  await form.getByText('Biography is required').waitFor()
  assert.equal(await form.locator('output').textContent(), '0')
  await form.locator('textarea').fill('A short biography')
  await save.click()
  assert.equal(await form.locator('output').textContent(), '1')
  await save.focus()
  await page.keyboard.press('Enter')
  assert.equal(await form.locator('output').textContent(), '2', 'keyboard submit emits once')
  const daily = page.getByRole('radio', { name: 'Daily' })
  await daily.focus()
  await page.keyboard.press('ArrowRight')
  assert.equal(
    await page.getByRole('radio', { name: 'Weekly' }).getAttribute('aria-checked'),
    'true'
  )
  const before = await page
    .getByRole('radio', { name: 'Weekly' })
    .evaluate((el) => getComputedStyle(el).backgroundColor)
  const button = page.locator('#save button')
  assert.notEqual(
    await button.evaluate((el) => getComputedStyle(el).backgroundColor),
    'rgba(0, 0, 0, 0)',
    'compiled CSS is applied'
  )
  await page.locator('#theme-toggle').click()
  const after = await page
    .getByRole('radio', { name: 'Weekly' })
    .evaluate((el) => getComputedStyle(el).backgroundColor)
  if (scheme === 'light') assert.notEqual(before, after, 'explicit theme changes computed styles')
  const brandBefore = await button.evaluate((el) => getComputedStyle(el).backgroundColor)
  await page.locator('#brand-change').click()
  assert.notEqual(
    await button.evaluate((el) => getComputedStyle(el).backgroundColor),
    brandBefore,
    'runtime brand changes compiled component styles'
  )
  const trigger = page.getByRole('button', { name: 'Open preferences' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Preferences' })
  await dialog.waitFor()
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden')
  await page.keyboard.press('Tab')
  assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true)
  await dialog.getByRole('button', { name: 'Done' }).click()
  await dialog.waitFor({ state: 'detached' })
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
  assert.equal(
    await trigger.evaluate((el) => el === document.activeElement),
    true,
    'Dialog restores trigger focus'
  )
  await trigger.click()
  await dialog.waitFor()
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'detached' })
}

try {
  const runtimes = JSON.parse(
    process.env.LB_MCP_NODE_BINARIES || JSON.stringify([process.execPath])
  )
  assert.ok(
    Array.isArray(runtimes) && runtimes.length > 0,
    'LB_MCP_NODE_BINARIES must be a nonempty JSON array of executable paths'
  )
  const nodes = runtimes.map((path) => realpathSync(resolve(path)))
  report.mcpNodes = nodes.map((node) => {
    const version = run(node, ['--version'], root).trim()
    assert.match(version, /^v\d+\.\d+\.\d+$/, 'expected a released Node executable')
    return version
  })
  browser = await chromium.launch({ headless: true })
  for (const version of ['3.3.0', '3.5.44']) {
    const consumer = join(root, version)
    mkdirSync(consumer)
    writeFileSync(
      join(consumer, 'package.json'),
      JSON.stringify({
        name: 'littlebrand-installed-consumer',
        private: true,
        type: 'module',
        dependencies: { 'littlebrand-ui-kit': `file:${tarball}`, vue: version },
        devDependencies: {
          '@vue/compiler-sfc': version,
          '@vitejs/plugin-vue': '6.0.10',
          vite: '8.3.5',
          typescript: '6.0.3',
          'vue-tsc': '3.3.13'
        }
      })
    )
    // Vite preview sets NODE_ENV=production in this process; still install test tools for each host.
    run(
      'npm',
      [
        'install',
        '--engine-strict',
        '--include=dev',
        '--ignore-scripts',
        '--no-fund',
        '--no-audit'
      ],
      consumer
    )
    const host = createRequire(join(consumer, 'package.json'))
    assert.equal(host('vue/package.json').version, version)
    const installed = join(consumer, 'node_modules/littlebrand-ui-kit')
    assert.ok(
      !realpathSync(installed).startsWith(realpathSync(repo)),
      'must not link to repo source'
    )
    const manifest = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'))
    const reference = JSON.parse(readFileSync(join(installed, 'reference/v1.json'), 'utf8'))
    const catalog = JSON.parse(readFileSync(join(installed, 'reference/catalog.json'), 'utf8'))
    assert.equal(catalog.packageVersion, manifest.version)
    assert.equal(manifest.engines.node, engineRange)
    assert.equal(
      JSON.parse(readFileSync(join(installed, 'mcp-server/package.json'), 'utf8')).engines.node,
      engineRange
    )
    assert.equal(manifest.peerDependencies.vue, '^3.3.0')
    for (const file of [
      manifest.main,
      manifest.module,
      manifest.types,
      'types/style.d.ts',
      'dist/littlebrand-ui.css',
      'mcp-server/dist/index.js',
      'mcp-server/dist/node-runtime.js',
      'docs/reference/v1/ai-index.md'
    ]) {
      assert.ok(existsSync(join(installed, file)), `tarball missing ${file}`)
    }
    // Exercise the compiled startup guard without running an actually vulnerable binary.
    const refused = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
      import { pathToFileURL } from 'node:url'
      Object.defineProperty(process.versions, 'node', { value: '26.9.0' })
      await import(pathToFileURL(process.argv[1]).href)
    `,
        join(installed, 'mcp-server/dist/index.js')
      ],
      { cwd: consumer, encoding: 'utf8', timeout: 10000 }
    )
    assert.equal(refused.status, 1, 'compiled CLI must reject a simulated vulnerable Node version')
    assert.match(refused.stderr, /security-patched Node/)
    assert.equal(refused.stdout, '', 'refused CLI must not start the protocol')
    run(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
      import assert from 'node:assert/strict'
      import * as kit from 'littlebrand-ui-kit'
      import {createRequire} from 'node:module'
      const cjs=createRequire(import.meta.url)('littlebrand-ui-kit')
      assert.deepEqual(Object.keys(kit).sort(),Object.keys(cjs).sort())
      for(const name of ['LbButton','LbInput','LbDialog','LbSegmentButton','LittleBrandUI','applyTheme']) assert.ok(kit[name],name)
      assert.match(import.meta.resolve('littlebrand-ui-kit/style.css'),/littlebrand-ui\\.css$/)
    `
      ],
      consumer
    )
    for (const file of [
      'consumer-package.ts',
      'tsconfig.consumer.json',
      'tsconfig.node-consumer.json'
    ])
      copyFileSync(join(repo, 'tests/fixtures', file), join(consumer, file))
    for (const config of ['tsconfig.consumer.json', 'tsconfig.node-consumer.json'])
      run(
        process.execPath,
        [join(consumer, 'node_modules/typescript/bin/tsc'), '--noEmit', '-p', config],
        consumer
      )
    mkdirSync(join(consumer, 'examples'))
    for (const name of names)
      writeFileSync(
        join(consumer, 'examples', `${name}.vue`),
        reference.components.find((c) => c.name === name).usage
      )
    copyFileSync(join(repo, 'tests/fixtures/ArtifactConsumer.vue'), join(consumer, 'App.vue'))
    writeFileSync(
      join(consumer, 'tsconfig.app.json'),
      JSON.stringify({
        extends: './tsconfig.consumer.json',
        compilerOptions: { types: ['vite/client'] },
        files: ['App.vue'],
        include: ['examples/*.vue']
      })
    )
    run(
      process.execPath,
      [
        join(consumer, 'node_modules/vue-tsc/bin/vue-tsc.js'),
        '--noEmit',
        '-p',
        'tsconfig.app.json'
      ],
      consumer
    )
    writeFileSync(
      join(consumer, 'index.html'),
      '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="app"></div><script type="module" src="/entry.ts"></script></body></html>'
    )
    writeFileSync(
      join(consumer, 'entry.ts'),
      "import {createApp} from 'vue'; import App from './App.vue'; createApp(App).mount('#app')"
    )
    writeFileSync(
      join(consumer, 'vite.config.js'),
      "import {defineConfig} from 'vite'; import vue from '@vitejs/plugin-vue'; export default defineConfig({plugins:[vue()]})"
    )
    run(process.execPath, [join(consumer, 'node_modules/vite/bin/vite.js'), 'build'], consumer)
    for (const node of nodes) await mcp(consumer, reference, catalog, node)
    const { preview } = await import(
      pathToFileURL(join(consumer, 'node_modules/vite/dist/node/index.js')).href
    )
    const server = await preview({
      root: consumer,
      configFile: false,
      preview: { host: '127.0.0.1', port: 0 }
    })
    try {
      for (const scheme of ['light', 'dark']) {
        const context = await browser.newContext({ colorScheme: scheme, reducedMotion: 'reduce' })
        try {
          const page = await context.newPage()
          const errors = []
          page.on('pageerror', (error) => errors.push(error.message))
          page.on('console', (message) => {
            if (message.type() === 'error') errors.push(message.text())
          })
          await page.goto(server.resolvedUrls.local[0])
          await interactions(page, version, scheme)
          assert.deepEqual(errors, [], `Vue ${version}/${scheme}: browser errors`)
        } finally {
          await context.close()
        }
      }
    } finally {
      await new Promise((resolve, reject) =>
        server.httpServer.close((error) => (error ? reject(error) : resolve()))
      )
    }
    report.consumers.push({
      vue: version,
      typescript: host('typescript/package.json').version,
      packageVersion: manifest.version,
      imports: 'ESM+CJS',
      declarations: 'Bundler+NodeNext+Vue SFC (skipLibCheck=false)',
      browser: 'production Chromium light+dark, six examples',
      mcp: 'installed bin, 3 tools, six checked lookups, catalog-only names and compound parent, invalid input; compiled startup rejects simulated stale runtime'
    })
    console.log(
      `PASS installed tarball: Vue ${version}, strict types, production consumer, six examples, MCP bin on ${report.mcpNodes.join(', ')}`
    )
  }
  if (process.env.LB_REPORT)
    writeFileSync(resolve(process.env.LB_REPORT), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally {
  if (browser) await browser.close()
  if (process.env.LB_KEEP_CONSUMERS === '1') console.log(`Consumer work directory: ${root}`)
  else rmSync(root, { recursive: true, force: true })
}
