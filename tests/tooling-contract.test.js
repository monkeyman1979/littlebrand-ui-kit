// @vitest-environment node
import { expect, test } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { glob } from 'glob'
import config from '../vite.config.js'

const json = path => JSON.parse(readFileSync(path, 'utf8'))

test('Vite migration preserves the library entry, Vue external and prior browser targets', () => {
  // Configuration inspection only: no production build or generated artifact.
  expect(config.build.lib.entry).toBe(resolve('src/index.js'))
  expect(config.build.target).toEqual(['chrome107', 'edge107', 'firefox104', 'safari16'])
  expect(config.build.rolldownOptions.external).toEqual(['vue'])
  expect(config.build.rolldownOptions.output).toEqual({ exports: 'named', globals: { vue: 'Vue' } })
})

test('Glob 13 still discovers the declaration inventory without running extraction', async () => {
  const expected = readdirSync('src/components', { recursive: true })
    .filter(path => path.endsWith('.vue.d.ts'))
    .map(path => `src/components/${path.replaceAll('\\', '/')}`).sort()
  expect((await glob('src/components/**/*.vue.d.ts', { cwd: process.cwd() })).sort()).toEqual(expected)
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
