# LittleBrand roadmap

Status: planning. This is the working plan for the next iteration of LittleBrand UI Kit, not a list of shipped features. See the [current handoff status](MODERNIZATION_STATUS.md) for merged Steps 01–07, Step 08 work and the next action. Follow the numbered PR sequence and acceptance gates in the [execution plan](EXECUTION_PLAN.md). Check an item only after its acceptance criteria are met. Keep release notes in [`CHANGELOG.md`](../CHANGELOG.md).

## North star

LittleBrand is a Vue 3 + Vite design system that can be used directly from npm and discovered reliably by AI agents. Applications may use its visual components when a UI is appropriate, but agent workflows and business logic must not depend on Vue or this kit. A future registry can let agents install individual Vue components and composed blocks without making source-copy installation mandatory for npm users.

Preserve the semantic design language: **text, surface, fill, border, and shadow**. The reference for the desired vocabulary is Product Design Sandbox's [`src/styles/_theme.sass`](https://github.com/drivevelocity/product-design-sandbox/blob/develop/src/styles/_theme.sass); LittleBrand's current implementation is [`src/styles/_theme.sass`](../src/styles/_theme.sass). Borrow the concepts, not necessarily the exact variable names or theme-switching implementation. Keep the public `--lb-*` namespace unless a deliberate, documented migration is approved.

## Current baseline and constraints

- Published package: `littlebrand-ui-kit` 0.8.3; Vue 3, Vite, SASS/Pug, runtime theming, npm distribution, and a bundled stdio MCP server.
- The MCP component data is generated from 26 `.vue.d.ts` files; the source contains 33 `.vue` files, including internal and compound components. Inventory *public exports*, not raw file counts, before stating a catalog size. Generated descriptions and examples are currently generic.
- Steps 04–05 replaced placeholder `lint`/`typecheck` scripts and added a source self-reference TypeScript consumer fixture. Step 05 now includes an owner-authorized local tarball and clean installed Vue + TypeScript consumer check; accurate generated documentation and a future published release still require separate checks.
- Do not replace the npm package with a registry. Do not add AI-specific runtime dependencies to visual components. Do not assume headless agent applications need a UI.
- Work on feature branches; do not publish or run `npm run build` as part of planning. Build only when explicitly requested, following project instructions.

## Phase 0 — Agree on the public contract (P0)

- [ ] Inventory public exports, internal pieces, declaration files, actual component props/slots/events/defaults, existing tokens, and MCP metadata. Record mismatches and ownership.
- [ ] Define the token grammar and roles: text (`normal`, `contrast-high`, `contrast-low`, `disabled`, `on-fill`), surface (`base`, `subtle`, `normal`, `hover`, `active`, transparent variants), fill (`normal`, `hover`, `active`, `disabled`), border (`line`, `normal`, `active`, `focus`, `disabled`), and shadows.
- [ ] Specify semantic distinctions: `on-fill` contrast per fill and theme; surface layering versus elevation; alpha surfaces over real backgrounds; active versus keyboard focus; focus color versus ring width/offset.
- [ ] Decide color families, naming (`contrast-high` versus `high-contrast`, `normal-alpha` ordering, etc.), compatibility aliases/deprecations, light/dark behavior, and how runtime `applyTheme()` will remain in sync. Compare Product Design Sandbox with existing LittleBrand consumers before renaming tokens.
- [ ] Decide what counts as a public component, a compound component, and a block. Write down the npm-first distribution and versioning policy.

**Exit:** a reviewed component inventory, token specification, and migration matrix (old name → new name or unchanged); no breaking change lands by accident.

## Phase 1 — Make the foundation trustworthy (P0; depends on Phase 0)

- [ ] Make component metadata reflect actual public exports and implementation; fix or retire stale `.vue.d.ts` declarations. Ensure extracted defaults, slots, events, and examples are accurate.
- [ ] Separate authored guidance (purpose, when/not to use, accessibility, examples, related components) from mechanically extracted API facts. Define one versioned content source that can feed docs, Markdown, and MCP.
- [ ] Replace placeholder lint/typecheck scripts with working checks; add focused tests for token extraction, metadata/export parity, examples, package imports, and selected component interactions.
- [ ] Test light/dark, keyboard/focus, disabled/loading, and reduced-motion behavior for the first documented components. Fix known defects before promoting examples as agent-ready.

**Exit:** Button, Input, and Dialog have verified public APIs and runnable, documented examples; metadata checks catch missing exports and invalid examples.

## Phase 2 — Refine semantic tokens and components (P0/P1; depends on Phase 0)

- [ ] Apply the approved text/surface/fill/border/shadow specification in the kit and runtime theme generator, including text-on-fill and transparent surface variants where appropriate.
- [ ] Choose whether to retain explicit `[data-theme="dark"]`/`.dark` overrides or adopt `light-dark()` with a defined `color-scheme` contract. Preserve an explicit light/dark choice and a documented system-preference behavior; verify nested previews and overlays.
- [ ] Check contrast in both themes and over alpha surfaces. Audit components against semantic tokens rather than adding one-off colors.
- [ ] Provide compatibility aliases or a migration guide for renamed/removed public tokens. Treat removals or changed semantics as potential breaking changes.

**Exit:** representative components and a token explorer demonstrate each role and state in light and dark themes; runtime theme overrides and documented token names agree.

## Phase 3 — Documentation and agent discovery (P1; depends on Phases 1–2)

- [ ] Build a separate public documentation site with live Vue previews, copyable Vue examples, API and token references, accessibility notes, theming, and installation guides. Start with Button, Input, Dialog, and a compound component before expanding. A local preview exists (Step 11); the owner intends to place docs within the future multi-project seedtoshelves.com site, which is not built or deployed yet.
- [ ] Publish per-component Markdown plus a compact index for agents. Include intent, when/not to use, valid props/slots/events, dependencies, related items, and links back to the site.
- [ ] Refocus MCP on a short path: search by intent → retrieve one verified component/token reference → get install or theming instructions. Keep results concise by default; offer detail on demand. Remove or correct generic code generation that can return invalid examples.
- [ ] Validate tool answers against the same versioned content as the website and package. Keep bundled local stdio usable; evaluate a hosted read-only endpoint only if there is a clear need and an ownership/hosting plan.

**Exit:** a developer and an agent can independently find, install, and correctly use the same documented components without guessing APIs.

## Phase 4 — Optional Vue source registry and blocks (P2; depends on Phases 1–3)

- [ ] Prototype a registry contract for *Vue* source installation alongside npm: item identity, source files, dependency graph, required foundation tokens, versions, licenses, and update/conflict behavior. Research tool/CLI choice before committing to a format.
- [ ] Pilot Button, Input, and one composed block with install-and-update tests in a clean Vue + Vite consumer project; compare the maintenance cost against npm-only consumption.
- [ ] Document when to use npm versus copied source; ensure agents can retrieve the matching instructions. Expand only if the pilot is reliably maintainable.

**Exit:** a registry install works without undocumented setup, preserves accessibility/theme behavior, and has a defined upgrade story. Otherwise, keep the npm-first path.

## Phase 5 — Headless integration boundary (P2; parallel research, not a prerequisite)

- [ ] Describe how an external AI agent discovers capabilities and requests optional visual output without coupling its domain logic or tools to Vue.
- [ ] Define a small real use case where an agent chooses between a text/tool response and a LittleBrand-powered visual view; identify what, if anything, belongs outside the UI kit.
- [ ] Keep agent workflows, permissions, business actions, and application state in their own packages/applications. Add new LittleBrand integration points only after a concrete consumer demonstrates the need.

**Exit:** a documented integration example demonstrates optional UI, not a required UI runtime for headless applications.

## Releases, changelog, and workflow

1. Use this roadmap for planned work and checkboxes; use [`CHANGELOG.md`](../CHANGELOG.md) for **implemented, user-visible** work. Planning items are not claims of shipped functionality.
2. In the same PR as each user-visible change, update the `Unreleased` section under **Added**, **Changed**, **Fixed**, **Deprecated**, or **Removed**. State affected public components/tokens, installation paths, MCP behavior, and migrations as applicable. Keep internal research out of release notes.
3. Before release, verify docs/examples, npm consumption, relevant checks, and any MCP/registry deliverables that exist at that milestone. Move `Unreleased` entries under the released version/date; follow semantic versioning, with breaking token/API changes called out prominently.
4. Complete Phase 0 before locking a release number or promising a hosted MCP service, registry, or specific website framework. Ship useful phases incrementally rather than waiting for all phases to finish.

## Decisions still open

- Token naming and backwards-compatibility window; whether existing `--lb-*` names remain the primary public contract.
- Explicit theme overrides versus `light-dark()`; how runtime-generated palettes and system preference interact.
- Location and format of authored component documentation; site framework and hosting.
- Registry format/tooling, npm-versus-source-copy rules, and whether a remote MCP endpoint is worth operating.
- Scope of the first agent-facing headless integration, based on a real consumer rather than speculative framework features.
