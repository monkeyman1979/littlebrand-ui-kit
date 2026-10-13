<script setup lang="ts">
import { LbButton, LbInput, LbDialog, applyTheme } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// Documentation fixture: checked for source/export parity, not executed or typechecked
// against a published tarball. Step 05 must run it in a clean consumer.
let visible = false
let value = ''
void applyTheme
</script>

<template>
  <LbButton @click="visible = true">Open</LbButton>
  <LbInput v-model="value" />
  <LbDialog v-model="visible">Details</LbDialog>
</template>
