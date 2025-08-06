// LittleBrand UI Kit - Main Entry Point

// Import global styles (themes, reset, typography)
import './styles/index.sass'

// Import all components
import LbAvatar from './components/Avatar'
import LbBadge from './components/Badge'
import LbButton from './components/Buttons/Button'
import LbChip from './components/Chip'
import LbInput from './components/Input'
import LbLabel from './components/Label'
import LbHintText from './components/HintText'
import LbTextarea from './components/Textarea'
import LbCheckbox from './components/Checkbox'
import LbRadio from './components/Radio'
import LbSwitch from './components/Switch'
import LbSelect from './components/Select'
import LbFormField from './components/FormField'
import LbDialog from './components/Dialog'
import LbBottomSheet from './components/BottomSheet'
import LbNavigationBar, { LbNavigationBarItem } from './components/NavigationBar'
import LbProgress from './components/Progress'
import { LbSnackbar, LbSnackbarProvider, useSnackbar, createSnackbarHelpers } from './components/Snackbar'

// Export individual components for tree-shaking
export { LbAvatar, LbBadge, LbButton, LbChip, LbInput, LbLabel, LbHintText, LbTextarea, LbCheckbox, LbRadio, LbSwitch, LbSelect, LbFormField, LbDialog, LbBottomSheet, LbNavigationBar, LbNavigationBarItem, LbProgress, LbSnackbar, LbSnackbarProvider, useSnackbar, createSnackbarHelpers }

// Plugin install function for Vue.use()
const LittleBrandUI = {
  install(app, options = {}) {
    // Register all components globally
    app.component('LbAvatar', LbAvatar)
    app.component('LbBadge', LbBadge)
    app.component('LbButton', LbButton)
    app.component('LbChip', LbChip)
    app.component('LbInput', LbInput)
    app.component('LbLabel', LbLabel)
    app.component('LbHintText', LbHintText)
    app.component('LbTextarea', LbTextarea)
    app.component('LbCheckbox', LbCheckbox)
    app.component('LbRadio', LbRadio)
    app.component('LbSwitch', LbSwitch)
    app.component('LbSelect', LbSelect)
    app.component('LbFormField', LbFormField)
    app.component('LbDialog', LbDialog)
    app.component('LbBottomSheet', LbBottomSheet)
    app.component('LbNavigationBar', LbNavigationBar)
    app.component('LbNavigationBarItem', LbNavigationBarItem)
    app.component('LbProgress', LbProgress)
    app.component('LbSnackbar', LbSnackbar)
    app.component('LbSnackbarProvider', LbSnackbarProvider)
    
    // Apply any global configuration
    if (options.theme) {
      // Handle theme configuration
    }
  }
}

// Export the plugin
export default LittleBrandUI

// Also export the install function directly
export { LittleBrandUI }