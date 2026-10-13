#!/usr/bin/env node
// Step 09 reference compiler. No build or metadata extraction is required.
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'
import { compile } from 'sass'

const root = path.resolve(import.meta.dirname, '..')
const authored = JSON.parse(fs.readFileSync(path.join(root, 'reference/v1.authored.json'), 'utf8'))
const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const pkg = JSON.parse(read('package.json'))
if (authored.packageVersion !== pkg.version) throw new Error('Reference package version differs from package.json')
const output = new Map()
const assert = (condition, message) => { if (!condition) throw new Error(message) }

function sourceFile(text, name) { return ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS) }
function expandType(type, file, extra) {
  const alias = file.statements.find(n => ts.isTypeAliasDeclaration(n) && n.name.text === type)
    ?? extra?.statements.find(n => ts.isTypeAliasDeclaration(n) && n.name.text === type)
  return alias ? alias.type.getText(alias.getSourceFile()) : type
}
function interfaceMembers(file, name) {
  const node = file.statements.find(n => ts.isInterfaceDeclaration(n) && n.name.text === name)
  if (!node && name.endsWith('Emits')) return []
  assert(node, `Missing interface ${name}`)
  return node.members.filter(member => ts.isPropertySignature(member) || ts.isMethodSignature(member)).map(member => ({
    name: member.name.getText(file).replaceAll(/['"]/g, ''),
    type: expandType(member.type?.getText(file) ?? 'unknown', file),
    required: !member.questionToken
  }))
}
function implementationProps(source, name) {
  const file = sourceFile(source, name)
  let props
  let defaults = {}
  let propTypes = {}
  let emits = []
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(file) === 'defineEmits') {
      emits = node.typeArguments?.[0]?.members?.map(p => p.name?.getText(file).replaceAll(/['"]/g, '')) ?? []
    }
    if (ts.isCallExpression(node) && node.expression.getText(file) === 'withDefaults') {
      const declaration = node.arguments[0]
      const type = declaration?.typeArguments?.[0]
      if (type) {
        const members = ts.isTypeLiteralNode(type) ? type.members : file.statements.find(n =>
          (ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name.text === type.getText(file))?.members
        assert(members, `${name}: cannot locate implementation props`)
        props = members.filter(ts.isPropertySignature).map(p => p.name.getText(file))
        const shared = name.startsWith('LbSegmentButton') ? sourceFile(read('src/components/Buttons/SegmentButton/types.ts'), 'types.ts') : undefined
        propTypes = Object.fromEntries(members.filter(ts.isPropertySignature).map(p => [p.name.getText(file), expandType(p.type?.getText(file) ?? 'unknown', file, shared)]))
        const obj = node.arguments[1]
        assert(ts.isObjectLiteralExpression(obj), `${name}: defaults must be an object`)
        defaults = Object.fromEntries(obj.properties.filter(ts.isPropertyAssignment).map(p => [p.name.getText(file), p.initializer.getText(file).replace(/^'|'$/g, '')]))
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  assert(props, `${name}: withDefaults(defineProps) missing`)
  return { props, defaults, propTypes, emits }
}
const css = compile(path.join(root, 'src/styles/_theme.sass'), {
  loadPaths: [path.join(root, 'src/styles')], logger: { warn() {}, debug() {} }
}).css
const tokenNames = new Set([...css.matchAll(/(--lb-[a-z0-9-]+):\s*[^;]+;/g)].map(m => m[1]))
const ids = new Set()
for (const item of [...authored.components, ...authored.tokens]) {
  assert(!ids.has(item.id), `Duplicate ID: ${item.id}`)
  ids.add(item.id)
}
const link = (id, from = 'index') => {
  assert(ids.has(id), `Broken reference link: ${id}`)
  if (id.startsWith('component:')) {
    const name = id.slice('component:'.length)
    return from === 'component' ? `./${name}.md` : `./components/${name}.md`
  }
  return from === 'component' ? `../TOKENS.md#${id.replace(':', '-')}` : `./TOKENS.md#${id.replace(':', '-')}`
}
const related = (item, from) => item.related.map(id => `[${id}](${link(id, from)})`).join(', ')
const api = {}
for (const item of authored.components) {
  assert(item.id === `component:${item.name}`, `Invalid component ID: ${item.id}`)
  const declaration = item.source + '.d.ts'
  const declared = sourceFile(read(declaration), declaration)
  const props = interfaceMembers(declared, `${item.name}Props`)
  const descriptor = parse(read(item.source)).descriptor
  const { props: sourceProps, defaults, propTypes, emits: sourceEmits } = implementationProps(descriptor.scriptSetup.content, item.name)
  assert(JSON.stringify(sourceProps.slice().sort()) === JSON.stringify(props.map(p => p.name).sort()), `${item.name}: declaration/source prop drift`)
  for (const prop of props) {
    if (['variant', 'color', 'size', 'type', 'width', 'iconPosition'].includes(prop.name)) {
      const normalize = value => value.replaceAll(/\s+/g, '').replaceAll('"', "'")
      assert(normalize(prop.type) === normalize(propTypes[prop.name]), `${item.name}.${prop.name}: declaration/source type drift`)
    }
    if (Object.hasOwn(defaults, prop.name)) prop.default = defaults[prop.name]
    else if (!prop.required && prop.type === 'boolean') prop.default = 'false'
  }
  const slots = interfaceMembers(declared, `${item.name}Slots`).map(p => p.name)
  const emits = interfaceMembers(declared, `${item.name}Emits`).map(p => p.name)
  const sameNames = (a, b) => JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort())
  assert(sameNames(emits, sourceEmits), `${item.name}: declaration/source event drift`)
  const templateSlots = descriptor.template.content.split('\n').map(line => line.trim()).filter(line => /^slot(?:\(|$)/.test(line))
    .map(line => line.match(/name="([^"]+)"/)?.[1] ?? 'default')
  assert(sameNames(slots, templateSlots), `${item.name}: declaration/template slot drift`)
  const example = read(item.example)
  assert(example.includes("from '../../src/components'"), `${item.name}: example must import verified source exports`)
  if (item.compoundOnly) assert(example.includes('<LbSegmentButton '), 'Item example must include root')
  const usage = example.replace("from '../../src/components'", "from 'littlebrand-ui-kit'")
    .replace('<script setup lang="ts">', "<script setup lang=\"ts\">\nimport 'littlebrand-ui-kit/style.css'")
  api[item.id] = { ...item, declaration, props, slots, emits, usage }
}
for (const token of authored.tokens) {
  assert(token.id === `token:${token.name}` && tokenNames.has(token.name), `Token not in static CSS: ${token.id}`)
}
for (const item of [...authored.components, ...authored.tokens]) for (const id of item.related) link(id)
const machine = { schemaVersion: authored.schemaVersion, packageVersion: authored.packageVersion,
  status: authored.status, distribution: authored.distribution, components: authored.components.map(c => api[c.id]), tokens: authored.tokens }
output.set('reference/v1.json', JSON.stringify(machine, null, 2) + '\n')
const heading = `# LittleBrand verified reference v${authored.schemaVersion}\n\nSource: \`reference/v1.authored.json\`; API derived from implementation and declarations. Package version: \`${authored.packageVersion}\`. ${authored.status}.\n\n${authored.distribution}\n`
const componentList = authored.components.map(c => `- [${c.name}](${link(c.id)})${c.compoundOnly ? ' (compound child only)' : ''} — ${c.purpose}`).join('\n')
const tokenList = authored.tokens.map(t => `- [\`${t.name}\`](${link(t.id)}) — ${t.purpose}`).join('\n')
output.set('docs/reference/v1/README.md', `${heading}\n## Components\n\n${componentList}\n\n## Verified semantic token selection\n\n${tokenList}\n\nOnly these authored tokens are listed here; see [Step 02](../../STEP_02_TOKEN_CONTRACT.md) for the complete semantic grammar. Generic extracted MCP examples are not verified: Dialog has no filled variant, and a SegmentButtonItem cannot stand alone.\n`)
output.set('docs/reference/v1/TOKENS.md', `${heading}\n## Selected semantic tokens\n\n${authored.tokens.map(t => `<a id="${t.id.replace(':', '-')}"></a>\n### \`${t.name}\`\n\nID: \`${t.id}\`. ${t.purpose}\n\nRelated: ${related(t, 'index')}.`).join('\n\n')}\n`)
output.set('docs/reference/v1/ai-index.md', `${heading}\n## Find a verified item\n\n${authored.components.filter(c => !c.compoundOnly).map(c => `- ${c.id} — ${c.purpose} [Reference](${link(c.id)})`).join('\n')}\n\nCompound child: [component:LbSegmentButtonItem](${link('component:LbSegmentButtonItem')}) only inside LbSegmentButton.\n\n## Selected tokens\n\n${authored.tokens.map(t => `- ${t.id} — [${t.name}](${link(t.id)})`).join('\n')}\n\nUse the package root and \`littlebrand-ui-kit/style.css\`. Current published npm 0.8.3 has not been verified against this source reference.\n`)
for (const item of authored.components) {
  const entry = api[item.id]
  const rows = entry.props.map(p => `| \`${p.name}\` | \`${p.type.replaceAll('|', '\\|')}\` | ${p.required ? 'yes' : 'no'} | ${p.default === undefined ? '—' : `\`${p.default}\``} |`).join('\n')
  output.set(`docs/reference/v1/components/${item.name}.md`, `# ${item.name}\n\nID: \`${item.id}\`. [Reference index](../README.md). ${item.compoundOnly ? '**Only use inside LbSegmentButton.** ' : ''}${item.purpose}\n\n**Use:** ${item.use}\n\n**Find by intent:** ${item.intents.join('; ')}.\n\n**Avoid:** ${item.avoid}\n\n**Accessibility:** ${item.accessibility}\n\n**States:** ${item.states.join('; ')}.\n\n**Dependencies:** ${item.dependencies.join('; ')}.\n\n**Related:** ${related(item, 'component')}.\n\n## API (source/declaration checked)\n\n| Prop | Type | Required | Default |\n| --- | --- | --- | --- |\n${rows}\n\nSlots: ${entry.slots.map(s => `\`${s}\``).join(', ') || 'none'}. Events: ${entry.emits.map(e => `\`${e}\``).join(', ') || 'none'}.\n\n## Tested Vue example\n\n\`\`\`vue\n${entry.usage.trim()}\n\`\`\`\n`)
}
// Vite publicDir serves the same generated Markdown beside the local Vue site.
// Keep the repository's full contract links pointing back to the source tree.
for (const [file, content] of [...output]) {
  if (!file.startsWith('docs/reference/v1/')) continue
  const publicContent = file.endsWith('/README.md')
    ? content.replace('../../STEP_02_TOKEN_CONTRACT.md', 'https://github.com/monkeyman1979/littlebrand-ui-kit/blob/develop/docs/STEP_02_TOKEN_CONTRACT.md')
    : content
  output.set(file.replace('docs/reference/v1/', 'site/public/reference/v1/'), publicContent)
}
const check = process.argv.includes('--check')
for (const [file, content] of output) {
  const target = path.join(root, file)
  if (check) assert(fs.existsSync(target) && fs.readFileSync(target, 'utf8') === content, `Stale generated reference: ${file}; run npm run reference:generate`)
  else { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content) }
}
console.log(`${check ? 'Checked' : 'Generated'} ${output.size} reference files`)
