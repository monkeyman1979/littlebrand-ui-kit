// Source-only CLI smoke: no dist compilation, extraction, or network.
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const command = resolve('mcp-server/node_modules/.bin/tsx')
assert.ok(existsSync(command), 'Install mcp-server dev dependencies before source stdio smoke')
const transport = new StdioClientTransport({ command, args: [resolve('mcp-server/src/index.ts')], cwd: process.cwd(), stderr: 'pipe' })
const client = new Client({ name: 'littlebrand-source-smoke', version: '1.0.0' })
try {
  await client.connect(transport)
  const tools = (await client.listTools()).tools
  assert.deepEqual(tools.map(tool => tool.name), ['lb_search', 'lb_get', 'lb_setup'])
  const search = await client.callTool({ name: 'lb_search', arguments: { query: 'confirm in a modal' } })
  const id = JSON.parse(search.content[0].text).results[0]?.id
  assert.equal(id, 'component:LbDialog')
  const result = await client.callTool({ name: 'lb_get', arguments: { id, detail: 'full' } })
  assert.match(JSON.parse(result.content[0].text).testedVueExample, /<LbDialog/)
  console.log(`Source stdio MCP smoke passed (${tools.length} tools; search ${Buffer.byteLength(search.content[0].text)} bytes; full Dialog ${Buffer.byteLength(result.content[0].text)} bytes)`)
} finally {
  await client.close()
}
