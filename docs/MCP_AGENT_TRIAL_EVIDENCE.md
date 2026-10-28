# Independent source MCP agent trial — six intents

**Scope:** An authenticated Claude Code CLI agent (Haiku) used an isolated, read-only source-stdio MCP configuration, with no built-in file/command tools and a fresh nonpersistent conversation per intent. The source entry was `mcp-server/node_modules/.bin/tsx mcp-server/src/index.ts`; no tracked `dist/`, published CLI, build, extraction, deployment, or publication was used. Tool selection and final answers were the agent's own. This is an experiment, not a release check.

**Result:** All six conversations used the source tools; only save and notes used LittleBrand in the *primary* final SFC. Email, validation, confirmation, and frequency used native controls instead despite retrieving the corresponding LittleBrand references. Each primary final SFC (the first `vue` block in each answer below, unchanged) passed a source-aliased `vue-tsc --noEmit` with `strict: true` and the repository baseline `skipLibCheck: true`. These were temporary test fixtures removed afterward. A second strict-library check with `skipLibCheck: false` failed on existing `@vueuse/core` Bluetooth ambient types, not these SFCs. Other snippets in answers were not typechecked. A subsequent source-only browser probe is recorded below; passing TypeScript or rendering does not by itself meet the Step 10 agent-use gate.

Successful `lb_get` results carried `packageVersion: "0.8.3"` and `status: "Unreleased source reference; not a published 0.8.3 artifact"`; an unknown-item lookup returned an error instead. Raw event-stream logs were local temporary files; below are their actual tool names/arguments, retrieved IDs, and **unaltered final agent answers** (including all code blocks). Prompts did not supply component names, props, or preselected tool calls.

## Observations

- The agent respected the source-versus-release caveat, but in four cases used it as a reason to substitute native components. Tool discovery alone does not show the kit can be used correctly.
- The notes SFC attaches both `@submit.prevent="onSubmit"` to the form and `@click="onSubmit"` to a submit button. A rendered click emitted `save` **twice**; do not count this as successful behavior.
- The confirmation run called `lb_get` for unverified `token:--lb-fill-error-normal` and received an unknown-item response, then retrieved `token:--lb-surface-subtle`. It ultimately used a native dialog, not `LbDialog`.
- Re-run under a deliberately explicit **use this unreleased source kit** constraint (without naming components or props) to distinguish tool/API quality from the rational decision to avoid an unreleased package. Keep published-package verification separate.

## Browser follow-up (source fixture, not npm artifact)

`node tests/browser-agent-trial.mjs` loads the first `vue` block from each **unaltered** answer below into temporary Vue files, aliases package-root imports and CSS to current source (never the tracked `dist/`), runs Vite's development server and headless Chromium, then removes the fixtures. Only these primary SFCs were probed; optional usage/alternative snippets were not. It checks initial rendering, one core interaction per task, and browser errors in a light-scheme context. It does **not** certify styling, accessibility, dark mode, all component states, production bundling, or installed npm behavior.

| Primary SFC | Result | Browser observation |
|---|---|---|
| Save | Passed | Edited note sent once to an intercepted placeholder API; success state and disabled save button observed. |
| Email | Passed | Required native input showed an error on blur and cleared it for a valid address. |
| Notes | **Failed** | A single click on “Save notes” emitted `save("A note")` **twice**; the handler runs on both button click and form submit. Empty-field error rendered. |
| Validation | Passed | Native input showed/cleared its error and emitted the valid address on submit. |
| Confirmation | Passed | Native dialog opened, confirmed, and closed on Escape with a cancel event. |
| Frequency | Passed | Native weekly radio selection updated its controlled value. |

The runner intentionally exits nonzero while the exact notes answer remains wrong (five of six core interaction probes passed). This failure belongs to **agent-produced code**, not a verified kit defect. Do not edit the captured answer to make the trial green. A rerun with explicit kit-use instructions and a new exact-answer validation is a separate follow-up.

## Save

**User request:** I am building a Vue 3 page and need an action that saves edits. Show me a complete Vue single-file component I can paste into a project, and tell me how to set up the kit. Use any available project reference if helpful.

**Actual calls, in order:**
- `lb_setup` `{}`
- `lb_search` `{"query":"save edits form with Button and Textarea","limit":4}`
- `lb_get` `{"id":"component:LbButton","detail":"full"}`
- `lb_get` `{"id":"component:LbTextarea","detail":"full"}`

**Retrieved items:** `component:LbButton`, `component:LbTextarea`. Successful retrievals report the unreleased source status/version above.

**Exact final answer:**

~~~~text
Here's a self-contained save-edits component. It uses the `LbTextarea` and `LbButton` props and the `label` + `aria-describedby` pattern from the kit's tested examples. The save request is a placeholder: point `saveUrl` at your own endpoint.

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { ref, computed } from 'vue'
import { LbButton, LbTextarea } from 'littlebrand-ui-kit'

const props = withDefaults(defineProps<{ initialNotes?: string; saveUrl?: string }>(), {
  initialNotes: '',
  saveUrl: '/api/notes'
})

const notes = ref(props.initialNotes)
const savedNotes = ref(props.initialNotes)
const saving = ref(false)
const status = ref<'idle' | 'saved' | 'error'>('idle')
const dirty = computed(() => notes.value !== savedNotes.value)

async function save() {
  if (saving.value || !dirty.value) return
  saving.value = true
  status.value = 'idle'
  try {
    const response = await fetch(props.saveUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: notes.value })
    })
    if (!response.ok) throw new Error(`Save failed: ${response.status}`)
    savedNotes.value = notes.value
    status.value = 'saved'
  } catch (error) {
    console.error(error)
    status.value = 'error'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="notes-form" @submit.prevent="save">
    <label for="notes">Notes</label>
    <LbTextarea
      id="notes"
      v-model="notes"
      name="notes"
      :maxlength="2000"
      :invalid="status === 'error'"
      aria-describedby="notes-help"
    />
    <p id="notes-help">Changes are saved to your account.</p>

    <div class="actions">
      <LbButton type="submit" :loading="saving" :disabled="!dirty || saving">
        Save changes
      </LbButton>
      <p v-if="status === 'saved'" role="status">Saved</p>
      <p v-else-if="status === 'error'" role="alert">Could not save. Try again.</p>
    </div>
  </form>
</template>

<style scoped>
.notes-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
```

**Using it**

```vue
<script setup lang="ts">
import NotesEditor from './NotesEditor.vue'
</script>

<template>
  <NotesEditor :initial-notes="existingNotes" save-url="/api/notes" />
</template>
```

**Setting up the kit**

1. Install the package: `npm install littlebrand-ui-kit`
2. Import the styles once, either in `main.ts` or in the component as shown above: `import 'littlebrand-ui-kit/style.css'`
3. Import components from the package root only: `import { LbButton, LbTextarea } from 'littlebrand-ui-kit'`. Deep imports are not supported.

**Notes and caveats**

- The component uses `fetch` with a `PUT` to `saveUrl`. Change the method, body, and auth headers to match your backend.
- The button is disabled until the text changes, and `loading` blocks repeat submits while a save is in flight. Success and failure are announced through `role="status"` and `role="alert"`.
- The kit reference I pulled is an unreleased source reference, not the published 0.8.3 artifact. The reference notes that published 0.8.3 has known strict TypeScript and CJS failures. If your project uses strict TS, check the build before relying on this.
- I did not run this in a project, so treat it as unverified until you compile it. The button and textarea usage follows the kit's tested examples.
~~~~

## Email

**User request:** I need a Vue 3 form for collecting a user email address. Give me a complete single-file component that can be pasted into a project, including setup guidance. Use any available project reference if helpful.

**Actual calls, in order:**
- `lb_search` `{"query":"text input form field email validation","limit":4}`
- `lb_setup` `{}`
- `lb_get` `{"id":"component:LbInput","detail":"full"}`

**Retrieved items:** `component:LbInput`. Successful retrievals report the unreleased source status/version above.

**Exact final answer:**

~~~~text
I'd use a standalone component with no library dependency. The library's `LbInput` and `LbFormField` are the closest match, but the reference notes that this source is unreleased and that the published 0.8.3 has known strict TypeScript failures. The component below uses a native `<input>` and the same `--lb-*` tokens that `LbInput` uses, with fallbacks. A snippet for swapping in `LbInput` is at the end.

## `EmailField.vue`

```vue
<script setup lang="ts">
import { computed, ref, useId } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  name?: string
  id?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  label: 'Email address',
  name: 'email',
  placeholder: 'name@example.com',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// useId requires Vue 3.5+
const generatedId = useId()
const inputId = computed(() => props.id ?? `${generatedId}-input`)
const errorId = computed(() => `${inputId.value}-error`)

const touched = ref(false)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const error = computed(() => {
  const value = props.modelValue.trim()
  if (!value) return props.required ? 'Enter an email address.' : ''
  if (!EMAIL_PATTERN.test(value)) return 'Enter an email address in the format name@example.com.'
  return ''
})

const showError = computed(() => touched.value && error.value !== '')

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

// Lets a parent form validate on submit, not just on blur
function validate(): boolean {
  touched.value = true
  return error.value === ''
}

defineExpose({ validate })
</script>

<template>
  <div class="email-field">
    <label :for="inputId">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <input
      :id="inputId"
      :name="name"
      type="email"
      inputmode="email"
      autocomplete="email"
      autocapitalize="off"
      spellcheck="false"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="{ invalid: showError }"
      :aria-invalid="showError ? 'true' : undefined"
      :aria-describedby="showError ? errorId : undefined"
      @input="onInput"
      @blur="touched = true"
    />
    <p v-if="showError" :id="errorId" class="error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.email-field {
  display: grid;
  gap: 0.375rem;
}

label {
  color: var(--lb-text-neutral-normal, #1f2937);
  font-weight: 600;
}

input {
  box-sizing: border-box;
  width: 100%;
  min-height: 2.75rem;
  padding: 0 0.75rem;
  border: 1px solid var(--lb-border-neutral-normal, #9ca3af);
  border-radius: 0.5rem;
  background: #fff;
  color: var(--lb-text-neutral-normal, #1f2937);
  font: inherit;
}

input.invalid {
  border-color: var(--lb-border-error-normal, #b91c1c);
}

input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error {
  color: var(--lb-border-error-normal, #b91c1c);
  font-size: 0.875rem;
}
</style>
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import EmailField from './EmailField.vue'

const email = ref('')
const emailField = ref<InstanceType<typeof EmailField> | null>(null)

function onSubmit() {
  if (!emailField.value?.validate()) return
  // send email.value to your API
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <EmailField ref="emailField" v-model="email" required />
    <button type="submit">Subscribe</button>
  </form>
</template>
```

`novalidate` stops the browser's native popups so the component's message is the only one shown.

## Setup

1. Save the file as `src/components/EmailField.vue`.
2. Requires Vue 3.5 or later because of `useId`. For Vue 3.0–3.4, delete the `useId` line and the `generatedId` fallback, and always pass an `id` prop.
3. No extra dependencies. The `--lb-*` variables are read if your theme defines them; otherwise the fallback colors apply.
4. Test with the keyboard, a screen reader, and an empty, invalid, and valid value before shipping.

## Optional: use `LbInput` instead

If you want the library styling, install `littlebrand-ui-kit`, import `littlebrand-ui-kit/style.css` once, and use the tested pattern from the reference:

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { ref } from 'vue'
import { LbInput } from 'littlebrand-ui-kit'
const email = ref('')
</script>

<template>
  <label for="contact-email">Email</label>
  <LbInput id="contact-email" v-model="email" type="email" name="email" autocomplete="email" required />
</template>
```

This pattern does not include the validation message. Add your own `invalid` state and error text with `LbFormField` if you need them. I haven't tested either version in a running app, so verify the behavior in your project.
~~~~

## Notes

**User request:** I need a Vue 3 form where someone can write longer notes across multiple lines. Give me a complete single-file component that can be pasted into a project, including setup guidance. Use any available project reference if helpful.

**Actual calls, in order:**
- `lb_search` `{"query":"Textarea multi-line form field"}`
- `lb_setup` `{}`
- `lb_get` `{"id":"component:LbTextarea","detail":"full"}`
- `lb_get` `{"id":"component:LbFormField","detail":"full"}`

**Retrieved items:** `component:LbTextarea`, `component:LbFormField`. Successful retrievals report the unreleased source status/version above.

**Exact final answer:**

~~~~text
Here's a self-contained form component built on the kit's `LbFormField` and `LbTextarea`, following the pattern in the project's tested reference example.

**`src/components/NotesForm.vue`**

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { computed, ref } from 'vue'
import { LbButton, LbFormField, LbTextarea } from 'littlebrand-ui-kit'

const MAX_LENGTH = 1000

const emit = defineEmits<{
  save: [notes: string]
}>()

const notes = ref('')
const error = ref('')
const hint = computed(() => `${notes.value.length} of ${MAX_LENGTH} characters`)

function onSubmit() {
  const text = notes.value.trim()

  if (!text) {
    error.value = 'Notes are required'
    return
  }

  error.value = ''
  emit('save', text)
}
</script>

<template>
  <form class="notes-form" novalidate @submit.prevent="onSubmit">
    <LbFormField
      label="Notes"
      :hint="hint"
      :error="error"
      required
    >
      <LbTextarea
        v-model="notes"
        name="notes"
        :rows="8"
        :maxlength="MAX_LENGTH"
        :invalid="Boolean(error)"
        required
        resize="vertical"
      />
    </LbFormField>

    <LbButton type="submit" @click="onSubmit">Save notes</LbButton>
  </form>
</template>

<style scoped>
.notes-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

**Usage**

```vue
<script setup lang="ts">
import NotesForm from './components/NotesForm.vue'

function handleSave(notes: string) {
  console.log('Saved notes:', notes)
}
</script>

<template>
  <NotesForm @save="handleSave" />
</template>
```

**Setup**

1. Install the package: `npm install littlebrand-ui-kit`
2. Paste the component into `src/components/NotesForm.vue`.
3. Import it where needed, as shown above. The component imports `littlebrand-ui-kit/style.css` itself, so you don't need to add it globally. Deep imports are unsupported, so use only the root `littlebrand-ui-kit` import and `/style.css`.

**Notes on the design**

- `LbFormField` doesn't validate or set `required` or `aria-invalid` on its child. The component sets `required` and `:invalid` on the textarea explicitly, as the reference recommends.
- `error` takes priority over `hint` in `LbFormField`, so the character count disappears while an error shows.
- The `maxlength` prop enforces the 1000-character limit natively. Adjust `MAX_LENGTH` and `:rows` as needed.
- The form uses `novalidate` so the browser doesn't show its own validation bubble. The kit's error message is the only one shown.

**Caveats**

- The kit reference is unreleased `develop` source, not the published 0.8.3 package. The status notes say published 0.8.3 has known strict TypeScript and CJS failures. If your project uses strict TypeScript, check the install before relying on these types.
- I haven't run this component. I verified the props, events, and accessibility behavior against the reference docs, not in a running app.
- I used a plain `<style scoped>` block with `gap` for layout, because the repo's SASS and Pug conventions apply to kit internals, not consumer apps. If your project uses SASS, convert it.
- I didn't verify that `LbButton` forwards `type="submit"`. I also kept `@click` on the button so submission works either way. If `type="submit"` already works in your setup, you can drop the `@click`.
~~~~

## Validation

**User request:** I need a Vue 3 form with a labeled field and a visible validation error hint. Give me a complete single-file component that can be pasted into a project, including setup guidance. Use any available project reference if helpful.

**Actual calls, in order:**
- `lb_search` `{"query":"FormField with label and validation error","limit":4}`
- `lb_get` `{"id":"component:LbFormField","detail":"full"}`

**Retrieved items:** `component:LbFormField`. Successful retrievals report the unreleased source status/version above.

**Exact final answer:**

~~~~text
I used the LittleBrand `LbFormField` reference for the pattern: the label targets the control, the hint and error are linked with `aria-describedby`, and `aria-invalid` is set on the control. The component below uses plain Vue and native inputs so it pastes into any Vue 3 project without the library installed.

## Component: `EmailField.vue`

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  id?: string
  label?: string
  hint?: string
}>(), {
  id: 'email',
  label: 'Email address',
  hint: 'We only use this to contact you about your account.',
})

const emit = defineEmits<{
  submit: [email: string]
}>()

const email = ref('')
const touched = ref(false)

const error = computed(() => {
  const value = email.value.trim()
  if (!value) return 'Enter an email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Enter an email address in the format name@example.com.'
  }
  return ''
})

const showError = computed(() => touched.value && error.value !== '')
const hintId = computed(() => `${props.id}-hint`)
const errorId = computed(() => `${props.id}-error`)
const describedBy = computed(() =>
  showError.value ? `${hintId.value} ${errorId.value}` : hintId.value,
)

function onBlur() {
  touched.value = true
}

function onSubmit() {
  touched.value = true
  if (error.value) return
  emit('submit', email.value.trim())
}
</script>

<template>
  <form class="email-form" novalidate @submit.prevent="onSubmit">
    <div class="field">
      <label :for="id">
        {{ label }}
        <span class="required" aria-hidden="true">*</span>
      </label>

      <input
        :id="id"
        v-model="email"
        type="email"
        name="email"
        autocomplete="email"
        required
        :aria-invalid="showError ? 'true' : 'false'"
        :aria-describedby="describedBy"
        :class="{ invalid: showError }"
        @blur="onBlur"
      />

      <span :id="hintId" class="hint">{{ hint }}</span>

      <span v-if="showError" :id="errorId" class="error" role="alert">
        {{ error }}
      </span>
    </div>

    <button type="submit">Save</button>
  </form>
</template>

<style scoped>
.email-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 24rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

label {
  font-weight: 600;
}

.required {
  color: var(--lb-border-error-normal, #b3261e);
}

input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #8a8a8a;
  border-radius: 0.375rem;
  font: inherit;
}

input:focus-visible {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
}

input.invalid {
  border-color: var(--lb-border-error-normal, #b3261e);
}

.hint {
  font-size: 0.875rem;
  color: #5f6368;
}

.error {
  font-size: 0.875rem;
  color: var(--lb-border-error-normal, #b3261e);
}

button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  font: inherit;
}
</style>
```

## Setup

1. **Create or open a Vue 3 project.** For a new one:
   ```sh
   npm create vite@latest my-form -- --template vue-ts
   cd my-form
   npm install
   ```
2. **Paste the file** at `src/components/EmailField.vue`.
3. **Use it in `src/App.vue`:**
   ```vue
   <script setup lang="ts">
   import EmailField from './components/EmailField.vue'

   function save(email: string) {
     console.log('Saved', email)
   }
   </script>

   <template>
     <EmailField @submit="save" />
   </template>
   ```
4. **Run it:** `npm run dev`, then submit the form empty or with a bad address to see the error hint.

## Notes

- **Validation timing:** The error appears after the field loses focus or after a submit attempt, not on the first keystroke.
- **Accessibility:** The hint and error are linked to the input through `aria-describedby`, `aria-invalid` is set, and the error uses `role="alert"` so screen readers announce it. The asterisk is hidden from assistive tech, so the `required` attribute carries the meaning.
- **Spacing:** Spacing comes from flexbox `gap` and there are no margins, which matches the LittleBrand guidance.
- **Tokens:** `--lb-border-error-normal` is the only error token I confirmed in the reference. I used it for the border and text color, with fallbacks. If you use the kit, check whether a text-specific error token exists.
- **Using LittleBrand components instead:** The reference shows `LbFormField` wrapping `LbInput` or `LbTextarea`, with `required` and `invalid` passed to the control. The reference describes version 0.8.3 as unreleased source, so I did not verify that the npm package installs and exports these components. Confirm that before depending on it.
- **Not run:** I did not run this component in a browser or a build. Per the repo's guidance, I also did not run `npm run build`.
~~~~

## Confirmation

**User request:** I need a Vue 3 UI that asks for confirmation before deleting an item. Give me a complete single-file component that can be pasted into a project, including setup guidance. Use any available project reference if helpful.

**Actual calls, in order:**
- `lb_search` `{"query":"confirm dialog modal delete","limit":5}`
- `lb_setup` `{}`
- `lb_get` `{"id":"component:LbDialog","detail":"full"}`
- `lb_search` `{"query":"danger error button color token","limit":5}`
- `lb_get` `{"id":"token:--lb-fill-error-normal"}`
- `lb_get` `{"id":"token:--lb-surface-subtle"}`

**Retrieved items:** `component:LbDialog`, `token:--lb-surface-subtle`. Successful retrievals report the unreleased source status/version above.

**Exact final answer:**

~~~~text
Here's a self-contained component. It uses the native `<dialog>` element, so the browser handles focus trapping, Escape, and the modal backdrop. It has no dependencies beyond Vue.

## `ConfirmDeleteDialog.vue`

```vue
<template>
  <dialog
    ref="dialog"
    class="confirm-dialog"
    :aria-labelledby="titleId"
    :aria-describedby="messageId"
    @cancel="onCancel"
    @close="onClose"
    @click="onBackdropClick"
  >
    <div class="panel">
      <h2 :id="titleId" class="title">{{ title }}</h2>

      <div :id="messageId" class="body">
        <p>{{ message }}</p>
        <p v-if="itemName" class="item">{{ itemName }}</p>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <div class="actions">
        <button
          type="button"
          class="btn"
          autofocus
          :disabled="busy"
          @click="dismiss"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          class="btn danger"
          :disabled="busy"
          :aria-busy="busy"
          @click="onConfirm"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Delete this item?' },
  message: { type: String, default: 'This action cannot be undone.' },
  itemName: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Delete' },
  cancelLabel: { type: String, default: 'Cancel' },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const uid = Math.random().toString(36).slice(2, 9)
const titleId = `confirm-title-${uid}`
const messageId = `confirm-message-${uid}`
const dialog = ref(null)

function sync(open) {
  const el = dialog.value
  if (!el) return
  if (open && !el.open) el.showModal()
  if (!open && el.open) el.close()
}

onMounted(() => sync(props.modelValue))
watch(() => props.modelValue, sync)

function dismiss() {
  if (props.busy) return
  emit('cancel')
  dialog.value.close()
}

function onCancel(event) {
  // Escape key: keep the dialog open while the delete is in flight
  if (props.busy) {
    event.preventDefault()
    return
  }
  emit('cancel')
}

function onClose() {
  // Runs for every close path (buttons, Escape, backdrop, or parent via v-model)
  if (props.modelValue) emit('update:modelValue', false)
}

function onBackdropClick(event) {
  // Clicks on the <dialog> itself (not the panel) land on the backdrop
  if (event.target === dialog.value) dismiss()
}

function onConfirm() {
  emit('confirm')
}
</script>

<style scoped>
.confirm-dialog {
  width: min(28rem, calc(100vw - 2rem));
  padding: 0;
  border: 1px solid var(--lb-border-neutral-normal, #d0d5dd);
  border-radius: 12px;
  background: var(--lb-surface-subtle, #ffffff);
  color: inherit;
  box-shadow: 0 16px 48px rgb(0 0 0 / 0.2);
}

.confirm-dialog::backdrop {
  background: var(--lb-surface-overlay, rgb(0 0 0 / 0.5));
}

.panel {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.title {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.3;
}

.body {
  display: grid;
  gap: 0.5rem;
}

.body p {
  margin: 0;
}

.item {
  font-weight: 600;
  overflow-wrap: anywhere;
}

.error {
  margin: 0;
  color: var(--lb-border-error-normal, #b42318);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--lb-border-neutral-normal, #d0d5dd);
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.btn:focus-visible {
  outline: 2px solid var(--lb-focus-ring-color, #2563eb);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger {
  border-color: var(--lb-border-error-normal, #b42318);
  background: var(--lb-border-error-normal, #b42318);
  color: #ffffff;
}
</style>
```

## Setup

1. **Copy the file** into your components folder, for example `src/components/ConfirmDeleteDialog.vue`.
2. **Requirements:** Vue 3.2 or later. No Sass, Pug, or extra packages are needed.
3. **Tokens (optional):** If your app imports `littlebrand-ui-kit/style.css`, the `--lb-*` variables resolve. Otherwise the fallback values apply.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog.vue'

const items = ref([
  { id: 1, name: 'Quarterly report' },
  { id: 2, name: 'Old draft' }
])
const pending = ref(null)     // item awaiting confirmation
const open = ref(false)
const busy = ref(false)
const error = ref('')

function askDelete(item) {
  pending.value = item
  error.value = ''
  open.value = true
}

async function confirmDelete() {
  busy.value = true
  error.value = ''
  try {
    await fetch(`/api/items/${pending.value.id}`, { method: 'DELETE' }) // your API call
    items.value = items.value.filter(i => i.id !== pending.value.id)
    open.value = false
  } catch {
    error.value = 'Could not delete the item. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
      <button type="button" @click="askDelete(item)">Delete</button>
    </li>
  </ul>

  <ConfirmDeleteDialog
    v-model="open"
    :item-name="pending?.name"
    :busy="busy"
    :error="error"
    confirm-label="Delete item"
    @confirm="confirmDelete"
  />
</template>
```

## Behavior

- **Focus:** Opens with focus on Cancel, the safer default for destructive actions. Focus is trapped inside the dialog. Native dialogs generally return focus to the trigger on close, but I did not verify that in every browser.
- **Dismissal:** Cancel, Escape, and backdrop click all close it. While `busy` is true, all three are blocked so a delete can't be abandoned mid-request.
- **Parent control:** The parent decides when to close it. It stays open on failure and shows `error`.

## Caveats

- **Not run in a browser.** I checked the code by reading it and did not execute it.
- **Danger color is a placeholder.** The reference has no verified error *fill* token, so the delete button uses `--lb-border-error-normal`, a border token. Check its contrast with white text, or swap in a verified fill token once you confirm one.
- **Why not `LbDialog`?** The reference documents `LbDialog` with a footer slot for actions. Its source is marked unreleased (0.8.3 reference, not the published artifact), and the published 0.8.3 build has known TypeScript and CJS failures. This standalone file avoids that dependency. If you want the library version, use `LbDialog` with `LbButton` in the footer slot, following its documented example.
~~~~

## Frequency

**User request:** I need a Vue 3 UI where someone can choose how often to receive updates (daily or weekly). Give me a complete single-file component that can be pasted into a project, including setup guidance. Use any available project reference if helpful.

**Actual calls, in order:**
- `lb_search` `{"query":"segment button radio group frequency choice","limit":4}`
- `lb_get` `{"id":"component:LbSegmentButton","detail":"full"}`
- `lb_search` `{"query":"text color surface border semantic tokens","limit":5}`
- `lb_get` `{"id":"token:--lb-surface-primary-active","detail":"full"}`
- `lb_get` `{"id":"token:--lb-focus-ring-color","detail":"full"}`

**Retrieved items:** `component:LbSegmentButton`, `token:--lb-surface-primary-active`, `token:--lb-focus-ring-color`. Successful retrievals report the unreleased source status/version above.

**Exact final answer:**

~~~~text
Here's a standalone component built on native radio buttons, so it works without installing the kit. It follows the project's conventions: Pug, indented SASS, `gap` for spacing, no BEM, no `!important`, and only the `--lb-*` tokens I could verify in the reference.

**`FrequencyPicker.vue`**

```vue
<script setup lang="ts">
import { useId } from 'vue'

type Frequency = 'daily' | 'weekly'

const props = withDefaults(defineProps<{
  modelValue?: Frequency
  label?: string
  helper?: string
  disabled?: boolean
}>(), {
  modelValue: 'daily',
  label: 'Update frequency',
  helper: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Frequency]
}>()

// Unique radio group name so multiple pickers on one page don't interfere
const groupName = `frequency-${useId()}`

const options: { value: Frequency; title: string; description: string }[] = [
  { value: 'daily', title: 'Daily', description: 'One update each morning.' },
  { value: 'weekly', title: 'Weekly', description: 'One summary every Monday.' },
]
</script>

<template lang="pug">
fieldset.frequency-picker(:disabled="props.disabled")
  legend.frequency-legend {{ props.label }}
  .frequency-options
    label.frequency-option(
      v-for="option in options"
      :key="option.value"
      :class="{ 'is-selected': props.modelValue === option.value, 'is-disabled': props.disabled }"
    )
      input(
        type="radio"
        :name="groupName"
        :value="option.value"
        :checked="props.modelValue === option.value"
        @change="emit('update:modelValue', option.value)"
      )
      span.frequency-text
        span.frequency-title {{ option.title }}
        span.frequency-description {{ option.description }}
  p.frequency-helper(v-if="props.helper") {{ props.helper }}
</template>

<style lang="sass" scoped>
.frequency-picker
  display: flex
  flex-direction: column
  gap: 8px
  min-width: 0
  margin: 0
  padding: 0
  border: 0

.frequency-legend
  padding: 0
  font-weight: 600

.frequency-options
  display: flex
  flex-wrap: wrap
  gap: 12px

.frequency-option
  display: flex
  flex: 1 1 200px
  align-items: flex-start
  gap: 12px
  padding: 16px
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent)
  border-radius: 8px
  cursor: pointer

  &.is-selected
    border-color: currentColor
    background: var(--lb-surface-primary-active)

  &:has(input:focus-visible)
    outline: 2px solid var(--lb-focus-ring-color, Highlight)
    outline-offset: 2px

  &.is-disabled
    cursor: not-allowed
    opacity: 0.5

.frequency-text
  display: flex
  flex-direction: column
  gap: 4px

.frequency-title
  font-weight: 600

.frequency-description
  font-size: 0.875rem

.frequency-helper
  font-size: 0.875rem
  color: color-mix(in srgb, currentColor 70%, transparent)
</style>
```

## Setup

1. **Requirements:** Vue 3.5 or newer (the component uses `useId`). For Pug and SASS, install the preprocessors:
   ```sh
   npm install -D pug sass
   ```
   Vite handles both automatically once they're installed.
2. **Save the file** as `src/components/FrequencyPicker.vue` (or wherever your components live).
3. **Use it with `v-model`:**
   ```vue
   <script setup lang="ts">
   import { ref } from 'vue'
   import FrequencyPicker from '@/components/FrequencyPicker.vue'

   const frequency = ref<'daily' | 'weekly'>('daily')
   </script>

   <template>
     <FrequencyPicker
       v-model="frequency"
       label="How often should we send updates?"
       helper="You can change this anytime in settings."
     />
   </template>
   ```
4. **Token support:** `--lb-surface-primary-active` and `--lb-focus-ring-color` only resolve when the kit's CSS is loaded. Without it, the selected background is transparent and the focus ring falls back to the system `Highlight` color.

## Notes

- **Choices I made:** I used native radios instead of `LbSegmentButton`, so the file has no package dependency. The reference shows `LbSegmentButton` with `:allow-empty="false"` is the shorter option if you already have `littlebrand-ui-kit` installed. Radios also give you arrow-key navigation and screen-reader grouping for free.
- **Default:** `modelValue` defaults to `'daily'`. Change that default if you want a different starting value.
- **Fieldset reset:** `margin: 0` resets the browser's default fieldset margin and doesn't add spacing. Spacing between elements comes from `gap`.
- **Not verified:** I haven't run or rendered this component. The reference confirmed the token names and the `LbSegmentButton` API, but the component itself has not been tested in a browser. Please check the focus ring and dark-theme appearance in your project.
~~~~
