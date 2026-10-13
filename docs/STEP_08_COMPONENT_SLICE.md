# Step 08 — verified component slice (Button, Input, Dialog, SegmentButton)

**Status:** merged to `develop` via PR #128 (3186a6c), based on Step 07 (#127). This is not a package release; no build, extraction or publication was run for Step 08.

## Supported contract

| Component | Props and defaults | Slots and events | Interaction / accessibility notes |
|---|---|---|---|
| `LbButton` | `variant`: `filled` (also `tonal`, `outline`, `ghost`, `link`); `color`: `primary` (all eight semantic families); `size`: `medium` (also `small`, `large`); `type`: `button` (also `submit`, `reset`). `disabled`, `loading`, `fullWidth`, `iconOnly`, `muted` default false; `iconPosition`: `leading` (also `trailing`); `href`, `to`, `target`, `rel` optional. No `tag` prop. | Optional default, `icon-leading`, `icon-trailing`; `click(event)` when enabled. | A native button is used by default; enabled `href` renders an anchor, enabled `to` requires a host Vue Router. Disabled/loading link destinations now render native disabled buttons instead of navigable anchors/router links. `iconOnly` requires an accessible name such as `aria-label`. Loading exposes `aria-busy`; icon-only trailing loading still displays its spinner. Warning variants no longer inherit a root-only light override when the effective theme is dark (a visible color change). |
| `LbInput` | `modelValue`: empty string (string/number accepted, string emitted); `type`: `text` (also `email`, `password`, `tel`, `url`, `search`); `size`: `medium` (also `large`; explicit size overrides density context); `disabled`, `readonly`, `invalid`, `required`, `clearable`, `loading`, `autofocus` default false; `id`, `placeholder`, `ariaDescribedby` optional. No `small` size. | Optional `icon-leading`, `icon-trailing`, `icon-password-show`, `icon-password-hide`, `icon-clear`, `icon-loading`; `update:modelValue(string)`, `input`, `change`, `focus`, `blur`, `clear`. | Provide a visible label or `aria-label`. Native attributes such as `name` and `autocomplete` now reach the input; class/style remain on its wrapper. Clear and password controls are unavailable while disabled/readonly; loading disables the native input. Invalid sets `aria-invalid`; focused inputs and controls have visible outlines at both supported sizes. |
| `LbDialog` | `modelValue`: false; `variant`: `default` or `fullscreen` (default `default`); `showClose`, `closeOnBackdrop`, `closeOnEscape` default true; optional `title`. | Optional default, `header`, `footer`; `update:modelValue(boolean)`, `open`, `close`. `close` fires on the component's close action, not on an external v-model assignment. | Body-teleported with originating theme scope. Supply `title` or `aria-label`/`aria-labelledby` to name the dialog. In default layout `title` is an accessible label; fullscreen renders its title in the header. The `header` slot displays only in fullscreen. Initial focus is on the dialog; Tab stays inside even without enabled controls, Escape/backdrop honor their props, and focus returns to the trigger on close. A custom `header` slot must provide its own visible heading; a title prop still supplies an accessible label if present. |
| `LbSegmentButton` + `LbSegmentButtonItem` | Root `modelValue`: optional string/number/array; `size`: `medium` or `large` (default `medium`), `width`: `full` or `auto` (default `full`), `color`: `primary` (or `secondary`, `tertiary`, `neutral`); `disabled`: false, `allowEmpty`: true, `multiSelect`: false. Child requires `value` (string/number), optionally `disabled` or `ariaLabel`. | Root default slot contains items; emits `update:modelValue` (scalar, array or undefined). Item default text and optional `icon` slots. No standalone item use. | Supply `aria-label` or `aria-labelledby` on the root and a text label or `ariaLabel` on icon-only items. Default optional selection uses a group of toggle buttons (`aria-pressed`); nonempty single-selection uses `radiogroup`/`radio` (`aria-checked`). Arrow/Home/End skip disabled items; mandatory single-selection radios use a selected roving Tab stop, arrows select the focused item, and an initially empty mandatory group itself remains keyboard reachable. Multi-select emits an array or undefined when empty. |

`LbButton`, `LbInput`, `LbDialog`, `LbSegmentButton`, and `LbSegmentButtonItem` already appear in both public exports (`src/index.js` and `src/components/index.ts`); no export paths or token names were added. Their `.vue.d.ts` component types now preserve strict props **and** expose slot/event signatures (including required child `value`). The source fixture `tests/fixtures/VerifiedSlice.vue` is typechecked and mounted; the matching Vue usage is:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LbButton, LbInput, LbDialog, LbSegmentButton, LbSegmentButtonItem } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'
const name = ref('')
const choice = ref<string | number>('daily')
const open = ref(false)
</script>

<template>
  <LbButton @click="open = true">Open preferences</LbButton>
  <LbInput v-model="name" name="displayName" aria-label="Display name" clearable required />
  <LbSegmentButton v-model="choice" :allow-empty="false" aria-label="Frequency">
    <LbSegmentButtonItem value="daily">Daily</LbSegmentButtonItem>
    <LbSegmentButtonItem value="weekly">Weekly</LbSegmentButtonItem>
  </LbSegmentButton>
  <LbDialog v-model="open" title="Preferences">
    <p>Choose when to receive updates.</p>
    <template #footer><LbButton @click="open = false">Done</LbButton></template>
  </LbDialog>
</template>
```

## Verification and remaining boundaries

`npm run lint`, `npm run typecheck` (including strict Bundler/NodeNext consumer declarations and the Vue fixture), `npm test` (27 focused tests), `npm run test:browser` (Chromium, light/dark and reduced-motion samples), and `git diff --check` passed on this branch. The component browser fixture mounts the typed Vue example, checks Dialog focus containment/restore with and without controls, Input icon placement and focus style, and reduced-motion duration. This is **not** a WCAG certification: more combinations (overlapping Dialogs, unusual consumer CSS, forms, router-link hosts, screen readers, other browser engines and mobile/touch) remain to be tested.

The generated MCP data in `mcp-server/src/data/components.ts` still uses generic examples and is **not** promoted as verified reference for these components: the extractor currently suggests `variant="filled"` on Dialog and emits an isolated `LbSegmentButtonItem`. Step 09 authors and tests a separate reference for this slice and updates the extractor to use it in a future extraction; the existing generated MCP data has not been refreshed. No Step 08 build or extraction has run; any future release requires separately authorized artifact verification from its exact commit. The Step 05 MCP dependency audit findings remain open.
