# LittleBrand UI Kit - Components Needed for Timist

## Overview
These components need to be built in LittleBrand UI Kit to support the Timist application migration. Components are organized by development day with complexity ratings.

Total components to build: 11 (3 simple, 5 medium, 3 complex)
Completed: 7 (Badge ✅, Progress ✅, Avatar ✅, Snackbar ✅, Divider ✅, Popover ✅, SegmentButton ✅)
Remaining: 4 (Card, Menu, Calendar, DatePicker)

## Day 1: Simple Components (3 components)

### 1. Badge ✅ (Completed)
- **Purpose**: Status indicators, counts, labels
- **Complexity**: ⭐ (Simple)
- **API Requirements**:
  ```pug
  lb-badge(variant="default|secondary|success|warning|error" size="small|medium")
    | Content
  ```
- **Key Features**:
  - Text/number content
  - Color variants matching theme
  - Size options
  - Inline-block display

### 2. Divider ✅ (Completed)
- **Purpose**: Visual divider between sections
- **Complexity**: ⭐ (Simple)
- **API Requirements**:
  ```pug
  lb-divider(orientation="horizontal|vertical")
  ```
- **Key Features**:
  - Horizontal/vertical orientation
  - Theme-aware coloring
  - Proper ARIA role
  - Replaces 23+ uses of Separator in Timist

### 3. Progress ✅ (Completed)
- **Purpose**: Upload progress, loading states
- **Complexity**: ⭐⭐ (Simple-Medium)
- **API Requirements**:
  ```pug
  lb-progress(:value="50" :max="100" size="small|medium|large")
  ```
- **Key Features**:
  - Percentage-based progress
  - Smooth animations
  - Accessible progress role
  - Size variants

### 4. Snackbar ✅ (Completed)
- **Purpose**: Notifications, alerts, and toast messages
- **Complexity**: ⭐⭐⭐ (Medium)
- **API Requirements**:
  ```typescript
  // Composable
  const { showSnackbar } = useSnackbar()
  
  showSnackbar({
    message: 'Action completed',
    variant: 'success|error|warning|info',
    duration: 5000,
    action: {
      label: 'Undo',
      handler: () => {}
    }
  })
  ```
  ```pug
  //- Provider Component (add to root)
  lb-snackbar-provider(
    position="top|bottom"
    max-visible="3"
  )
  ```
- **Key Features**:
  - Queue management
  - Auto-dismiss with progress
  - Swipe to dismiss
  - Action buttons
  - Multiple variants
  - Stacking behavior
  - Replaces Alert and Toast components

## Day 2: Medium Complexity (3 components)

### 5. Popover ✅ (Completed)
- **Purpose**: Generic floating container for any content
- **Complexity**: ⭐⭐⭐ (Medium)
- **API Requirements**:
  ```pug
  .lb-popover(v-model:open="isOpen" :placement="'top|bottom|left|right|start|end'")
    .trigger Click me
    .content
      | Any content here
  ```
- **Key Features**:
  - Flexible positioning options
  - Click outside to close
  - Focus management
  - Works for calendars, custom dropdowns, etc.
  - Can be used as base for other floating components
  - Arrow/pointer support
  - Auto-positioning to stay in viewport

### 6. SegmentButton ✅ (Completed)
- **Purpose**: For filtering/switching between content views
- **Complexity**: ⭐⭐⭐ (Medium)
- **API Requirements**:
  ```pug
  .lb-segment-button(v-model="selectedValue")
    .item(value="option1") Option 1
    .item(value="option2") Option 2
    .item(value="option3") Option 3
  ```
- **Key Features**:
  - Single selection model
  - Smooth transition between segments
  - Keyboard navigation
  - Can replace Tabs for media types, biography/media views
  - Mobile-friendly touch targets
  - Visual indicator for active segment

### 7. Card ❌ (Not Started)
- **Purpose**: Container for grouped content
- **Complexity**: ⭐⭐ (Medium)
- **API Requirements**:
  ```pug
  .lb-card
    .header
      .title Title
      .description Description
    .content Content
    .footer Footer
  ```
- **Key Features**:
  - Composable sub-components
  - Optional sections
  - Theme-aware borders/shadows
  - Grid-based internal spacing

### 8. Avatar ✅ (Completed)
- **Purpose**: User/timeline profile images
- **Complexity**: ⭐⭐⭐ (Medium)
- **API Requirements**:
  ```pug
  .lb-avatar(size="small|medium|large")
    .image(:src="url" :alt="alt")
    .fallback JD
  ```
- **Key Features**:
  - Image with fallback
  - Loading states
  - Size variants
  - Circle/square options
  - Error handling

## Day 3: Additional Components for DatePicker (2 components)

### 9. Menu ❌ (Not Started)
- **Purpose**: Flexible dropdown menu for custom selections
- **Complexity**: ⭐⭐⭐ (Medium)
- **API Requirements**:
  ```pug
  lb-menu(v-model="selectedValue" :options="menuOptions" searchable)
    template(#trigger)
      button {{ triggerText }}
  ```
- **Key Features**:
  - Scrollable list of options
  - Virtual scrolling for long lists (100+ items)
  - Optional search/filter capability
  - Keyboard navigation (arrows, Home/End, type to search)
  - Auto-scroll to selected item on open
  - Hover and focus states
  - Uses LbPopover internally
  - Custom item templates via slots
  - Divider support
  - Better than Select for long lists like years (1900-2025+)

### 10. Calendar ❌ (Not Started)
- **Purpose**: Calendar grid component for date selection
- **Complexity**: ⭐⭐⭐⭐ (Complex)
- **API Requirements**:
  ```pug
  lb-calendar(
    v-model="selectedDate"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled-dates="disabledDates"
  )
  ```
- **Key Features**:
  - Month/year header with LbMenu dropdowns
  - Day grid with proper week layout
  - Previous/next month navigation buttons
  - Today highlight
  - Selected date highlight
  - Disabled dates support
  - Min/max date constraints
  - Keyboard navigation (arrow keys for days, PageUp/PageDown for months)
  - First day of week configuration
  - Month names and weekday names localization ready

## Day 4: Complex Components (1 component)

### 11. DatePicker ❌ (Not Started)
- **Purpose**: Complete date selection component with easy year navigation for birthdates
- **Complexity**: ⭐⭐⭐⭐⭐ (Complex - Integration)
- **API Requirements**:
  ```pug
  lb-date-picker(
    v-model="selectedDate" 
    :format="'MM/DD/YYYY'"
    :min-date="minDate"
    :max-date="maxDate"
    placeholder="Select date"
  )
  ```
- **Key Features**:
  - Combines LbInput + calendar icon trigger + LbPopover + LbCalendar
  - Input field shows formatted date
  - Calendar icon button as trigger
  - Uses LbMenu for month/year selection (solves birthdate year navigation)
  - Date formatting options (MM/DD/YYYY, DD/MM/YYYY, etc.)
  - Keyboard shortcuts (today, clear)
  - Min/max date constraints
  - Clear button
  - Today button for quick selection
  - Mobile-friendly with native date input fallback option
  - Form integration with v-model
  - Validation states (invalid, disabled, required)
  - Range selection mode (optional future enhancement)

## Notes on Existing Components Used Instead

- **NavigationBar**: Used instead of Tabs for navigation between views
- **BottomSheet**: Used instead of Drawer for mobile panels
- **Dialog**: Used instead of AlertDialog for confirmations
- **Snackbar**: Used for both Alert and Toast functionality

## Component Dependencies

### DatePicker Build Order:
1. **LbMenu** - Prerequisite for Calendar month/year dropdowns
2. **LbCalendar** - Core calendar grid component  
3. **LbDatePicker** - Integration wrapper combining all pieces

### Why Menu Instead of Select for DatePicker:
- **Better UX for year selection**: Scrollable list with 100+ years
- **Search capability**: Users can type "1985" to jump to year
- **Visual consistency**: Both month and year use same component style
- **Performance**: Virtual scrolling for large lists
- **Flexibility**: Can add decade grouping, dividers, etc.

## Implementation Notes

### General Requirements for All Components:
1. **NO utility classes** - Use semantic class names only
2. **NO BEM naming** - Parent gets `lb-component-name` class, children get simple descriptive names
3. **CSS Grid/Flexbox** for spacing (no margins)
4. **CSS Variables** for all customizable values
5. **Pug templates** following LittleBrand patterns
6. **SASS styles** (not SCSS syntax) with scoped styles
7. **TypeScript** for props/emits
8. **Slots** for icon integration
9. **ARIA compliance** for accessibility

### Testing Checklist:
- [ ] Keyboard navigation works
- [ ] Screen reader announces properly
- [ ] Theme switching works (light/dark)
- [ ] CSS variables can override styles
- [ ] No Tailwind classes used
- [ ] Responsive without breakpoints