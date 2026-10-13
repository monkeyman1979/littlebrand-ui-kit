import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'

const json = path => JSON.parse(readFileSync(path, 'utf8'))
const minimum = [1, 32, 1]
function atLeast(version) {
  const parts = version.split('.').map(Number)
  for (let i = 0; i < minimum.length; i++) {
    if (parts[i] !== minimum[i]) return parts[i] > minimum[i]
  }
  return true
}

test('root and bundled local MCP lockfiles do not revert to the vulnerable SDK range', () => {
  for (const dir of ['.', 'mcp-server']) {
    const manifest = json(`${dir}/package.json`)
    const lock = json(`${dir}/package-lock.json`)
    expect(manifest.dependencies['@modelcontextprotocol/sdk']).toBe('^1.32.1')
    expect(manifest.dependencies.zod).toBe('^3.25.1')
    expect(atLeast(lock.packages['node_modules/@modelcontextprotocol/sdk'].version)).toBe(true)
    expect(lock.packages['node_modules/proxy-addr'].version).not.toBe('2.0.7')
  }
})
