<template lang="pug">
LbDropdown.lb-menu(
  v-model="isOpen"
  :match-width="true"
  :placement="placement === 'bottom-start' ? 'bottom' : placement === 'top-start' ? 'top' : 'auto'"
  :disabled="disabled"
  :close-on-click-outside="true"
  :close-on-escape="true"
  @open="handleOpen"
  @close="handleClose"
)
  template(#trigger)
    slot(name="trigger")
  
  template(#content)
    .menu-content(
      :class="contentClasses"
      @keydown="handleKeydown"
    )
      .menu-search(v-if="searchable")
        form(@submit.prevent="handleFormSubmit")
          input.search-input(
            ref="searchInputRef"
            v-model="searchQuery"
            :placeholder="placeholder"
            @input="handleSearch"
            @keydown.stop
          )
      
      .menu-items-container(
        ref="menuContainerRef"
        :style="containerStyle"
        tabindex="0"
      )
        .menu-items(
          ref="menuItemsRef"
          :style="itemsStyle"
        )
          template(v-for="(item, index) in visibleItems" :key="getItemKey(item, index)")
            //- Divider item
            .menu-divider(v-if="item.type === 'divider'")
            
            //- Regular menu item
            .menu-item(
              v-else
              :class="getItemClasses(item, index)"
              :data-index="index"
              @click="handleItemClick(item, index)"
              @mouseenter="handleItemHover(index)"
            )
              slot(
                name="item"
                :item="item"
                :index="index"
                :selected="isSelected(item)"
                :highlighted="highlightedIndex === index"
              )
                .item-content
                  span.item-label(v-html="getHighlightedLabel(item)")
                  .item-checkmark(v-if="isSelected(item)")
                    svg(
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    )
                      path(
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      )
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import LbDropdown from '../Dropdown/LbDropdown.vue'

// Types
export type MenuPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

export interface MenuItem {
  value: any
  label: string
  disabled?: boolean
  type?: 'item' | 'divider'
}

export interface LbMenuProps {
  modelValue?: any
  options: (MenuItem | string | number)[]
  searchable?: boolean
  placeholder?: string
  visibleItems?: number
  disabled?: boolean
  closeOnSelect?: boolean
  placement?: MenuPlacement
  virtualScrolling?: boolean
  itemHeight?: number
}

// Props
const props = withDefaults(defineProps<LbMenuProps>(), {
  modelValue: null,
  searchable: false,
  placeholder: 'Search...',
  visibleItems: 7,
  disabled: false,
  closeOnSelect: true,
  placement: 'bottom-start',
  virtualScrolling: true,
  itemHeight: 40, // 40px (--lb-size-6xl) - used for virtual scrolling calculations
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'select': [value: any, item: MenuItem]
  'open': []
  'close': []
  'search': [query: string]
}>()

// Refs
const searchInputRef = ref<HTMLInputElement>()
const menuContainerRef = ref<HTMLElement>()
const menuItemsRef = ref<HTMLElement>()
const triggerElement = ref<HTMLElement>()

// State
const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const scrollTop = ref(0)

// Computed
const normalizedOptions = computed(() => {
  return props.options.map((option, index) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        value: option,
        label: String(option),
        disabled: false,
        type: 'item' as const
      }
    }
    return {
      disabled: false,
      type: 'item' as const,
      ...option
    }
  })
})

const filteredItems = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return normalizedOptions.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return normalizedOptions.value.filter(item => {
    if (item.type === 'divider') return false
    return item.label.toLowerCase().includes(query)
  })
})

const selectableItems = computed(() => {
  return filteredItems.value.filter(item => item.type !== 'divider' && !item.disabled)
})

const visibleItems = computed(() => {
  // Only apply virtual scrolling for lists longer than 50 items
  if (!props.virtualScrolling || filteredItems.value.length <= 50) {
    return filteredItems.value
  }
  
  const startIndex = Math.floor(scrollTop.value / props.itemHeight)
  const endIndex = Math.min(
    startIndex + props.visibleItems + 2, // Buffer items
    filteredItems.value.length
  )
  
  return filteredItems.value.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    originalIndex: startIndex + index
  }))
})

const containerStyle = computed(() => {
  // No longer setting maxHeight since Dropdown handles overflow
  return {}
})

const itemsStyle = computed(() => {
  // Only apply virtual scrolling for lists longer than 50 items
  if (!props.virtualScrolling || filteredItems.value.length <= 50) {
    return {}
  }
  
  const totalHeight = filteredItems.value.length * props.itemHeight
  const offsetY = Math.floor(scrollTop.value / props.itemHeight) * props.itemHeight
  
  return {
    height: `${totalHeight}px`,
    transform: `translateY(${offsetY}px)`
  }
})

const contentClasses = computed(() => ({
  'menu-searchable': props.searchable,
  'menu-virtual': props.virtualScrolling
}))

// Methods
const getItemKey = (item: MenuItem & { originalIndex?: number }, index: number) => {
  const actualIndex = item.originalIndex ?? index
  return `${actualIndex}-${item.value}-${item.type}`
}

const getItemClasses = (item: MenuItem, index: number) => ({
  'menu-item-selected': isSelected(item),
  'menu-item-highlighted': highlightedIndex.value === index,
  'menu-item-disabled': item.disabled
})

const isSelected = (item: MenuItem) => {
  return props.modelValue === item.value
}

const getHighlightedLabel = (item: MenuItem) => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return item.label
  }
  
  const query = searchQuery.value.trim()
  const regex = new RegExp(`(${query})`, 'gi')
  return item.label.replace(regex, '<mark>$1</mark>')
}

const handleItemClick = (item: MenuItem, index: number) => {
  if (item.disabled || item.type === 'divider') return
  
  emit('update:modelValue', item.value)
  emit('select', item.value, item)
  
  if (props.closeOnSelect) {
    isOpen.value = false
  }
}

const handleItemHover = (index: number) => {
  highlightedIndex.value = index
}

const handleKeydown = (event: KeyboardEvent) => {
  const { key } = event
  
  switch (key) {
    case 'ArrowDown':
      event.preventDefault()
      event.stopPropagation()
      navigateDown()
      break
    case 'ArrowUp':
      event.preventDefault()
      event.stopPropagation()
      navigateUp()
      break
    case 'Home':
      event.preventDefault()
      event.stopPropagation()
      navigateToFirst()
      break
    case 'End':
      event.preventDefault()
      event.stopPropagation()
      navigateToLast()
      break
    case 'Enter':
      event.preventDefault()
      event.stopPropagation()
      selectHighlighted()
      break
    case 'Escape':
      event.preventDefault()
      event.stopPropagation()
      isOpen.value = false
      break
    default:
      // Type to search
      if (props.searchable && key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
        focusSearchInput()
      }
      break
  }
}

const navigateDown = () => {
  const currentIndex = highlightedIndex.value
  const nextIndex = findNextSelectableIndex(currentIndex, 1)
  if (nextIndex !== -1) {
    setHighlightedIndex(nextIndex)
  }
}

const navigateUp = () => {
  const currentIndex = highlightedIndex.value
  const prevIndex = findNextSelectableIndex(currentIndex, -1)
  if (prevIndex !== -1) {
    setHighlightedIndex(prevIndex)
  }
}

const navigateToFirst = () => {
  const firstIndex = findNextSelectableIndex(-1, 1)
  if (firstIndex !== -1) {
    setHighlightedIndex(firstIndex)
  }
}

const navigateToLast = () => {
  const lastIndex = findNextSelectableIndex(selectableItems.value.length, -1)
  if (lastIndex !== -1) {
    setHighlightedIndex(lastIndex)
  }
}

const findNextSelectableIndex = (currentIndex: number, direction: number): number => {
  const items = filteredItems.value
  let index = currentIndex + direction
  
  while (index >= 0 && index < items.length) {
    const item = items[index]
    if (item.type !== 'divider' && !item.disabled) {
      return index
    }
    index += direction
  }
  
  return -1
}

const setHighlightedIndex = (index: number) => {
  highlightedIndex.value = index
  scrollToHighlighted()
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredItems.value.length) {
    const item = filteredItems.value[highlightedIndex.value]
    handleItemClick(item, highlightedIndex.value)
  }
}

const handleFormSubmit = () => {
  // Called when mobile number pad's "Go/Done" button is pressed
  // Select the highlighted option if there is one
  selectHighlighted()
}

const scrollToHighlighted = () => {
  if (!menuContainerRef.value || highlightedIndex.value === -1) return
  
  const container = menuContainerRef.value
  const itemTop = highlightedIndex.value * props.itemHeight
  const itemBottom = itemTop + props.itemHeight
  const containerTop = container.scrollTop
  const containerBottom = containerTop + container.clientHeight
  
  if (itemTop < containerTop) {
    container.scrollTop = itemTop
  } else if (itemBottom > containerBottom) {
    container.scrollTop = itemBottom - container.clientHeight
  }
}

const scrollToSelected = () => {
  if (!isOpen.value) return
  
  const selectedIndex = filteredItems.value.findIndex(item => isSelected(item))
  if (selectedIndex >= 0) {
    setHighlightedIndex(selectedIndex)
  } else if (selectableItems.value.length > 0) {
    setHighlightedIndex(0)
  }
}

const handleSearch = () => {
  emit('search', searchQuery.value)
  highlightedIndex.value = -1
  
  // Auto-highlight first result
  nextTick(() => {
    if (selectableItems.value.length > 0) {
      const firstSelectableIndex = filteredItems.value.findIndex(
        item => item.type !== 'divider' && !item.disabled
      )
      if (firstSelectableIndex >= 0) {
        setHighlightedIndex(firstSelectableIndex)
      }
    }
  })
}

const focusSearchInput = () => {
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const handleOpen = () => {
  // Store the trigger element (currently focused element)
  triggerElement.value = document.activeElement as HTMLElement
  
  emit('open')
  
  nextTick(() => {
    if (props.searchable) {
      focusSearchInput()
    } else {
      // Focus the menu container for keyboard navigation
      menuContainerRef.value?.focus()
    }
    
    scrollToSelected()
  })
}

const handleClose = () => {
  emit('close')
  searchQuery.value = ''
  highlightedIndex.value = -1
  
  // Return focus to trigger
  nextTick(() => {
    triggerElement.value?.focus()
  })
}

const handleScroll = () => {
  if (menuContainerRef.value && props.virtualScrolling) {
    scrollTop.value = menuContainerRef.value.scrollTop
  }
}

// Virtual scrolling setup
let scrollListener: (() => void) | null = null

watch(() => isOpen.value, (open) => {
  if (open && props.virtualScrolling) {
    nextTick(() => {
      if (menuContainerRef.value) {
        scrollListener = () => handleScroll()
        menuContainerRef.value.addEventListener('scroll', scrollListener)
      }
    })
  } else if (scrollListener && menuContainerRef.value) {
    menuContainerRef.value.removeEventListener('scroll', scrollListener)
    scrollListener = null
  }
})

// Slots
defineSlots<{
  trigger: () => any
  item?: (props: { 
    item: MenuItem
    index: number
    selected: boolean
    highlighted: boolean
  }) => any
}>()

// Component options
defineOptions({
  name: 'LbMenu',
  inheritAttrs: false
})

// Cleanup
onUnmounted(() => {
  if (scrollListener && menuContainerRef.value) {
    menuContainerRef.value.removeEventListener('scroll', scrollListener)
  }
})
</script>

<style lang="sass" scoped>
@use '@/styles/base' as base
@use '@/styles/typography' as typography

.lb-menu
  display: inline-block

.menu-content
  display: flex
  flex-direction: column
  width: max-content
  min-width: 14rem // 224px - increased for better search input visibility
  max-width: 25rem // 400px
  outline: none

.menu-search
  padding: base.$space-sm base.$space-sm base.$space-xs
  border-bottom: base.$border-sm solid var(--lb-border-neutral-normal)
  
  form
    margin: 0
    padding: 0

.search-input
  width: 100%
  height: base.$size-6xl
  padding: 0 base.$space-sm // 0 8px
  background: var(--lb-background-surface)
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-sm  // 8px for search inputs inside dropdowns
  font-size: typography.$font-size-label-base
  color: var(--lb-text-neutral-contrast-high)
  transition: border-color base.$transition
  box-sizing: border-box

  &::placeholder
    color: var(--lb-text-neutral-contrast-low)
    opacity: base.$opacity-100

  &:focus-visible
    outline: base.$focus-ring-width solid transparent
    outline-offset: base.$focus-ring-offset
    border-color: var(--lb-border-neutral-active)
    box-shadow: base.$shadow-sm

.menu-items-container
  position: relative


.menu-items
  position: relative
  padding: base.$space-xs
  display: flex
  flex-direction: column
  gap: base.$space-2xs

.menu-item
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  min-height: base.$unit-40  // 40px for better clickability
  padding: base.$space-sm base.$space-md  // 8px vertical, 12px horizontal
  background: transparent
  border: none
  border-radius: base.$radius-md
  font-size: typography.$font-size-label-base
  color: var(--lb-text-neutral-contrast-high)
  cursor: pointer
  transition: background-color base.$transition, color base.$transition
  box-sizing: border-box
  gap: base.$space-sm // 8px

  &:hover:not(.menu-item-disabled):not(.menu-item-selected)
    background: var(--lb-surface-neutral-hover)

  &.menu-item-highlighted:not(.menu-item-disabled):not(.menu-item-selected)
    background: var(--lb-surface-neutral-hover)

  &.menu-item-selected
    background: var(--lb-surface-neutral-hover)
    color: var(--lb-text-neutral-contrast-high)

    &:hover
      background: var(--lb-surface-neutral-hover)

  &.menu-item-disabled
    color: var(--lb-text-neutral-disabled)
    cursor: not-allowed
    opacity: base.$opacity-60

.item-content
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  gap: base.$space-sm // 8px

.item-label
  flex: 1
  text-align: left
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

  :deep(mark)
    background: var(--lb-surface-warning-normal)
    color: var(--lb-text-warning-contrast-high)
    padding: 0 base.$space-2xs // 0 2px
    border-radius: base.$radius-xs

.item-checkmark
  display: flex
  align-items: center
  justify-content: center
  width: base.$unit-18  // 18px
  height: base.$unit-18  // 18px
  color: var(--lb-text-neutral-contrast-low)
  flex-shrink: 0

.menu-divider
  width: 100%
  height: base.$border-sm // 1px
  background: var(--lb-border-neutral-normal)

</style>