<script setup lang="ts">
import { onMounted, ref, version } from 'vue'
import { applyTheme } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'
import SaveExample from './examples/LbButton.vue'
import EmailExample from './examples/LbInput.vue'
import NotesExample from './examples/LbTextarea.vue'
import FormExample from './examples/LbFormField.vue'
import DialogExample from './examples/LbDialog.vue'
import FrequencyExample from './examples/LbSegmentButton.vue'

const saves = ref(0)
const dark = ref(false)
function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.dataset.theme = dark.value ? 'dark' : 'light'
}
onMounted(() => {
  Object.assign(window, { __consumerVueVersion: version })
})
</script>

<template>
  <main>
    <button id="theme-toggle" @click="toggleTheme">Toggle theme</button>
    <button id="brand-change" @click="applyTheme({ primary: '#8b5cf6' })">Change brand</button>
    <section id="save"><SaveExample /></section>
    <section id="email"><EmailExample /></section>
    <section id="notes-example"><NotesExample /></section>
    <section id="form">
      <FormExample @save="saves++" /><output>{{ saves }}</output>
    </section>
    <section id="dialog"><DialogExample /></section>
    <section id="frequency"><FrequencyExample /></section>
  </main>
</template>
