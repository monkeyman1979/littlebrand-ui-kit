<script setup lang="ts">
import { ref } from 'vue'
import { LbFormField, LbTextarea, LbButton } from '../../src/components'
const biography = ref('')
const error = ref('')
const emit = defineEmits<{ save: [biography: string] }>()
function onSubmit() {
  const text = biography.value.trim()
  error.value = text ? '' : 'Biography is required'
  if (!error.value) emit('save', text)
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <LbFormField label="Biography" hint="Tell us a little about yourself." :error="error" required>
      <LbTextarea v-model="biography" name="biography" :invalid="Boolean(error)" required />
    </LbFormField>
    <LbButton type="submit">Save biography</LbButton>
  </form>
</template>
