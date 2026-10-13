# Dependency remediation — root and bundled MCP lockfiles

**Status:** merged into `develop` via PR #134 (9d0c6bf), based on PR #133 as merged to `develop`. No production build, MCP extraction/compilation, tarball test, `main` merge or npm publication. Initial advisory inventory and paths: [MCP readiness triage](MCP_RELEASE_READINESS.md).

## Change and scope

- Raise the direct `@modelcontextprotocol/sdk` floor from `^1.6.1` to `^1.32.1` in both manifests and refresh both lockfiles; installed SDK is 1.32.1. This remains the **v1** SDK with the same local stdio/registerTool APIs used in source; SDK 1.32.1 declares Node ≥18 and requires Zod ≥3.25; both manifests now declare `zod ^3.25.1` and both lockfiles resolve 3.25.76. v2 is a separate migration, not part of this patch. The new SDK path resolves Express 5.3.0 and `proxy-addr` 2.0.8, removing the prior critical finding.
- Raise **development** Vue and `@vue/compiler-sfc` floors from `^3.5.18` to `^3.5.44`, to remove the repo's vulnerable `@vue/server-renderer` tree. Keep the public Vue peer range `^3.3.0` unchanged: raising it is a consumer compatibility decision, **not** silently part of security patching. Host applications must assess their own Vue install; this lockfile audit does not certify older peer versions.
- Apply non-forced npm audit remediation for root transitive/dev lockfile entries (including Vite 7.3.7, glob 11.1.0, postcss 8.5.30, source-map-js 1.2.2, nanoid 3.3.20 and Rollup 4.64.6). The `glob@11.1.0` npm deprecation warning still appears despite no current audit finding; review its next major migration separately, since extraction uses its API. A read-only glob scan still found 26 declaration files; extraction itself was not run.

`npm install ... --ignore-scripts` and `npm audit fix --ignore-scripts` were used, followed by clean `npm ci --ignore-scripts --no-fund --no-audit` in **both** directories. No `--force`, dependency override, npm lifecycle script or release build was used.

| Lockfile | Before (2026-10-13) | After current lockfile | Validation |
| --- | --- | --- | --- |
| Root, all | 18 (2 moderate, 15 high, 1 critical) | **0** | `npm audit --json --package-lock-only --ignore-scripts` exit 0 |
| Root, production (`--omit=dev`) | 10 (2 moderate, 7 high, 1 critical) | **0** | same command with `--omit=dev` exit 0 |
| `mcp-server/`, all / production | 6 (3 moderate, 2 high, 1 critical) each | **0 / 0** | both audit modes exit 0 |

**Source checks:** root lint, strict source/consumer typecheck, site typecheck, MCP no-emit TypeScript check, 38 Vitest tests (including a minimum SDK/lockfile regression guard), four-intent source stdio MCP trial, Chromium theme/component/site checks, reference freshness and diff whitespace check passed after upgrades. The source stdio tests also passed after clean installs. This proves the local source and lockfiles, *not* the tracked old `mcp-server/dist/` or published npm 0.8.3 artifacts. An independent LLM-agent trial and exact-release artifact verification remain open. Audit findings may change as advisories evolve; re-run on the exact release commit.
