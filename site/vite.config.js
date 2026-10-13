import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
export default defineConfig({
  root,
  resolve: { alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) } },
  plugins: [vue({ template: { preprocessOptions: { pug: { doctype: 'html' } } } })],
  server: { fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } }
})
