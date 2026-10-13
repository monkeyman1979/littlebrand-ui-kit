<script setup lang="ts">
import { ref } from 'vue'
import { LbFormField, LbTextarea, LbButton } from '../../src/components'
const biography = ref('')
const error = ref('')
function validate() {
  error.value = biography.value.trim() ? '' : 'Biography is required'
}
</script>

<template>
  <LbFormField label="Biography" hint="Tell us a little about yourself." :error="error" required>
    <LbTextarea v-model="biography" name="biography" :invalid="Boolean(error)" required />
  </LbFormField>
  <LbButton @click="validate">Validate</LbButton>
</template>
