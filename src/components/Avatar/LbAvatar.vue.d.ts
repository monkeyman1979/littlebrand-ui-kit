import { DefineComponent } from 'vue'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type Status = 'online' | 'offline' | 'away' | 'busy'

export interface LbAvatarProps {
  /**
   * Source URL for the avatar image
   */
  src?: string
  
  /**
   * Alt text for the avatar image
   * @default 'Avatar'
   */
  alt?: string
  
  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: Size
  
  /**
   * Name to generate initials from
   */
  name?: string
  
  /**
   * Legacy fallback text (use name prop instead)
   * @deprecated Use name prop instead
   */
  fallback?: string
  
  /**
   * Color variant for the fallback background
   * @default 'primary'
   */
  variant?: ColorVariant
  
  /**
   * Status indicator to display
   */
  status?: Status
}

export interface LbAvatarSlots {
  /**
   * Custom fallback content when no image is available
   */
  fallback: () => any
}

export interface LbAvatarEmits {
  /**
   * Emitted when the image loads successfully
   */
  load: [event: Event]
  
  /**
   * Emitted when the image fails to load
   */
  error: [event: Event]
}

declare const LbAvatar: DefineComponent<LbAvatarProps>

export default LbAvatar