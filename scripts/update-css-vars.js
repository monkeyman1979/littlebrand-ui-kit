#!/usr/bin/env node

// Script to help identify SASS variable usage in components
const fs = require('fs');
const path = require('path');

// Map of SASS variables to CSS custom properties
const variableMap = {
  // Base spacing
  'base.$space-1': 'var(--space-1)',
  'base.$space-2': 'var(--space-2)',
  'base.$space-3': 'var(--space-3)',
  'base.$space-4': 'var(--space-4)',
  'base.$space-5': 'var(--space-5)',
  'base.$space-6': 'var(--space-6)',
  'base.$space-7': 'var(--space-7)',
  'base.$space-8': 'var(--space-8)',
  'base.$space-9': 'var(--space-9)',
  'base.$space-10': 'var(--space-10)',
  'base.$space-11': 'var(--space-11)',
  'base.$space-12': 'var(--space-12)',
  'base.$space-13': 'var(--space-13)',
  'base.$space-14': 'var(--space-14)',
  'base.$space-15': 'var(--space-15)',
  'base.$space-16': 'var(--space-16)',
  'base.$space-17': 'var(--space-17)',
  'base.$space-18': 'var(--space-18)',
  
  // Sizes
  'base.$size-xs': 'var(--icon-size-xs)',
  'base.$size-sm': 'var(--icon-size-sm)',
  'base.$size-md': 'var(--icon-size-md)',
  'base.$size-lg': 'var(--icon-size-lg)',
  'base.$size-xl': 'var(--btn-height-small)',
  'base.$size-2xl': 'var(--btn-height-medium)',
  'base.$size-3xl': 'var(--btn-height-large)',
  
  // Border radius
  'base.$radius-xs': 'var(--radius-xs)',
  'base.$radius-sm': 'var(--radius-sm)',
  'base.$radius-md': 'var(--radius-md)',
  'base.$radius-lg': 'var(--radius-lg)',
  'base.$radius-xl': 'var(--radius-xl)',
  'base.$radius-2xl': 'var(--radius-2xl)',
  'base.$radius-3xl': 'var(--radius-3xl)',
  'base.$radius-4xl': 'var(--radius-4xl)',
  'base.$radius-full': 'var(--radius-full)',
  
  // Borders
  'base.$border-thin': 'var(--border-thin)',
  'base.$border-medium': 'var(--border-medium)',
  'base.$border-thick': 'var(--border-thick)',
  
  // Transitions
  'base.$transition': 'var(--transition)',
  
  // Focus
  'base.$focus-ring-width': 'var(--focus-ring-width)',
  'base.$focus-ring-offset': 'var(--focus-ring-offset)',
  
  // Z-index
  'base.$z-dropdown': 'var(--z-dropdown)',
  'base.$z-modal-backdrop': 'var(--z-modal-backdrop)',
  'base.$z-modal': 'var(--z-modal)',
  'base.$z-notification': 'var(--z-notification)',
  
  // Typography
  'typography.$font-heading': 'var(--font-heading)',
  'typography.$font-body': 'var(--font-body)',
  'typography.$font-mono': 'var(--font-mono)',
  'typography.$weight-normal': 'var(--font-weight-normal)',
  'typography.$weight-medium': 'var(--font-weight-medium)',
  'typography.$weight-semibold': 'var(--font-weight-semibold)',
  'typography.$weight-bold': 'var(--font-weight-bold)',
  'typography.$line-compact': 'var(--line-height-compact)',
  'typography.$line-normal': 'var(--line-height-normal)',
  'typography.$line-relaxed': 'var(--line-height-relaxed)',
  'typography.$label-size-small': 'var(--font-size-label-small)',
  'typography.$label-size-base': 'var(--font-size-label-base)',
  'typography.$label-size-large': 'var(--font-size-label-large)',
  'typography.$letter-spacing-tight': 'var(--letter-spacing-tight)',
  'typography.$letter-spacing-normal': 'var(--letter-spacing-normal)',
  'typography.$letter-spacing-wide': 'var(--letter-spacing-wide)',
};

// Function to process a file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find all SASS variable usages
  const sassVarRegex = /(base|typography)\.\$[\w-]+/g;
  const matches = content.match(sassVarRegex);
  
  if (!matches) {
    console.log(`No SASS variables found in ${filePath}`);
    return;
  }
  
  console.log(`\n${filePath}:`);
  console.log('Found SASS variables:');
  
  const unique = [...new Set(matches)];
  unique.forEach(sassVar => {
    const cssVar = variableMap[sassVar];
    if (cssVar) {
      console.log(`  ${sassVar} → ${cssVar}`);
    } else {
      console.log(`  ${sassVar} → ⚠️  NO MAPPING FOUND`);
    }
  });
  
  console.log(`Total: ${matches.length} usages (${unique.length} unique)`);
}

// Process all component files
const componentsDir = path.join(__dirname, '../src/components');
const componentFiles = fs.readdirSync(componentsDir, { recursive: true })
  .filter(file => file.endsWith('.vue'))
  .map(file => path.join(componentsDir, file));

componentFiles.forEach(processFile);