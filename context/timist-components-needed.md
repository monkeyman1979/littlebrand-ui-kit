# LittleBrand UI Kit - Components Needed for Timist

## Overview
These components need to be built in LittleBrand UI Kit to support the Timist application migration. Components are organized by development day with complexity ratings.

## Day 1: Simple Components (4 components)

### 1. Badge
- **Purpose**: Status indicators, counts, labels
- **Complexity**: ⭐ (Simple)
- **API Requirements**:
  ```vue
  <LbBadge variant="default|secondary|success|warning|error" size="small|medium">
    Content
  </LbBadge>
  ```
- **Key Features**:
  - Text/number content
  - Color variants matching theme
  - Size options
  - Inline-block display

### 2. Separator
- **Purpose**: Visual divider between sections
- **Complexity**: ⭐ (Simple)
- **API Requirements**:
  ```vue
  <LbSeparator orientation="horizontal|vertical" />
  ```
- **Key Features**:
  - Horizontal/vertical orientation
  - Theme-aware coloring
  - Proper ARIA role

### 3. Progress
- **Purpose**: Upload progress, loading states
- **Complexity**: ⭐⭐ (Simple-Medium)
- **API Requirements**:
  ```vue
  <LbProgress :value="50" :max="100" size="small|medium|large" />
  ```
- **Key Features**:
  - Percentage-based progress
  - Smooth animations
  - Accessible progress role
  - Size variants

### 4. Alert
- **Purpose**: Inline notifications, warnings, errors
- **Complexity**: ⭐⭐ (Simple-Medium)
- **API Requirements**:
  ```vue
  <LbAlert variant="default|success|warning|error|info">
    <template #icon><!-- optional icon --></template>
    <template #title>Alert Title</template>
    <template #description>Alert description</template>
  </LbAlert>
  ```
- **Key Features**:
  - Icon slot support
  - Title and description slots
  - Color variants
  - Semantic HTML (role="alert")

## Day 2: Medium Complexity (3 components)

### 5. Card
- **Purpose**: Container for grouped content
- **Complexity**: ⭐⭐ (Medium)
- **API Requirements**:
  ```vue
  <LbCard>
    <LbCardHeader>
      <LbCardTitle>Title</LbCardTitle>
      <LbCardDescription>Description</LbCardDescription>
    </LbCardHeader>
    <LbCardContent>Content</LbCardContent>
    <LbCardFooter>Footer</LbCardFooter>
  </LbCard>
  ```
- **Key Features**:
  - Composable sub-components
  - Optional sections
  - Theme-aware borders/shadows
  - Grid-based internal spacing

### 6. Avatar
- **Purpose**: User/timeline profile images
- **Complexity**: ⭐⭐⭐ (Medium)
- **API Requirements**:
  ```vue
  <LbAvatar size="small|medium|large">
    <LbAvatarImage :src="url" :alt="alt" />
    <LbAvatarFallback>JD</LbAvatarFallback>
  </LbAvatar>
  ```
- **Key Features**:
  - Image with fallback
  - Loading states
  - Size variants
  - Circle/square options
  - Error handling

### 7. Tabs
- **Purpose**: Navigation between views
- **Complexity**: ⭐⭐⭐ (Medium)
- **API Requirements**:
  ```vue
  <LbTabs v-model="activeTab">
    <LbTabsList>
      <LbTabsTrigger value="tab1">Tab 1</LbTabsTrigger>
      <LbTabsTrigger value="tab2">Tab 2</LbTabsTrigger>
    </LbTabsList>
    <LbTabsContent value="tab1">Content 1</LbTabsContent>
    <LbTabsContent value="tab2">Content 2</LbTabsContent>
  </LbTabs>
  ```
- **Key Features**:
  - Keyboard navigation
  - ARIA compliant
  - Flexible styling
  - Animation support

## Day 3: Complex Components (3 components)

### 8. Drawer
- **Purpose**: Mobile navigation, side panels
- **Complexity**: ⭐⭐⭐⭐ (Complex)
- **API Requirements**:
  ```vue
  <LbDrawer v-model:open="isOpen" side="left|right|top|bottom">
    <LbDrawerTrigger>Open</LbDrawerTrigger>
    <LbDrawerContent>
      <LbDrawerHeader>
        <LbDrawerTitle>Title</LbDrawerTitle>
        <LbDrawerDescription>Description</LbDrawerDescription>
      </LbDrawerHeader>
      <LbDrawerBody>Content</LbDrawerBody>
      <LbDrawerFooter>Footer</LbDrawerFooter>
    </LbDrawerContent>
  </LbDrawer>
  ```
- **Key Features**:
  - Touch gestures support
  - Focus trap
  - Backdrop overlay
  - Smooth animations
  - Body scroll lock
  - Escape key handling

### 9. AlertDialog
- **Purpose**: Confirmation dialogs, destructive actions
- **Complexity**: ⭐⭐⭐ (Medium-Complex)
- **API Requirements**:
  ```vue
  <LbAlertDialog v-model:open="isOpen">
    <LbAlertDialogTrigger>Delete</LbAlertDialogTrigger>
    <LbAlertDialogContent>
      <LbAlertDialogHeader>
        <LbAlertDialogTitle>Are you sure?</LbAlertDialogTitle>
        <LbAlertDialogDescription>This action cannot be undone.</LbAlertDialogDescription>
      </LbAlertDialogHeader>
      <LbAlertDialogFooter>
        <LbAlertDialogCancel>Cancel</LbAlertDialogCancel>
        <LbAlertDialogAction>Continue</LbAlertDialogAction>
      </LbAlertDialogFooter>
    </LbAlertDialogContent>
  </LbAlertDialog>
  ```
- **Key Features**:
  - Focus management
  - Backdrop click handling
  - Animation support
  - Accessible (ARIA)

### 10. Toast (Sonner replacement)
- **Purpose**: Temporary notifications
- **Complexity**: ⭐⭐⭐⭐ (Complex)
- **API Requirements**:
  ```typescript
  // Composable
  const { toast } = useToast()
  
  toast({
    title: 'Success',
    description: 'Action completed',
    variant: 'success',
    duration: 5000
  })
  ```
  ```vue
  <!-- Component -->
  <LbToaster position="top-right|top-left|bottom-right|bottom-left" />
  ```
- **Key Features**:
  - Queue management
  - Auto-dismiss
  - Swipe to dismiss
  - Progress indicator
  - Action buttons
  - Stacking behavior

## Implementation Notes

### General Requirements for All Components:
1. **NO utility classes** - Use semantic class names only
2. **CSS Grid/Flexbox** for spacing (no margins)
3. **CSS Variables** for all customizable values
4. **Pug templates** following LittleBrand patterns
5. **SASS styles** (not SCSS syntax)
6. **TypeScript** for props/emits
7. **Slots** for icon integration
8. **ARIA compliance** for accessibility

### Testing Checklist:
- [ ] Keyboard navigation works
- [ ] Screen reader announces properly
- [ ] Theme switching works (light/dark)
- [ ] CSS variables can override styles
- [ ] No Tailwind classes used
- [ ] Responsive without breakpoints