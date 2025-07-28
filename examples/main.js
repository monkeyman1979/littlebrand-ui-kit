import { createApp } from 'vue'
import App from './App.vue'

// Import global styles for the example app
import '../src/styles/main.sass'

const app = createApp(App)

app.mount('#app')