// Vue's DefineComponent expects event handlers, while defineEmits uses event
// argument tuples. Preserve the source signatures when declaring components.
export type ComponentEmits<Events extends { [K in keyof Events]: unknown[] }> = {
  [K in keyof Events]: (...args: Events[K]) => void
}
