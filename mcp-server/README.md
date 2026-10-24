# LittleBrand local MCP (source work, unreleased)

**Security-patched runtime required:** Both the root package (which ships the CLI) and MCP manifest require **`^22.23.4 || ^24.22.1 || ^26.12.1`** after the [October 2026 Node security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases). The server checks this before creating tools; vulnerable older patches, EOL odd majors and unreviewed future majors are refused even if npm engine checks were bypassed. `.node-version` pins LTS **22.23.4** for development. Upgrade Node and restart MCP clients to load fixes; npm dependency audits do not cover Node's bundled libraries. Vue peer `^3.3.0` and SDK v1 remain unchanged.

The bundled server uses **local stdio**, not a hosted endpoint. This source version reduces the old ten unverified tools to three read-only tools grounded in the authored [v1 reference](../docs/reference/v1/README.md):

| Tool | Response |
| --- | --- |
| `lb_search` | Small intent-matched list of stable IDs, purposes and relative reference paths (up to five). Only reference-verified standalone examples plus selected tokens appear. |
| `lb_get` | Exact component/token by ID or name; `detail=full` includes derived API and the tested Vue SFC. `LbSegmentButtonItem` is a compound child, never recommended by itself. |
| `lb_setup` | npm root/CSS setup, local stdio path and version caveats. |

The server loads `reference/v1.json` from the same package root at runtime, checks schema/package version, and does not read the unverified generic `src/data/` examples. There is no synthetic code/theme generation, all-catalog claim, hosted endpoint, or registry install path. `mcp-server/dist/` is still the old tracked artifact until a **separately authorized release build**; the *published* npm 0.8.3 is unchanged. Do not mistake the current npm CLI for this source server. The source is on the maintained `@modelcontextprotocol/sdk` **v1** line (`^1.32.2`), not the new split-package v2 SDK or a hosted transport. For agent trial context, see the [handoff](../docs/MCP_AGENT_TRIAL_HANDOFF.md); local artifact checks and runtime coverage are recorded in [distributable verification](../docs/DISTRIBUTABLE_VERIFICATION.md). SDK v2 remains a separate migration.

## Planned npm usage (after artifact verification and publication)

In a Vue 3 application, install via `npm install littlebrand-ui-kit`, import from `littlebrand-ui-kit`, and import `littlebrand-ui-kit/style.css`. Configure an MCP-compatible client to start `node ./node_modules/littlebrand-ui-kit/mcp-server/dist/index.js` from the project root (client config format varies). The source reference describes unreleased changes; published 0.8.3 has known strict TypeScript and CommonJS failures. Deep imports are unsupported. See [Step 05 consumer evidence](../docs/STEP_05_NPM_CONSUMER.md).

## Source-level checks (no release build)

From the repository root, with dependencies already installed:

```sh
./mcp-server/node_modules/.bin/tsc --noEmit -p mcp-server/tsconfig.json
npm test
npm run test:mcp
```

`npm run test:mcp` launches the **source** server through the local `tsx` dev dependency and calls it over real stdio. It does not compile or verify the tracked `dist/` artifact. See [Step 10 limits](../docs/STEP_10_LOCAL_MCP.md). Do not run `npm run build` or `npm run build:mcp` unless the owner authorizes a release build. The prior 10-tool `evaluation.xml` was retired; source-level retrieval and response-size checks are in `tests/mcp-reference.test.js` and `tests/mcp-stdio.mjs`.
