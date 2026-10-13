# MCP/source release-readiness checkpoint — 2026-10-13

**Status:** investigation merged to `develop` via PR #133 (f1df767), after Steps 10–11 (#131, #132). The counts below are the **pre-remediation snapshot**; see [dependency remediation](DEPENDENCY_REMEDIATION.md) for the later lockfile changes. This is not a release, installed-package certification, or hosted MCP proposal. No build, extraction, lockfile mutation, package installation or publication was run.

## Tool-choice and example gate

`npm run test:mcp` now exercises a **real source stdio MCP client** over four natural-language intents: save action → `component:LbButton`; collect email → `component:LbInput`; confirmation modal → `component:LbDialog`; choose frequency → `component:LbSegmentButton`. For each, the client searches, retrieves full detail, checks source/package version and exact equality with the tested SFC from `reference/v1.json`. The largest measured response was **855 bytes for search** and **2,477 bytes for full retrieval**. The checked Dialog example does not use `variant="filled"`; the segment example includes its parent. `npm test` still covers source SFC rendering and component interactions.

**Gate still open:** these prompts use a deterministic test client, not an independent LLM deciding tools and producing an answer. An attempted local offline LLM session failed before tool selection (`onUpdate is not a function`; no LM Studio listener on port 1234). Do not claim an independent agent-in-loop pass. Once an agent runtime is available, ask those four intents without supplying component names or APIs, record `lb_search` → `lb_get` calls and the final Vue code, and typecheck/render the exact answers. The tracked `mcp-server/dist/` and npm 0.8.3 CLI still contain the old ten tools; exact-release artifact verification requires separate owner authorization.

## Dependency audit triage (both lockfiles, no fixes applied)

Commands: `npm audit --json --package-lock-only --ignore-scripts` and the same command with `--omit=dev`, run separately at repository root and in `mcp-server/`. Registry audit findings can change; counts below are snapshots, not a security guarantee. `npm ls` confirms both lockfiles resolve **@modelcontextprotocol/sdk 1.20.1**, despite a permissive `^1.6.1` declaration. No production build or HTTP MCP transport exists in this source slice: the new server uses local stdio only, but dependency findings must not be dismissed on that basis.

| Lockfile | All dependencies | Production only | Main path / action |
| --- | --- | --- | --- |
| Root | 18 (2 moderate, 15 high, 1 critical) | 10 (2 moderate, 7 high, 1 critical) | Direct SDK and Vue plus transitive Express chain; Vite/glob and other dev tooling also appear in full audit. |
| `mcp-server/` | 6 (3 moderate, 2 high, 1 critical) | 6 (3 moderate, 2 high, 1 critical) | Direct SDK, transitive `ajv`, `body-parser`, `path-to-regexp`, `proxy-addr`, `qs`. |

The **critical** finding is [proxy-addr IP spoofing](https://github.com/advisories/GHSA-jqcg-44mw-7w3h), reached via `@modelcontextprotocol/sdk → express → proxy-addr` (locked 2.0.7, registry 2.0.8 available). The **high direct SDK** entry groups [cross-client instance reuse](https://github.com/advisories/GHSA-345p-7cg4-v4c7), DNS rebinding, ReDoS and OAuth-client advisories; npm flags SDK versions `<=1.30.1`. The current server creates a fresh server per source stdio process and does not offer HTTP/OAuth, so the cited HTTP/OAuth paths are not part of its intended runtime. This is *exposure context*, not a finding waiver: transitives remain installed and a future host may change usage. The high `path-to-regexp` and moderate `body-parser`/`qs`/`ajv` are also on the SDK/Express dependency path. Root production audit separately flags Vue/server-renderer, PostCSS, nanoid and source-map-js. `npm audit` reports a non-forced fix available for each listed package; patched combinations were **not installed or verified**.

**Remediation target (addressed on a subsequent feature branch, pending review):** raise the SDK minimum in both manifests to a non-vulnerable 1.x range (registry reported 1.32.1 supporting Node ≥18), refresh both lockfiles without `--force` or lifecycle scripts, and update other direct root dependencies in a separate bounded pass (Vue 3.5.44, Vite 7.3.7 within 7.x, glob 11.1+ were available at this snapshot). Re-run both full and production audits, source lint/types/tests/browser/stdio checks, then inspect remaining transitive paths instead of blindly running `npm audit fix`. Do not call either package safe until the audited **release artifact and its exact lockfile** are verified. A build or publish requires separate owner authorization.

## Docs hosting boundary

The owner intends to show LittleBrand documentation within the future multi-project **seedtoshelves.com** website. The website has not been built, and there is no selected framework, deployment pipeline, route, or public URL for the docs. The Step 11 Vue preview stays local; no automatic deploy, hosted MCP or package-release coupling is implied.
