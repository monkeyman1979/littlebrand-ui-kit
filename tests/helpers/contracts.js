import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { globSync } from 'glob'

const root = resolve(import.meta.dirname, '../..')
export const source = (path) => readFileSync(resolve(root, path), 'utf8')
export const files = (pattern) => globSync(pattern, { cwd: root, nodir: true }).sort()

export function componentInventory() {
  const entry = source('src/index.js')
  const barrel = source('src/components/index.ts')
  const namedBlock = entry.match(/\/\/ Export individual components[^\n]*\nexport \{([^}]+)\}/)?.[1]
  if (!namedBlock) throw new Error('Cannot locate root component export block')
  const names = (text) => new Set(text.match(/\bLb[A-Z]\w+\b/g) ?? [])
  const js = names(namedBlock)
  const ts = names(barrel)
  const plugin = new Set([...entry.matchAll(/app\.component\('(Lb\w+)'/g)].map((match) => match[1]))
  const vue = new Set(
    files('src/components/**/*.vue').map((path) =>
      path
        .split('/')
        .at(-1)
        .replace(/\.vue$/, '')
    )
  )
  const dts = new Set(
    files('src/components/**/*.vue.d.ts').map((path) =>
      path
        .split('/')
        .at(-1)
        .replace(/\.vue\.d\.ts$/, '')
    )
  )
  return { js, ts, plugin, vue, dts }
}

export function records() {
  const file = source('mcp-server/src/data/components.ts')
  const literal = file.match(
    /export const components: Component\[\] = (\[.*?\]);\s*\/\/ Quick lookup helpers/s
  )?.[1]
  if (!literal) throw new Error('Cannot locate component records')
  return JSON.parse(literal)
}

export function tokenInventory() {
  const theme = source('src/styles/_theme.sass')
  const colors = source('src/styles/_colors.sass')
  const mcp = source('mcp-server/src/data/tokens.ts')
  const names = (text) =>
    new Set([...text.matchAll(/^\s*(--lb-[\w-]+):/gm)].map((match) => match[1]))
  return {
    semantic: names(theme),
    defined: names(`${theme}\n${colors}`),
    documented: new Set([...mcp.matchAll(/"name": "(--lb-[\w-]+)"/g)].map((match) => match[1]))
  }
}

// Only static, literal references: SASS interpolation is checked by rendering tests later.
export function missingRequiredTokens(names) {
  const missing = []
  for (const family of [
    'primary',
    'secondary',
    'tertiary',
    'neutral',
    'success',
    'warning',
    'error',
    'info'
  ]) {
    for (const role of ['text', 'fill', 'surface', 'border']) {
      const token = `--lb-${role}-${family}-normal`
      if (!names.has(token)) missing.push(token)
    }
    for (const token of [`--lb-text-on-${family}`, `--lb-surface-${family}-normal-alpha`]) {
      if (!names.has(token)) missing.push(token)
    }
  }
  for (const token of ['--lb-shadow-sm', '--lb-shadow-md', '--lb-shadow-lg']) {
    if (!names.has(token)) missing.push(token)
  }
  return missing.sort()
}

export function undefinedComponentTokens(defined) {
  const missing = new Set()
  for (const path of files('src/components/**/*.vue')) {
    for (const [, token] of source(path).matchAll(/var\((--lb-[\w-]+)/g)) {
      if (!token.endsWith('-') && !defined.has(token)) missing.add(token)
    }
  }
  return [...missing].sort()
}

export function usageIssues(
  record,
  allowedVariants = record.props.find((prop) => prop.name === 'variant')?.options
) {
  const issues = []
  const opening = record.usage.match(/^<([a-z][\w-]*)([^>]*)>/)
  if (!opening) return [`${record.name}:unparseable-usage`]
  const [, tag, attrs] = opening
  const expectedTag = record.name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .slice(1)
  if (tag !== expectedTag) issues.push(`${record.name}:wrong-tag`)
  const variant = attrs.match(/\bvariant="([^"]+)"/)?.[1]
  if (variant && allowedVariants?.length && !allowedVariants.includes(variant)) {
    issues.push(`${record.name}:invalid-variant-${variant}`)
  }
  for (const prop of record.props.filter((prop) => prop.required && prop.name !== 'modelValue')) {
    if (!new RegExp(`(?:^|\\s)(?::|v-bind:)?${prop.name}(?:=|\\s|$)`).test(attrs)) {
      issues.push(`${record.name}:missing-${prop.name}`)
    }
  }
  return issues
}
