# LittleBrand contributor and agent guidance

This file is tool-agnostic guidance for anyone working on this repository. See [`docs/ROADMAP.md`](docs/ROADMAP.md) for planned work and [`CHANGELOG.md`](CHANGELOG.md) for shipped changes. Optional task guides live in [`agents/`](agents/); they are not required automation or a reason to delegate work without authorization.

## Working agreements

- Work on a feature branch; open a PR against `develop` before merging. Do not bypass required reviews or checks.
- Do **not** run or suggest `npm run build` unless the project owner asks for a build. Builds run extraction and MCP compilation as part of the release process.
- Update `CHANGELOG.md` in the same PR as a user-visible change. Keep planned work in the roadmap and label migrations/breaking changes clearly.
- Do not add `!important`, BEM class names, or margins to space components/elements. Use flexbox or CSS grid with `gap` for spacing.
- Use the existing semantic `--lb-*` CSS tokens for colors and runtime customization. Use existing `base.$` SASS variables or `--lb-*` sizing/spacing tokens where appropriate; do not invent token names. Treat token changes as public API changes.
- Keep visual components independent of agent runtimes and application business logic. Vue + Vite/npm are the current distribution baseline; the source registry and hosted MCP are proposals, not existing features.

## Codebase

- Vue 3 Composition API with TypeScript; Pug templates and indented SASS (`<style lang="sass" scoped>`). Prefer semantic HTML and accessible keyboard/focus behavior.
- Components: `src/components/`; public exports: `src/index.js` and `src/components/index.ts`. Check both when adding/changing a public component.
- Design tokens and dark-theme overrides: `src/styles/_theme.sass`; primitives: `src/styles/_colors.sass`; shared sizes/spacing: `src/styles/_base.sass`; typography: `src/styles/_typography.sass`.
- Runtime theme generation: `src/utils/color-generator.js`; examples: `examples/App.vue`.
- MCP server: `mcp-server/src/index.ts`; generated metadata: `mcp-server/src/data/`; extraction: `scripts/extract-components.js` and `scripts/extract-tokens.js`. `.vue.d.ts` declarations drive component extraction and must be checked against the actual implementation. Existing metadata may be incomplete; verify before documenting props or defaults.
- Form components use `v-model` where appropriate; support disabled, invalid, and required states as applicable. Review slots for actual content and keep `.vue.d.ts` props, slots, and emits in sync.

## Commands (run only when appropriate)

- `npm run dev` — local Vite demo.
- `npm run extract` — regenerate token/component metadata and sync versions; writes files.
- `npm run build:mcp` — compile MCP server (the script installs its dependencies).
- `npm run build` — production build; **only when explicitly requested**.
- `npm run lint` — ESLint over source, scripts, tests and site.
- `npm run typecheck` — source Vue/TypeScript plus strict Bundler/NodeNext declaration fixtures; `npm run typecheck:site` checks the local docs app.
- `npm test`, `npm run test:mcp`, `npm run test:browser`, `npm run test:site` and `npm run reference:check` — non-release source checks. Optional `npm run test:vue-compat` needs isolated host dependencies; see `docs/VUE33_SOURCE_COMPATIBILITY.md`.
- Use a security-patched supported Node runtime: `^22.23.4 || ^24.22.1 || ^26.12.1` in both manifests. `.node-version` pins 22.23.4 and `.npmrc` enables engine-strict; the MCP also checks its runtime. A clean npm audit is not a Node runtime security check. Recheck official Node advisories before changing these floors or adding a major. TypeScript stays on 6.0.x while the lint stack requires `<6.1`; do not force TypeScript 7.

## Optional task guides

- [`agents/vue-ui-kit-developer.md`](agents/vue-ui-kit-developer.md) — component implementation checklist.
- [`agents/style-optimization-auditor.md`](agents/style-optimization-auditor.md) — styling/token review checklist.
