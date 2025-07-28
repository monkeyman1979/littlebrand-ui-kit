// LittleBrand UI Kit - Main Entry Point

// Import all components
// (We'll add actual component imports as we create them)

// Export individual components for tree-shaking
// export { LbButton } from './components/LbButton'
// export { LbInput } from './components/LbInput'
// etc...

// Plugin install function for Vue.use()
const LittleBrandUI = {
  install(app, options = {}) {
    // Register all components globally
    // app.component('LbButton', LbButton)
    // app.component('LbInput', LbInput)
    // etc...
    
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