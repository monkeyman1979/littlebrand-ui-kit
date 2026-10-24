# Bounded security lockfile refresh — 2026-10-24

**Scope:** source-only patch/minor refresh on a feature branch, based on `develop` after #140. [Earlier remediation](DEPENDENCY_REMEDIATION.md) audited zero findings at its checkpoint, but new advisories have since appeared. This work does **not** test the published npm 0.8.3, old tracked MCP `dist/`, or an exact release artifact. PR #141's Vue 3.3 source fixture is independent.

## Changes

- Raised the direct `@modelcontextprotocol/sdk` floor in **both** manifests and lockfiles to `^1.32.2`; this remains the maintained **v1** SDK with the existing local stdio tools and MCP Node `>=18` engine. No SDK v2/Node-support migration.
- Resolved `body-parser` 2.4.0 and `fast-uri` 3.1.9 in both lockfiles through their existing transitive ranges (including the required `qs` 6.16.1). Raised development-only `happy-dom` to `^21.0.4` in the root manifest/lockfile.
- Kept direct `zod ^3.25.1` (locked 3.25.76) unchanged: npm's fix for the current high finding is Zod 4.6.7, a **major** migration requiring its own compatibility checks. Do not call either lockfile advisory-free.
- Left Vue development 3.5.44, the public Vue peer `^3.3.0`, Vite 7, and other unrelated direct dependency majors untouched. The existing `@vueuse/core` 13.8 peer expects Vue `^3.5.0`; reconciling that with the kit's advertised Vue 3.3 support needs a separate owner compatibility decision.

Both lockfiles were updated without forced or lifecycle-script changes, then installed locally with `npm ci --ignore-scripts --no-fund --no-audit` in both directories. No release build, metadata extraction, MCP compilation, publication, deployment, or `main` merge.

## Advisory snapshot (lockfiles, read-only npm audit)

| Lockfile | Before | After | Remaining |
| --- | --- | --- | --- |
| Root, all | 4 (3 high, 1 moderate) | **1 high** | `zod` |
| Root, production (`--omit=dev`) | 3 (2 high, 1 moderate) | **1 high** | `zod` |
| `mcp-server/`, all and production | 3 (2 high, 1 moderate) each | **1 high** each | `zod` |

Commands: `npm audit --json --package-lock-only --ignore-scripts` and the same with `--omit=dev`, from both directories. At this snapshot `body-parser`'s compressed-body denial-of-service advisory, `fast-uri`'s URI parsing advisories, and development `happy-dom`'s import-alias advisory no longer appear. The remaining Zod finding concerns memory exhaustion for oversized constrained collections. Audit results can change; exposure depends on how each dependency is used, and this table is not a waiver for the remaining high finding.

**Validation after clean installs:** root lint, source/consumer typecheck, site typecheck, reference freshness, 42 unit tests, MCP TypeScript no-emit, six-path source stdio, Chromium theme/component/site checks and the six kit-directed source SFC probes passed; `git diff --check` passed. These checks verify current local source and lockfiles, not the unreleased compiled MCP CLI or future npm artifact.

**Next separate decisions:** Zod 4 migration with root and bundled MCP source/tool tests; reconcile the VueUse/Vue peer range without silently dropping Vue 3.3 support. Broader tooling majors (Vite 8, TypeScript 7, VueUse 15, SDK v2) are not part of this security patch.
