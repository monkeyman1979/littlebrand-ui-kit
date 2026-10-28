<script setup lang="ts">
import { ref } from 'vue'
import { LbButton } from '../../src/components'
const saved = ref(false)
</script>

<template>
  <LbButton @click="saved = true">Save changes</LbButton>
  <p v-if="saved" role="status">Saved</p>
</template>
