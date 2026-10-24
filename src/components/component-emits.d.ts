import type { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue'

// These building blocks are public in Vue 3.3; Vue's PublicProps and
// EmitsToProps aliases were only exported in later versions.
export type ComponentPublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps
export type ComponentEventProps<Events> = {
  [K in keyof Events & string as `on${Capitalize<K>}`]?: Events[K]
}

// Vue's DefineComponent expects event handlers, while defineEmits uses event
// argument tuples. Preserve the source signatures when declaring components.
export type ComponentEmits<Events extends { [K in keyof Events]: unknown[] }> = {
  [K in keyof Events]: (...args: Events[K]) => void
}
