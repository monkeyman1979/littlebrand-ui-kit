import { describe, expect, test } from 'vitest'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { componentInventory, files, missingRequiredTokens, records, source, tokenInventory, undefinedComponentTokens, usageIssues } from './helpers/contracts.js'

const sorted = (set) => [...set].sort()
const difference = (left, right) => sorted(new Set([...left].filter(value => !right.has(value))))
const knownMissing = ['LbBadge', 'LbBottomSheet', 'LbChip', 'LbNavigationBar', 'LbNavigationBarItem', 'LbSnackbar', 'LbSnackbarProvider'].sort()

describe('public component contract (legacy gaps pinned)', () => {
  test('root exports, plugin and Vue implementations agree; secondary barrel has only the known omission', () => {
    const { js, ts, plugin, vue } = componentInventory()
    expect(sorted(js)).toEqual(sorted(vue))
    expect(sorted(js)).toEqual(sorted(plugin))
    expect(difference(js, ts)).toEqual(['LbDropdown'])
    expect(difference(ts, js)).toEqual([])
  })

  test('declarations and MCP names have no new omissions or unexpected entries', () => {
    const { js, dts } = componentInventory()
    const mcp = new Set(records().map(record => record.name))
    expect(difference(js, dts)).toEqual(knownMissing)
    expect(difference(js, mcp)).toEqual(knownMissing)
    expect(difference(dts, js)).toEqual([])
    expect(difference(mcp, js)).toEqual([])
  })

  test('every component is an SFC with a script and a template', () => {
    for (const path of files('src/components/**/*.vue')) {
      const { descriptor, errors } = parseSfc(source(path), { filename: path })
      expect(errors, path).toEqual([])
      expect(descriptor.template, path).toBeTruthy()
      expect(descriptor.scriptSetup ?? descriptor.script, path).toBeTruthy()
    }
  })
})

describe('MCP usage examples', () => {
  test('known legacy mistakes are explicit, and new invalid variants/required props fail', () => {
    const verified = new Set(JSON.parse(source('reference/v1.json')).components.map(item => item.name))
    const legacy = records().filter(record => !verified.has(record.name))
    const issues = legacy.flatMap(record => usageIssues(record)).sort()
    expect(issues).toEqual([
      'LbCalendar:invalid-variant-filled',
      'LbCustomSelect:missing-options',
      'LbMenu:missing-options',
      'LbRadio:missing-value',
      'LbSelect:missing-options'
    ])
  })

  test('validator rejects an invented variant and a missing required prop', () => {
    expect(usageIssues({ name: 'LbButton', usage: '<lb-button variant="imaginary" />', props: [
      { name: 'variant', options: ['filled'] }, { name: 'value', required: true }
    ] })).toEqual(['LbButton:invalid-variant-imaginary', 'LbButton:missing-value'])
  })

  test('generated verified examples exactly match the authored SFCs, including Button content', () => {
    const generated = new Map(records().map(record => [record.name, record]))
    for (const item of JSON.parse(source('reference/v1.json')).components) {
      expect(generated.get(item.name)?.usage, item.name).toBe(item.usage)
      expect(parseSfc(item.usage, { filename: `${item.name}.vue` }).errors).toEqual([])
    }
    expect(generated.get('LbButton').usage).toContain('>Save changes</LbButton>')
    expect(source('examples/App.vue')).toMatch(/LbButton\(variant="filled" color="primary"\) Primary Button/)
  })
})

describe('semantic tokens', () => {
  test('MCP token names match the static definitions and key Step 02 roles exist', () => {
    const { semantic, documented } = tokenInventory()
    expect(sorted(documented)).toEqual(sorted(semantic))
    expect(missingRequiredTokens(semantic)).toEqual([])
    const withDeliberateOmission = new Set(semantic)
    withDeliberateOmission.delete('--lb-fill-primary-normal')
    expect(missingRequiredTokens(withDeliberateOmission)).toEqual(['--lb-fill-primary-normal'])
  })

  test('literal component CSS token references have only the recorded baseline gaps', () => {
    expect(undefinedComponentTokens(tokenInventory().defined)).toEqual([
      '--lb-focus-ring-offset', '--lb-focus-ring-width', '--lb-neutral-a4',
      '--lb-neutral-a6', '--lb-surface-neutral-disabled'
    ])
  })
})

describe('npm-facing source contract (not an installed-package test)', () => {
  test('the documented root names and CSS path exist in source/package exports', () => {
    const pkg = JSON.parse(source('package.json'))
    const fixture = source('tests/fixtures/ConsumerFixture.vue')
    expect(pkg.exports['.']?.import).toBe('./dist/littlebrand-ui.js')
    expect(pkg.exports['.']?.types).toBe('./types/index.d.ts')
    expect(pkg.exports['.']?.require).toBe('./dist/littlebrand-ui.umd.cjs')
    expect(pkg.exports['./style.css']?.default).toBe('./dist/littlebrand-ui.css')
    expect(pkg.exports['./style.css']?.types).toBe('./types/style.d.ts')
    expect(fixture).toContain("import 'littlebrand-ui-kit/style.css'")
    const named = fixture.match(/import \{([^}]+)\} from 'littlebrand-ui-kit'/)?.[1]
    expect(named).toBeTruthy()
    const rootExports = new Set([...source('src/index.js').matchAll(/export \{([^}]+)\}/g)]
      .flatMap(([, block]) => block.split(',').map(name => name.trim())))
    for (const name of named.split(',').map(item => item.trim())) {
      expect(rootExports.has(name), name).toBe(true)
    }
    expect(parseSfc(fixture, { filename: 'ConsumerFixture.vue' }).errors).toEqual([])
  })
})
