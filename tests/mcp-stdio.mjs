// Source-only protocol trial: four intent prompts over actual stdio, no dist build.
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const reference = JSON.parse(readFileSync(resolve('reference/v1.json'), 'utf8'))
const command = resolve('mcp-server/node_modules/.bin/tsx')
assert.ok(existsSync(command), 'Install mcp-server dev dependencies before source stdio trial')
const transport = new StdioClientTransport({ command, args: [resolve('mcp-server/src/index.ts')], cwd: process.cwd(), stderr: 'pipe' })
const client = new Client({ name: 'littlebrand-source-trial', version: '1.0.0' })
const prompts = [
  ['I need an action to save my changes', 'component:LbButton'],
  ['How can I collect a user email address?', 'component:LbInput'],
  ['Show a confirmation in a modal', 'component:LbDialog'],
  ['Choose frequency using a segmented control', 'component:LbSegmentButton']
]
try {
  await client.connect(transport)
  const tools = (await client.listTools()).tools
  assert.deepEqual(tools.map(tool => tool.name), ['lb_search', 'lb_get', 'lb_setup'])
  let largestSearch = 0
  let largestDetail = 0
  for (const [query, expectedId] of prompts) {
    const search = await client.callTool({ name: 'lb_search', arguments: { query } })
    const id = JSON.parse(search.content[0].text).results[0]?.id
    assert.equal(id, expectedId, query)
    largestSearch = Math.max(largestSearch, Buffer.byteLength(search.content[0].text))
    const result = await client.callTool({ name: 'lb_get', arguments: { id, detail: 'full' } })
    const item = JSON.parse(result.content[0].text)
    assert.equal(item.testedVueExample, reference.components.find(c => c.id === id).usage, id)
    assert.equal(item.packageVersion, reference.packageVersion)
    assert.ok(!item.testedVueExample.includes('variant="filled"') || id !== 'component:LbDialog')
    assert.match(item.testedVueExample, /littlebrand-ui-kit\/style\.css/)
    largestDetail = Math.max(largestDetail, Buffer.byteLength(result.content[0].text))
  }
  console.log(`Source stdio trial passed (3 tools, 4 intents/examples; max search ${largestSearch} bytes, max full ${largestDetail} bytes)`)
} finally {
  await client.close()
}
