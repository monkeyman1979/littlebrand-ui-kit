#!/usr/bin/env node
/** Local stdio discovery for the checked reference slices. No synthesized examples. */
import { readFileSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertSupportedNodeVersion, NODE_ENGINE_RANGE } from './node-runtime.js';
// src/ and dist/ are siblings: both resolve to the same packaged root reference.
function loadReference() {
    const reference = JSON.parse(readFileSync(new URL('../../reference/v1.json', import.meta.url), 'utf8'));
    const packageVersion = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
    if (reference.packageVersion !== packageVersion)
        throw new Error('MCP reference package version mismatch');
    return reference;
}
function loadCatalog() {
    return JSON.parse(readFileSync(new URL('../../reference/catalog.json', import.meta.url), 'utf8'));
}
const pathFor = (id) => id.startsWith('component:')
    ? `docs/reference/v1/components/${id.slice('component:'.length)}.md`
    : 'docs/reference/v1/TOKENS.md';
const normalize = (text) => text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const words = (text) => normalize(text)
    .split(' ')
    .filter((word) => word.length > 2 && !['the', 'for', 'with', 'and', 'use', 'how', 'can'].includes(word));
const search = (reference, catalog, query, limit) => {
    const normalized = normalize(query);
    const terms = words(query);
    const entries = [
        ...reference.components.map((c) => ({
            id: c.id,
            name: c.name,
            purpose: c.purpose,
            terms: normalize([c.name, c.purpose, c.use, ...c.intents].join(' ')),
            intents: c.intents.map(normalize),
            verification: 'checked',
            referencePath: pathFor(c.id),
            ...(c.compoundOnly
                ? {
                    parent: c.related.find((id) => id.startsWith('component:'))?.slice('component:'.length)
                }
                : {})
        })),
        ...catalog.components.map((c) => ({
            id: `component:${c.name}`,
            name: c.name,
            purpose: c.purpose,
            terms: normalize([c.name, c.purpose, ...c.intents].join(' ')),
            intents: c.intents.map(normalize),
            verification: 'catalog-only',
            sourcePath: c.source,
            ...(c.parent ? { parent: c.parent } : {})
        })),
        ...reference.tokens.map((t) => ({
            id: t.id,
            name: t.name,
            purpose: t.purpose,
            terms: normalize(`${t.name} ${t.purpose}`),
            intents: [],
            verification: 'checked',
            referencePath: pathFor(t.id)
        }))
    ];
    return entries
        .filter((entry) => !('parent' in entry) ||
        normalize(entry.name) === normalized ||
        entry.intents.includes(normalized))
        .map((entry) => {
        const name = normalize(entry.name);
        const score = (name === normalized ? 100 : 0) +
            (terms.includes('token') && entry.id.startsWith('token:') ? 30 : 0) +
            (terms.includes('component') && entry.id.startsWith('component:') ? 30 : 0) +
            (entry.intents.some((intent) => intent === normalized) ? 40 : 0) +
            (entry.intents.some((intent) => normalized.includes(intent)) ? 25 : 0) +
            (terms.length && terms.every((term) => entry.terms.includes(term)) ? 12 : 0) +
            terms.reduce((total, term) => total + (entry.terms.includes(term) ? 1 : 0), 0);
        return {
            id: entry.id,
            name: entry.name,
            purpose: entry.purpose,
            verification: entry.verification,
            ...('referencePath' in entry ? { referencePath: entry.referencePath } : {}),
            ...('sourcePath' in entry ? { sourcePath: entry.sourcePath } : {}),
            ...('parent' in entry ? { parent: entry.parent } : {}),
            score
        };
    })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
        .slice(0, limit)
        .map(({ score: _score, ...entry }) => entry);
};
const response = (value, isError = false) => ({
    content: [{ type: 'text', text: JSON.stringify(value) }],
    ...(isError ? { isError: true } : {})
});
const note = 'Only checked items have verified APIs and tested examples. Catalog-only items have unverified APIs; do not infer props or use a compound child alone. Older package versions may expose different MCP tools and examples.';
export function createServer(reference = loadReference(), catalog = loadCatalog()) {
    assertSupportedNodeVersion();
    if (reference.schemaVersion !== 1 || catalog.schemaVersion !== 1)
        throw new Error('Unsupported MCP reference schema');
    if (catalog.packageVersion !== reference.packageVersion)
        throw new Error('MCP catalog package version mismatch');
    const checked = new Set(reference.components.map((item) => item.name));
    const names = new Set();
    for (const item of catalog.components) {
        if (checked.has(item.name) || names.has(item.name))
            throw new Error(`Duplicate MCP catalog component: ${item.name}`);
        names.add(item.name);
    }
    if (catalog.components.some((item) => item.parent && !checked.has(item.parent) && !names.has(item.parent)))
        throw new Error('MCP catalog has an unknown compound parent');
    const packageVersion = reference.packageVersion;
    const server = new McpServer({ name: 'littlebrand-mcp-server', version: packageVersion });
    const annotations = {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    };
    server.registerTool('lb_search', {
        title: 'Search LittleBrand public components and verified tokens',
        description: `Search ${reference.components.length + catalog.components.length} source root-exported components and selected semantic tokens. Results distinguish checked examples from catalog-only names without verified APIs. Compound children name their parent. Use lb_get for one item; only checked items have tested Vue examples.`,
        inputSchema: {
            query: z.string().trim().min(2),
            limit: z.number().int().min(1).max(5).default(4)
        },
        annotations
    }, async ({ query, limit }) => response({
        schemaVersion: reference.schemaVersion,
        packageVersion,
        status: reference.status,
        results: search(reference, catalog, query, limit)
    }));
    server.registerTool('lb_get', {
        title: 'Retrieve one LittleBrand component or verified token',
        description: 'Retrieve by exact stable ID or name. Checked items include tested Vue examples with detail=full. Catalog-only components return name, purpose, source path and parent when applicable; no unverified API or example.',
        inputSchema: {
            id: z.string().trim().min(1),
            detail: z.enum(['summary', 'full']).default('summary')
        },
        annotations
    }, async ({ id, detail }) => {
        const matches = (entry) => entry.id.toLowerCase() === id.toLowerCase() || entry.name.toLowerCase() === id.toLowerCase();
        const component = reference.components.find(matches);
        const catalogItem = catalog.components.find((entry) => entry.name.toLowerCase() === id.toLowerCase() ||
            `component:${entry.name}`.toLowerCase() === id.toLowerCase());
        const item = component ?? reference.tokens.find(matches);
        if (catalogItem)
            return response({
                schemaVersion: reference.schemaVersion,
                packageVersion,
                status: reference.status,
                id: `component:${catalogItem.name}`,
                name: catalogItem.name,
                purpose: catalogItem.purpose,
                verification: 'catalog-only',
                sourcePath: catalogItem.source,
                ...(catalogItem.parent ? { parent: catalogItem.parent } : {}),
                caveat: 'Public source export, but props, slots, events and examples are not verified. Do not infer an API; check parent context for compound pieces.'
            });
        if (!item)
            return response({
                error: 'Unknown item',
                id,
                hint: 'Use lb_search for source exports and the verified slice.'
            }, true);
        const base = {
            schemaVersion: reference.schemaVersion,
            packageVersion,
            status: reference.status,
            verification: 'checked',
            id: item.id,
            name: item.name,
            purpose: item.purpose,
            related: item.related,
            referencePath: pathFor(item.id)
        };
        if (component)
            return response({
                ...base,
                use: component.use,
                avoid: component.avoid,
                accessibility: component.accessibility,
                compoundOnly: Boolean(component.compoundOnly),
                ...(detail === 'full'
                    ? {
                        states: component.states,
                        dependencies: component.dependencies,
                        props: component.props,
                        slots: component.slots,
                        emits: component.emits,
                        testedVueExample: component.usage
                    }
                    : {})
            });
        return response(base);
    });
    server.registerTool('lb_setup', {
        title: 'Get supported npm setup and source-version caveats',
        description: 'Exact root import and CSS path for a Vue host, plus the local stdio entry path and release limitations.',
        inputSchema: {},
        annotations
    }, async () => response({
        schemaVersion: reference.schemaVersion,
        packageVersion,
        status: reference.status,
        distribution: reference.distribution,
        caveat: note,
        install: 'npm install littlebrand-ui-kit',
        vue: "import { LbButton } from 'littlebrand-ui-kit'\nimport 'littlebrand-ui-kit/style.css'",
        mcpStdio: 'node ./node_modules/littlebrand-ui-kit/mcp-server/dist/index.js',
        supported: `Security-patched Node (${NODE_ENGINE_RANGE}) for the bundled MCP CLI. Vue peer ^3.3.0; npm root component exports and /style.css. Search covers source root exports; only checked results have verified APIs/examples. For reusable wrappers compatible with Vue 3.3, use modelValue and update:modelValue; defineModel requires Vue 3.4+. No deep import or hosted MCP contract.`
    }));
    return server;
}
async function main() {
    const server = createServer();
    await server.connect(new StdioServerTransport());
}
if (import.meta.url.startsWith('file:') &&
    process.argv[1] &&
    realpathSync(resolve(process.argv[1])) === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}
//# sourceMappingURL=index.js.map