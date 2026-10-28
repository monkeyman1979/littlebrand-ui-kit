// @vitest-environment node
import { expect, test } from 'vite-plus/test'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { ESLint } from 'eslint'
import { resolve } from 'node:path'
import { glob } from 'glob'
import config, { frameworkLintConfig } from '../vite.config.js'

const json = (path) => JSON.parse(readFileSync(path, 'utf8'))

test('Vite migration preserves the library entry, Vue external and prior browser targets', () => {
  // Configuration inspection only: no production build or generated artifact.
  expect(config.build.lib.entry).toBe(resolve('src/index.js'))
  expect(config.build.target).toEqual(['chrome107', 'edge107', 'firefox104', 'safari16'])
  expect(config.build.rolldownOptions.external).toEqual(['vue'])
  expect(config.build.rolldownOptions.output).toEqual({ exports: 'named', globals: { vue: 'Vue' } })
})

test('Glob 13 still discovers the declaration inventory without running extraction', async () => {
  const expected = readdirSync('src/components', { recursive: true })
    .filter((path) => path.endsWith('.vue.d.ts'))
    .map((path) => `src/components/${path.replaceAll('\\', '/')}`)
    .sort()
  expect((await glob('src/components/**/*.vue.d.ts', { cwd: process.cwd() })).sort()).toEqual(
    expected
  )
  expect(expected).toContain('src/components/Dialog/LbDialog.vue.d.ts')
})

test('TypeScript 6 configs explicitly select globals and do not suppress deprecations', () => {
  const root = json('tsconfig.json').compilerOptions
  const mcp = json('mcp-server/tsconfig.json').compilerOptions
  const site = json('site/tsconfig.json').compilerOptions
  expect(root.baseUrl).toBeUndefined()
  expect(root.paths['@/*']).toEqual(['./src/*'])
  expect(mcp.types).toEqual(['node'])
  expect(site.types).toEqual(['vite/client'])
  for (const options of [root, mcp, site]) expect(options.ignoreDeprecations).toBeUndefined()
})

test('one Vite+ configuration owns the mandatory checks without running release tasks', () => {
  for (const file of ['eslint.config.js', 'vitest.config.js', 'site/vite.config.js']) {
    expect(existsSync(file), file).toBe(false)
  }
  expect(config.test).toMatchObject({
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
    clearMocks: true
  })
  expect(json('package.json').scripts.check).toBe('vp run verify')
  expect(config.run.cache).toBe(false)
  expect(config.run.tasks.verify.command).toEqual([
    'vp check',
    'node scripts/lint-framework.mjs',
    'vp run check-types',
    'vp run check-types-site',
    'vp run check-types-mcp',
    'vp test run',
    'node tests/mcp-stdio.mjs',
    'node scripts/generate-reference.js --check'
  ])
  expect(config.run.tasks['check-types'].command).toEqual([
    'vue-tsc --noEmit --project tsconfig.json',
    'tsc --noEmit --project tests/fixtures/tsconfig.consumer.json',
    'tsc --noEmit --project tests/fixtures/tsconfig.node-consumer.json'
  ])
})

test('Vite+ uses one forked Vite and its matching Vitest rather than mixed runtime copies', () => {
  const manifest = json('package.json')
  const packages = json('package-lock.json').packages
  const vitePlusVersion = manifest.devDependencies['vite-plus']
  expect(manifest.devDependencies.vite).toBe(`npm:@voidzero-dev/vite-plus-core@${vitePlusVersion}`)
  expect(manifest.overrides.vite).toBe(manifest.devDependencies.vite)
  expect(manifest.devDependencies.vitest).toBeUndefined()
  expect(json('node_modules/vite/package.json').name).toBe('@voidzero-dev/vite-plus-core')
  expect(packages['node_modules/vitest'].version).toBe(manifest.overrides.vitest)
  for (const name of ['vite', 'vitest']) {
    expect(
      Object.keys(packages).filter((path) => path.endsWith(`node_modules/${name}`))
    ).toHaveLength(1)
  }
})

test('central framework lint still rejects Vue template defects and undefined script globals', async () => {
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: frameworkLintConfig })
  const [template] = await eslint.lintText(
    '<template><button type="button" type="submit">Probe</button></template>',
    { filePath: resolve('site/lint-probe.vue') }
  )
  expect(template.messages.map((message) => message.ruleId)).toContain(
    'vue/no-duplicate-attributes'
  )
  const [script] = await eslint.lintText('notALittleBrandGlobal()\n', {
    filePath: resolve('scripts/lint-probe.mjs')
  })
  expect(script.messages.map((message) => message.ruleId)).toContain('no-undef')
})
