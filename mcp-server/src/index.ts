#!/usr/bin/env node
/** Local stdio discovery for the checked reference slices. No synthesized examples. */
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertSupportedNodeVersion, NODE_ENGINE_RANGE } from './node-runtime.js';

interface Prop { name: string; type: string; required: boolean; default?: string }
interface Component {
  id: string; name: string; purpose: string; intents: string[]; use: string; avoid: string;
  accessibility: string; states: string[]; related: string[]; dependencies: string[];
  compoundOnly?: boolean; props: Prop[]; slots: string[]; emits: string[]; usage: string;
}
interface Token { id: string; name: string; purpose: string; related: string[] }
interface Reference {
  schemaVersion: number; packageVersion: string; status: string; distribution: string;
  components: Component[]; tokens: Token[];
}

// src/ and dist/ are siblings: both resolve to the same packaged root reference.
function loadReference(): Reference {
  const reference: Reference = JSON.parse(readFileSync(new URL('../../reference/v1.json', import.meta.url), 'utf8'));
  const packageVersion = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version as string;
  if (reference.packageVersion !== packageVersion) throw new Error('MCP reference package version mismatch');
  return reference;
}

const pathFor = (id: string) => id.startsWith('component:')
  ? `docs/reference/v1/components/${id.slice('component:'.length)}.md`
  : 'docs/reference/v1/TOKENS.md';
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const words = (text: string) => normalize(text).split(' ').filter(word => word.length > 2 && !['the', 'for', 'with', 'and', 'use', 'how', 'can'].includes(word));
const search = (reference: Reference, query: string, limit: number) => {
  const normalized = normalize(query);
  const terms = words(query);
  const entries = [
    ...reference.components.filter(c => !c.compoundOnly).map(c => ({
      id: c.id, name: c.name, purpose: c.purpose,
      terms: normalize([c.name, c.purpose, c.use, ...c.intents].join(' ')),
      intents: c.intents.map(normalize)
    })),
    ...reference.tokens.map(t => ({
      id: t.id, name: t.name, purpose: t.purpose,
      terms: normalize(`${t.name} ${t.purpose}`), intents: [] as string[]
    }))
  ];
  return entries.map(entry => {
    const name = normalize(entry.name);
    const score = (name === normalized ? 100 : 0)
      + (terms.includes('token') && entry.id.startsWith('token:') ? 30 : 0)
      + (terms.includes('component') && entry.id.startsWith('component:') ? 30 : 0)
      + (entry.intents.some(intent => normalized.includes(intent)) ? 25 : 0)
      + (terms.length && terms.every(term => entry.terms.includes(term)) ? 12 : 0)
      + terms.reduce((total, term) => total + (entry.terms.includes(term) ? 1 : 0), 0);
    return { id: entry.id, name: entry.name, purpose: entry.purpose, referencePath: pathFor(entry.id), score };
  }).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit).map(({ score: _score, ...entry }) => entry);
};
const response = (value: unknown, isError = false) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value) }], ...(isError ? { isError: true } : {})
});
const note = 'This reference is unreleased source work, not the published npm 0.8.3 artifact. Published 0.8.3 has known strict TypeScript and CJS failures; the exact future release artifact and MCP CLI remain unverified.';

export function createServer(reference: Reference = loadReference()) {
  assertSupportedNodeVersion();
  if (reference.schemaVersion !== 1) throw new Error('Unsupported MCP reference schema');
  const packageVersion = reference.packageVersion;
  const server = new McpServer({ name: 'littlebrand-mcp-server', version: packageVersion });
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

  server.registerTool('lb_search', {
    title: 'Search verified LittleBrand components and tokens',
    description: `Small intent search over ${reference.components.filter(c => !c.compoundOnly).length} verified examples and selected semantic tokens. Returns stable IDs and reference paths. Search, then use lb_get for the exact item.`,
    inputSchema: { query: z.string().trim().min(2), limit: z.number().int().min(1).max(5).default(4) },
    annotations
  }, async ({ query, limit }) => response({ schemaVersion: reference.schemaVersion, packageVersion, status: reference.status, results: search(reference, query, limit) }));

  server.registerTool('lb_get', {
    title: 'Retrieve one verified LittleBrand component or token',
    description: 'Retrieve by exact stable ID or name. Set detail=full for API and tested, npm-ready Vue example. SegmentButtonItem always requires its parent.',
    inputSchema: { id: z.string().trim().min(1), detail: z.enum(['summary', 'full']).default('summary') },
    annotations
  }, async ({ id, detail }) => {
    const matches = (entry: Component | Token) =>
      entry.id.toLowerCase() === id.toLowerCase() || entry.name.toLowerCase() === id.toLowerCase();
    const component = reference.components.find(matches);
    const item = component ?? reference.tokens.find(matches);
    if (!item) return response({ error: 'Unknown or unverified item', id, hint: 'Use lb_search for the verified slice.' }, true);
    const base = { schemaVersion: reference.schemaVersion, packageVersion, status: reference.status,
      id: item.id, name: item.name, purpose: item.purpose, related: item.related, referencePath: pathFor(item.id) };
    if (component) return response({ ...base, use: component.use, avoid: component.avoid,
      accessibility: component.accessibility, compoundOnly: Boolean(component.compoundOnly),
      ...(detail === 'full' ? { states: component.states, dependencies: component.dependencies,
        props: component.props, slots: component.slots, emits: component.emits, testedVueExample: component.usage } : {}) });
    return response(base);
  });

  server.registerTool('lb_setup', {
    title: 'Get supported npm setup and source-version caveats',
    description: 'Exact root import and CSS path for a Vue host, plus the local stdio entry path and release limitations.',
    inputSchema: {}, annotations
  }, async () => response({ schemaVersion: reference.schemaVersion, packageVersion,
    status: reference.status, distribution: reference.distribution, caveat: note,
    install: 'npm install littlebrand-ui-kit',
    vue: "import { LbButton } from 'littlebrand-ui-kit'\nimport 'littlebrand-ui-kit/style.css'",
    mcpStdio: 'node ./node_modules/littlebrand-ui-kit/mcp-server/dist/index.js',
    supported: `Security-patched Node (${NODE_ENGINE_RANGE}) for the bundled MCP CLI. Vue peer ^3.3.0; npm root component exports and /style.css. For reusable wrappers compatible with Vue 3.3, use modelValue and update:modelValue; defineModel requires Vue 3.4+. No deep import or hosted MCP contract.` }));
  return server;
}

async function main() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url.startsWith('file:') && process.argv[1] && realpathSync(resolve(process.argv[1])) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
