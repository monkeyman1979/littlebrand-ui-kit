import { inject } from 'vue'
import type { SnackbarProviderContext, UseSnackbarReturn, SnackbarConfig } from './types'

/**
 * Composable for interacting with the snackbar system
 * Must be used within a component tree that has LbSnackbarProvider
 */
export function useSnackbar(): UseSnackbarReturn {
  const snackbarContext = inject<SnackbarProviderContext>('snackbar')
  
  if (!snackbarContext) {
    throw new Error(
      'useSnackbar() was called but no LbSnackbarProvider was found in the component tree. ' +
      'Make sure to wrap your app with <LbSnackbarProvider />.'
    )
  }
  
  return {
    showSnackbar: snackbarContext.showSnackbar,
    clearAll: snackbarContext.clearAll,
    snackbars: snackbarContext.snackbars
  }
}

/**
 * Convenience function to show different types of snackbars
 */
export function createSnackbarHelpers() {
  const { showSnackbar, clearAll, snackbars } = useSnackbar()
  
  return {
    // Core methods
    showSnackbar,
    clearAll,
    snackbars,
    
    // Convenience methods for different variants
    showSuccess: (message: string, options?: Omit<SnackbarConfig, 'message' | 'variant'>) =>
      showSnackbar({ ...options, message, variant: 'success' }),
    
    showError: (message: string, options?: Omit<SnackbarConfig, 'message' | 'variant'>) =>
      showSnackbar({ ...options, message, variant: 'error' }),
    
    showWarning: (message: string, options?: Omit<SnackbarConfig, 'message' | 'variant'>) =>
      showSnackbar({ ...options, message, variant: 'warning' }),
    
    showInfo: (message: string, options?: Omit<SnackbarConfig, 'message' | 'variant'>) =>
      showSnackbar({ ...options, message, variant: 'info' }),
    
    // Show snackbar with action
    showWithAction: (
      message: string, 
      actionLabel: string, 
      actionHandler: () => void,
      options?: Omit<SnackbarConfig, 'message' | 'action'>
    ) => showSnackbar({
      ...options,
      message,
      action: { label: actionLabel, handler: actionHandler }
    }),
    
    // Show persistent snackbar (must be manually dismissed)
    showPersistent: (message: string, options?: Omit<SnackbarConfig, 'message' | 'persistent'>) =>
      showSnackbar({ ...options, message, persistent: true })
  }
}

// Export for convenience
export default useSnackbar