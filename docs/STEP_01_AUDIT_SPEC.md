# Step 01 spec: public-surface triage audit

**Status:** ready for execution. This is the first work package in [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md). It is a **read-only investigation of product code**, not a component, token, MCP, or packaging fix. Its purpose is to give the owner enough evidence to decide the semantic-token and compatibility contract in Step 02.

## Goal and output

Create one reviewable audit report at `docs/audits/01-public-surface.md`. Inventory what the checkout *claims to expose*, identify the most consequential mismatches, and separate verified facts from matters requiring a build, browser test, or consumer project. The report should be short enough to make decisions from; do not attempt to document every prop on every component.

## Scope and method

1. **Starting state.** Read `AGENTS.md`, `docs/ROADMAP.md`, and `docs/EXECUTION_PLAN.md`. Note the current branch/commit and working-tree status. Existing uncommitted planning files are intentional; do not overwrite or discard them. Use a dedicated feature branch before committing any audit report.
2. **Public component inventory.** Use `src/index.js` (named exports and plugin registration) and `src/components/index.ts` as the entry-point candidates. Compare their names with component `.vue` files, `.vue.d.ts` files, and `mcp-server/src/data/components.ts`. Count separately: exported components, public compound components, non-component exports, internal-only `.vue` files, declaration files, and MCP records. Do **not** infer public component counts from raw file totals. Make a compact table with one row per public component or compound piece: name, category (standalone/compound), exported, registered in plugin (yes/no/not applicable), declaration (yes/no), MCP entry (yes/no), and notable discrepancy. List internal-only files and non-component exports separately.
3. **API spot checks, not full prop audit.** Inspect `LbButton`, `LbInput`, `LbDialog`, and one compound component of your choice. Compare implementation, declarations, MCP props/slots/emits/defaults, and generated usage with at least one example or README claim where available. Record representative issues with exact file/line evidence. Confirm or refute the leads in `EXECUTION_PLAN.md` (Input `small`, Dialog `filled`, generic Button usage); do not simply repeat them as verified findings.
4. **Token/theme inventory.** Identify the public semantic token families in `src/styles/_theme.sass` (text, surface including alpha, fill, border, shadows), color families, and the light/dark mechanism. Compare *representative* token names and palette-step mappings with `src/utils/color-generator.js` (`generateSemanticTokens`, `applyTheme`) and `scripts/extract-tokens.js`/`mcp-server/src/data/tokens.ts`. Confirm or refute the leads about surface step mappings, generated base/alpha/inverse tokens, and `data-theme` versus `.dark` detection. Summarize families and key divergences; do not list hundreds of tokens in the report.
5. **Distribution and verification gaps.** Inspect `package.json`, `vite.config.js`, `mcp-server/package.json`, and the current docs for declared entry points, TypeScript exposure, CSS imports, bundled MCP, placeholder scripts, and claims that cannot be verified by static inspection. Do not label a package behavior broken solely because a `types` field is absent; mark it **unverified** until a consumer test.
6. **Triage.** Rank the top 5–10 findings by impact on npm consumers, visual correctness, AI-generated code, or maintenance. For each, name the evidence, impact, confidence (verified by source / needs runtime validation), and the numbered follow-up work package in `EXECUTION_PLAN.md`. End with 3–5 decisions or questions for the owner before Step 02.

## Report format

`docs/audits/01-public-surface.md` should have these sections:

- **Executive summary:** counts with denominators and limitations; top three risks; recommended immediate next step.
- **Scope and method:** checkout reference and read-only commands/inspection; explicitly state no build, runtime, published-tarball, accessibility, or full per-prop verification if those were not performed.
- **Public surface matrix:** one row per exported component/compound piece, plus internal-only and non-component exports in separate lists. State how duplicates/compound pieces were counted.
- **Token and theme matrix:** family, static source, runtime generation coverage, representative differences, unknowns.
- **Prioritized findings:** file and line references, evidence, impact, confidence, proposed work package; avoid asserting untested behavior as fact.
- **Owner decisions and next PR:** short recommendation for Step 02 and any issues that should move earlier in the plan.

## Acceptance criteria

- Every public component name from both export files is accounted for; counts of `.vue`, `.vue.d.ts`, MCP records, and exported names are clearly distinguished.
- At least four representative components (including a compound component) and the five semantic color families are spot-checked.
- The known leads above are verified/refuted with direct evidence, and uncertain runtime/package claims are labeled **unverified**.
- Findings are prioritized with explicit next steps; report stays a triage document, not an exhaustive API encyclopedia.
- No product files, generated data, package versions, or token names are changed. No `npm run build`, `npm run extract*`, `npm run build:mcp`, `npm install`, publication, browser automation, or scripts that write files are run. Simple read-only shell inspection is fine. `git diff --check` may be used on the report changes.
- Work stops after preparing the report and a concise summary. Do not merge or publish without an explicit request. Do not update `CHANGELOG.md` for findings alone; it records implemented user-visible changes.

## Out of scope

Complete per-prop verification across all components, test harness implementation, fixing mismatches, choosing new token names, rewriting theming, new MCP tools, website/registry architecture, consumer-build verification, release/version bump, and a definitive accessibility certification. Those belong to later work packages.
