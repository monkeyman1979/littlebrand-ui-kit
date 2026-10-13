# Modernization execution plan

Status: proposed ordering for the [roadmap](ROADMAP.md), not an implementation or a release commitment. See the [handoff status](MODERNIZATION_STATUS.md) for merged Steps 01–11 and outstanding release-readiness work. Each numbered item is a small PR to `develop` unless investigation shows it must be split. Complete the acceptance gate before moving to its dependent item. Keep this plan for work that has *not* shipped; update `CHANGELOG.md` in each PR with user-visible changes only. Do not run `npm run build` without an explicit request from the project owner.

## Why this order

Do not put a website, registry, or newly advertised MCP tools on top of unreliable APIs. First establish the public contract, protect it with checks, align static and runtime themes, then document it and offer additional ways to discover/install it. The npm Vue package remains the base; headless AI applications remain independent of the visual kit.

### Initial planning observations (some now addressed; see handoff and Step 05 consumer report)

- `src/index.js` and `src/components/index.ts` define public exports; `scripts/extract-components.js` instead scans 26 `.vue.d.ts` files, while there are 33 `.vue` files. Some differences are internal/compound pieces; we need an explicit public inventory rather than assuming either count is the catalog.
- Initially `LbInput.vue.d.ts` advertised `size="small"` although the implementation accepts only `medium | large`; Step 05 corrected the declaration and an authorized build regenerated affected MCP data. The tracked MCP metadata still contains an old `variant="filled"` example for `LbDialog`, whose variant is `default | fullscreen`. Step 09 corrected the extractor for verified names, and Step 10's source server uses only the checked reference; neither metadata nor compiled MCP artifact has been refreshed.
- Initially `src/styles/_theme.sass` mapped primary surface `normal/hover/active` to 3/4/5, while runtime used 2/3/4 and omitted matching base/alpha/inverse roles. The approved Step 02 contract and [Step 06 implementation](STEP_06_TOKEN_ALIGNMENT.md) resolve this source-level mismatch; Step 07 added Chromium verification for the theme contract.
- Initially static CSS supported `[data-theme="dark"]` and `.dark` but not explicit light or system following, while `applyTheme()` observed only `.dark` classes. [Step 07](STEP_07_THEME_RELIABILITY.md) now implements approved precedence and checks it in Chromium; other browser engines and strict CSP are still unverified.
- Initially `package.json` lacked root types and lint/typecheck were placeholders. Steps 04–05 implemented source checks and proposed root types; the published 0.8.3 install still fails strict root TypeScript and CJS require ([consumer evidence](STEP_05_NPM_CONSUMER.md)). A limited local tree-shaking comparison and a fresh tarball consumer check have since passed; a future published artifact remains unverified.

## Ordered work packages

### 01. Public surface audit — first task (P0, planning)

**Execution spec:** [`STEP_01_AUDIT_SPEC.md`](STEP_01_AUDIT_SPEC.md). This is a triage audit; it does not require exhaustive per-prop verification.

Compare each public name in `src/index.js` and `src/components/index.ts` with implementation, `.vue.d.ts`, plugin registration, MCP entry, import path, and example. Inventory existing CSS tokens, the runtime generator, and package exports. Classify each component as public standalone, public compound, internal, or obsolete. Record the installed npm package's known compatibility constraints separately from source observations.

**Gate:** a reviewable inventory/mismatch table and list of public names; no component or token renaming yet. **Next:** 02.

### 02. Decide semantic token contract and compatibility policy (P0, planning; after 01)

Write down roles and names for text (including text-on-fill), surface (base/subtle/normal/hover/active and transparent versions), fill, border (line/normal/active/focus/disabled), and shadow. For each color family and mode, define expected palette mapping and intended uses. Include focus color versus outline width/offset and contrast over alpha surfaces. Compare LittleBrand with Product Design Sandbox; do not mechanically copy its unprefixed tokens or `light-dark()` implementation. Make an explicit old → unchanged/alias/deprecated/replaced mapping for npm consumers.

**Owner decision:** naming, supported color families, token deprecation window, and whether a breaking release is acceptable. **Gate:** approved token table and migration policy; no arbitrary token additions. **Next:** 03.

### 03. Decide theme and distribution contracts (P0, planning; after 01–02)

Specify initial/default light behavior, explicit dark via `.dark` and/or `data-theme`, optional system preference, nested theme previews, runtime `applyTheme()` behavior, switching after a custom theme is applied, and ownership of generated versus static variables. Decide whether to keep selector overrides or test a `light-dark()` approach; a syntax switch alone is not a goal. Confirm npm is the default path, and which component/type/CSS import paths are supported. Keep registry/remote MCP optional.

**Owner decision:** public theme selectors and any changed npm exports. **Gate:** written examples for light → dark → light and custom brand colors in both modes; compatibility cases identified. **Next:** 04–05.

### 04. Put real checks in place (P0, implementation; after 01, independent of token implementation)

Replace placeholder lint/typecheck scripts; add focused tests for component/declaration/export parity, metadata examples, token-name presence, theme toggling, and a few keyboard/focus interactions. Make checks runnable without publishing or implicitly changing generated files. Add consumer validation for documented imports and CSS, with production-build checks deferred until the owner requests a build.

**Gate:** checks fail on a deliberately invalid example or token and pass on the agreed baseline, with known legacy failures documented. **Next:** 05–09. This is the safety net, not a requirement to fix every component at once.

### 05. Repair npm-facing types and packaging contract (P0; after 01, 03–04)

Verify a clean Vue + TypeScript consumer can import public components, composables, utilities, and CSS as documented. Investigate root declarations/exports, shipped `.vue.d.ts`, ESM/UMD boundaries, dependency ownership, and what is actually tree-shakeable. Fix proven failures, keeping the existing install path viable. Test packaging when a build is explicitly authorized; do not infer published behavior from source layout alone.

**Gate:** a consumer fixture documents supported import paths and type completion; no misleading `types`/tree-shaking claims. **Next:** 08 and registry pilot.

### 06. Align static and generated tokens (P0; after 02–04)

Implement the approved grammar in `src/styles/_theme.sass`, the palette/alpha definitions, and `src/utils/color-generator.js` together. Reconcile step mappings, text-on-fill, surface alpha/base/inverse, border focus, shadows, and compatibility aliases. Keep naming and mapping tables machine-checkable rather than maintaining three independent descriptions.

**Gate:** static defaults and runtime-generated equivalents expose the same documented semantic names and intended roles for representative colors; aliases and migration notes are explicit. **Next:** 07, 09.

### 07. Make theming reliable (P0; after 03–04, 06)

Fix/tune switching under each supported selector and custom `applyTheme()` palette. Cover light/dark, toggling after applying a theme, overlay/nested previews, readable on-fill text, alpha over different surfaces, and focus visibility. Verify in a browser and with focused tests when implementation work is authorized.

**Gate:** theme behavior agrees with the contract in both modes and on an explicit custom brand palette; no silent light/dark mismatch. **Next:** 08–10.

### 08. Verify and polish the first component slice (P0/P1; after 04–07)

Start with Button, Input, and Dialog, then one compound component (e.g. Popover or SegmentButton). Reconcile implementation, declaration, documented variants/defaults/slots/events, token use, semantic HTML, keyboard/focus, disabled/loading, and reduced motion. Only introduce new animation or component families after existing behavior is dependable.

**Gate:** each example is valid Vue and renders; the component has tested states and theme support, and its public API is documented. **Next:** 09–11. Additional components follow the same checklist iteratively.

### 09. Create a single authored component/token reference (P1; after 01–02, 06, 08)

Choose a versioned content format for authored purpose, when/not to use, accessibility, states, related items, dependencies, and *tested* Vue examples. Derive API facts from verified implementation/declarations; do not infer usage from a prop name. Produce stable component/token IDs and links. Generate human reference and per-component Markdown from this common source.

**Gate:** Button, Input, Dialog, and the compound example have matching machine/human references; updates cannot silently drift. **Next:** 10–11.

### 10. Simplify the bundled MCP server (P1; after 09)

Keep local stdio first. Offer small search-by-intent results, precise retrieval of one component/token, and exact setup/installation advice with details on demand. Audit or retire tools that synthesize invalid examples. Measure tool count, response size, lookup accuracy, and source/version consistency against realistic prompts before deciding whether a hosted endpoint is worth operating.

**Gate:** an agent finds and correctly uses the four documented examples without guessing a prop or token; no generated example claims unverified correctness. **Next:** 11–12. Hosted MCP remains a later decision.

### 11. Launch a small Vue documentation site (P1; after 07–09; can overlap with 10)

Build the visual site around the same reference: live previews, API, intent-based guidance, installation, light/dark and brand theme, accessible states, token browser, and copyable Vue examples. Start with the verified slice, not the entire catalog. Publish a compact AI index and per-item Markdown alongside human pages. Decide site framework/hosting when the content contract is clear.

**Gate:** a new consumer can install and implement Button, Input, Dialog, and the compound example using only the site; rendered demos agree with docs/MCP. **Next:** 12–13.

### 12. Broaden the component catalog in slices (P1; after 08–11)

Prioritize form controls and their field/validation companions, then feedback/overlays, navigation, and display/utility pieces. For each slice repeat declaration/export, semantic tokens, a11y, theme, examples, metadata, and docs validation. Decide whether missing pieces are actual product needs, not just parity with a React catalog.

**Gate:** each published slice passes the same checks as the first; catalog counts refer to verified public exports. **Next:** 13–14.

### 13. Pilot an optional Vue source registry and blocks (P2; after 05, 09–11)

Investigate existing Vue-compatible tooling before selecting a registry format. Define install/update/version/license/dependency rules and foundation token ownership; trial Button, Input, and one composed block in a clean Vite consumer. Keep npm as a first-class path. Stop if source-copy upgrade costs outweigh its value.

**Gate:** deterministic install and update, working examples, and clear npm-versus-copy guidance. A successful pilot is required before expansion; this is not a promised feature. **Next:** 14.

### 14. Test a headless-first integration (P2; after 10–13 only if a real consumer exists)

Choose a concrete agent workflow that works without Vue. Add an optional visual result using the library/registry only when helpful; keep business actions, permissions, state, and tool execution in the host application. Decide separately whether remote MCP, additional blocks, or a dedicated package is actually needed.

**Gate:** the same workflow works without UI and with an optional documented Vue view. Do not make this a dependency of the UI kit release.

## Parallelism and release gates

- 01–03 are decision work: finish in order before API-changing implementation. 04 can start once the inventory is understood; 05 can proceed alongside 06, provided the public contracts are settled. 10 and 11 can overlap after 09. 12 expands incrementally; 13–14 are optional research/pilots.
- Keep PRs bounded. For every user-visible change, update `CHANGELOG.md` under Unreleased and include a migration path if behavior or names change. Do not mark planned features as released.
- Before an npm release, verify documented imports/types, token and theme behavior, component tests, and generated metadata against that exact version. A release build and publish are separate steps requiring the owner's instruction.

## Immediate next PR

**Steps 01–11 merged into `develop` via PRs #121–#132.** [Step 11 site](STEP_11_DOC_SITE.md) previews the verified slice and generated Markdown locally. [Release-readiness triage](MCP_RELEASE_READINESS.md) records four source stdio intent paths and pre-remediation findings; [dependency remediation](DEPENDENCY_REMEDIATION.md) is on a feature branch and both refreshed lockfiles currently audit at zero findings. Independent agent-in-loop and exact-release artifact checks remain open. The owner intends future docs within the not-yet-built seedtoshelves.com project; no hosting, build or publication has been authorized. See the [handoff](MODERNIZATION_STATUS.md).
