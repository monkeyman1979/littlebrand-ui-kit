import { expect, test } from 'vite-plus/test'
import { readFileSync } from 'node:fs'
import {
  assertSupportedNodeVersion,
  isSupportedNodeVersion,
  NODE_ENGINE_RANGE
} from '../mcp-server/src/node-runtime.ts'

const json = (path) => JSON.parse(readFileSync(path, 'utf8'))
function atLeast(version, minimum) {
  const parts = version.split('.').map(Number)
  for (let i = 0; i < minimum.length; i++) {
    if (parts[i] !== minimum[i]) return parts[i] > minimum[i]
  }
  return true
}

test('both manifests and lockfiles require the security-patched supported Node lines', () => {
  expect(NODE_ENGINE_RANGE).toBe('^22.23.4 || ^24.22.1 || ^26.12.1')
  for (const dir of ['.', 'mcp-server']) {
    expect(json(`${dir}/package.json`).engines.node).toBe(NODE_ENGINE_RANGE)
    expect(json(`${dir}/package-lock.json`).packages[''].engines.node).toBe(NODE_ENGINE_RANGE)
  }
})

test('Node security boundaries reject vulnerable patches, EOL majors and unreviewed releases', () => {
  for (const version of [
    '22.23.4',
    'v22.23.5',
    '22.24.0',
    '24.22.1',
    '24.23.0',
    '26.12.1',
    '26.13.0'
  ]) {
    expect(isSupportedNodeVersion(version), version).toBe(true)
  }
  for (const version of [
    '18.20.8',
    '20.20.2',
    '22.0.0',
    '22.23.3',
    '23.11.1',
    '24.22.0',
    '25.9.0',
    '26.9.0',
    '26.12.0',
    '28.0.0',
    '22.23.4-rc.1',
    'invalid'
  ]) {
    expect(isSupportedNodeVersion(version), version).toBe(false)
    expect(() => assertSupportedNodeVersion(version)).toThrow('security-patched Node')
  }
})

test('source checks run on a patched runtime and the repo pin stays patched', () => {
  expect(isSupportedNodeVersion(process.versions.node), process.version).toBe(true)
  const pin = readFileSync('.node-version', 'utf8').trim()
  expect(pin).toBe('22.23.4')
  expect(isSupportedNodeVersion(pin)).toBe(true)
})

test('the runtime guard gives an actionable upgrade error on an unsupported version', () => {
  expect(() => assertSupportedNodeVersion('26.9.0')).toThrow('Upgrade Node and restart')
  expect(() => assertSupportedNodeVersion()).not.toThrow()
})

test('root and bundled local MCP lockfiles retain patched SDK and Zod versions', () => {
  for (const dir of ['.', 'mcp-server']) {
    const manifest = json(`${dir}/package.json`)
    const lock = json(`${dir}/package-lock.json`)
    expect(manifest.dependencies['@modelcontextprotocol/sdk']).toBe('^1.32.2')
    expect(manifest.dependencies.zod).toBe('^4.6.7')
    expect(atLeast(lock.packages['node_modules/zod'].version, [4, 6, 7])).toBe(true)
    expect(
      atLeast(lock.packages['node_modules/@modelcontextprotocol/sdk'].version, [1, 32, 2])
    ).toBe(true)
    expect(atLeast(lock.packages['node_modules/body-parser'].version, [2, 4, 0])).toBe(true)
    expect(atLeast(lock.packages['node_modules/fast-uri'].version, [3, 1, 9])).toBe(true)
    expect(lock.packages['node_modules/proxy-addr'].version).not.toBe('2.0.7')
  }
  const root = json('./package-lock.json')
  expect(json('./package.json').peerDependencies.vue).toBe('^3.3.0')
  expect(root.packages['node_modules/@vueuse/core']).toBeUndefined()
  expect(atLeast(root.packages['node_modules/happy-dom'].version, [21, 0, 4])).toBe(true)
})
