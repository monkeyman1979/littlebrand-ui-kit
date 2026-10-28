# Vue 3.3 wrapper compatibility — source agent retrial

**Context:** [Six-intent kit-directed source trial](MCP_AGENT_KIT_DIRECTED_TRIAL.md) (PR #139) produced two primary Vue SFCs using `defineModel()` for Dialog and SegmentButton wrappers. [Vue documents](https://vuejs.org/api/sfc-script-setup.html#definemodel) that this macro requires Vue 3.4+, while the kit declares peer `^3.3.0`. This follow-up keeps the peer minimum unchanged and adds explicit Vue 3.3 wrapper guidance to the authored reference and `lb_setup`. It does **not** rewrite PR #139's captured answers.

**Method:** Fresh Claude Code (Haiku) conversations, same user requests as PR #139, with only the source stdio MCP tools available; no component names, props, or tools prescribed. Results are stochastic, not proof that the guidance alone caused the change. Successful retrieved IDs reported `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`.

**Validation:** Both exact primary Vue SFCs below contain explicit `modelValue` / `update:modelValue` bindings and no `defineModel`. They passed source-aliased `vue-tsc --noEmit` with `strict: true` and the repository's `skipLibCheck: true`. In a temporary Vite/Chromium source fixture, confirmation opened, emitted one confirm, and closed on Cancel; frequency exposed a labeled radio group and moved from Daily to Weekly by ArrowRight with one update. Temp files were removed. This verifies those interactions under the installed Vue 3.5 environment; it is **not** a Vue 3.3 installed-consumer, published-package, release-artifact, dark-mode or broad accessibility certification. No production build, component/token extraction, publication or deployment occurred.

## Confirmation

**User request (exact):** I need a Vue 3 UI for a confirmation before deleting an item. Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Actual tool calls:**
- `lb_setup` `{}`
- `lb_search` `{"query":"confirmation dialog","limit":5}`
- `lb_search` `{"query":"button","limit":5}`
- `lb_get` `{"id":"component:LbDialog","detail":"full"}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`
- `lb_get` `{"id":"token:--lb-surface-overlay"}`
- `lb_setup` `{}`
- `lb_search` `{"query":"source entry exports","limit":1}`

**Retrieved IDs:** `component:LbDialog`, `component:LbButton`, `token:--lb-surface-overlay`.

**Exact final agent answer (unaltered):**

~~~~text
I can't read the repo's `src/index.js` from this session (only the LittleBrand reference tools are available), so the source-alias step below is unverified against your checkout.

## Component: `DeleteConfirmDialog.vue`

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { computed } from 'vue'
import { LbButton, LbDialog } from 'littlebrand-ui-kit'

const props = withDefaults(defineProps<{
  modelValue: boolean
  itemName?: string
  loading?: boolean
}>(), {
  itemName: '',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const title = computed(() => props.itemName ? `Delete ${props.itemName}?` : 'Delete item?')

function cancel() {
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm')
}
</script>

<template lang="pug">
LbDialog(
  :modelValue="modelValue"
  :title="title"
  :closeOnBackdrop="false"
  @update:modelValue="emit('update:modelValue', $event)"
)
  p This action cannot be undone.
  template(v-slot:footer)
    LbButton(variant="outline" color="neutral" :disabled="loading" @click="cancel") Cancel
    LbButton(color="error" :loading="loading" @click="confirm") Delete
</template>

<style lang="sass" scoped>
</style>
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import DeleteConfirmDialog from './DeleteConfirmDialog.vue'

const confirmOpen = ref(false)
const deleting = ref(false)

async function removeItem() {
  deleting.value = true
  try {
    // your delete call here
    confirmOpen.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<template lang="pug">
LbButton(color="error" variant="tonal" @click="confirmOpen = true") Delete item
DeleteConfirmDialog(
  v-model="confirmOpen"
  item-name="Quarterly report"
  :loading="deleting"
  @confirm="removeItem"
)
</template>
```

## Choices I made

- **`LbDialog`** for the modal, with `LbButton` for actions, per the reference's guidance.
- **Backdrop click is disabled** (`closeOnBackdrop=false`) so a stray click can't dismiss the prompt. Escape and the close button still cancel.
- **Delete uses `color="error"`** and **Cancel is `outline`**, so the destructive action is visually distinct.
- **Loading** locks the Delete button while the parent awaits the request, and Cancel is disabled during that time.
- **`modelValue` / `update:modelValue`** instead of `defineModel`, because the reference says the Vue 3.3 peer range can't use `defineModel`.
- The `<style>` block is empty because the dialog and buttons already handle layout and theming. Add spacing with flex/grid `gap`, not margins.

## Setup for testing the source

1. **Dependencies in your app:** `vue@^3.3`, `pug`, and `sass`. The Pug and Sass packages are needed for `lang="pug"` and `lang="sass"`.
2. **Point the import at the repo source** instead of the npm package. In your `vite.config.ts`, add an alias to this repo's entry. I haven't verified the exact path, so check that `src/index.js` exports `LbDialog` and `LbButton`:
   ```ts
   import { fileURLToPath, URL } from 'node:url'
   export default defineConfig({
     resolve: {
       alias: {
         'littlebrand-ui-kit': fileURLToPath(new URL('../littlebrand-ui-kit/src/index.js', import.meta.url)),
       },
     },
   })
   ```
   Adjust the relative path to where your app sits next to the repo.
3. **CSS:** the `import 'littlebrand-ui-kit/style.css'` line won't resolve through that alias. Either import the repo's `src/styles` entry directly for testing, or switch to the published package for the CSS.
4. **Verify:** this component is not compiled or run here; I was not asked to build, and `npm run build` is off-limits without explicit request. Test it in a dev server.
~~~~

## Frequency

**User request (exact):** I need a Vue 3 UI for a way to choose how often to receive updates (daily or weekly). Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Actual tool calls:**
- `lb_setup` `{}`
- `lb_search` `{"query":"segment button selection toggle","limit":5}`
- `lb_search` `{"query":"radio group choice form","limit":5}`
- `lb_get` `{"id":"component:LbSegmentButton","detail":"full"}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`

**Retrieved IDs:** `component:LbSegmentButton`, `component:LbButton`.

**Exact final agent answer (unaltered):**

~~~~text
Here's a self-contained picker that uses `LbSegmentButton` in mandatory mode, so one option is always selected. It uses `modelValue` and `update:modelValue` rather than `defineModel`, which keeps it compatible with the Vue `^3.3.0` peer range.

**`FrequencyPicker.vue`**

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { computed } from 'vue'
import { LbSegmentButton, LbSegmentButtonItem } from 'littlebrand-ui-kit'

type Frequency = 'daily' | 'weekly'

const props = withDefaults(defineProps<{ modelValue?: Frequency }>(), {
  modelValue: 'daily'
})
const emit = defineEmits<{ 'update:modelValue': [value: Frequency] }>()

const frequency = computed<Frequency>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value as Frequency)
})

const summary = computed(() =>
  frequency.value === 'daily'
    ? 'You will receive one update each day.'
    : 'You will receive one update each week.'
)
</script>

<template lang="pug">
section
  span#update-frequency-label Update frequency
  LbSegmentButton(
    v-model="frequency"
    :allow-empty="false"
    aria-labelledby="update-frequency-label"
  )
    LbSegmentButtonItem(value="daily") Daily
    LbSegmentButtonItem(value="weekly") Weekly
  p(role="status")= summary
</template>

<style lang="sass" scoped>
section
  display: flex
  flex-direction: column
  gap: 8px
</style>
```

**Usage**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import FrequencyPicker from './FrequencyPicker.vue'

const frequency = ref<'daily' | 'weekly'>('daily')
</script>

<template>
  <FrequencyPicker v-model="frequency" />
  <p>Current choice: {{ frequency }}</p>
</template>
```

**Setup notes**

- **Source, not npm:** The reference's tested example imports `LbSegmentButton` and `LbSegmentButtonItem` from `littlebrand-ui-kit` and the CSS from `littlebrand-ui-kit/style.css`. Deep imports aren't supported, so to test the repo source, alias `littlebrand-ui-kit` in `vite.config` to the repo's `src/index.js` (and the CSS to the matching source stylesheet). I haven't verified that alias, and I didn't run `npm run dev` or any build.
- **Pug and SASS:** Pug needs the `pug` package and SASS needs `sass` in the host project. Both are standard Vite dependencies, but check that they're installed.
- **Single instance:** The label uses a fixed id, `update-frequency-label`. If you render several pickers on one page, give each its own id.
- **Spacing:** I used a literal `gap: 8px` because I couldn't confirm the kit's spacing token names from the reference. If you want kit-consistent spacing, swap in a `--lb-*` spacing token after checking `TOKENS.md`.
- **Accessibility:** Because `allow-empty` is `false`, the group uses radio semantics with arrow-key navigation. The status message is a `role="status"` live region, so screen readers announce the change.
~~~~
