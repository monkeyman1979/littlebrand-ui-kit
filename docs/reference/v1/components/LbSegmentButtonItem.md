# LbSegmentButtonItem

ID: `component:LbSegmentButtonItem`. [Reference index](../README.md). **Only use inside LbSegmentButton.** One option within LbSegmentButton.

**Use:** Provide a unique value and visible text or ariaLabel within a labelled root.

**Avoid:** Never use independently; it throws without its parent context.

**Accessibility:** Renders a button, with aria-pressed in optional/multi mode or radio semantics in mandatory single mode.

**States:** selected; disabled; keyboard focus.

**Dependencies:** LbSegmentButton parent.

**Related:** [component:LbSegmentButton](./LbSegmentButton.md).

## API (source/declaration checked)

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `value` | `string \| number` | yes | — |
| `disabled` | `boolean` | no | `false` |
| `ariaLabel` | `string` | no | — |

Slots: `default`, `icon`. Events: none.

## Tested Vue example

```vue
<script setup lang="ts">
import 'littlebrand-ui-kit/style.css'
import { ref } from 'vue'
import { LbSegmentButton, LbSegmentButtonItem } from 'littlebrand-ui-kit'
const choice = ref<string | number>('daily')
</script>

<template>
  <LbSegmentButton v-model="choice" :allow-empty="false" aria-label="Frequency">
    <LbSegmentButtonItem value="daily">Daily</LbSegmentButtonItem>
    <LbSegmentButtonItem value="weekly">Weekly</LbSegmentButtonItem>
  </LbSegmentButton>
</template>
```
