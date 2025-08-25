/**
 * LittleBrand UI Kit - CSS Custom Properties TypeScript Definitions
 * 
 * This file provides IntelliSense support for LittleBrand CSS variables
 * in TypeScript projects and CSS-in-JS solutions.
 * 
 * Usage in VS Code:
 * - Place this file in your project root or src directory
 * - CSS variables will autocomplete in .css, .sass, .scss files
 * - TypeScript will recognize these properties in style objects
 */

declare module 'csstype' {
  interface Properties {
    // ============================================================
    // TYPOGRAPHY PROPERTIES
    // ============================================================
    
    /** Font family for headings (h1-h6) */
    '--lb-font-heading'?: string;
    /** Font family for body text */
    '--lb-font-body'?: string;
    /** Font family for monospace text */
    '--lb-font-mono'?: string;
    
    /** Unified font weight for all headings (default: 600) */
    '--lb-font-weight-heading'?: number | string;
    /** Unified font weight for body text (default: 400) */
    '--lb-font-weight-body'?: number | string;
    /** Unified font weight for labels and UI text (default: 500) */
    '--lb-font-weight-label'?: number | string;
    
    /** Normal font weight (400) */
    '--lb-font-weight-normal'?: number | string;
    /** Medium font weight (500) */
    '--lb-font-weight-medium'?: number | string;
    /** Semibold font weight (600) */
    '--lb-font-weight-semibold'?: number | string;
    /** Bold font weight (700) */
    '--lb-font-weight-bold'?: number | string;
    
    /** Tight line height (1.1) */
    '--lb-line-height-tight'?: number | string;
    /** Compact line height (1.25) */
    '--lb-line-height-compact'?: number | string;
    /** Normal line height (1.5) */
    '--lb-line-height-normal'?: number | string;
    /** Relaxed line height (1.75) */
    '--lb-line-height-relaxed'?: number | string;
    
    /** Small body text size (0.875rem) */
    '--lb-font-size-body-small'?: string;
    /** Base body text size (1rem) */
    '--lb-font-size-body-base'?: string;
    /** Large body text size (1.125rem) */
    '--lb-font-size-body-large'?: string;
    
    /** Extra small label size (0.625rem) */
    '--lb-font-size-label-xsmall'?: string;
    /** Small label size (0.75rem) */
    '--lb-font-size-label-small'?: string;
    /** Base label size (0.875rem) */
    '--lb-font-size-label-base'?: string;
    /** Large label size (1rem) */
    '--lb-font-size-label-large'?: string;
    
    /** Display 1 size (responsive) */
    '--lb-display-1'?: string;
    /** Display 2 size (responsive) */
    '--lb-display-2'?: string;
    
    /** Tighter letter spacing (-0.025em) */
    '--lb-letter-spacing-tighter'?: string;
    /** Tight letter spacing (-0.01em) */
    '--lb-letter-spacing-tight'?: string;
    /** Normal letter spacing */
    '--lb-letter-spacing-normal'?: string;
    /** Wide letter spacing (0.025em) */
    '--lb-letter-spacing-wide'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - PRIMARY
    // ============================================================
    
    /** Primary border line color */
    '--lb-border-primary-line'?: string;
    /** Primary border normal color */
    '--lb-border-primary-normal'?: string;
    /** Primary border active color */
    '--lb-border-primary-active'?: string;
    /** Primary border focus color */
    '--lb-border-primary-focus'?: string;
    /** Primary border disabled color */
    '--lb-border-primary-disabled'?: string;
    
    /** Primary fill normal color */
    '--lb-fill-primary-normal'?: string;
    /** Primary fill hover color */
    '--lb-fill-primary-hover'?: string;
    /** Primary fill active color */
    '--lb-fill-primary-active'?: string;
    /** Primary fill focus color */
    '--lb-fill-primary-focus'?: string;
    /** Primary fill disabled color */
    '--lb-fill-primary-disabled'?: string;
    
    /** Primary text normal color */
    '--lb-text-primary-normal'?: string;
    /** Primary text high contrast color */
    '--lb-text-primary-contrast-high'?: string;
    /** Primary text low contrast color */
    '--lb-text-primary-contrast-low'?: string;
    /** Primary text disabled color */
    '--lb-text-primary-disabled'?: string;
    
    /** Primary surface normal color */
    '--lb-surface-primary-normal'?: string;
    /** Primary surface hover color */
    '--lb-surface-primary-hover'?: string;
    /** Primary surface active color */
    '--lb-surface-primary-active'?: string;
    /** Primary surface subtle color */
    '--lb-surface-primary-subtle'?: string;
    /** Primary surface raised color */
    '--lb-surface-primary-raised'?: string;
    
    /** Text color on primary background */
    '--lb-text-on-primary'?: string;
    /** Text color on primary hover background */
    '--lb-text-on-primary-hover'?: string;
    /** Text color on primary active background */
    '--lb-text-on-primary-active'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - SECONDARY
    // ============================================================
    
    '--lb-border-secondary-line'?: string;
    '--lb-border-secondary-normal'?: string;
    '--lb-border-secondary-active'?: string;
    '--lb-border-secondary-focus'?: string;
    '--lb-border-secondary-disabled'?: string;
    
    '--lb-fill-secondary-normal'?: string;
    '--lb-fill-secondary-hover'?: string;
    '--lb-fill-secondary-active'?: string;
    '--lb-fill-secondary-focus'?: string;
    '--lb-fill-secondary-disabled'?: string;
    
    '--lb-text-secondary-normal'?: string;
    '--lb-text-secondary-contrast-high'?: string;
    '--lb-text-secondary-contrast-low'?: string;
    '--lb-text-secondary-disabled'?: string;
    
    '--lb-surface-secondary-normal'?: string;
    '--lb-surface-secondary-hover'?: string;
    '--lb-surface-secondary-active'?: string;
    '--lb-surface-secondary-subtle'?: string;
    '--lb-surface-secondary-raised'?: string;
    
    '--lb-text-on-secondary'?: string;
    '--lb-text-on-secondary-hover'?: string;
    '--lb-text-on-secondary-active'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - TERTIARY
    // ============================================================
    
    '--lb-border-tertiary-line'?: string;
    '--lb-border-tertiary-normal'?: string;
    '--lb-border-tertiary-active'?: string;
    '--lb-border-tertiary-focus'?: string;
    '--lb-border-tertiary-disabled'?: string;
    
    '--lb-fill-tertiary-normal'?: string;
    '--lb-fill-tertiary-hover'?: string;
    '--lb-fill-tertiary-active'?: string;
    '--lb-fill-tertiary-focus'?: string;
    '--lb-fill-tertiary-disabled'?: string;
    
    '--lb-text-tertiary-normal'?: string;
    '--lb-text-tertiary-contrast-high'?: string;
    '--lb-text-tertiary-contrast-low'?: string;
    '--lb-text-tertiary-disabled'?: string;
    
    '--lb-surface-tertiary-normal'?: string;
    '--lb-surface-tertiary-hover'?: string;
    '--lb-surface-tertiary-active'?: string;
    '--lb-surface-tertiary-subtle'?: string;
    '--lb-surface-tertiary-raised'?: string;
    
    '--lb-text-on-tertiary'?: string;
    '--lb-text-on-tertiary-hover'?: string;
    '--lb-text-on-tertiary-active'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - NEUTRAL
    // ============================================================
    
    '--lb-border-neutral-line'?: string;
    '--lb-border-neutral-normal'?: string;
    '--lb-border-neutral-active'?: string;
    '--lb-border-neutral-focus'?: string;
    '--lb-border-neutral-disabled'?: string;
    
    '--lb-fill-neutral-normal'?: string;
    '--lb-fill-neutral-hover'?: string;
    '--lb-fill-neutral-active'?: string;
    '--lb-fill-neutral-focus'?: string;
    '--lb-fill-neutral-disabled'?: string;
    
    '--lb-text-neutral-normal'?: string;
    '--lb-text-neutral-contrast-high'?: string;
    '--lb-text-neutral-contrast-low'?: string;
    '--lb-text-neutral-disabled'?: string;
    
    '--lb-surface-neutral-normal'?: string;
    '--lb-surface-neutral-hover'?: string;
    '--lb-surface-neutral-active'?: string;
    '--lb-surface-neutral-subtle'?: string;
    '--lb-surface-neutral-raised'?: string;
    '--lb-surface-neutral-disabled'?: string;
    
    '--lb-text-on-neutral'?: string;
    '--lb-text-on-neutral-hover'?: string;
    '--lb-text-on-neutral-active'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - SUCCESS
    // ============================================================
    
    '--lb-border-success-line'?: string;
    '--lb-border-success-normal'?: string;
    '--lb-border-success-active'?: string;
    '--lb-border-success-focus'?: string;
    '--lb-border-success-disabled'?: string;
    
    '--lb-fill-success-normal'?: string;
    '--lb-fill-success-hover'?: string;
    '--lb-fill-success-active'?: string;
    '--lb-fill-success-focus'?: string;
    '--lb-fill-success-disabled'?: string;
    
    '--lb-text-success-normal'?: string;
    '--lb-text-success-contrast-high'?: string;
    '--lb-text-success-contrast-low'?: string;
    '--lb-text-success-disabled'?: string;
    
    '--lb-surface-success-normal'?: string;
    '--lb-surface-success-hover'?: string;
    '--lb-surface-success-active'?: string;
    '--lb-surface-success-subtle'?: string;
    '--lb-surface-success-raised'?: string;
    
    '--lb-text-on-success'?: string;
    '--lb-text-on-success-hover'?: string;
    '--lb-text-on-success-active'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - WARNING
    // ============================================================
    
    '--lb-border-warning-line'?: string;
    '--lb-border-warning-normal'?: string;
    '--lb-border-warning-active'?: string;
    '--lb-border-warning-focus'?: string;
    '--lb-border-warning-disabled'?: string;
    
    '--lb-fill-warning-normal'?: string;
    '--lb-fill-warning-hover'?: string;
    '--lb-fill-warning-active'?: string;
    '--lb-fill-warning-focus'?: string;
    '--lb-fill-warning-disabled'?: string;
    
    '--lb-text-warning-normal'?: string;
    '--lb-text-warning-contrast-high'?: string;
    '--lb-text-warning-contrast-low'?: string;
    '--lb-text-warning-disabled'?: string;
    
    '--lb-surface-warning-normal'?: string;
    '--lb-surface-warning-hover'?: string;
    '--lb-surface-warning-active'?: string;
    '--lb-surface-warning-subtle'?: string;
    '--lb-surface-warning-raised'?: string;
    
    '--lb-text-on-warning'?: string;
    '--lb-text-on-warning-hover'?: string;
    '--lb-text-on-warning-active'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - ERROR
    // ============================================================
    
    '--lb-border-error-line'?: string;
    '--lb-border-error-normal'?: string;
    '--lb-border-error-active'?: string;
    '--lb-border-error-focus'?: string;
    '--lb-border-error-disabled'?: string;
    
    '--lb-fill-error-normal'?: string;
    '--lb-fill-error-hover'?: string;
    '--lb-fill-error-active'?: string;
    '--lb-fill-error-focus'?: string;
    '--lb-fill-error-disabled'?: string;
    
    '--lb-text-error-normal'?: string;
    '--lb-text-error-contrast-high'?: string;
    '--lb-text-error-contrast-low'?: string;
    '--lb-text-error-disabled'?: string;
    
    '--lb-surface-error-normal'?: string;
    '--lb-surface-error-hover'?: string;
    '--lb-surface-error-active'?: string;
    '--lb-surface-error-subtle'?: string;
    '--lb-surface-error-raised'?: string;
    
    '--lb-text-on-error'?: string;
    '--lb-text-on-error-hover'?: string;
    '--lb-text-on-error-active'?: string;
    
    // ============================================================
    // COLOR PROPERTIES - INFO
    // ============================================================
    
    '--lb-border-info-line'?: string;
    '--lb-border-info-normal'?: string;
    '--lb-border-info-active'?: string;
    '--lb-border-info-focus'?: string;
    '--lb-border-info-disabled'?: string;
    
    '--lb-fill-info-normal'?: string;
    '--lb-fill-info-hover'?: string;
    '--lb-fill-info-active'?: string;
    '--lb-fill-info-focus'?: string;
    '--lb-fill-info-disabled'?: string;
    
    '--lb-text-info-normal'?: string;
    '--lb-text-info-contrast-high'?: string;
    '--lb-text-info-contrast-low'?: string;
    '--lb-text-info-disabled'?: string;
    
    '--lb-surface-info-normal'?: string;
    '--lb-surface-info-hover'?: string;
    '--lb-surface-info-active'?: string;
    '--lb-surface-info-subtle'?: string;
    '--lb-surface-info-raised'?: string;
    
    '--lb-text-on-info'?: string;
    '--lb-text-on-info-hover'?: string;
    '--lb-text-on-info-active'?: string;
    
    // ============================================================
    // SPACING PROPERTIES
    // ============================================================
    
    /** Extra extra small spacing (2px) */
    '--lb-space-2xs'?: string;
    /** Extra small spacing (4px) */
    '--lb-space-xs'?: string;
    /** Small spacing (8px) */
    '--lb-space-sm'?: string;
    /** Medium spacing (12px) */
    '--lb-space-md'?: string;
    /** Large spacing (16px) */
    '--lb-space-lg'?: string;
    /** Extra large spacing (20px) */
    '--lb-space-xl'?: string;
    /** 2X large spacing (24px) */
    '--lb-space-2xl'?: string;
    /** 3X large spacing (32px) */
    '--lb-space-3xl'?: string;
    /** 4X large spacing (40px) */
    '--lb-space-4xl'?: string;
    /** 5X large spacing (48px) */
    '--lb-space-5xl'?: string;
    /** 6X large spacing (56px) */
    '--lb-space-6xl'?: string;
    /** 7X large spacing (64px) */
    '--lb-space-7xl'?: string;
    /** 8X large spacing (72px) */
    '--lb-space-8xl'?: string;
    /** 9X large spacing (96px) */
    '--lb-space-9xl'?: string;
    /** 10X large spacing (120px) */
    '--lb-space-10xl'?: string;
    
    // ============================================================
    // BORDER RADIUS PROPERTIES
    // ============================================================
    
    /** Extra small radius (4px) */
    '--lb-radius-xs'?: string;
    /** Small radius (8px) */
    '--lb-radius-sm'?: string;
    /** Medium radius (10px) */
    '--lb-radius-md'?: string;
    /** Large radius (12px) */
    '--lb-radius-lg'?: string;
    /** Extra large radius (16px) */
    '--lb-radius-xl'?: string;
    /** 2X large radius (24px) */
    '--lb-radius-2xl'?: string;
    /** 3X large radius (32px) */
    '--lb-radius-3xl'?: string;
    /** 4X large radius (40px) */
    '--lb-radius-4xl'?: string;
    /** 5X large radius (48px) */
    '--lb-radius-5xl'?: string;
    /** 6X large radius (56px) */
    '--lb-radius-6xl'?: string;
    /** 7X large radius (64px) */
    '--lb-radius-7xl'?: string;
    /** 8X large radius (72px) */
    '--lb-radius-8xl'?: string;
    /** 9X large radius (80px) */
    '--lb-radius-9xl'?: string;
    /** Full radius (9999px) */
    '--lb-radius-full'?: string;
    
    // ============================================================
    // SIZING PROPERTIES
    // ============================================================
    
    /** Small icon size (18px) */
    '--lb-icon-size-sm'?: string;
    /** Medium icon size (20px) */
    '--lb-icon-size-md'?: string;
    /** Large icon size (24px) */
    '--lb-icon-size-lg'?: string;
    
    /** Small border width (1px) */
    '--lb-border-sm'?: string;
    /** Medium border width (2px) */
    '--lb-border-md'?: string;
    
    /** Medium input height (40px) */
    '--lb-input-height-medium'?: string;
    /** Large input height (44px) */
    '--lb-input-height-large'?: string;
    
    // ============================================================
    // BACKGROUND & SPECIAL PROPERTIES
    // ============================================================
    
    /** Main page background color */
    '--lb-background-page'?: string;
    /** Surface/card background color */
    '--lb-background-surface'?: string;
    /** Modal overlay background color */
    '--lb-background-overlay'?: string;
    
    /** Focus ring color */
    '--lb-focus-ring-color'?: string;
    /** Divider/separator color */
    '--lb-divider-color'?: string;
  }
}

// Also export as a standalone type for convenience
export interface LittleBrandCSSVariables {
  [key: `--lb-${string}`]: string | number;
}