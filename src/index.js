// LittleBrand UI Kit - Main Entry Point

// Import all components
import LbButton from './components/LbButton.vue'

// Export individual components for tree-shaking
export { LbButton }

// Plugin install function for Vue.use()
const LittleBrandUI = {
  install(app, options = {}) {
    // Register all components globally
    app.component('LbButton', LbButton)
    
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