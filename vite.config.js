import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
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
    // Preserve Vite 7's browser target rather than silently raising it in Vite 8.
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'LittleBrandUI',
      fileName: 'littlebrand-ui'
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
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