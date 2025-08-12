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
    v-show="showFallback"
    :class="{ 'visible': showFallback }"
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
import { computed, ref, watch, useSlots } from 'vue'

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
const imageState = ref<ImageState>(props.src ? 'loading' : 'no-src')

// Watchers
watch(() => props.src, (newSrc) => {
  imageState.value = newSrc ? 'loading' : 'no-src'
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
@use '@/styles/typography' as typography
@use '@/styles/component-variables' as cv

.lb-avatar
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  border-radius: cv.$avatar-border-radius
  background-color: var(--lb-background-surface-raised)
  box-shadow: base.$shadow-sm
  flex-shrink: 0
  
  // Size variants - using space variables since avatar-size variables don't work
  &.size-xs
    width: cv.$avatar-size-xs
    height: cv.$avatar-size-xs
    
  &.size-sm
    width: cv.$avatar-size-sm
    height: cv.$avatar-size-sm
    
  &.size-md
    width: cv.$avatar-size-md
    height: cv.$avatar-size-md
    
  &.size-lg
    width: cv.$avatar-size-lg
    height: cv.$avatar-size-lg
    
  &.size-xl
    width: cv.$avatar-size-xl
    height: cv.$avatar-size-xl

  // Image inside avatar - need to override global img reset
  img.avatar-image
    position: absolute
    top: 0
    left: 0
    display: block
    width: 100%
    height: 100%
    max-width: 100%
    max-height: 100%
    object-fit: cover
    transition: opacity base.$transition
    border-radius: inherit
    
    &.loading
      opacity: base.$opacity-0
      
    &.loaded
      opacity: base.$opacity-100

  // Fallback container
  .avatar-fallback
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    align-items: center
    justify-content: center
    font-weight: typography.$font-weight-medium
    transition: opacity base.$transition
    opacity: base.$opacity-0
    border-radius: inherit
    
    &.visible
      opacity: base.$opacity-100

    // Fallback text inside
    .fallback-text
      font-family: typography.$font-body
      text-transform: uppercase
      letter-spacing: typography.$letter-spacing-wide
      line-height: typography.$line-height-compact
      user-select: none

    // Fallback icon container
    .fallback-icon
      display: flex
      align-items: center
      justify-content: center
      
      .default-icon
        fill: currentColor

  // Status indicator
  .status-indicator
    position: absolute
    border-radius: base.$radius-full
    border: base.$border-md solid var(--lb-background-surface)
    
    &.status-online
      background-color: var(--lb-text-success-normal)
      
    &.status-offline
      background-color: var(--lb-text-neutral-contrast-low)
      
    &.status-away
      background-color: var(--lb-text-warning-normal)
      
    &.status-busy
      background-color: var(--lb-text-error-normal)

  // Color variants for fallback
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

  // Size-specific styles for text
  &.size-xs .fallback-text
    font-size: typography.$font-size-label-small
    
  &.size-sm .fallback-text
    font-size: typography.$font-size-label-base
    
  &.size-md .fallback-text
    font-size: typography.$font-size-body-base
    
  &.size-lg .fallback-text
    font-size: typography.$font-size-body-large
    
  &.size-xl .fallback-text
    font-size: typography.$font-size-body-large

  // Size-specific styles for icon
  &.size-xs .default-icon
    width: cv.$avatar-icon-size-xs
    height: cv.$avatar-icon-size-xs
    
  &.size-sm .default-icon
    width: cv.$avatar-icon-size-sm
    height: cv.$avatar-icon-size-sm
    
  &.size-md .default-icon
    width: cv.$avatar-icon-size-md
    height: cv.$avatar-icon-size-md
    
  &.size-lg .default-icon
    width: cv.$avatar-icon-size-lg
    height: cv.$avatar-icon-size-lg
    
  &.size-xl .default-icon
    width: cv.$avatar-icon-size-xl
    height: cv.$avatar-icon-size-xl

  // Size-specific styles for status indicator
  &.size-xs .status-indicator,
  &.size-sm .status-indicator
    bottom: calc(#{base.$space-2xs} * -1)
    right: calc(#{base.$space-2xs} * -1)
    
  &.size-xs .status-indicator
    width: cv.$avatar-status-size-xs
    height: cv.$avatar-status-size-xs
    
  &.size-sm .status-indicator
    width: cv.$avatar-status-size-sm
    height: cv.$avatar-status-size-sm
    
  &.size-md .status-indicator,
  &.size-lg .status-indicator
    bottom: 0
    right: 0
    
  &.size-md .status-indicator
    width: cv.$avatar-status-size-md
    height: cv.$avatar-status-size-md
    
  &.size-lg .status-indicator
    width: cv.$avatar-status-size-lg
    height: cv.$avatar-status-size-lg
    
  &.size-xl .status-indicator
    width: cv.$avatar-status-size-xl
    height: cv.$avatar-status-size-xl
    bottom: base.$space-2xs
    right: base.$space-2xs
</style>