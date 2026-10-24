# Vue 3.3 minimum-peer source fixture check

**Checkpoint:** `develop` at `aeab46a` (PRs #139 and #140 merged). The kit declares Vue peer `^3.3.0`. The two original kit-directed answers in [the six-intent trial](MCP_AGENT_KIT_DIRECTED_TRIAL.md) used `defineModel()` (Vue 3.4+). [The follow-up agent trial](VUE33_AGENT_COMPAT_RETRIAL.md) preserved the original answers and recorded two *new*, explicit `modelValue` / `update:modelValue` wrappers. This check validates only those two new primary SFCs against a Vue 3.3 runtime/compiler.

## Reproducible source-only probe

With repo development dependencies already present, install the *test host's* dependencies in a disposable directory, not in the kit or its lockfiles:

```sh
fixture="$(mktemp -d /tmp/lb-vue33-source.XXXXXX)"
npm install --prefix "$fixture" --ignore-scripts --no-package-lock --no-save --no-audit --no-fund \
  vue@3.3.13 @vue/compiler-sfc@3.3.13 pug@3.0.3 sass@1.89.2
VUE33_NODE_MODULES="$fixture/node_modules" node tests/browser-agent-vue33.mjs
```

`tests/browser-agent-vue33.mjs` reads the **unaltered first Vue code block** for each intent from `docs/VUE33_AGENT_COMPAT_RETRIAL.md`. It parses/compiles each script with `@vue/compiler-sfc` 3.3.13, then mounts the SFCs with a temporary Vite development fixture using that compiler and Vue 3.3.13 at runtime. Root component/CSS imports are aliased to this repo's **source**, not to tracked MCP `dist/` or an installed LittleBrand package; the source `@/` alias is retained. Pug/Sass are test-host preprocessors. Fixtures are removed after the probe.

**Observed:** both SFCs compiled and rendered with Vue 3.3.13. Confirmation opened a named dialog, emitted one confirm, and closed on Cancel; frequency exposed a labeled radio group and selected Weekly via ArrowRight with one update. No browser exceptions or console errors were observed. The runner exited successfully.

**Boundary:** This is a narrow source-fixture interaction check, **not** an installed-kit consumer or exact-release-artifact test. It does not establish every component's Vue 3.3 compatibility, TypeScript library checking against Vue 3.3, other browsers, screen-reader support, or the published npm 0.8.3/old MCP CLI behavior. The earlier source-aliased `vue-tsc` test used the repo's Vue 3.5 dependencies; this probe adds Vue 3.3 compiler/runtime evidence but is not a strict Vue 3.3 typecheck. No production build, component/token extraction, publication, hosting, or `main` merge was performed.
