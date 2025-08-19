import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue({
      template: {
        preprocessOptions: {
          // Enable Pug support in Vue templates
          pug: {
            doctype: 'html'
          }
        },
        compilerOptions: {
          // Tell Vue to treat these as custom elements and not try to resolve them as components
          isCustomElement: (tag) => ['Calendar', 'Grid', 'List'].includes(tag)
        }
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'LittleBrandUI',
      fileName: 'littlebrand-ui'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      sass: {
        // Use indented syntax by default
        indentedSyntax: true
      }
    }
  }
})