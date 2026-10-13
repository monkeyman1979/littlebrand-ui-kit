<script setup lang="ts">
import { ref } from 'vue'
import { LbButton, LbDialog } from '../../src/components'
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
