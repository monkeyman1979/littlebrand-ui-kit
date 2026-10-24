import { defineConfig, lazyPlugins } from 'vite-plus'
import js from '@eslint/js'
import vueRules from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import { fileURLToPath, URL } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// ESLint remains necessary for Vue template rules not implemented by Oxlint.
// This is the only rule configuration; the framework lint runner just consumes it.
export const frameworkLintFiles = [
  'src/**/*.{js,ts,vue}',
  'scripts/**/*.{js,mjs}',
  'tests/**/*.{js,mjs,ts,vue}',
  'site/**/*.{js,ts,vue}',
  'vite.config.js'
]
export const frameworkLintConfig = [
  { ignores: ['dist/**', 'mcp-server/**', 'node_modules/**', 'examples/**'] },
  {
    files: [
      'src/**/*.js',
      'scripts/**/*.{js,mjs}',
      'tests/**/*.{js,mjs}',
      'site/**/*.js',
      '*.config.js'
    ],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  { files: ['scripts/extract-components.js'], rules: { 'no-useless-escape': 'off' } },
  { files: ['scripts/extract-tokens.js'], rules: { 'no-unused-vars': 'off' } },
  {
    files: ['src/utils/color-generator.js', 'src/utils/oklch-utils.js'],
    rules: { 'no-unused-vars': 'off', 'no-useless-assignment': 'off' }
  },
  ...vueRules.configs['flat/essential'],
  {
    files: ['src/**/*.vue', 'site/**/*.vue'],
    languageOptions: { parserOptions: { parser: tsParser } },
    rules: { 'no-unused-vars': 'off' }
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts', 'site/**/*.ts'],
    languageOptions: { parser: tsParser },
    rules: { 'no-unused-vars': 'off' }
  }
]

export default defineConfig({
  fmt: {
    singleQuote: true,
    semi: false,
    trailingComma: 'none',
    printWidth: 100,
    sortPackageJson: false,
    // Establish formatting for tooling, tests, MCP source and the docs app only.
    // Leave public library source bytes, captured answers and references unchanged.
    ignorePatterns: [
      'src/**',
      'types/**',
      'littlebrand.css.d.ts',
      'node_modules/**',
      'dist/**',
      'mcp-server/dist/**',
      'mcp-server/src/data/**',
      'docs/**',
      'context/**',
      'reference/**',
      'site/public/**',
      'examples/**',
      '**/*.md',
      '**/package-lock.json'
    ]
  },
  lint: {
    plugins: ['typescript', 'oxc'],
    categories: { correctness: 'error' },
    env: { browser: true, node: true },
    ignorePatterns: [
      'node_modules/**',
      'dist/**',
      'mcp-server/dist/**',
      'mcp-server/src/data/**',
      'docs/**',
      'context/**',
      'reference/**',
      'site/public/**',
      'examples/**'
    ],
    // Native TypeScript-Go is not a Vue SFC/Pug typechecker. The mandatory
    // check-types tasks below keep strict vue-tsc/tsc checks, without an any shim.
    options: { typeAware: false, typeCheck: false },
    overrides: [
      { files: ['**/*.vue', '**/*.ts'], rules: { 'no-unused-vars': 'off' } },
      { files: ['scripts/extract-components.js'], rules: { 'no-useless-escape': 'off' } },
      { files: ['scripts/extract-tokens.js'], rules: { 'no-unused-vars': 'off' } },
      {
        files: ['src/utils/color-generator.js', 'src/utils/oklch-utils.js'],
        rules: { 'no-unused-vars': 'off', 'no-useless-assignment': 'off' }
      }
    ]
  },
  run: {
    // Never replay stale security/runtime or validation results during migration.
    cache: false,
    tasks: {
      'check-lint': { command: ['vp lint', 'node scripts/lint-framework.mjs'] },
      'check-types': {
        command: [
          'vue-tsc --noEmit --project tsconfig.json',
          'tsc --noEmit --project tests/fixtures/tsconfig.consumer.json',
          'tsc --noEmit --project tests/fixtures/tsconfig.node-consumer.json'
        ]
      },
      'check-types-site': { command: 'vue-tsc --noEmit --project site/tsconfig.json' },
      'check-types-mcp': {
        command:
          'node mcp-server/node_modules/typescript/bin/tsc --noEmit -p mcp-server/tsconfig.json'
      },
      verify: {
        command: [
          'vp check',
          'node scripts/lint-framework.mjs',
          'vp run check-types',
          'vp run check-types-site',
          'vp run check-types-mcp',
          'vp test run',
          'node tests/mcp-stdio.mjs',
          'node scripts/generate-reference.js --check'
        ]
      },
      'check-browser': {
        command: [
          'node tests/browser-theme.mjs',
          'node tests/browser-component-slice.mjs',
          'node tests/browser-overlay-scroll.mjs',
          'node tests/browser-doc-site.mjs'
        ]
      },
      'verify-all': { command: ['vp run verify', 'vp run check-browser'] }
    }
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  plugins: lazyPlugins(async () => {
    const { default: vue } = await import('@vitejs/plugin-vue')
    return [
      vue({
        template: {
          preprocessOptions: { pug: { doctype: 'html' } },
          compilerOptions: { isCustomElement: (tag) => ['Calendar', 'Grid', 'List'].includes(tag) }
        }
      })
    ]
  }),
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
    clearMocks: true
  },
  server: { fs: { allow: [projectRoot] } },
  build: {
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'LittleBrandUI',
      fileName: 'littlebrand-ui'
    },
    rolldownOptions: {
      external: ['vue'],
      output: { exports: 'named', globals: { vue: 'Vue' } }
    }
  },
  css: { preprocessorOptions: { sass: { indentedSyntax: true } } }
})
