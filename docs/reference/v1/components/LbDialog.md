# LbDialog

ID: `component:LbDialog`. [Reference index](../README.md). Present a modal decision or focused content.

**Use:** Bind v-model and give the dialog a title or an ARIA name; use the footer slot for actions.

**Avoid:** Do not use variant=filled; only default and fullscreen exist. The header slot renders only in fullscreen and needs its own visible heading.

**Accessibility:** Teleports to body with originating theme; focuses dialog on open, contains Tab and restores trigger focus on close. Escape/backdrop respect close props.

**States:** closed or open; default or fullscreen; close button; Escape and backdrop policy.

**Dependencies:** Vue 3; @vueuse/core (package dependency).

**Related:** [component:LbButton](./LbButton.md), [token:--lb-surface-subtle](../TOKENS.md#token---lb-surface-subtle), [token:--lb-surface-overlay](../TOKENS.md#token---lb-surface-overlay).

## API (source/declaration checked)

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | no | `false` |
| `title` | `string` | no | — |
| `variant` | `'default' \| 'fullscreen'` | no | `default` |
| `showClose` | `boolean` | no | `true` |
| `closeOnBackdrop` | `boolean` | no | `true` |
| `closeOnEscape` | `boolean` | no | `true` |

Slots: `default`, `header`, `footer`. Events: `update:modelValue`, `close`, `open`.

## Tested Vue example

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { ref } from 'vue'
import { LbButton, LbDialog } from 'littlebrand-ui-kit'
const open = ref(false)
</script>

<template>
  <LbButton @click="open = true">Open preferences</LbButton>
  <LbDialog v-model="open" title="Preferences">
    <p>Choose your preferences.</p>
    <template #footer>
      <LbButton @click="open = false">Done</LbButton>
    </template>
  </LbDialog>
</template>
```
