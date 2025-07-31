// LittleBrand UI Kit - Main Entry Point

// Import all components
import LbButton from './components/Button'
import LbInput from './components/Input'
import LbLabel from './components/Label'
import LbHintText from './components/HintText'
import LbTextarea from './components/Textarea'
import LbCheckbox from './components/Checkbox'
import LbRadio from './components/Radio'
import LbSwitch from './components/Switch'
import LbSelect from './components/Select'

// Export individual components for tree-shaking
export { LbButton, LbInput, LbLabel, LbHintText, LbTextarea, LbCheckbox, LbRadio, LbSwitch, LbSelect }

// Plugin install function for Vue.use()
const LittleBrandUI = {
  install(app, options = {}) {
    // Register all components globally
    app.component('LbButton', LbButton)
    app.component('LbInput', LbInput)
    app.component('LbLabel', LbLabel)
    app.component('LbHintText', LbHintText)
    app.component('LbTextarea', LbTextarea)
    app.component('LbCheckbox', LbCheckbox)
    app.component('LbRadio', LbRadio)
    app.component('LbSwitch', LbSwitch)
    app.component('LbSelect', LbSelect)
    
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