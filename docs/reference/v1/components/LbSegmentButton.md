# LbSegmentButton

ID: `component:LbSegmentButton`. [Reference index](../README.md). Choose one or more options from a short set of segments.

**Use:** Nest LbSegmentButtonItem inside the root; bind v-model and label the group.

**Avoid:** Never mount LbSegmentButtonItem alone; it requires root context. Do not treat optional toggle mode as mandatory radio mode.

**Accessibility:** Optional selection uses toggle buttons; nonempty mandatory single selection uses radio semantics. Arrow/Home/End skip disabled items; label icon-only items.

**States:** optional or mandatory; single or multi-select; medium or large; disabled; keyboard focus.

**Dependencies:** Vue 3.

**Related:** [component:LbSegmentButtonItem](./LbSegmentButtonItem.md), [token:--lb-surface-primary-active](../TOKENS.md#token---lb-surface-primary-active).

## API (source/declaration checked)

| Prop | Type | Required | Default |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| (string \| number)[]` | no | — |
| `size` | `'medium' \| 'large'` | no | `medium` |
| `width` | `'full' \| 'auto'` | no | `full` |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'neutral'` | no | `primary` |
| `disabled` | `boolean` | no | `false` |
| `ariaLabelledby` | `string` | no | — |
| `allowEmpty` | `boolean` | no | `true` |
| `multiSelect` | `boolean` | no | `false` |

Slots: `default`. Events: `update:modelValue`.

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
