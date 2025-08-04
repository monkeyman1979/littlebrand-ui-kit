import LbSnackbar from './LbSnackbar.vue'
import LbSnackbarProvider from './LbSnackbarProvider.vue'
import { useSnackbar, createSnackbarHelpers } from './useSnackbar'

// Export components
export { LbSnackbar, LbSnackbarProvider }

// Export composables
export { useSnackbar, createSnackbarHelpers }

// Export types
export type {
  SnackbarVariant,
  SnackbarAction,
  SnackbarConfig,
  SnackbarItem,
  SnackbarProviderContext,
  UseSnackbarReturn
} from './types'

// Default export for convenience
export { LbSnackbarProvider as default }