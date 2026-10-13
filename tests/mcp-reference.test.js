import { afterEach, expect, test } from 'vitest'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { createServer } from '../mcp-server/src/index.ts'
import reference from '../reference/v1.json'

const open = []
async function connect() {
  const server = createServer(reference)
  const client = new Client({ name: 'reference-check', version: '1.0.0' })
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])
  open.push({ client, server })
  return client
}
afterEach(async () => {
  for (const { client, server } of open.splice(0)) { await client.close(); await server.close() }
})
async function call(client, name, args = {}) {
  const result = await client.callTool({ name, arguments: args })
  return { result, body: JSON.parse(result.content[0].text), bytes: Buffer.byteLength(result.content[0].text) }
}

test('small verified stdio tool surface; no synthetic example or generic catalog tools', async () => {
  const client = await connect()
  const tools = (await client.listTools()).tools.map(tool => tool.name)
  expect(tools).toEqual(['lb_search', 'lb_get', 'lb_setup'])
  const setup = await call(client, 'lb_setup')
  expect(setup.body.vue).toContain("from 'littlebrand-ui-kit'")
  expect(setup.body.vue).toContain("littlebrand-ui-kit/style.css")
  expect(setup.body.caveat).toContain('unverified')
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
  expect(body.results.every(result => result.id !== 'component:LbSegmentButtonItem')).toBe(true)
})

test('exact full retrieval matches authored machine facts and all four tested examples', async () => {
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
  const item = (await call(client, 'lb_get', { id: 'LbSegmentButtonItem', detail: 'full' })).body
  expect(item.compoundOnly).toBe(true)
  expect(item.testedVueExample).toContain('<LbSegmentButton ')
  const token = (await call(client, 'lb_get', { id: '--lb-surface-overlay' })).body
  expect(token.referencePath).toBe('docs/reference/v1/TOKENS.md')
  expect(token.purpose).toBe(reference.tokens.find(t => t.name === token.name).purpose)
  const missing = await call(client, 'lb_get', { id: 'LbUnverifiedComponent' })
  expect(missing.result.isError).toBe(true)
})
