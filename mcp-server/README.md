# LittleBrand local MCP (0.9.0)

**Security-patched runtime required:** Both the root package (which ships the CLI) and MCP manifest require **`^22.23.4 || ^24.22.1 || ^26.12.1`** after the [October 2026 Node security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases). The server checks this before creating tools; vulnerable older patches, EOL odd majors and unreviewed future majors are refused even if npm engine checks were bypassed. `.node-version` pins LTS **22.23.4** for development. Upgrade Node and restart MCP clients to load fixes; npm dependency audits do not cover Node's bundled libraries. Vue peer `^3.3.0` and SDK v1 remain unchanged.

The bundled server uses **local stdio**, not a hosted endpoint. Version 0.9.0 replaces the old ten unverified tools with three read-only tools. It combines the authored [verified v1 reference](../docs/reference/v1/README.md) with a source root-export inventory in [`reference/catalog.json`](../reference/catalog.json):

| Tool | Response |
| --- | --- |
| `lb_search` | At most five intent-matched IDs and purposes from all 33 source root-exported components and selected verified tokens. Each result is marked `checked` or `catalog-only`; catalog-only entries provide a source path, and compound children name their parent. |
| `lb_get` | Exact component/token by ID or name. Only `checked` items expose verified API and a tested Vue SFC with `detail=full`. Catalog-only components expose a name, purpose, source path and parent where applicable, **never** inferred props or examples. |
| `lb_setup` | npm root/CSS setup, local stdio path and version caveats. |

The server loads `reference/v1.json` and `reference/catalog.json` from the same package root at runtime, checks schema/package versions and duplicate names, and does not read the unverified generic `src/data/` examples. The catalog contains only lightweight source-export facts and short discovery intents; it is **not** an all-catalog API reference or an example library. No synthetic code/theme generation, hosted endpoint, or registry install path exists. The earlier npm 0.8.3 CLI exposes ten different tools. The tracked `mcp-server/dist/` now matches the published 0.9.0 package, with three tools; installed clients should use the 0.9.0 package. Building a release regenerates the bundled `dist/` from source. The source is on the maintained `@modelcontextprotocol/sdk` **v1** line (`^1.32.2`), not the new split-package v2 SDK or a hosted transport. For agent trial context, see the [handoff](../docs/MCP_AGENT_TRIAL_HANDOFF.md); local artifact checks and runtime coverage are recorded in [distributable verification](../docs/DISTRIBUTABLE_VERIFICATION.md). SDK v2 remains a separate migration.

## Installed npm usage (0.9.0)

In a Vue 3 application, install via `npm install littlebrand-ui-kit`, import from `littlebrand-ui-kit`, and import `littlebrand-ui-kit/style.css`. Configure an MCP-compatible client to start `node ./node_modules/littlebrand-ui-kit/mcp-server/dist/index.js` from the project root (client config format varies). Use the matching 0.9.0 package for these tools; older 0.8.3 has known strict TypeScript and CommonJS failures. Deep imports are unsupported. See [Step 05 consumer evidence](../docs/STEP_05_NPM_CONSUMER.md).

## Source-level checks (no release build)

From the repository root, with dependencies already installed:

```sh
./mcp-server/node_modules/.bin/tsc --noEmit -p mcp-server/tsconfig.json
npm test
npm run test:mcp
```

`npm run test:mcp` launches the **source** server through the local `tsx` dev dependency and calls it over real stdio. It does not compile or verify the packaged `dist/` artifact. See [Step 10 limits](../docs/STEP_10_LOCAL_MCP.md). Do not run `npm run build` or `npm run build:mcp` unless the owner authorizes a release build. The prior 10-tool `evaluation.xml` was retired; source-level retrieval and response-size checks are in `tests/mcp-reference.test.js` and `tests/mcp-stdio.mjs`.
