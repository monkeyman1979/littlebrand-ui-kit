import { afterEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import LbButton from '../src/components/Buttons/Button/LbButton.vue'
import LbInput from '../src/components/Inputs/Input/LbInput.vue'
import LbDialog from '../src/components/Dialog/LbDialog.vue'
import LbPopover from '../src/components/Popover/LbPopover.vue'
import LbPopoverTrigger from '../src/components/Popover/LbPopoverTrigger.vue'
import LbSegmentButton from '../src/components/Buttons/SegmentButton/LbSegmentButton.vue'
import LbSegmentButtonItem from '../src/components/Buttons/SegmentButton/LbSegmentButtonItem.vue'
import VerifiedSlice from './fixtures/VerifiedSlice.vue'

const wrappers = []
function attached(component, options = {}) {
  const node = document.createElement('div')
  document.body.append(node)
  const wrapper = mount(component, { attachTo: node, ...options })
  wrappers.push({ wrapper, node })
  return wrapper
}

afterEach(() => {
  for (const { wrapper, node } of wrappers.splice(0)) {
    wrapper.unmount()
    node.remove()
  }
  document.body.innerHTML = ''
})

describe('first component slice — narrow DOM interactions, not an accessibility certification', () => {
  test('Button emits click only when enabled; keyboard focus has a native button', async () => {
    const button = attached(LbButton, { slots: { default: 'Continue' } })
    const el = button.get('button')
    el.element.focus()
    expect(document.activeElement).toBe(el.element)
    await el.trigger('click')
    expect(button.emitted('click')).toHaveLength(1)
    await button.setProps({ disabled: true })
    expect(el.attributes('disabled')).toBeDefined()
    await el.trigger('click')
    expect(button.emitted('click')).toHaveLength(1)
  })

  test('Input updates v-model and clear control refocuses input', async () => {
    const input = attached(LbInput, { props: { modelValue: 'hello', clearable: true } })
    const nativeInput = input.get('input')
    await input.get('button[aria-label="Clear input"]').trigger('click')
    expect(input.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(input.emitted('clear')).toHaveLength(1)
    expect(document.activeElement).toBe(nativeInput.element)
    await nativeInput.setValue('new')
    expect(input.emitted('update:modelValue')?.at(-1)).toEqual(['new'])
  })

  test('Dialog opens in a body portal and Escape emits close/model update', async () => {
    const dialog = attached(LbDialog, { props: { modelValue: true }, slots: { default: 'Details' } })
    await nextTick()
    expect(document.body.querySelector('[role="dialog"]')?.textContent).toContain('Details')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(dialog.emitted('update:modelValue')?.at(-1)).toEqual([false])
    expect(dialog.emitted('close')).toHaveLength(1)
  })

  test('disabled and loading links render native disabled buttons, without destinations', async () => {
    const button = attached(LbButton, { props: { href: '/billing', disabled: true }, slots: { default: 'Billing' } })
    expect(button.find('a').exists()).toBe(false)
    expect(button.get('button').attributes('disabled')).toBeDefined()
    await button.setProps({ disabled: false })
    expect(button.get('a').attributes('href')).toBe('/billing')
    await button.setProps({ loading: true, iconOnly: true, iconPosition: 'trailing', href: undefined, to: '/billing' })
    expect(button.get('button').attributes('aria-busy')).toBe('true')
    expect(button.find('.spinner').exists()).toBe(true)
    await button.get('button').trigger('click')
    expect(button.emitted('click')).toBeUndefined()
  })

  test('Input forwards native attributes, preserves wrapper classes and exposes its states', async () => {
    const input = attached(LbInput, { attrs: { name: 'email', autocomplete: 'email', 'aria-label': 'Email', class: 'form-control' }, props: { required: true, invalid: true, type: 'password' } })
    const native = input.get('input')
    expect(native.attributes('name')).toBe('email')
    expect(native.attributes('autocomplete')).toBe('email')
    expect(native.attributes('aria-label')).toBe('Email')
    expect(input.get('.lb-input').classes()).toContain('form-control')
    expect(native.attributes('required')).toBeDefined()
    expect(native.attributes('aria-invalid')).toBe('true')
    await input.get('button[aria-label="Show password"]').trigger('click')
    expect(native.attributes('type')).toBe('text')
    await input.setProps({ readonly: true, disabled: true })
    expect(native.attributes('readonly')).toBeDefined()
    expect(native.attributes('disabled')).toBeDefined()
    expect(input.find('button[aria-label="Hide password"]').exists()).toBe(false)
  })

  test('Dialog exposes an accessible name and respects a custom label', async () => {
    attached(LbDialog, { props: { modelValue: true, title: 'Preferences', showClose: false }, slots: { default: 'Details' } })
    await nextTick()
    const panel = document.body.querySelector('[role="dialog"]')
    expect(panel?.getAttribute('aria-label')).toBe('Preferences')
    expect(panel?.hasAttribute('aria-labelledby')).toBe(false)
    const custom = attached(LbDialog, { props: { modelValue: true, title: 'Ignored fallback' }, attrs: { 'aria-label': 'Custom name' }, slots: { default: 'Other details' } })
    await nextTick()
    expect(document.body.querySelectorAll('[role="dialog"]')[1]?.getAttribute('aria-label')).toBe('Custom name')
    expect(custom.exists()).toBe(true)
    attached(LbDialog, { props: { modelValue: true, title: 'Expanded', variant: 'fullscreen' }, slots: { default: 'More details' } })
    await nextTick()
    const full = document.body.querySelectorAll('[role="dialog"]')[2]
    expect(full?.getAttribute('aria-labelledby')).toBe(full?.querySelector('.dialog-title')?.id)
  })

  test('SegmentButton skips disabled children and arrows select in a single-choice radio group', async () => {
    const segment = attached(LbSegmentButton, {
      props: { modelValue: 'a', allowEmpty: false },
      attrs: { 'aria-label': 'Period' },
      slots: { default: () => [
        h(LbSegmentButtonItem, { value: 'a' }, { default: () => 'Daily' }),
        h(LbSegmentButtonItem, { value: 'b', disabled: true }, { default: () => 'Weekly' }),
        h(LbSegmentButtonItem, { value: 'c' }, { default: () => 'Monthly' })
      ] }
    })
    const buttons = segment.findAll('button')
    expect(segment.get('[role="radiogroup"]').attributes('aria-label')).toBe('Period')
    expect(buttons[0].attributes('tabindex')).toBe('0')
    expect(buttons[2].attributes('tabindex')).toBe('-1')
    buttons[0].element.focus()
    await buttons[0].trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[2].element)
    expect(buttons[1].attributes('disabled')).toBeDefined()
    expect(segment.emitted('update:modelValue')?.at(-1)).toEqual(['c'])
    expect(buttons[2].attributes('aria-checked')).toBe('true')
    expect(buttons[2].attributes('tabindex')).toBe('0')
    expect(buttons[0].attributes('tabindex')).toBe('-1')
  })

  test('required SegmentButton without an initial value stays reachable from its group', async () => {
    const segment = attached(LbSegmentButton, { props: { allowEmpty: false }, slots: { default: () => h(LbSegmentButtonItem, { value: 'first' }, { default: () => 'First' }) } })
    const root = segment.get('[role="radiogroup"]')
    expect(root.attributes('tabindex')).toBe('0')
    root.element.focus()
    await root.trigger('keydown', { key: 'ArrowRight' })
    expect(segment.emitted('update:modelValue')?.at(-1)).toEqual(['first'])
    expect(root.attributes('tabindex')).toBe('-1')
    expect(segment.get('[role="radio"]').attributes('tabindex')).toBe('0')
  })

  test('verified Vue example renders Button, Input, Dialog and compound SegmentButton', async () => {
    const fixture = attached(VerifiedSlice)
    expect(fixture.get('input[name="displayName"]').attributes('required')).toBeDefined()
    expect(fixture.get('[role="radiogroup"]').attributes('aria-label')).toBe('Frequency')
    await fixture.get('button.lb-button').trigger('click')
    await nextTick()
    expect(document.body.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Preferences')
  })

  test('Popover trigger opens on Enter and ignores keyboard action when disabled', async () => {
    const popover = attached(LbPopover, {
      props: { open: false },
      slots: { default: () => h(LbPopoverTrigger, {}, { default: () => 'Options' }) }
    })
    const trigger = popover.get('[role="button"]')
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(popover.emitted('update:open')?.at(-1)).toEqual([true])
    await popover.setProps({ disabled: true })
    expect(trigger.attributes('tabindex')).toBe('-1')
    await trigger.trigger('keydown', { key: ' ' })
    expect(popover.emitted('update:open')).toHaveLength(1)
  })
})
