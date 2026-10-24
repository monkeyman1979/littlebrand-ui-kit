import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'

const json = path => JSON.parse(readFileSync(path, 'utf8'))
function atLeast(version, minimum) {
  const parts = version.split('.').map(Number)
  for (let i = 0; i < minimum.length; i++) {
    if (parts[i] !== minimum[i]) return parts[i] > minimum[i]
  }
  return true
}

test('root and bundled local MCP lockfiles retain patched SDK and Zod versions', () => {
  for (const dir of ['.', 'mcp-server']) {
    const manifest = json(`${dir}/package.json`)
    const lock = json(`${dir}/package-lock.json`)
    expect(manifest.dependencies['@modelcontextprotocol/sdk']).toBe('^1.32.2')
    expect(manifest.dependencies.zod).toBe('^4.6.7')
    expect(atLeast(lock.packages['node_modules/zod'].version, [4, 6, 7])).toBe(true)
    expect(atLeast(lock.packages['node_modules/@modelcontextprotocol/sdk'].version, [1, 32, 2])).toBe(true)
    expect(atLeast(lock.packages['node_modules/body-parser'].version, [2, 4, 0])).toBe(true)
    expect(atLeast(lock.packages['node_modules/fast-uri'].version, [3, 1, 9])).toBe(true)
    expect(lock.packages['node_modules/proxy-addr'].version).not.toBe('2.0.7')
  }
  const root = json('./package-lock.json')
  expect(atLeast(root.packages['node_modules/happy-dom'].version, [21, 0, 4])).toBe(true)
})
