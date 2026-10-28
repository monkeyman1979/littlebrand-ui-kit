# LbButton

ID: `component:LbButton`. [Reference index](../README.md). Trigger an action or navigate to a destination.

**Use:** Use a native button for actions; inside a form use type=submit with one form @submit.prevent handler. Use href for a URL, or to only in a host with Vue Router.

**Find by intent:** action; submit; save; button; link; navigate.

**Avoid:** Do not attach the same action to both a submit button click and its form submit; do not use iconOnly without an accessible name or a link for a disabled action.

**Accessibility:** Native button by default; iconOnly needs aria-label. Loading exposes aria-busy and blocks activation. Disabled/loading links become disabled buttons.

**States:** filled, tonal, outline, ghost or link; small, medium or large; disabled; loading; keyboard focus.

**Dependencies:** Vue 3; Vue Router only for the to prop.

**Related:** [component:LbDialog](./LbDialog.md), [token:--lb-fill-primary-normal](../TOKENS.md#token---lb-fill-primary-normal), [token:--lb-text-on-primary](../TOKENS.md#token---lb-text-on-primary), [token:--lb-focus-ring-color](../TOKENS.md#token---lb-focus-ring-color).

## API (source/declaration checked)

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `variant` | `'filled' \| 'tonal' \| 'outline' \| 'ghost' \| 'link'` | no | `filled` |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | no | `primary` |
| `size` | `'small' \| 'medium' \| 'large'` | no | `medium` |
| `type` | `'button' \| 'submit' \| 'reset'` | no | `button` |
| `disabled` | `boolean` | no | `false` |
| `loading` | `boolean` | no | `false` |
| `fullWidth` | `boolean` | no | `false` |
| `iconPosition` | `'leading' \| 'trailing'` | no | `leading` |
| `iconOnly` | `boolean` | no | `false` |
| `href` | `string` | no | — |
| `to` | `string \| object` | no | — |
| `target` | `string` | no | — |
| `rel` | `string` | no | — |
| `muted` | `boolean` | no | `false` |

Slots: `default`, `icon-leading`, `icon-trailing`. Events: `click`.

## Tested Vue example

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { ref } from 'vue'
import { LbButton } from 'littlebrand-ui-kit'
const saved = ref(false)
</script>

<template>
  <LbButton @click="saved = true">Save changes</LbButton>
  <p v-if="saved" role="status">Saved</p>
</template>
```
