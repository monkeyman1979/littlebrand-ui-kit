# LittleBrand modernization — handoff status

**As of 2026-10-12.** Work is on feature branches for review against `develop`; nothing has been merged or published. The project remains at the current package version. This is a checkpoint, **not** a release announcement. Numbered work packages and gates: [execution plan](EXECUTION_PLAN.md); planned features: [roadmap](ROADMAP.md). Do not treat untested contracts as shipped behavior.

## Where we stopped

| Step | State | Evidence / boundary |
|---|---|---|
| **01 — public-surface audit** | Audit prepared | [Report](audits/01-public-surface.md) inventories 33 root-exported components/pieces, 26 declarations/MCP entries, representative API drift, tokens and packaging claims. It is source triage, not installed-package or browser verification; [audit spec](STEP_01_AUDIT_SPEC.md). |
| **02 — semantic token contract** | **Owner-approved planning baseline** | [Contract and migration matrix](STEP_02_TOKEN_CONTRACT.md): keep eight color families and current `--lb-*` names; align runtime surface sequence with static 1/2/3/4/5; avoid first-slice removals/renames. No token or generator implementation yet. |
| **03 — theme and distribution contract** | **Owner-approved planning baseline** | [Contract and walkthroughs](STEP_03_THEME_DISTRIBUTION_CONTRACT.md): automatically follow the system preference without an explicit choice, preserve explicit light/dark controls, retain latest `applyTheme()` custom palette, and give a teleported Dialog the originating theme scope. npm root imports and `/style.css` remain intended paths; installed-package types and deep imports are unverified. |
| **04 — real checks** | **Implemented locally; ready for review** | [Check coverage and pinned gaps](STEP_04_CHECKS.md). ESLint/`vue-tsc` and 18 focused Vitest tests cover known source mismatches, runtime theme probes and a few DOM interactions. Tests pin legacy gaps, **not** fixes. |
| **05 — npm-facing types** | **Prepared locally; release-artifact gate pending** | [Published-package failures and proposed repairs](STEP_05_NPM_CONSUMER.md). Published 0.8.3 installed in an isolated temp consumer: ESM root and CSS path resolve, strict root/CSS TypeScript and CJS require fail. Proposed `types`/CJS targets, a source self-reference TypeScript fixture for all 33 public component names, and corrections to a few declaration mismatches pass locally. Temporary metadata overlay onto published 0.8.3 passed but **does not validate a new release**. No build was authorized. |

**Last validation:** `npm run lint`, `npm run typecheck` (including the source self-reference consumer fixture), `npm test` (4 files, 18 tests), and `git diff --check` passed. No `npm run build`, extraction, MCP build, publication, merge, new tarball or browser/bundler test occurred. The legacy source CSS smoke test and the newly installed published-package checks are different; neither validates the next release artifact. `CHANGELOG.md` has an Unreleased entry for Step 05; it does not announce a published version.

## Next actions: Step 05 release gate, then Step 06

1. Review ordered Step 01–05 feature-branch commits/PRs against `develop`; do not bypass checks or required reviews. Step 05 changes are prepared on `feat/step-05-npm-types`; do not merge without review.
2. Obtain explicit owner authorization **before any production build**. When authorized, inspect the exact output and tarball in a clean Vue + TypeScript + Vite consumer for CSS rendering, declarations, ESM/CJS paths, dependency ownership, measured tree-shaking, and the MCP CLI. Follow [Step 05's outstanding gate](STEP_05_NPM_CONSUMER.md#outstanding-release-gate). Do not run `npm run extract*`, `npm run build:mcp`, or publish as a convenience check.
3. After that gate is satisfied or explicitly deferred by the owner, Steps **06–07** implement/test token and theme contracts; Step **08** verifies Button, Input, Dialog and a compound component before promoting metadata. Preserve the Step 04 pinned gaps until actual fixes land.

**Open decisions:** do not promise runtime-only `border-subtle`/`surface-raised` as new public APIs without consumer evidence; Popover/other teleported overlays beyond Dialog are deferred; full declaration accuracy, bundle bytes, and deep-import support remain unverified. Any breaking behavior or deprecation window requires separate owner approval. Keep user-visible implementation changes and migrations in `CHANGELOG.md` in their implementing PR.
