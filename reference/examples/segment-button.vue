<script setup lang="ts">
import { ref } from 'vue'
import { LbSegmentButton, LbSegmentButtonItem } from '../../src/components'
const choice = ref<string | number>('daily')
</script>

<template>
  <LbSegmentButton v-model="choice" :allow-empty="false" aria-label="Frequency">
    <LbSegmentButtonItem value="daily">Daily</LbSegmentButtonItem>
    <LbSegmentButtonItem value="weekly">Weekly</LbSegmentButtonItem>
  </LbSegmentButton>
</template>
