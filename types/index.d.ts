import type { DefineComponent, Plugin } from 'vue'

// Public root exports. The source .vue.d.ts files are included in the npm package;
// component API accuracy is being verified in slices (Button/Input/Dialog first).
export { default as LbAvatar } from '../src/components/Avatar/LbAvatar.vue'
export { default as LbButton } from '../src/components/Buttons/Button/LbButton.vue'
export { default as LbSegmentButton } from '../src/components/Buttons/SegmentButton/LbSegmentButton.vue'
export { default as LbSegmentButtonItem } from '../src/components/Buttons/SegmentButton/LbSegmentButtonItem.vue'
export { default as LbCalendar } from '../src/components/Calendar/LbCalendar.vue'
export { default as LbDatePicker } from '../src/components/DatePicker/LbDatePicker.vue'
export { default as LbDivider } from '../src/components/Divider/LbDivider.vue'
export { default as LbInput } from '../src/components/Inputs/Input/LbInput.vue'
export { default as LbChatInput } from '../src/components/Inputs/ChatInput/LbChatInput.vue'
export { default as LbLabel } from '../src/components/Label/LbLabel.vue'
export { default as LbHintText } from '../src/components/HintText/LbHintText.vue'
export { default as LbTextarea } from '../src/components/Textarea/LbTextarea.vue'
export { default as LbCheckbox } from '../src/components/Checkbox/LbCheckbox.vue'
export { default as LbRadio } from '../src/components/Radio/LbRadio.vue'
export { default as LbSwitch } from '../src/components/Switch/LbSwitch.vue'
export { default as LbSelect } from '../src/components/Select/LbSelect.vue'
export { default as LbCustomSelect } from '../src/components/CustomSelect/LbCustomSelect.vue'
export { default as LbFormField } from '../src/components/FormField/LbFormField.vue'
export { default as LbDialog } from '../src/components/Dialog/LbDialog.vue'
export { default as LbProgress } from '../src/components/Progress/LbProgress.vue'
export { default as LbPopover } from '../src/components/Popover/LbPopover.vue'
export { default as LbPopoverTrigger } from '../src/components/Popover/LbPopoverTrigger.vue'
export { default as LbPopoverContent } from '../src/components/Popover/LbPopoverContent.vue'
export { default as LbPopoverArrow } from '../src/components/Popover/LbPopoverArrow.vue'
export { default as LbMenu } from '../src/components/Menu/LbMenu.vue'
export { default as LbDropdown } from '../src/components/Dropdown/LbDropdown.vue'

// These seven public components have no .vue.d.ts yet. Do not claim prop
// completion for them until their actual APIs are verified in Step 08/12.
type UnverifiedComponent = DefineComponent<Record<string, unknown>>
export declare const LbBadge: UnverifiedComponent
export declare const LbChip: UnverifiedComponent
export declare const LbBottomSheet: UnverifiedComponent
export declare const LbNavigationBar: UnverifiedComponent
export declare const LbNavigationBarItem: UnverifiedComponent
export declare const LbSnackbar: UnverifiedComponent
export declare const LbSnackbarProvider: UnverifiedComponent

export { useSnackbar, createSnackbarHelpers } from '../src/components/Snackbar/useSnackbar.js'
export type { SnackbarConfig, SnackbarItem, SnackbarVariant, SnackbarAction, UseSnackbarReturn } from '../src/components/Snackbar/types.js'

export declare const LittleBrandUI: Plugin

type Scale = Record<number, string>
type ColorFamily = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
export declare function generateScale(hexColor: string, curve?: string): Scale
export declare function generateDarkScale(lightScale: Scale | null, originalHex: string): Scale
export declare function generateAlphaScale(hexColor: string, mode?: 'light' | 'dark'): Scale
export declare function generateSemanticTokens(name: string, scale: Scale, darkScale?: Scale | null): Record<string, string>
export declare function applyTheme(colors: Partial<Record<ColorFamily, string>> & { background?: ColorFamily | string }, curve?: string): void
