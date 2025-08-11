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
  border-radius: var(--lb-avatar-radius)
  background-color: var(--lb-background-surface-raised)
  box-shadow: var(--lb-shadow-sm)
  flex-shrink: 0
  
  // Size variants
  &.size-xs
    width: base.$unit-24  // 24px
    height: base.$unit-24  // 24px
    
  &.size-sm
    width: base.$avatar-size-small  // 32px  
    height: base.$avatar-size-small  // 32px
    
  &.size-md
    width: base.$unit-40  // 40px
    height: base.$unit-40  // 40px
    
  &.size-lg
    width: base.$avatar-size-medium  // 48px
    height: base.$avatar-size-medium  // 48px
    
  &.size-xl
    width: base.$unit-56  // 56px
    height: base.$unit-56  // 56px

.avatar-image
  width: 100%
  height: 100%
  object-fit: cover
  transition: opacity var(--lb-transition)
  border-radius: var(--lb-avatar-radius)
  
  &.loading
    opacity: var(--lb-opacity-0)
    
  &.loaded
    opacity: var(--lb-opacity-100)

.avatar-fallback
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  font-weight: var(--lb-font-weight-medium)
  transition: opacity var(--lb-transition)
  opacity: var(--lb-opacity-0)
  border-radius: var(--lb-avatar-radius)
  overflow: hidden
  
  &.visible
    opacity: var(--lb-opacity-100)

// Color variants for fallback background
.lb-avatar
  &.variant-primary .avatar-fallback
    background-color: var(--lb-surface-primary-subtle)
    color: var(--lb-text-primary-normal)
    
  &.variant-secondary .avatar-fallback
    background-color: var(--lb-surface-secondary-subtle)
    color: var(--lb-text-secondary-normal)
    
  &.variant-success .avatar-fallback
    background-color: var(--lb-surface-success-subtle)
    color: var(--lb-text-success-normal)
    
  &.variant-warning .avatar-fallback
    background-color: var(--lb-surface-warning-subtle)
    color: var(--lb-text-warning-contrast-high)
    
  &.variant-error .avatar-fallback
    background-color: var(--lb-surface-error-subtle)
    color: var(--lb-text-error-normal)
    
  &.variant-info .avatar-fallback
    background-color: var(--lb-surface-info-subtle)
    color: var(--lb-text-info-normal)

.fallback-text
  font-family: var(--lb-font-body)
  text-transform: uppercase
  letter-spacing: var(--lb-letter-spacing-wide)
  line-height: var(--lb-line-height-compact)
  user-select: none
  
  // Font sizes that scale with avatar size
  .lb-avatar.size-xs &
    font-size: base.$unit-10  // 10px
    
  .lb-avatar.size-sm &
    font-size: base.$avatar-font-size-small  // 14px
    
  .lb-avatar.size-md &
    font-size: base.$unit-16  // 16px
    
  .lb-avatar.size-lg &
    font-size: base.$avatar-font-size-medium  // 18px
    
  .lb-avatar.size-xl &
    font-size: base.$unit-20  // 20px

.fallback-icon
  display: flex
  align-items: center
  justify-content: center
  
.default-icon
  // Icon sizes that scale with avatar size
  .lb-avatar.size-xs &
    width: base.$unit-16  // 16px
    height: base.$unit-16  // 16px
    
  .lb-avatar.size-sm &
    width: base.$unit-18  // 18px
    height: base.$unit-18  // 18px
    
  .lb-avatar.size-md &
    width: base.$unit-20  // 20px
    height: base.$unit-20  // 20px
    
  .lb-avatar.size-lg &
    width: base.$unit-24  // 24px
    height: base.$unit-24  // 24px
    
  .lb-avatar.size-xl &
    width: base.$unit-28  // 28px
    height: base.$unit-28  // 28px

.status-indicator
  position: absolute
  border-radius: base.$radius-full
  border: base.$border-md solid var(--lb-background-surface)
  
  // Status indicator sizes and positioning based on avatar size
  .lb-avatar.size-xs &
    width: base.$unit-8  // 8px
    height: base.$unit-8  // 8px
    bottom: calc(base.$unit-2 * -1)  // -2px
    right: calc(base.$unit-2 * -1)  // -2px
    
  .lb-avatar.size-sm &
    width: base.$unit-10  // 10px
    height: base.$unit-10  // 10px
    bottom: calc(base.$unit-2 * -1)  // -2px
    right: calc(base.$unit-2 * -1)  // -2px
    
  .lb-avatar.size-md &
    width: base.$unit-12  // 12px
    height: base.$unit-12  // 12px
    bottom: 0
    right: 0
    
  .lb-avatar.size-lg &
    width: base.$unit-14  // 14px
    height: base.$unit-14  // 14px
    bottom: 0
    right: 0
    
  .lb-avatar.size-xl &
    width: base.$unit-16  // 16px
    height: base.$unit-16  // 16px
    bottom: base.$unit-2  // 2px
    right: base.$unit-2  // 2px
    
  // Status colors
  &.status-online
    background-color: var(--lb-text-success-normal)
    
  &.status-offline
    background-color: var(--lb-text-neutral-contrast-low)
    
  &.status-away
    background-color: var(--lb-text-warning-normal)
    
  &.status-busy
    background-color: var(--lb-text-error-normal)
</style>