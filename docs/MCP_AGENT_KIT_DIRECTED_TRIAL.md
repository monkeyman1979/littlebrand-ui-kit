# Six-intent kit-directed source MCP agent trial

**Source checkpoint:** `develop` merge `817cfc7` (PRs #136–#138 merged). Fresh, nonpersistent Claude Code (Haiku) conversations with only the source stdio MCP tools available; each prompt asks for the unreleased LittleBrand kit, without naming components, props, tools, or code. The six original unconstrained answers remain unchanged in [the baseline evidence](MCP_AGENT_TRIAL_EVIDENCE.md); the one-prompt form retrial is [separate](FORM_SUBMISSION_AGENT_RETRIAL.md). These are *agent choices*, not manually retrieved examples. The source reference advertises packageVersion 0.8.3 but explicitly says it is unreleased, **not** the published 0.8.3 CLI or tracked `mcp-server/dist/`. No release artifact, build, extraction, npm publication, main merge or docs deployment was involved.

**Collection method:** each run used an isolated source stdio MCP config and disabled the agent's built-in file/command tools. Below are verbatim user requests, tool names/arguments, retrieved IDs, and **unaltered final answers**; the first `vue` code block in each answer is the primary SFC for validation. Agent claims inside quoted answers are evidence, not certification. Raw local event streams were checked when transcribing this document.

**Observation:** all six agents chose the kit in their primary answer, instead of four native-only answers in the earlier unconstrained baseline. This changed both the prompt constraint and the source FormField reference, so the difference is not an isolated causal test of either change.

## Source-fixture validation

The **unaltered first Vue SFC from each answer** passed source-aliased `vue-tsc --noEmit` (`strict: true`, repository baseline `skipLibCheck: true`). `node tests/browser-agent-kit-directed.mjs` then loaded those exact SFCs in temporary Vue+Vite source fixtures with root/CSS imports aliased to current source, ran headless Chromium in a light-scheme context, and removed the fixtures. All **6/6** rendered and passed one targeted core interaction without browser exceptions:

| Intent | Interaction checked |
|---|---|
| Save | Empty name shows an error; a valid submit calls the host's async save callback **once** with the trimmed name and displays success. |
| Email | Empty submit shows an error; valid submit emits one email. |
| Multiline notes | Empty submit shows an error; valid submit emits one note, not two. |
| Labeled error field | Label targets the control, error is linked through `aria-describedby` and `aria-invalid`, and entering a value restores the hint. The parent supplied validation state. |
| Confirmation | Accessible dialog opens, Delete emits one confirmation, and Cancel closes it. |
| Frequency | Mandatory selection exposes radio semantics; ArrowLeft selects Daily from Weekly and emits one update. |

This is a **6/6 kit-directed source trial pass for the measured interactions on the repo's installed Vue 3.5**, not a full supported-version or release gate. In particular, the confirmation and frequency answers use Vue's `defineModel()` macro, which [Vue documents as available only in 3.4+](https://vuejs.org/api/sfc-script-setup.html#definemodel), while this kit's declared Vue peer range starts at `^3.3.0`. Those exact answers therefore require a newer Vue/compiler than the advertised minimum; they were **not** validated on Vue 3.3. A follow-up agent/code-compatibility decision is needed before claiming a pass for the whole public contract. The probe also does not verify optional secondary snippets, dark-mode styling, screen readers, all states, an installed npm package, the old tracked MCP `dist/`, or an exact future release artifact. The earlier unconstrained baseline remains a genuine failing snapshot, not something this result retroactively makes green.

## Save

**User request (exact):** I need a Vue 3 UI for an action to save edits. Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Tool calls (in order):**
- `lb_setup` `{}`
- `lb_search` `{"query":"save action button form submit","limit":5}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`
- `lb_get` `{"id":"component:LbInput","detail":"full"}`
- `lb_get` `{"id":"component:LbFormField","detail":"full"}`

**Retrieved IDs:** `component:LbButton`, `component:LbInput`, `component:LbFormField`. Successful retrievals reported `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`.

**Exact final agent answer:**

~~~~text
I'll build this on `LbFormField`, `LbInput`, and `LbButton` with `type="submit"`. That's the pattern the kit's source reference recommends for forms. The component owns the saving, error, and saved states, so the parent only supplies an async save function.

**`ProfileNameForm.vue`**

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { LbFormField, LbInput, LbButton } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

const props = withDefaults(defineProps<{
  initialName?: string
  onSave: (value: { name: string }) => Promise<void>
}>(), {
  initialName: '',
})

const name = ref(props.initialName)
const validationError = ref('')
const saving = ref(false)
const saveError = ref('')
const saved = ref(false)

// Editing again clears the previous "saved" confirmation
watch(name, () => {
  saved.value = false
})

async function onSubmit() {
  if (saving.value) return

  const value = name.value.trim()
  validationError.value = value ? '' : 'Name is required'
  if (validationError.value) return

  saving.value = true
  saveError.value = ''
  saved.value = false

  try {
    await props.onSave({ name: value })
    saved.value = true
  } catch (error) {
    saveError.value = error instanceof Error ? error.message : 'Could not save changes. Try again.'
  } finally {
    saving.value = false
  }
}
</script>

<template lang="pug">
form(novalidate @submit.prevent="onSubmit")
  LbFormField(
    label="Name"
    hint="This is shown on your profile."
    :error="validationError"
    required
  )
    LbInput(
      v-model="name"
      name="name"
      autocomplete="name"
      required
      :invalid="Boolean(validationError)"
      :loading="saving"
    )

  LbButton(type="submit" :loading="saving") Save changes

  p(v-if="saveError" role="alert") {{ saveError }}
  p(v-else-if="saved" role="status") Changes saved.
</template>

<style lang="sass" scoped>
form
  display: flex
  flex-direction: column
  gap: 1rem
  max-width: 28rem
</style>
```

**Usage**

```vue
<script setup lang="ts">
import ProfileNameForm from './ProfileNameForm.vue'

async function saveName({ name }: { name: string }) {
  const res = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Could not save changes. Try again.')
}
</script>

<template>
  <ProfileNameForm initial-name="Ada Lovelace" :on-save="saveName" />
</template>
```

**Setup for testing the source**

- The kit's source reference shows the npm import (`import { LbButton } from 'littlebrand-ui-kit'` plus `littlebrand-ui-kit/style.css`). For an unreleased source checkout, point that package name at your local source with a Vite alias, for example `'littlebrand-ui-kit': '<repo>/src/index.js'`. I could not read the repo files, so I have not confirmed the exact entry path or the CSS path for the source checkout. Check `examples/App.vue` for how the demo imports the kit and match it.
- Then run `npm run dev` for the local demo. I have not run anything. Per `AGENTS.md`, don't run `npm run build` unless the project owner asks for it.

**Choices I made**

- `LbFormField` supplies the label, the hint, and the generated ID that connects the label to the input. The field's `error` prop shows the validation message.
- The save button uses `type="submit"` with one `@submit.prevent` handler, so Enter and clicks run the same code path.
- `saving` drives `LbButton`'s `loading` (which blocks activation) and the input's `loading`. A guard also stops a second submit while a save is in flight.
- Server failures show in an `role="alert"` line, and success shows in a `role="status"` line that clears when the user edits again.
- Styling uses flexbox with `gap` and no margins. I used a plain `1rem` rather than an `--lb-*` token because I could not confirm the token names in this session.
~~~~

## Email

**User request (exact):** I need a Vue 3 UI for a form for collecting a user email address. Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Tool calls (in order):**
- `lb_setup` `{}`
- `lb_search` `{"query":"email input form field with validation","limit":5}`
- `lb_search` `{"query":"button submit form","limit":5}`
- `lb_get` `{"id":"component:LbFormField","detail":"full"}`
- `lb_get` `{"id":"component:LbInput","detail":"full"}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`
- `lb_get` `{"id":"component:LbFormField"}`
- `lb_get` `{"id":"component:LbTextarea"}`
- `lb_get` `{"id":"component:LbButton","detail":"summary"}`

**Retrieved IDs:** `component:LbFormField`, `component:LbInput`, `component:LbButton`, `component:LbFormField`, `component:LbTextarea`, `component:LbButton`. Successful retrievals reported `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`.

**Exact final agent answer:**

~~~~text
I used the kit's `LbFormField`, `LbInput` (`type="email"`), and `LbButton` (`type="submit"`). `LbFormField` supplies the label, hint, error, and `aria-describedby`. The form handles submit once, so the button has no click handler.

**`EmailSignupForm.vue`**

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { LbFormField, LbInput, LbButton } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

const emit = defineEmits<{ submit: [email: string] }>()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const email = ref('')
const error = ref('')
const submitted = ref(false)

// Clear the success message when the address changes again
watch(email, () => {
  submitted.value = false
})

function onSubmit() {
  const value = email.value.trim()

  if (!value) {
    error.value = 'Enter your email address.'
  } else if (!EMAIL_PATTERN.test(value)) {
    error.value = 'Enter an email address like name@example.com.'
  } else {
    error.value = ''
  }

  if (error.value) return

  email.value = value
  submitted.value = true
  emit('submit', value)
}
</script>

<template lang="pug">
form(novalidate @submit.prevent="onSubmit")
  LbFormField(
    label="Email address"
    hint="We will use this address to contact you."
    :error="error"
    required
  )
    LbInput(
      v-model="email"
      type="email"
      name="email"
      autocomplete="email"
      placeholder="name@example.com"
      :invalid="Boolean(error)"
      required
    )
  LbButton(type="submit" fullWidth) Subscribe
  p(v-if="submitted" role="status") Thanks, we will be in touch at {{ email }}.
</template>

<style lang="sass" scoped>
form
  display: flex
  flex-direction: column
  gap: 16px
  max-width: 360px
</style>
```

**Setup**

1. Run the repo's Vite demo with `npm run dev`. Don't run `npm run build` unless the project owner asks for it.
2. Mount the component in a local app, such as `examples/App.vue`, and listen for `@submit="(email) => console.log(email)"`.
3. The imports use `littlebrand-ui-kit` and `littlebrand-ui-kit/style.css`, as the reference documents. Inside this repo, that name has to resolve to the source. Add a Vite alias to `src/index.js` if it doesn't already. I did not verify that alias exists, because I have no file-read tool in this session.

**Notes**

- The regex is a basic format check. It does not confirm that the address exists.
- The `16px` gap is a literal value. If you want kit tokens, swap in an existing `--lb-*` spacing token. I did not invent one.
- I checked the component details only against the MCP reference metadata, not the `.vue.d.ts` or implementation files. The reference is also marked as unreleased 0.8.3 source, not the published artifact.
~~~~

## Notes

**User request (exact):** I need a Vue 3 UI for a form for writing longer notes across multiple lines. Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Tool calls (in order):**
- `lb_setup` `{}`
- `lb_search` `{"query":"textarea multi-line notes form field","limit":5}`
- `lb_get` `{"id":"component:LbTextarea","detail":"full"}`
- `lb_get` `{"id":"component:LbFormField","detail":"full"}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`

**Retrieved IDs:** `component:LbTextarea`, `component:LbFormField`, `component:LbButton`. Successful retrievals reported `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`.

**Exact final agent answer:**

~~~~text
Here's a single-file component built from `LbFormField`, `LbTextarea`, and `LbButton`. The kit's docs say `LbFormField` doesn't validate or set `required`/`aria-invalid` on its child, so the component sets those itself and validates on submit.

```vue
<template lang="pug">
form.note-form(novalidate @submit.prevent="onSubmit")
  LbFormField(
    label="Note"
    :hint="hint"
    :error="error"
    required
  )
    LbTextarea(
      v-model="note"
      name="note"
      placeholder="Write your note..."
      :rows="6"
      :maxRows="12"
      :maxlength="MAX_LENGTH"
      :invalid="Boolean(error)"
      required
      autoResize
    )
  .actions
    LbButton(type="submit") Save note
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { LbButton, LbFormField, LbTextarea } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

const MAX_LENGTH = 2000

const emit = defineEmits<{ save: [note: string] }>()

const note = ref('')
const error = ref('')

// Shown as helper text unless an error replaces it
const hint = computed(() => `${note.value.length} of ${MAX_LENGTH} characters`)

function onSubmit() {
  const text = note.value.trim()
  error.value = text ? '' : 'Note is required'
  if (error.value) return
  emit('save', text)
}
</script>

<style scoped>
.note-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 40rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
```

**Setup notes**

- **Import paths:** The component imports from the package root (`littlebrand-ui-kit`) and its stylesheet (`littlebrand-ui-kit/style.css`), as the kit's setup guidance specifies. Deep imports are unsupported, so don't import from `src/components/...` directly.
- **Testing the repo source:** Point the `littlebrand-ui-kit` import at the repo's `src/index.js` with a Vite `resolve.alias` in your consumer app. I did not verify the source stylesheet path, so check it in the repo before aliasing the `.css` import.
- **TypeScript:** The `lang="ts"` script needs a Vue TypeScript setup. The kit's docs flag that published 0.8.3 has strict TypeScript and CJS failures, so this may surface on the unreleased source too.
- **Styling:** The styles use plain CSS with `gap` rather than the kit's SASS conventions, so the consumer app doesn't need `sass` installed.
- **Pug:** The template uses `lang="pug"`, so install `pug` in the consumer app.
- **Usage:** Listen for the component's `save` event to receive the trimmed note.

I haven't run this component. The API details come from the kit's reference docs for `LbTextarea`, `LbFormField`, and `LbButton`.
~~~~

## Validation

**User request (exact):** I need a Vue 3 UI for a labeled field with a visible validation error hint. Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Tool calls (in order):**
- `lb_setup` `{}`
- `lb_search` `{"query":"text field with label and validation error message","limit":5}`
- `lb_get` `{"id":"component:LbFormField","detail":"full"}`
- `lb_get` `{"id":"component:LbInput","detail":"full"}`

**Retrieved IDs:** `component:LbFormField`, `component:LbInput`. Successful retrievals reported `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`.

**Exact final agent answer:**

~~~~text
The kit's `LbFormField` wraps a label, a control, and one error or hint message, and `LbInput` handles `invalid` and `aria-invalid`. I'll compose those two rather than hand-building the markup.

```vue
<!-- EmailField.vue -->
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { LbFormField, LbInput } from 'littlebrand-ui-kit'

withDefaults(defineProps<{
  modelValue?: string
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  hint?: string
  error?: string
  required?: boolean
  autocomplete?: string
}>(), {
  modelValue: '',
  type: 'text',
  hint: '',
  error: '',
  required: false,
  autocomplete: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <LbFormField
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
  >
    <LbInput
      :model-value="modelValue"
      :type="type"
      :name="name"
      :autocomplete="autocomplete"
      :invalid="Boolean(error)"
      :required="required"
      @update:model-value="emit('update:modelValue', String($event))"
    />
  </LbFormField>
</template>
```

**Usage** (validation stays in the parent, so the component only displays what it's given):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LbButton } from 'littlebrand-ui-kit'
import EmailField from './EmailField.vue'

const email = ref('')
const emailError = ref('')

function onSubmit() {
  const value = email.value.trim()
  if (!value) emailError.value = 'Email is required'
  else if (!/^\S+@\S+\.\S+$/.test(value)) emailError.value = 'Enter a valid email address'
  else emailError.value = ''
  if (!emailError.value) {
    // submit value
  }
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <EmailField
      v-model="email"
      label="Email"
      name="email"
      type="email"
      autocomplete="email"
      hint="We'll send your receipt here."
      :error="emailError"
      required
    />
    <LbButton type="submit">Continue</LbButton>
  </form>
</template>
```

**Setup notes**

- **Source, not npm:** The `lb_setup` output says to install `littlebrand-ui-kit` from npm, which is the published path you're not using. For the unreleased source, point the `littlebrand-ui-kit` import at this repo's `src/index.js`, for example with a Vite alias or a `file:` dependency. I have not verified which stylesheet entry the source exposes, so check `src/` for the CSS entry before relying on `littlebrand-ui-kit/style.css`.
- **Don't build:** `AGENTS.md` says not to run `npm run build` unless the owner asks. The component runs in `npm run dev`.
- **Error behavior:** Errors appear only when the parent sets `error`. The error message takes priority over the hint. `LbFormField` handles the `aria-describedby` link, and `LbInput` sets `aria-invalid` when `invalid` is true.
- **Not verified:** I haven't run or type-checked this file. `lb_get` documents these props and this composition, and the usage pattern follows the kit's tested `LbFormField` example.
~~~~

## Confirmation

**User request (exact):** I need a Vue 3 UI for a confirmation before deleting an item. Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Tool calls (in order):**
- `lb_search` `{"query":"confirmation dialog modal","limit":5}`
- `lb_setup` `{}`
- `lb_search` `{"query":"button destructive danger","limit":5}`
- `lb_get` `{"id":"component:LbDialog","detail":"full"}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`

**Retrieved IDs:** `component:LbDialog`, `component:LbButton`. Successful retrievals reported `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`.

**Exact final agent answer:**

~~~~text
Both components are documented in the source reference. `LbDialog` provides the modal, focus trap, and footer slot, and `LbButton` provides the actions. The component keeps the dialog open while the delete is in progress, so the parent controls when it closes.

**`DeleteConfirmDialog.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { LbButton, LbDialog } from 'littlebrand-ui-kit'

const props = defineProps<{
  itemName: string
  busy?: boolean
}>()

const emit = defineEmits<{
  confirm: []
}>()

// v-model: parent owns open state; the parent closes the dialog after deletion succeeds.
const open = defineModel<boolean>({ required: true })

const title = computed(() => `Delete “${props.itemName}”?`)

function cancel() {
  if (props.busy) return
  open.value = false
}

function confirm() {
  if (props.busy) return
  emit('confirm')
}
</script>

<template>
  <LbDialog
    v-model="open"
    :title="title"
    :show-close="!busy"
    :close-on-backdrop="!busy"
    :close-on-escape="!busy"
  >
    <p>
      This action can’t be undone. The item will be permanently removed.
    </p>

    <template #footer>
      <LbButton variant="outline" :disabled="busy" @click="cancel">
        Cancel
      </LbButton>
      <LbButton color="error" :loading="busy" @click="confirm">
        Delete
      </LbButton>
    </template>
  </LbDialog>
</template>
```

**Usage**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LbButton } from 'littlebrand-ui-kit'
import DeleteConfirmDialog from './DeleteConfirmDialog.vue'

const confirmOpen = ref(false)
const deleting = ref(false)

async function deleteItem() {
  deleting.value = true
  try {
    await fetch('/api/items/42', { method: 'DELETE' }) // replace with your delete call
    confirmOpen.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <LbButton color="error" variant="tonal" @click="confirmOpen = true">Delete item</LbButton>
  <DeleteConfirmDialog
    v-model="confirmOpen"
    item-name="Quarterly report"
    :busy="deleting"
    @confirm="deleteItem"
  />
</template>
```

**Setup (source reference, not the published package)**

1. Keep `littlebrand-ui-kit` as the import specifier so the component code doesn't change. In your Vite config, alias it to the repo's source root. The public export file is `src/index.js`, and I haven't verified the exact relative path from your app, so adjust it:
   ```js
   import { fileURLToPath, URL } from 'node:url'
   export default defineConfig({
     resolve: {
       alias: {
         'littlebrand-ui-kit': fileURLToPath(new URL('../littlebrand-ui-kit/src/index.js', import.meta.url)),
       },
     },
   })
   ```
2. Import the kit's styles. The published entry is `littlebrand-ui-kit/style.css`, but I couldn't confirm the source stylesheet path, so check `src/styles/` in the repo and import the file that compiles the kit's CSS.
3. `LbDialog` depends on `@vueuse/core`. Install it in your app, or the dialog will fail to resolve it.
4. Deep imports aren't supported by the kit, so keep the alias pointed at the root export file rather than individual component files.

**Notes**

- I haven't run this code. The `LbDialog` and `LbButton` usage follows the documented props and the tested examples in the reference. I didn't check the `.vue.d.ts` declarations, so if TypeScript complains about a prop, check those.
- The dialog stays open while `busy` is true, and Escape, backdrop clicks, and the close button are disabled during that time so the delete can't be dismissed mid-request.
- The `error` color on `LbButton` is the kit's destructive affordance. The reference doesn't document a dedicated danger variant, so I didn't use one.
- The reference warns against attaching the same action to both a button click and a form submit. This dialog isn't in a form, so there's no conflict.
~~~~

## Frequency

**User request (exact):** I need a Vue 3 UI for a way to choose how often to receive updates (daily or weekly). Give me a complete single-file component and brief setup guidance. Use the LittleBrand kit's unreleased source reference in this repository; I am testing the source, not installing the published package. Choose tools and components yourself.

**Tool calls (in order):**
- `lb_setup` `{}`
- `lb_search` `{"query":"segmented control choose one option"}`
- `lb_search` `{"query":"radio group form field"}`
- `lb_get` `{"id":"component:LbSegmentButton","detail":"full"}`
- `lb_get` `{"id":"component:LbFormField","detail":"full"}`
- `lb_get` `{"id":"component:LbSegmentButtonItem","detail":"full"}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`

**Retrieved IDs:** `component:LbSegmentButton`, `component:LbFormField`, `component:LbSegmentButtonItem`, `component:LbButton`. Successful retrievals reported `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`.

**Exact final agent answer:**

~~~~text
I picked `LbSegmentButton` over a radio group because the kit documents it as a single-select with radio semantics when `allowEmpty` is false. Here is the component:

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { LbSegmentButton, LbSegmentButtonItem } from 'littlebrand-ui-kit'

type Frequency = 'daily' | 'weekly'

const frequency = defineModel<Frequency>({ default: 'weekly' })

defineProps<{
  disabled?: boolean
}>()

const legendId = 'update-frequency-legend'
const hintId = 'update-frequency-hint'
</script>

<template>
  <fieldset class="update-frequency">
    <legend :id="legendId">Update frequency</legend>
    <p :id="hintId">Choose how often you want to receive updates.</p>
    <LbSegmentButton
      v-model="frequency"
      :allow-empty="false"
      :aria-labelledby="legendId"
      aria-describedby="update-frequency-hint"
      :disabled="disabled"
    >
      <LbSegmentButtonItem value="daily">Daily</LbSegmentButtonItem>
      <LbSegmentButtonItem value="weekly">Weekly</LbSegmentButtonItem>
    </LbSegmentButton>
  </fieldset>
</template>

<style scoped>
.update-frequency {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 0;
  border: 0;
}
</style>
```

Usage:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import UpdateFrequency from './UpdateFrequency.vue'

const frequency = ref<'daily' | 'weekly'>('weekly')
</script>

<template>
  <UpdateFrequency v-model="frequency" />
  <p role="status">Current choice: {{ frequency }}</p>
</template>
```

**Setup guidance**

- The kit reference (`lb_setup`) says to install from npm and import from `littlebrand-ui-kit`. You're testing the unreleased source, so the package import needs to resolve to your local checkout instead. In your Vite config, add an alias from `littlebrand-ui-kit` to the repo's public entry (`src/index.js`, per `AGENTS.md`). Confirm that path and the stylesheet path (`littlebrand-ui-kit/style.css`) against your checkout. I couldn't read the repo from here, so I haven't verified either one.
- Vue 3 with `defineModel` requires Vue 3.4 or later.
- The `<style scoped>` block uses plain CSS with `gap` for spacing, which matches the kit's no-margins rule. I didn't add `--lb-*` tokens because I couldn't confirm names from here.
- I haven't run this component. Check it with `npm run dev` in the kit repo, or in your app with the alias in place. Confirm that arrow keys move between Daily and Weekly, and that the legend is announced by a screen reader.
- The reference notes that this is unreleased develop work, not the published 0.8.3 package, so behavior may change before release.
~~~~
