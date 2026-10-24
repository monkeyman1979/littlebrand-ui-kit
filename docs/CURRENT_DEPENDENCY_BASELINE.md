# Current compatible dependency baseline — 2026-10-24

**Runtime follow-up:** after the Node 22 migration, the October security review requires **`^22.23.4 || ^24.22.1 || ^26.12.1`** in both manifests and pins development to patched LTS 22.23.4. The earlier generic Node 22+/Node 22.12+/unchanged-engine statements below are historical, not a security recommendation. See [distributable verification](DISTRIBUTABLE_VERIFICATION.md) for the installed Node 22/current-runtime matrix and the explicit migration. Dependency versions and the Vue peer range were not changed by that follow-up.

## Decision and scope

Owner-authorized maintenance: merge the pending source-evidence/Zod PRs, restore the promised Vue 3.3 source contract, then update dependencies in validated batches. Keep public `Lb` names, CSS tokens/imports, Vue peer `^3.3.0`, and MCP SDK v1/Node engine unchanged. This is **unreleased source maintenance**, not a release build or npm publication.

PRs #141/#143 merged the earlier Vue 3.3.13 probe and Zod 4 follow-up. PR #144 removed VueUse's hidden Vue 3.5 requirement and fixed declaration-only Vue aliases; [minimum-version evidence](VUE33_SOURCE_COMPATIBILITY.md) now covers isolated Vue **3.3.0** strict source and declaration checks, plus targeted overlay interactions. Historical agent answers and their failures remain unchanged.

## Tooling refresh

| Dependency | Before | Current |
| --- | --- | --- |
| Vue / compiler-sfc (development) | 3.5.44 | **3.5.44** (current stable; unchanged) |
| Vite | 7.3.7 | **8.3.5** |
| @vitejs/plugin-vue | 6.0.1 | **6.0.10** |
| Glob | 11.1.0 | **13.0.6** |
| TypeScript (root and MCP) | 5.9.3 | **6.0.3** |
| ESLint / typescript-eslint | 10.12.0 / 8.71.2 | **10.13.0 / 8.72.0** |
| Playwright | 1.60.0 | **1.64.1** (exact pin; matching Chromium installed locally) |
| Pug / Sass | 3.0.3 / 1.89.2 | **3.0.4 / 1.106.1** |
| Vitest | 5.0.4 | **5.0.5** |
| MCP tsx / @types/node | 4.20.6 / 22.18.12 | **4.23.15 / 22.20.5** |

SDK **1.32.2**, Zod **4.6.7**, Happy DOM **21.0.4**, vue-tsc **3.3.13** and the other unchanged direct dependencies were already current on their chosen lines. Both lockfiles were refreshed and clean-installed with `npm ci --ignore-scripts --no-fund --no-audit`; no lifecycle scripts, forced audit fixes or dependency overrides.

### Intentional exceptions to `latest`

- **TypeScript 7.0.2:** not forced. `typescript-eslint@8.72.0` declares TypeScript `>=4.8.4 <6.1.0`; the native TypeScript 7 package also changes its API/exports. Both packages stay on `~6.0.3`, the current release inside the lint stack's supported range. No claim that vue-tsc works with TypeScript 7.
- **MCP @types/node 26.6.5:** keep the existing 22 type major at its latest patch, rather than introducing another runtime/type-policy migration. This is not proof of runtime compatibility with Node 18; MCP's unchanged `>=18` engine has not been runtime-tested here.
- MCP SDK v2 uses different split packages and changes runtime/protocol contracts; the monolithic v1 dependency is current. It is not an overdue same-package patch update.

At this snapshot, `npm outdated --json --depth=0` shows only TypeScript in root and TypeScript plus `@types/node` in MCP; no updates remain within the declared ranges. Recheck the registry when resuming rather than treating this as permanently current.

## Migration adjustments

- **Vite 8:** use `build.rolldownOptions` and a native ESM file-URL entry instead of injected `__dirname`. Explicitly retain Vite 7's browser compilation target list (`chrome107`, `edge107`, `firefox104`, `safari16`) instead of silently adopting the newer Vite 8 defaults. Config tests inspect these settings; they do **not** run a production build. Development tooling retains Vite's Node requirement `^20.19.0 || >=22.12.0`, separate from the library's Vue peer and bundled MCP engine.
- **TypeScript 6:** remove deprecated `baseUrl` in favor of explicitly relative `paths`, select `node` globals in MCP, and select `vite/client` CSS-import types plus an explicit common `rootDir` for the site. No `ignoreDeprecations` suppression or reduced strictness.
- **Sass:** replace deprecated Button `if()` calls with an ordinary `@if` family choice, preserving existing tokens. An in-memory Sass comparison produced byte-identical unscoped CSS for the old and new Button styles; the new style emitted no deprecation warnings. No CSS artifact was written.
- **Glob 13:** a read-only scan matched all **26** declarations found before the upgrade. A regression test compares the glob result to the filesystem inventory. Extraction itself was not run; the removed Glob CLI is unused.

Authoritative guidance checked: [Vite 8 migration](https://vite.dev/guide/migration.html), [TypeScript 6 migration/default changes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [Sass `if()` deprecation](https://sass-lang.com/documentation/breaking-changes/if-function/), [Glob API/CLI](https://github.com/isaacs/node-glob/blob/main/README.md), plus registry peer/engine metadata for the pinned versions.

## Validation and boundaries

Passed on local Node **26.9.0** after clean installs: root lint, source/strict consumer and site typechecks, MCP no-emit TypeScript, reference freshness, **51 tests**, actual source stdio (schemas/defaults/invalid arguments/six intent lookups), Chromium theme/component/overlay/site probes and all six kit-directed primary SFC probes. Isolated Vue **3.3.0** with TypeScript **5.9.3** and current Vue **3.5.44** with TypeScript **6.0.3** passed copied-source and Bundler/NodeNext declaration checks with `skipLibCheck=false`; the minimum host also passed overlay probes through the updated Vite toolchain.

Read-only root and MCP lockfile audits, in **both full and production views**, report **zero findings at this snapshot**. Audits can change and are not a guarantee of absence of exploitable behavior.

No production build, component/token extraction, MCP compilation, old tracked `dist/` verification, exact-release tarball, installed LittleBrand consumer, real iOS Safari, publication, hosting, or `main` merge. Vite 8's production bundler/output behavior remains part of the separately authorized exact-release gate. The old Step 05 artifact cannot certify these changes. Broader component semantics, real mobile/cross-engine and screen-reader checks remain separate from routine dependency maintenance.
