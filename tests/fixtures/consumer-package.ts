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
void menuSlots

// Known incorrect declaration-only APIs must not be reintroduced.
// @ts-expect-error Input implementation does not accept small
const invalidInput: InstanceType<typeof LbInput>['$props'] = { size: 'small' }
// @ts-expect-error Dialog variant is default | fullscreen
const invalidDialog: InstanceType<typeof LbDialog>['$props'] = { variant: 'filled' }
// @ts-expect-error Button implementation does not have tag prop
const invalidButton: InstanceType<typeof LbButton>['$props'] = { tag: 'span' }
// @ts-expect-error PopoverContent has no side prop; use parent placement
const invalidContent: InstanceType<typeof LbPopoverContent>['$props'] = { side: 'top' }

void [scale, inputProps, dialogProps, popoverProps, components, invalidInput, invalidDialog, invalidButton, invalidContent]
