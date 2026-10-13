import { afterEach, describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import LbButton from '../src/components/Buttons/Button/LbButton.vue'
import LbInput from '../src/components/Inputs/Input/LbInput.vue'
import LbDialog from '../src/components/Dialog/LbDialog.vue'
import LbPopover from '../src/components/Popover/LbPopover.vue'
import LbPopoverTrigger from '../src/components/Popover/LbPopoverTrigger.vue'

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
