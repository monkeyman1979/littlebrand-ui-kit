# LbFormField

ID: `component:LbFormField`. [Reference index](../README.md). Compose a label, control and one helper or validation message.

**Use:** Nest an Input or Textarea, supply label and hint/error, and bind v-model on the control. Pass required and invalid to the control itself.

**Find by intent:** form field; validation; label and hint; error message; field group.

**Avoid:** Do not expect FormField to validate or set aria-invalid/required on its child. If using labelFor, keep it matched to the actual control ID.

**Accessibility:** Provides a stable generated id and aria-describedby for injected Input/Textarea; the visible label targets that id and the message supplies its description. A label alone does not mark the control required.

**States:** hint; error, warning or success message (in that priority); required indicator; stable control/description ids.

**Dependencies:** Vue 3; LbLabel and LbHintText internally (standalone APIs not verified in this slice).

**Related:** [component:LbTextarea](./LbTextarea.md), [component:LbInput](./LbInput.md), [token:--lb-border-error-normal](../TOKENS.md#token---lb-border-error-normal).

## API (source/declaration checked)

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `label` | `string` | no | — |
| `hint` | `string` | no | — |
| `required` | `boolean` | no | `false` |
| `error` | `string` | no | — |
| `warning` | `string` | no | — |
| `success` | `string` | no | — |
| `id` | `string` | no | — |
| `labelFor` | `string` | no | — |

Slots: `default`, `label-icon`. Events: none.

## Tested Vue example

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { ref } from 'vue'
import { LbFormField, LbTextarea, LbButton } from 'littlebrand-ui-kit'
const biography = ref('')
const error = ref('')
function validate() {
  error.value = biography.value.trim() ? '' : 'Biography is required'
}
</script>

<template>
  <LbFormField label="Biography" hint="Tell us a little about yourself." :error="error" required>
    <LbTextarea v-model="biography" name="biography" :invalid="Boolean(error)" required />
  </LbFormField>
  <LbButton @click="validate">Validate</LbButton>
</template>
```
