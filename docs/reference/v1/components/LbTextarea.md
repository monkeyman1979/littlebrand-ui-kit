# LbTextarea

ID: `component:LbTextarea`. [Reference index](../README.md). Collect longer free-form text with v-model.

**Use:** Associate a visible label or aria-label; pass native name and aria-describedby to the textarea for forms and helper text.

**Find by intent:** textarea; multiline; notes; long form; feedback.

**Avoid:** Do not assume FormField supplies validation or a required native attribute; explicitly set invalid/required on the control. No small size exists.

**Accessibility:** Uses a native textarea. Invalid sets aria-invalid; readonly and disabled preserve native semantics. The outline and ring stay visible on keyboard focus in both themes.

**States:** medium or large; disabled; readonly; required; invalid; autoResize with optional maxRows; keyboard focus; reduced motion.

**Dependencies:** Vue 3.

**Related:** [component:LbFormField](./LbFormField.md), [component:LbInput](./LbInput.md), [token:--lb-border-neutral-normal](../TOKENS.md#token---lb-border-neutral-normal), [token:--lb-border-error-normal](../TOKENS.md#token---lb-border-error-normal).

## API (source/declaration checked)

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `modelValue` | `string` | no | `` |
| `placeholder` | `string` | no | — |
| `disabled` | `boolean` | no | `false` |
| `readonly` | `boolean` | no | `false` |
| `invalid` | `boolean` | no | `false` |
| `required` | `boolean` | no | `false` |
| `id` | `string` | no | — |
| `ariaDescribedby` | `string` | no | — |
| `autofocus` | `boolean` | no | `false` |
| `rows` | `number` | no | `4` |
| `cols` | `number` | no | — |
| `minlength` | `number` | no | — |
| `maxlength` | `number` | no | — |
| `spellcheck` | `boolean` | no | `true` |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | no | `vertical` |
| `autoResize` | `boolean` | no | `false` |
| `maxRows` | `number` | no | — |
| `size` | `'medium' \| 'large'` | no | — |

Slots: none. Events: `update:modelValue`, `input`, `change`, `focus`, `blur`.

## Tested Vue example

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { ref } from 'vue'
import { LbTextarea } from 'littlebrand-ui-kit'
const notes = ref('')
</script>

<template>
  <label for="notes">Notes</label>
  <LbTextarea id="notes" v-model="notes" name="notes" aria-describedby="notes-help" :maxlength="200" />
  <p id="notes-help">Optional notes, up to 200 characters.</p>
</template>
```
