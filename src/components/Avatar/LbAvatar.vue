<template lang="pug">
.lb-avatar(:class="avatarClasses" role="img" :aria-label="accessibleLabel")
  //- Image element with loading states
  img.avatar-image(
    v-if="showImage"
    :src="src"
    :alt="alt"
    loading="lazy"
    @load="handleImageLoad"
    @error="handleImageError"
    :class="{ 'loading': imageState === 'loading', 'loaded': imageState === 'loaded' }"
  )
  
  //- Fallback content
  .avatar-fallback(
    v-if="showFallback"
    :class="{ 'visible': imageState === 'error' || imageState === 'no-src' }"
    :style="fallbackStyles"
  )
    //- Custom fallback slot content
    slot(v-if="$slots.fallback" name="fallback")
    //- Generated initials from name
    span.fallback-text(v-else-if="initials") {{ initials }}
    //- Legacy fallback prop support
    span.fallback-text(v-else-if="fallback") {{ fallback }}
    //- Default icon fallback
    .fallback-icon(v-else)
      svg.default-icon(viewBox="0 0 24 24" fill="currentColor")
        path(d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z")
  
  //- Status indicator
  .status-indicator(
    v-if="status"
    :class="`status-${status}`"
    :aria-label="`Status: ${status}`"
    role="status"
  )
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, useSlots } from 'vue'

// Types
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ImageState = 'loading' | 'loaded' | 'error' | 'no-src'
type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
type Status = 'online' | 'offline' | 'away' | 'busy'

// Props
const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  size?: Size
  name?: string
  fallback?: string
  variant?: ColorVariant
  status?: Status
}>(), {
  size: 'md',
  alt: 'Avatar',
  variant: 'primary'
})

// Emits
const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

// Slots
const slots = useSlots()

// Reactive state
const imageState = ref<ImageState>('loading')

// Watchers
watch(() => props.src, (newSrc) => {
  if (newSrc) {
    imageState.value = 'loading'
  } else {
    imageState.value = 'no-src'
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  if (!props.src) {
    imageState.value = 'no-src'
  }
})

// Computed
const avatarClasses = computed(() => [
  `size-${props.size}`,
  `variant-${props.variant}`
])

const initials = computed(() => {
  if (props.name) {
    const names = props.name.trim().split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }
  }
  return ''
})

const showImage = computed(() => {
  return props.src && (imageState.value === 'loading' || imageState.value === 'loaded')
})

const showFallback = computed(() => {
  return imageState.value === 'error' || imageState.value === 'no-src' || !!slots.fallback
})

const fallbackStyles = computed(() => {
  // CSS variables will handle the color variants
  return {}
})

const accessibleLabel = computed(() => {
  if (props.alt && props.alt !== 'Avatar') {
    return props.alt
  }
  if (props.name && imageState.value !== 'loaded') {
    return `Avatar for ${props.name}`
  }
  if (props.fallback && imageState.value !== 'loaded') {
    return `Avatar for ${props.fallback}`
  }
  return 'Avatar'
})

// Methods
const handleImageLoad = (event: Event) => {
  imageState.value = 'loaded'
  emit('load', event)
}

const handleImageError = (event: Event) => {
  imageState.value = 'error'
  emit('error', event)
}

// Component options
defineOptions({
  name: 'LbAvatar',
  inheritAttrs: false
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base

.lb-avatar
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  border-radius: var(--radius-full)
  background-color: var(--color-surface-raised)
  box-shadow: var(--shadow-sm)
  flex-shrink: 0
  
  // Size variants
  &.size-xs
    width: var(--space-2xl) // 24px
    height: var(--space-2xl) // 24px
    
  &.size-sm
    width: var(--space-3xl) // 32px  
    height: var(--space-3xl) // 32px
    
  &.size-md
    width: var(--space-4xl) // 40px
    height: var(--space-4xl) // 40px
    
  &.size-lg
    width: var(--space-5xl) // 48px
    height: var(--space-5xl) // 48px
    
  &.size-xl
    width: var(--space-6xl) // 56px
    height: var(--space-6xl) // 56px

.avatar-image
  width: 100%
  height: 100%
  object-fit: cover
  transition: opacity var(--transition)
  border-radius: var(--radius-full)
  
  &.loading
    opacity: var(--opacity-0)
    
  &.loaded
    opacity: var(--opacity-100)

.avatar-fallback
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  font-weight: var(--font-weight-medium)
  transition: opacity var(--transition)
  opacity: var(--opacity-0)
  border-radius: var(--radius-full)
  overflow: hidden
  
  &.visible
    opacity: var(--opacity-100)

// Color variants for fallback background
.lb-avatar
  &.variant-primary .avatar-fallback
    background-color: var(--color-primary-subtle)
    color: var(--color-primary)
    
  &.variant-secondary .avatar-fallback
    background-color: var(--color-secondary-subtle)
    color: var(--color-secondary)
    
  &.variant-success .avatar-fallback
    background-color: var(--color-success-background)
    color: var(--color-success)
    
  &.variant-warning .avatar-fallback
    background-color: var(--color-warning-background)
    color: var(--color-warning-contrast-text)
    
  &.variant-error .avatar-fallback
    background-color: var(--color-error-background)
    color: var(--color-error)
    
  &.variant-info .avatar-fallback
    background-color: var(--color-info-background)
    color: var(--color-info)

.fallback-text
  font-family: var(--font-body)
  text-transform: uppercase
  letter-spacing: var(--letter-spacing-wide)
  line-height: var(--line-height-compact)
  user-select: none
  
  // Font sizes that scale with avatar size using CSS variables
  .lb-avatar.size-xs &
    font-size: var(--font-size-label-small) // 12px
    
  .lb-avatar.size-sm &
    font-size: var(--font-size-label-small) // 12px
    
  .lb-avatar.size-md &
    font-size: var(--font-size-label-base) // 14px
    
  .lb-avatar.size-lg &
    font-size: var(--font-size-label-base) // 14px
    
  .lb-avatar.size-xl &
    font-size: var(--font-size-label-large) // 16px

.fallback-icon
  display: flex
  align-items: center
  justify-content: center
  
.default-icon
  // Icon sizes that scale with avatar size using CSS variables
  .lb-avatar.size-xs &
    width: var(--icon-size-sm)
    height: var(--icon-size-sm)
    
  .lb-avatar.size-sm &
    width: var(--icon-size-sm)
    height: var(--icon-size-sm)
    
  .lb-avatar.size-md &
    width: var(--icon-size-md)
    height: var(--icon-size-md)
    
  .lb-avatar.size-lg &
    width: var(--icon-size-lg)
    height: var(--icon-size-lg)
    
  .lb-avatar.size-xl &
    width: var(--icon-size-lg)
    height: var(--icon-size-lg)

.status-indicator
  position: absolute
  border-radius: var(--radius-full)
  border: 2px solid var(--color-surface)
  
  // Status indicator sizes and positioning based on avatar size
  .lb-avatar.size-xs &
    width: 0.5rem // 8px
    height: 0.5rem // 8px
    bottom: -0.125rem // -2px
    right: -0.125rem // -2px
    
  .lb-avatar.size-sm &
    width: 0.625rem // 10px
    height: 0.625rem // 10px
    bottom: -0.125rem // -2px
    right: -0.125rem // -2px
    
  .lb-avatar.size-md &
    width: 0.75rem // 12px
    height: 0.75rem // 12px
    bottom: 0
    right: 0
    
  .lb-avatar.size-lg &
    width: 0.875rem // 14px
    height: 0.875rem // 14px
    bottom: 0
    right: 0
    
  .lb-avatar.size-xl &
    width: 1rem // 16px
    height: 1rem // 16px
    bottom: 0.125rem // 2px
    right: 0.125rem // 2px
    
  // Status colors
  &.status-online
    background-color: var(--color-success)
    
  &.status-offline
    background-color: var(--color-text-tertiary)
    
  &.status-away
    background-color: var(--color-warning)
    
  &.status-busy
    background-color: var(--color-error)
</style>