import { onScopeDispose } from 'vue'

interface BodyLock {
  owners: number
  overflowX: string
  overflowY: string
  priorityX: string
  priorityY: string
  stopTouchGuard: () => void
}

// Prevent touch scroll chaining into the page (including mobile Safari), while
// allowing inner scroll containers to consume gestures in either direction.
function guardBackgroundTouch(body: HTMLElement) {
  let x = 0
  let y = 0
  const start = (event: TouchEvent) => {
    x = event.touches[0]?.clientX ?? 0
    y = event.touches[0]?.clientY ?? 0
  }
  const move = (event: TouchEvent) => {
    if (event.touches.length !== 1) return // Preserve pinch zoom.
    const touch = event.touches[0]
    const dx = x - touch.clientX
    const dy = y - touch.clientY
    x = touch.clientX
    y = touch.clientY
    if (!dx && !dy) return
    for (let element = event.target instanceof Element ? event.target : null;
      element && element !== body; element = element.parentElement) {
      const style = getComputedStyle(element)
      const horizontal = Math.abs(dx) > Math.abs(dy)
      const overflow = horizontal ? style.overflowX : style.overflowY
      const position = horizontal ? element.scrollLeft : element.scrollTop
      const maximum = horizontal ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight
      const delta = horizontal ? dx : dy
      if (/(auto|scroll|overlay)/.test(overflow) && maximum > 0
        && (delta < 0 ? position > 0 : position < maximum - 1)) return
    }
    if (event.cancelable) event.preventDefault()
  }
  body.addEventListener('touchstart', start, { passive: true })
  body.addEventListener('touchmove', move, { passive: false })
  return () => {
    body.removeEventListener('touchstart', start)
    body.removeEventListener('touchmove', move)
  }
}

// Shared by Dialog and BottomSheet, but isolated per document/body (including SSR).
const locks = new WeakMap<HTMLElement, BodyLock>()

/** Internal, per-component ownership: one overlay cannot unlock another overlay. */
export function useBodyScrollLock() {
  let body: HTMLElement | undefined

  const lock = () => {
    if (body || typeof document === 'undefined' || !document.body) return
    body = document.body
    const existing = locks.get(body)
    if (existing) {
      existing.owners++
      return
    }
    const style = body.style
    locks.set(body, {
      owners: 1,
      overflowX: style.getPropertyValue('overflow-x'),
      overflowY: style.getPropertyValue('overflow-y'),
      priorityX: style.getPropertyPriority('overflow-x'),
      priorityY: style.getPropertyPriority('overflow-y'),
      stopTouchGuard: guardBackgroundTouch(body)
    })
    style.setProperty('overflow', 'hidden')
  }

  const unlock = () => {
    if (!body) return
    const target = body
    body = undefined
    const state = locks.get(target)
    if (!state || --state.owners > 0) return
    state.stopTouchGuard()
    target.style.removeProperty('overflow')
    for (const [property, value, priority] of [
      ['overflow-x', state.overflowX, state.priorityX],
      ['overflow-y', state.overflowY, state.priorityY]
    ]) {
      if (value) target.style.setProperty(property, value, priority)
      else target.style.removeProperty(property)
    }
    locks.delete(target)
  }

  onScopeDispose(unlock)
  return { lock, unlock }
}
