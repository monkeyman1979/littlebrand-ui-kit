<script setup lang="ts">
import { ref } from 'vue'
import { LbTextarea } from '../../src/components'
const notes = ref('')
</script>

<template>
  <label for="notes">Notes</label>
  <LbTextarea id="notes" v-model="notes" name="notes" aria-describedby="notes-help" :maxlength="200" />
  <p id="notes-help">Optional notes, up to 200 characters.</p>
</template>
