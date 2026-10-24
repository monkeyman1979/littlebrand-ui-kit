# Zod 4 source MCP compatibility — 2026-10-24

**Scope:** separate major **dependency migration**, on a feature branch based on the merged [security lockfile refresh](SECURITY_LOCKFILE_REFRESH.md). Both root and bundled `mcp-server/` direct dependencies now declare `zod ^4.6.7`, with separate lockfiles resolving 4.6.7. The maintained `@modelcontextprotocol/sdk` **v1.32.2** explicitly peers Zod `^3.25 || ^4.0`, and the MCP package retains Node `>=18`. No MCP SDK v2 or public Vue peer-range migration is included.

Zod 4 changes validation semantics (including defaults and safe integers). This server's two input schemas use a trimmed string, bounded safe integer with default 4, an enum defaulting to `summary`, and a no-input setup tool. No server schema source change was needed: the following **actual source stdio protocol** checks passed with independently clean root and MCP installs:

- `listTools` still advertises all three tools, with JSON Schema constraints and defaults for `lb_search` and `lb_get`.
- Omitted `limit` matches an explicit `limit: 4`; omitted `detail` returns a summary, not the full code example.
- Too-short search text, zero and unsafe-integer limits, and an unknown detail enum return validation errors without executing the tool body.
- All six intent searches and full exact-reference Vue example lookups still pass; root and MCP no-emit TypeScript checks, root lint, 42 unit tests, reference freshness, browser theme/component/site and six kit-directed source SFC checks also pass.

The `tests/mcp-stdio.mjs` and `tests/dependency-contract.test.js` guards cover these behaviors and both pinned dependency floors. After clean installs via `npm ci --ignore-scripts --no-fund --no-audit` in both directories, read-only `npm audit --json --package-lock-only --ignore-scripts` and `--omit=dev` each reported **zero findings** for root and MCP at this snapshot (previously one high Zod finding per lockfile in each mode). Audit counts may change and are not proof of absence of exploitable behavior.

**Boundary:** These are unreleased **source and lockfile** checks only. They do not test the published npm 0.8.3 package, old tracked MCP `dist/`, an installed-kit Vue 3.3 consumer, Node 18 runtime execution, or the eventual exact release artifact. No extraction, MCP compilation, production build, tarball creation, publication, deployment, or `main` merge was done. The existing `@vueuse/core` 13.8 Vue `^3.5.0` peer mismatch against the kit's advertised Vue `^3.3.0` remains a separate compatibility decision.
