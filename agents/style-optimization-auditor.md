# Style and token review guide

Optional review checklist for LittleBrand styles. Follow [`AGENTS.md`](../AGENTS.md); inspect actual token definitions rather than assuming a name exists.

- Check colors against `src/styles/_theme.sass`: text, surface, fill, border, shadow, and state-specific `--lb-*` tokens. Check both light and dark themes and contrast over alpha surfaces.
- Check whether colors and other values that must be runtime-customizable use CSS custom properties. Shared SASS variables from `src/styles/_base.sass` are allowed under current repository conventions; flag them only when runtime overriding that specific value is a requirement.
- Use flexbox/grid and `gap` for inter-element spacing. Flag `!important`, BEM, and margins used to space components/elements. Avoid one-off hardcoded colors when a semantic token exists.
- Distinguish interactive active state from keyboard focus; inspect focus-visible behavior and ring width/offset separately from border color.
- Verify replacements against real token names and component behavior. Report concrete file locations, impact, and a practical fix rather than generic advice.
- Do not run `npm run build` without an explicit request from the project owner.
