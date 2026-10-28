import { afterEach, expect, test } from 'vite-plus/test'
import { existsSync, readFileSync } from 'node:fs'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { createServer } from '../mcp-server/src/index.ts'
import reference from '../reference/v1.json'
import catalog from '../reference/catalog.json'
import { NODE_ENGINE_RANGE } from '../mcp-server/src/node-runtime.ts'

const open = []
async function connect() {
  const server = createServer(reference, catalog)
  const client = new Client({ name: 'reference-check', version: '1.0.0' })
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
  open.push({ client, server })
  return client
}
afterEach(async () => {
  for (const { client, server } of open.splice(0)) {
    await client.close()
    await server.close()
  }
})
async function call(client, name, args = {}) {
  const result = await client.callTool({ name, arguments: args })
  return {
    result,
    body: JSON.parse(result.content[0].text),
    bytes: Buffer.byteLength(result.content[0].text)
  }
}

test('small read-only tool surface; no synthetic example tools', async () => {
  const client = await connect()
  const tools = (await client.listTools()).tools.map((tool) => tool.name)
  expect(tools).toEqual(['lb_search', 'lb_get', 'lb_setup'])
  const setup = await call(client, 'lb_setup')
  expect(setup.body.vue).toContain("from 'littlebrand-ui-kit'")
  expect(setup.body.vue).toContain('littlebrand-ui-kit/style.css')
  expect(setup.body.caveat).toContain('unverified')
  expect(setup.body.supported).toContain(NODE_ENGINE_RANGE)
  expect(setup.body.supported).toContain('Vue peer ^3.3.0')
  expect(setup.body.supported).toContain('defineModel requires Vue 3.4+')
  expect(setup.body.packageVersion).toBe(reference.packageVersion)
})

test.each([
  ['save changes with a button', 'component:LbButton'],
  ['collect an email in a form', 'component:LbInput'],
  ['write multiline notes', 'component:LbTextarea'],
  ['show a validation field group', 'component:LbFormField'],
  ['confirmation modal', 'component:LbDialog'],
  ['choose frequency using a segmented control', 'component:LbSegmentButton'],
  ['focus ring color', 'token:--lb-focus-ring-color'],
  ['dialog overlay token', 'token:--lb-surface-overlay']
])('intent %s resolves to %s without guessing an API', async (query, id) => {
  const client = await connect()
  const { body, bytes } = await call(client, 'lb_search', { query })
  expect(body.results.length).toBeLessThanOrEqual(4)
  expect(body.results[0].id).toBe(id)
  expect(bytes).toBeLessThan(1800)
  expect(body.results.every((result) => result.id !== 'component:LbSegmentButtonItem')).toBe(true)
})

test('exact full retrieval matches authored machine facts and tested examples', async () => {
  const client = await connect()
  for (const item of reference.components) {
    const { body, bytes } = await call(client, 'lb_get', { id: item.id, detail: 'full' })
    expect(body.testedVueExample).toBe(item.usage)
    expect(body.props).toEqual(item.props)
    expect(body.slots).toEqual(item.slots)
    expect(body.emits).toEqual(item.emits)
    expect(body.referencePath).toBe(`docs/reference/v1/components/${item.name}.md`)
    expect(bytes).toBeLessThan(6500)
  }
  const dialog = (await call(client, 'lb_get', { id: 'LbDialog', detail: 'full' })).body
  expect(dialog.testedVueExample).not.toContain('variant="filled"')
  expect(dialog.avoid).toContain('defineModel')
  expect(dialog.use).toContain('update:modelValue')
  const segment = (await call(client, 'lb_get', { id: 'LbSegmentButton', detail: 'full' })).body
  expect(segment.avoid).toContain('defineModel')
  expect(segment.use).toContain('update:modelValue')
  const item = (await call(client, 'lb_get', { id: 'LbSegmentButtonItem', detail: 'full' })).body
  expect(item.compoundOnly).toBe(true)
  expect(item.testedVueExample).toContain('<LbSegmentButton ')
  const token = (await call(client, 'lb_get', { id: '--lb-surface-overlay' })).body
  expect(token.referencePath).toBe('docs/reference/v1/TOKENS.md')
  expect(token.purpose).toBe(reference.tokens.find((t) => t.name === token.name).purpose)
  const missing = await call(client, 'lb_get', { id: 'LbUnverifiedComponent' })
  expect(missing.result.isError).toBe(true)
})

test('catalog-only source names exactly cover public root component exports outside the checked slice', () => {
  const root = readFileSync('src/index.js', 'utf8')
  const exported = new Set(
    [...root.matchAll(/export \{([^}]+)\}/g)]
      .flatMap(([, group]) => group.split(',').map((name) => name.trim()))
      .filter((name) => name.startsWith('Lb') && name !== 'LittleBrandUI')
  )
  const checked = new Set(reference.components.map((item) => item.name))
  const names = catalog.components.map((item) => item.name)
  expect(new Set(names).size).toBe(names.length)
  expect([...new Set([...names, ...checked])].sort()).toEqual([...exported].sort())
  expect(names.filter((name) => checked.has(name))).toEqual([])
  expect(catalog.packageVersion).toBe(reference.packageVersion)
  expect(JSON.parse(readFileSync('package.json', 'utf8')).files).toContain('reference/catalog.json')
  for (const item of catalog.components) {
    expect(existsSync(item.source), item.source).toBe(true)
    if (item.parent) expect(exported.has(item.parent), item.name).toBe(true)
  }
})

test('catalog-only items can be discovered and retrieved, but cannot claim checked API or examples', async () => {
  const client = await connect()
  for (const item of catalog.components) {
    const { body } = await call(client, 'lb_get', { id: `component:${item.name}`, detail: 'full' })
    expect(body).toMatchObject({
      id: `component:${item.name}`,
      verification: 'catalog-only',
      sourcePath: item.source,
      ...(item.parent ? { parent: item.parent } : {})
    })
    for (const key of ['testedVueExample', 'props', 'slots', 'emits', 'referencePath']) {
      expect(body).not.toHaveProperty(key)
    }
    const search = await call(client, 'lb_search', { query: item.name })
    expect(search.body.results[0].id, item.name).toBe(`component:${item.name}`)
    expect(search.body.results[0].verification).toBe('catalog-only')
  }
  const { body, bytes } = await call(client, 'lb_search', { query: 'popover trigger' })
  expect(body.results[0]).toMatchObject({
    id: 'component:LbPopoverTrigger',
    verification: 'catalog-only',
    parent: 'LbPopover'
  })
  expect(bytes).toBeLessThan(1800)
  const checked = (await call(client, 'lb_search', { query: 'confirmation modal' })).body.results[0]
  expect(checked).toMatchObject({ id: 'component:LbDialog', verification: 'checked' })
  expect(checked).toHaveProperty('referencePath')
  const child = (await call(client, 'lb_search', { query: 'segment item' })).body.results[0]
  expect(child).toMatchObject({
    id: 'component:LbSegmentButtonItem',
    verification: 'checked',
    parent: 'LbSegmentButton'
  })
})

test('catalog/version mismatches fail closed at server startup', () => {
  expect(() => createServer(reference, { ...catalog, packageVersion: 'other' })).toThrow(
    'catalog package version mismatch'
  )
  expect(() =>
    createServer(reference, {
      ...catalog,
      components: [catalog.components[0], catalog.components[0]]
    })
  ).toThrow('Duplicate MCP catalog component')
})
