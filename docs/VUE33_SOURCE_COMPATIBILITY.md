# Restoring the Vue 3.3 source contract

## Changes

The kit retains public Vue peer `^3.3.0`; development Vue/compiler remain 3.5.44. Two concrete source conflicts were fixed:

- `@vueuse/core` 13.8 requires Vue `^3.5.0`. The kit only used its scroll lock in Dialog and BottomSheet. Removed that dependency instead of downgrading to an older VueUse or silently raising the kit's Vue minimum. `src/utils/body-scroll-lock.ts` now owns the body overflow lock per overlay, shares ownership per body, restores the prior axes on last release, and cleans up on scope disposal. A shared touch guard prevents background/edge scroll chaining while allowing inner scrolling and pinch zoom. Initially open overlays also acquire the lock. This does not introduce a public composable export.
- Vue 3.3.0 does not export `PublicProps` or `EmitsToProps`. Seven declarations now use internal compatibility aliases composed from Vue 3.3's public types. Prop/event/slot signatures are unchanged. The existing positive and negative declaration fixtures pass without `skipLibCheck` against **3.3.0**.

## Reproduce without building

Install isolated **test host** dependencies; do not install Vue 3.3 into the repo or release lockfiles:

```sh
fixture="$(mktemp -d /tmp/lb-vue330.XXXXXX)"
npm install --prefix "$fixture" --ignore-scripts --no-package-lock --no-save --no-audit --no-fund \
  vue@3.3.0 @vue/compiler-sfc@3.3.0 typescript@5.9.3 vue-tsc@3.3.13
VUE_COMPAT_NODE_MODULES="$fixture/node_modules" npm run test:vue-compat
rm -rf "$fixture"
```

`tests/check-vue-source-compat.mjs` copies source/declarations and the existing consumer type fixtures into a disposable directory whose only `node_modules` is the supplied host. It runs strict no-emit `vue-tsc` over source and `tsc` over the root-export declaration fixtures in Bundler and NodeNext modes, all with `skipLibCheck=false`. This checks copied source/declarations, **not** an installed LittleBrand package or built artifact.

`tests/browser-overlay-scroll.mjs` uses the supplied host Vue runtime and matching compiler with repository source. In desktop and mobile-emulated Chromium it checks initially open Dialog + BottomSheet, closing one while the other remains locked, sheet content scrolling while background wheel scrolling is locked, final-close restoration and unmount cleanup. It also runs with development Vue as part of `npm run test:browser`. Unit checks cover idempotent acquisition, separate prior overflow axes, overlapping owners, scope disposal, touch scroll boundaries, pinch zoom and no-document safety.

## Evidence and boundaries

Vue **3.3.0** and **3.5.44** passed strict copied-source/declaration checks and the overlay probes. Current development lint, source/consumer/site/MCP no-emit checks, 48 unit tests, source stdio, reference freshness, browser theme/components/site and six kit-directed agent SFC probes passed. The original two wrapper probe from #141 remains a separate Vue **3.3.13** historical result; neither its evidence nor the original agent answers were rewritten.

This addresses the identified dependency and declaration conflicts, not exhaustive compatibility of every interaction on every supported version. No installed-kit consumer, real iOS Safari scroll/touch behavior, cross-engine accessibility, publication, metadata extraction, MCP compilation, production build, or exact-release artifact was tested. Old published npm 0.8.3 and tracked `mcp-server/dist/` are unchanged. Vue 3.3.0 is a historical compatibility host, **not a recommendation that applications use an unpatched old Vue version**; applications should use a current patched Vue where possible.
