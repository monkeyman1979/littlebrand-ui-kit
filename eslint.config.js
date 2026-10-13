import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'mcp-server/**', 'node_modules/**', 'examples/**'] },
  {
    files: ['src/**/*.js', 'scripts/**/*.js', 'tests/**/*.js', '*.config.js'],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  {
    files: ['scripts/extract-components.js'],
    rules: { 'no-useless-escape': 'off' }
  },
  {
    files: ['scripts/extract-tokens.js'],
    rules: { 'no-unused-vars': 'off' }
  },
  {
    files: ['src/utils/color-generator.js', 'src/utils/oklch-utils.js'],
    rules: { 'no-unused-vars': 'off', 'no-useless-assignment': 'off' }
  },
  ...vue.configs['flat/essential'],
  {
    files: ['src/**/*.vue'],
    languageOptions: { parserOptions: { parser: tsParser } },
    rules: { 'no-unused-vars': 'off' }
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: { parser: tsParser },
    rules: { 'no-unused-vars': 'off' }
  }
]
