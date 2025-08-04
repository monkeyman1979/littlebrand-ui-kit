import { createApp, h } from 'vue'
import App from './App.vue'
import { LbSnackbarProvider } from '../src'

// Import global styles for the example app
import '../src/styles/main.sass'

// Create app with SnackbarProvider wrapping the root App
const app = createApp({
  render() {
    return h(LbSnackbarProvider, () => h(App))
  }
})

app.mount('#app')