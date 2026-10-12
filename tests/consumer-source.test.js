import { describe, expect, test } from 'vitest'
import { compile } from 'sass'
import { resolve } from 'node:path'
import * as kit from '../src/index.js'

const root = process.cwd() // tests run from the package root

describe('source-entry consumer smoke (not an installed npm tarball)', () => {
  test('README root-named imports are available through the real source entry', () => {
    for (const name of ['LittleBrandUI', 'LbButton', 'LbInput', 'LbDialog', 'applyTheme']) {
      expect(kit[name], name).toBeDefined()
    }
    expect(typeof kit.LittleBrandUI.install).toBe('function')
    expect(typeof kit.applyTheme).toBe('function')
  })

  test('the documented styles have in-memory CSS definitions and both dark selectors', () => {
    // Sass compile returns a string; no dist, metadata, or package file is written.
    const css = compile(resolve(root, 'src/styles/index.sass'), {
      loadPaths: [resolve(root, 'src/styles')],
      logger: { warn() {}, debug() {} }
    }).css
    expect(css).toContain('--lb-fill-primary-normal:')
    expect(css).toContain('--lb-surface-base:')
    expect(css).toMatch(/\[data-theme=dark\]|\[data-theme="dark"\]/)
    expect(css).toContain('.dark')
  })
})
