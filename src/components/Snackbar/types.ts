import type { ComputedRef } from 'vue'

export type SnackbarVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface SnackbarAction {
  label: string
  handler: () => void
}

export interface SnackbarConfig {
  message: string
  variant?: SnackbarVariant
  duration?: number
  action?: SnackbarAction
  persistent?: boolean
}

export interface SnackbarItem extends Required<Omit<SnackbarConfig, 'action'>> {
  id: string
  action?: SnackbarAction
}

export interface SnackbarProviderContext {
  showSnackbar: (config: SnackbarConfig) => Promise<string>
  removeSnackbar: (id: string) => void
  clearAll: () => void
  updateSnackbar: (id: string, updates: Partial<SnackbarItem>) => void
  snackbars: ComputedRef<SnackbarItem[]>
}

export interface UseSnackbarReturn {
  showSnackbar: (config: SnackbarConfig) => Promise<string>
  clearAll: () => void
  snackbars: ComputedRef<SnackbarItem[]>
}