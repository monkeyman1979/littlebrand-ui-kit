<script setup lang="ts">
import { ref } from 'vue'
import { LbButton, LbInput, LbDialog, LbSegmentButton, LbSegmentButtonItem } from '../../src/components'

const name = ref('')
const choice = ref<string | number>('daily')
const open = ref(false)
</script>

<template>
  <LbButton @click="open = true">Open preferences</LbButton>
  <LbInput v-model="name" name="displayName" aria-label="Display name" clearable required />
  <LbSegmentButton v-model="choice" :allow-empty="false" aria-label="Frequency">
    <LbSegmentButtonItem value="daily">Daily</LbSegmentButtonItem>
    <LbSegmentButtonItem value="weekly">Weekly</LbSegmentButtonItem>
  </LbSegmentButton>
  <LbDialog v-model="open" title="Preferences">
    <p>Choose when to receive updates.</p>
    <template #footer>
      <LbButton @click="open = false">Done</LbButton>
    </template>
  </LbDialog>
</template>
