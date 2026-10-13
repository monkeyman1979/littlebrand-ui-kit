<script setup lang="ts">
import { ref } from 'vue'
import { LbInput } from '../../src/components'
const email = ref('')
</script>

<template>
  <label for="contact-email">Email</label>
  <LbInput id="contact-email" v-model="email" type="email" name="email" autocomplete="email" required />
</template>
