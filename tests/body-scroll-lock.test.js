import { afterEach, expect, test, vi } from 'vite-plus/test'
import { effectScope, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useBodyScrollLock } from '../src/utils/body-scroll-lock'
import LbDialog from '../src/components/Dialog/LbDialog.vue'
import LbBottomSheet from '../src/components/BottomSheet/LbBottomSheet.vue'

const scopes = []
const wrappers = []
function owner() {
  const scope = effectScope()
  scopes.push(scope)
  return { ...scope.run(useBodyScrollLock), stop: () => scope.stop() }
}

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  for (const scope of scopes.splice(0)) scope.stop()
  document.body.removeAttribute('style')
  document.body.innerHTML = ''
})

test('repeated lock/unlock is idempotent and restores separate overflow axes', () => {
  document.body.style.overflowX = 'clip'
  document.body.style.overflowY = 'scroll'
  const modal = owner()
  modal.lock()
  modal.lock()
  expect(document.body.style.overflow).toBe('hidden')
  modal.unlock()
  expect(document.body.style.overflowX).toBe('clip')
  expect(document.body.style.overflowY).toBe('scroll')
  modal.unlock()
  expect(document.body.style.overflowY).toBe('scroll')
})

test('overlapping owners restore body only when the last owner releases', () => {
  const dialog = owner()
  const sheet = owner()
  dialog.lock()
  sheet.lock()
  dialog.unlock()
  expect(document.body.style.overflow).toBe('hidden')
  sheet.stop()
  expect(document.body.style.overflow).toBe('')
})

test('a closed owner does not unlock another owner during scope cleanup', () => {
  const first = owner()
  const second = owner()
  first.lock()
  second.lock()
  first.unlock()
  first.stop()
  expect(document.body.style.overflow).toBe('hidden')
  second.unlock()
  expect(document.body.style.overflow).toBe('')
})

test('touch guard blocks background and scroll edges but allows inner scrolling and pinch zoom', () => {
  const modal = owner()
  const content = document.createElement('div')
  content.style.overflowY = 'auto'
  Object.defineProperties(content, { scrollHeight: { value: 500 }, clientHeight: { value: 100 } })
  document.body.append(content)
  const touch = (type, target, y, count = 1) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'touches', {
      value: Array.from({ length: count }, () => ({ clientX: 0, clientY: y }))
    })
    target.dispatchEvent(event)
    return event.defaultPrevented
  }
  modal.lock()
  touch('touchstart', document.body, 100)
  expect(touch('touchmove', document.body, 50)).toBe(true)
  touch('touchstart', content, 100)
  expect(touch('touchmove', content, 50)).toBe(false) // Can scroll down.
  content.scrollTop = 400
  touch('touchstart', content, 100)
  expect(touch('touchmove', content, 50)).toBe(true) // At the bottom edge.
  expect(touch('touchmove', content, 100)).toBe(false) // Can scroll back up.
  expect(touch('touchmove', document.body, 50, 2)).toBe(false)
  modal.unlock()
  expect(touch('touchmove', document.body, 50)).toBe(false)
})

test('lock is safe without a browser document', () => {
  const modal = owner()
  vi.stubGlobal('document', undefined)
  try {
    expect(() => {
      modal.lock()
      modal.unlock()
      modal.stop()
    }).not.toThrow()
  } finally {
    vi.unstubAllGlobals()
  }
})

test('Dialog and BottomSheet initially open share the lock and release on unmount', async () => {
  for (const component of [LbDialog, LbBottomSheet]) {
    const wrapper = mount(component, {
      props: { modelValue: true },
      slots: { default: 'Overlay content' }
    })
    wrappers.push(wrapper)
  }
  await nextTick()
  expect(document.body.style.overflow).toBe('hidden')
  wrappers.shift().unmount()
  expect(document.body.style.overflow).toBe('hidden')
  wrappers.shift().unmount()
  expect(document.body.style.overflow).toBe('')
})
