import { createApp } from 'vue'
import {
  LbAvatar, LbBadge, LbBottomSheet, LbButton, LbCalendar, LbChatInput,
  LbCheckbox, LbChip, LbCustomSelect, LbDatePicker, LbDialog, LbDivider,
  LbDropdown, LbFormField, LbHintText, LbInput, LbLabel, LbMenu,
  LbNavigationBar, LbNavigationBarItem, LbPopover, LbPopoverArrow,
  LbPopoverContent, LbPopoverTrigger, LbProgress, LbRadio, LbSegmentButton,
  LbSegmentButtonItem, LbSelect, LbSnackbar, LbSnackbarProvider, LbSwitch,
  LbTextarea, LittleBrandUI, applyTheme, generateAlphaScale, generateDarkScale,
  generateScale, generateSemanticTokens, useSnackbar, createSnackbarHelpers
} from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'
import 'littlebrand-ui-kit/dist/littlebrand-ui.css'

const app = createApp({ render: () => null })
app.use(LittleBrandUI)
applyTheme({ primary: '#8b5cf6', background: 'neutral' })
const scale: Record<number, string> = generateScale('#8b5cf6')
const snackbar = useSnackbar()
snackbar.showSnackbar({ message: 'Saved' })
createSnackbarHelpers().showSuccess('Saved')

const inputProps: InstanceType<typeof LbInput>['$props'] = { size: 'large' }
const dialogProps: InstanceType<typeof LbDialog>['$props'] = { variant: 'fullscreen' }
const textareaProps: InstanceType<typeof LbTextarea>['$props'] = { size: 'large', resize: 'both' }
const fieldProps: InstanceType<typeof LbFormField>['$props'] = { label: 'Biography', error: 'Required' }
const popoverProps: InstanceType<typeof LbPopover>['$props'] = { trapFocus: true }
const components = [
  LbAvatar, LbBadge, LbBottomSheet, LbButton, LbCalendar, LbChatInput,
  LbCheckbox, LbChip, LbCustomSelect, LbDatePicker, LbDialog, LbDivider,
  LbDropdown, LbFormField, LbHintText, LbInput, LbLabel, LbMenu,
  LbNavigationBar, LbNavigationBarItem, LbPopover, LbPopoverArrow,
  LbPopoverContent, LbPopoverTrigger, LbProgress, LbRadio, LbSegmentButton,
  LbSegmentButtonItem, LbSelect, LbSnackbar, LbSnackbarProvider, LbSwitch,
  LbTextarea
] as const
void [generateAlphaScale, generateDarkScale, generateSemanticTokens]

// Vue's DefineComponent event and slot generics must compile without skipLibCheck.
declare const segmentEmit: InstanceType<typeof LbSegmentButton>['$emit']
segmentEmit('update:modelValue', 'first')
// @ts-expect-error The segment model value is not a boolean
segmentEmit('update:modelValue', true)
const menuSlots: InstanceType<typeof LbMenu>['$slots'] = { trigger: () => [] }
const buttonSlots: InstanceType<typeof LbButton>['$slots'] = { 'icon-leading': () => [] }
const inputSlots: InstanceType<typeof LbInput>['$slots'] = { 'icon-clear': () => [] }
const dialogSlots: InstanceType<typeof LbDialog>['$slots'] = { footer: () => [] }
const fieldSlots: InstanceType<typeof LbFormField>['$slots'] = { default: ({ id }) => { void id; return [] } }
declare const buttonEmit: InstanceType<typeof LbButton>['$emit']
buttonEmit('click', new Event('click'))
// @ts-expect-error Button click emits an Event
buttonEmit('click', 'not an event')
declare const inputEmit: InstanceType<typeof LbInput>['$emit']
inputEmit('update:modelValue', 'text')
// @ts-expect-error Input model updates are strings
inputEmit('update:modelValue', true)
declare const dialogEmit: InstanceType<typeof LbDialog>['$emit']
dialogEmit('update:modelValue', false)
// @ts-expect-error Dialog model updates are booleans
dialogEmit('update:modelValue', 'no')
declare const textareaEmit: InstanceType<typeof LbTextarea>['$emit']
textareaEmit('update:modelValue', 'notes')
// @ts-expect-error Textarea v-model emits strings
textareaEmit('update:modelValue', 42)
void [menuSlots, buttonSlots, inputSlots, dialogSlots, fieldSlots]

// Known incorrect declaration-only APIs must not be reintroduced.
// @ts-expect-error Input implementation does not accept small
const invalidInput: InstanceType<typeof LbInput>['$props'] = { size: 'small' }
// @ts-expect-error Textarea has only medium and large
const invalidTextarea: InstanceType<typeof LbTextarea>['$props'] = { size: 'small' }
// @ts-expect-error FormField error is a message, not a boolean
const invalidField: InstanceType<typeof LbFormField>['$props'] = { error: true }
// @ts-expect-error Dialog variant is default | fullscreen
const invalidDialog: InstanceType<typeof LbDialog>['$props'] = { variant: 'filled' }
// @ts-expect-error Button implementation does not have tag prop
const invalidButton: InstanceType<typeof LbButton>['$props'] = { tag: 'span' }
// @ts-expect-error PopoverContent has no side prop; use parent placement
const invalidContent: InstanceType<typeof LbPopoverContent>['$props'] = { side: 'top' }
// @ts-expect-error SegmentButton supports medium or large, not small
const invalidSegment: InstanceType<typeof LbSegmentButton>['$props'] = { size: 'small' }
// @ts-expect-error SegmentButtonItem must have a value
const invalidSegmentItem: InstanceType<typeof LbSegmentButtonItem>['$props'] = {}

void [scale, inputProps, dialogProps, textareaProps, fieldProps, popoverProps, components, invalidInput, invalidTextarea, invalidField, invalidDialog, invalidButton, invalidContent, invalidSegment, invalidSegmentItem]
