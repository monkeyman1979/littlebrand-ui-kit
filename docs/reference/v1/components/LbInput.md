# LbInput

ID: `component:LbInput`. [Reference index](../README.md). Collect one line of text with v-model.

**Use:** Use a visible label or aria-label; pass native name and autocomplete when submitting forms.

**Find by intent:** input; email; text field; form; entry.

**Avoid:** Do not request small size or assume v-model emits numbers: updates are strings.

**Accessibility:** Invalid sets aria-invalid; loading disables the native input. Clear and password controls are unavailable while disabled or readonly.

**States:** medium or large; disabled; readonly; required; invalid; loading; clearable; keyboard focus.

**Dependencies:** Vue 3.

**Related:** [token:--lb-border-neutral-normal](../TOKENS.md#token---lb-border-neutral-normal), [token:--lb-border-error-normal](../TOKENS.md#token---lb-border-error-normal), [token:--lb-text-neutral-normal](../TOKENS.md#token---lb-text-neutral-normal).

## API (source/declaration checked)

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | no | `` |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'url' \| 'search'` | no | `text` |
| `placeholder` | `string` | no | — |
| `disabled` | `boolean` | no | `false` |
| `readonly` | `boolean` | no | `false` |
| `invalid` | `boolean` | no | `false` |
| `required` | `boolean` | no | `false` |
| `id` | `string` | no | — |
| `ariaDescribedby` | `string` | no | — |
| `clearable` | `boolean` | no | `false` |
| `loading` | `boolean` | no | `false` |
| `size` | `'medium' \| 'large'` | no | — |
| `autofocus` | `boolean` | no | `false` |

Slots: `icon-leading`, `icon-trailing`, `icon-password-show`, `icon-password-hide`, `icon-clear`, `icon-loading`. Events: `update:modelValue`, `input`, `change`, `focus`, `blur`, `clear`.

## Tested Vue example

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
