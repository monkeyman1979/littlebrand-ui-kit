# Vue UI kit component guide

Optional checklist for creating or changing LittleBrand components. Follow the repository's [`AGENTS.md`](../AGENTS.md); this is guidance, not an instruction to launch a particular model or tool.

1. Inspect a comparable component, its `.vue.d.ts` declaration, and both public export paths before editing.
2. Use Vue 3 Composition API and TypeScript, Pug templates, semantic HTML, and indented SASS. Preserve accessibility, keyboard behavior, disabled/loading states, and reduced-motion behavior where relevant.
3. Prefer `--lb-*` semantic color tokens; verify names in `src/styles/_theme.sass`. For sizing and spacing, use existing CSS tokens or appropriate shared SASS variables. Use grid/flex and `gap`, not margins for inter-element spacing; no BEM or `!important`.
4. Keep props, defaults, slots, emits, `.vue.d.ts`, usage examples, `src/components/index.ts`, and `src/index.js` consistent. Check whether compound pieces are public or internal.
5. Review light/dark and runtime theme behavior, focus visibility, and keyboard interaction. Record user-visible changes in `CHANGELOG.md`.
6. Do not run `npm run build` without an explicit request from the project owner.
