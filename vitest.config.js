import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue({
    template: {
      preprocessOptions: { pug: { doctype: 'html' } },
      compilerOptions: { isCustomElement: (tag) => ['Calendar', 'Grid', 'List'].includes(tag) }
    }
  })],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
    clearMocks: true
  }
})
