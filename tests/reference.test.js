import { afterEach, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { compile } from 'sass'
import { resolve } from 'node:path'
import reference from '../reference/v1.json'

const examples = import.meta.glob('../reference/examples/*.vue', { eager: true, import: 'default' })
const mounted = []
afterEach(() => {
  for (const { wrapper, node } of mounted.splice(0)) { wrapper.unmount(); node.remove() }
  document.body.innerHTML = ''
})

function render(file) {
  const node = document.createElement('div')
  document.body.append(node)
  const wrapper = mount(examples[`../${file}`], { attachTo: node })
  mounted.push({ wrapper, node })
  return wrapper
}

test('authored, machine and Markdown references agree without writing generated files', () => {
  execFileSync(process.execPath, ['scripts/generate-reference.js', '--check'])
  const index = readFileSync('docs/reference/v1/README.md', 'utf8')
  const aiIndex = readFileSync('site/public/reference/v1/ai-index.md', 'utf8')
  expect(aiIndex).toContain(`v${reference.schemaVersion}`)
  for (const component of reference.components) {
    const page = readFileSync(`docs/reference/v1/components/${component.name}.md`, 'utf8')
    expect(index).toContain(`components/${component.name}.md`)
    expect(page).toContain(component.id)
    expect(page).toContain(component.usage.trim())
    expect(page).toContain(component.purpose)
    expect(aiIndex).toContain(component.id)
    expect(readFileSync(`site/public/reference/v1/components/${component.name}.md`, 'utf8')).toBe(page)
  }
  const tokens = readFileSync('docs/reference/v1/TOKENS.md', 'utf8')
  const css = compile(resolve('src/styles/_theme.sass'), { loadPaths: [resolve('src/styles')], logger: { warn() {}, debug() {} } }).css
  for (const token of reference.tokens) {
    expect(tokens).toContain(token.id)
    expect(index).toContain(token.name)
    expect(css).toContain(`${token.name}:`)
    expect(aiIndex).toContain(token.id)
  }
  expect(reference.components.find(c => c.name === 'LbDialog').usage).not.toContain('variant="filled"')
  expect(reference.components.find(c => c.name === 'LbSegmentButtonItem').usage).toContain('<LbSegmentButton ')
})

test('every authored Vue example mounts and exposes the intended interaction', async () => {
  expect(Object.keys(examples)).toHaveLength(6)
  const button = render('reference/examples/button.vue')
  expect(button.get('button').text()).toBe('Save changes')
  await button.get('button').trigger('click')
  expect(button.get('[role="status"]').text()).toBe('Saved')
  const input = render('reference/examples/input.vue')
  expect(input.get('label').attributes('for')).toBe(input.get('input').attributes('id'))
  await input.get('input').setValue('hello@example.com')
  expect(input.get('input').element.value).toBe('hello@example.com')
  const dialog = render('reference/examples/dialog.vue')
  await dialog.get('button').trigger('click')
  await nextTick()
  expect(document.body.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Preferences')
  const segment = render('reference/examples/segment-button.vue')
  expect(segment.findAll('.lb-segment-button-item')).toHaveLength(2)
  await segment.findAll('.lb-segment-button-item')[1].trigger('click')
  expect(segment.findAll('.lb-segment-button-item')[1].attributes('aria-checked')).toBe('true')
  const textarea = render('reference/examples/textarea.vue')
  expect(textarea.get('label').attributes('for')).toBe(textarea.get('textarea').attributes('id'))
  expect(textarea.get('textarea').attributes('name')).toBe('notes')
  expect(textarea.get('textarea').attributes('aria-describedby')).toBe('notes-help')
  await textarea.get('textarea').setValue('Longer notes')
  expect(textarea.get('textarea').element.value).toBe('Longer notes')
  const field = render('reference/examples/form-field.vue')
  const control = field.get('textarea')
  expect(field.get('label').attributes('for')).toBe(control.attributes('id'))
  expect(control.attributes('aria-describedby')).toBe(field.get('.lb-hint-text').attributes('id'))
  field.get('button').element.click()
  await nextTick()
  expect(control.attributes('aria-invalid')).toBe('true')
  expect(field.get('.lb-hint-text').text()).toContain('Biography is required')
  expect(field.emitted('save')).toBeUndefined()
  await control.setValue('A short biography')
  field.get('button').element.click()
  await nextTick()
  expect(control.attributes('aria-invalid')).toBeUndefined()
  expect(field.emitted('save')).toEqual([['A short biography']])
})
