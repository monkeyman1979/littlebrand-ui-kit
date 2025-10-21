#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the theme SASS file (contains all tokens)
const sassFilePath = path.join(__dirname, '../src/styles/_theme.sass');
const outputPath = path.join(__dirname, '../TOKENS.md');

const sassContent = fs.readFileSync(sassFilePath, 'utf-8');

// Extract all CSS custom property DEFINITIONS (--lb-*: value)
// This regex looks for tokens at the start of lines (with optional indentation)
const tokenRegex = /^\s*(--lb-[\w-]+):/gm;
const tokens = new Set();

// Find all matches
let match;
while ((match = tokenRegex.exec(sassContent)) !== null) {
  tokens.add(match[1]);
}

// Sort tokens into categories
const categorized = {
  border: [],
  fill: [],
  text: [],
  surface: [],
  input: [],
  icon: [],
  space: [],
  radius: [],
  other: []
};

// Categorize each token
for (const token of tokens) {
  if (token.startsWith('--lb-border-')) categorized.border.push(token);
  else if (token.startsWith('--lb-fill-')) categorized.fill.push(token);
  else if (token.startsWith('--lb-text-')) categorized.text.push(token);
  else if (token.startsWith('--lb-surface-')) categorized.surface.push(token);
  else if (token.startsWith('--lb-input-')) categorized.input.push(token);
  else if (token.startsWith('--lb-icon-')) categorized.icon.push(token);
  else if (token.startsWith('--lb-space-')) categorized.space.push(token);
  else if (token.startsWith('--lb-radius-')) categorized.radius.push(token);
  else categorized.other.push(token);
}

// Generate markdown content
let markdown = `# LittleBrand UI Kit - CSS Token Reference

This file contains all available CSS custom properties (tokens) in the LittleBrand UI Kit.
Use these tokens in your styles instead of hardcoded values.

Generated on: ${new Date().toISOString().split('T')[0]}

`;

// Add each category
const categoryTitles = {
  border: 'Border Tokens',
  fill: 'Fill Tokens',
  text: 'Text Tokens',
  surface: 'Surface Tokens',
  input: 'Input Tokens',
  icon: 'Icon Size Tokens',
  space: 'Spacing Tokens',
  radius: 'Border Radius Tokens',
  other: 'Other Tokens'
};

for (const [key, title] of Object.entries(categoryTitles)) {
  const categoryTokens = categorized[key];
  if (categoryTokens.length > 0) {
    markdown += `## ${title}\n\n`;
    categoryTokens.sort().forEach(token => {
      markdown += `- \`${token}\`\n`;
    });
    markdown += '\n';
  }
}

// Add usage note
markdown += `## Usage

These tokens are defined in the theme and will adapt to light/dark mode automatically.

Example usage in CSS/SASS:
\`\`\`css
.my-component {
  color: var(--lb-text-primary-normal);
  background: var(--lb-fill-primary-normal);
  border: 1px solid var(--lb-border-primary-normal);
}
\`\`\`
`;

// Write the markdown file
fs.writeFileSync(outputPath, markdown);
console.log(`✅ Token reference extracted to ${outputPath}`);
console.log(`📊 Found ${tokens.size} unique tokens across ${Object.values(categorized).filter(arr => arr.length > 0).length} categories`);

// ============================================================================
// GENERATE MCP SERVER TOKEN DATA
// ============================================================================

// Generate TypeScript file for MCP server
const mcpTokensPath = path.join(__dirname, '../mcp-server/src/data/tokens.ts');

// Create enhanced token metadata for MCP server
const mcpTokens = [];

// Token metadata templates
const tokenDescriptions = {
  border: {
    normal: 'Standard border color for normal state',
    line: 'Line/divider border color',
    active: 'Border color for active/pressed state',
    focus: 'Border color for focus state',
    disabled: 'Border color for disabled state'
  },
  fill: {
    normal: 'Standard fill/background color',
    hover: 'Fill color for hover state',
    active: 'Fill color for active/pressed state',
    focus: 'Fill color for focus state',
    disabled: 'Fill color for disabled state'
  },
  text: {
    normal: 'Standard text color',
    'contrast-low': 'Text color with lower contrast',
    'contrast-high': 'Text color with higher contrast',
    disabled: 'Text color for disabled state'
  },
  surface: {
    normal: 'Subtle surface/background color',
    hover: 'Surface color for hover state',
    active: 'Surface color for active state'
  }
};

// Generate token metadata
for (const token of tokens) {
  const tokenName = token;
  let category = 'Other';
  let subcategory = '';
  let description = '';
  let usage = `Use in CSS: ${tokenName}`;
  let example = '';

  // Categorize and describe
  if (token.startsWith('--lb-border-')) {
    category = 'Border';
    const parts = token.replace('--lb-border-', '').split('-');
    const variant = parts[0];
    const state = parts.slice(1).join('-');
    subcategory = variant;
    description = `${variant.charAt(0).toUpperCase() + variant.slice(1)} border color for ${state} state`;
    usage = `border: 1px solid var(${tokenName});`;
    example = `Use for ${variant} border in ${state} state`;
  } else if (token.startsWith('--lb-fill-')) {
    category = 'Fill';
    const parts = token.replace('--lb-fill-', '').split('-');
    const variant = parts[0];
    const state = parts.slice(1).join('-');
    subcategory = variant;
    description = `${variant.charAt(0).toUpperCase() + variant.slice(1)} fill/background color for ${state} state`;
    usage = `background: var(${tokenName});`;
    example = `Background color for ${variant} element in ${state} state`;
  } else if (token.startsWith('--lb-text-')) {
    category = 'Text';
    const parts = token.replace('--lb-text-', '').split('-');
    if (parts[0] === 'on') {
      const variant = parts[1];
      const state = parts.slice(2).join('-') || 'normal';
      subcategory = `on-${variant}`;
      description = `Text color for use on ${variant} backgrounds (${state} state)`;
      usage = `color: var(${tokenName});`;
      example = `Text on ${variant} button`;
    } else {
      const variant = parts[0];
      const state = parts.slice(1).join('-') || 'normal';
      subcategory = variant;
      description = `${variant.charAt(0).toUpperCase() + variant.slice(1)} text color (${state} contrast)`;
      usage = `color: var(${tokenName});`;
      example = `Text color for ${variant} content`;
    }
  } else if (token.startsWith('--lb-surface-')) {
    category = 'Surface';
    const parts = token.replace('--lb-surface-', '').split('-');
    if (parts[0] === 'base' || parts[0] === 'subtle' || parts[0] === 'overlay' || parts[0] === 'disabled') {
      description = `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} surface background`;
      usage = `background: var(${tokenName});`;
      example = `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} background surface`;
    } else {
      const variant = parts[0];
      const state = parts.slice(1).join('-');
      subcategory = variant;
      description = `${variant.charAt(0).toUpperCase() + variant.slice(1)} surface color (${state} state)`;
      usage = `background: var(${tokenName});`;
      example = `Subtle ${variant} background in ${state} state`;
    }
  } else if (token.startsWith('--lb-space-')) {
    category = 'Spacing';
    const size = token.replace('--lb-space-', '');
    description = `Spacing size ${size}`;
    usage = `padding: var(${tokenName}); gap: var(${tokenName});`;
    example = `Use for margins, padding, gaps`;
  } else if (token.startsWith('--lb-radius-')) {
    category = 'Border Radius';
    const size = token.replace('--lb-radius-', '');
    description = `Border radius ${size}`;
    usage = `border-radius: var(${tokenName});`;
    example = size === 'full' ? 'Fully rounded (pills, circles)' : `Rounded corners`;
  } else if (token.startsWith('--lb-input-')) {
    category = 'Input';
    description = token.includes('height') ? 'Input height' : 'Input property';
    usage = token.includes('height') ? `height: var(${tokenName});` : `Use in input styles`;
  } else if (token.startsWith('--lb-icon-')) {
    category = 'Icon';
    const size = token.replace('--lb-icon-size-', '');
    description = `Icon size ${size}`;
    usage = `width: var(${tokenName}); height: var(${tokenName});`;
    example = `Standard icon sizing`;
  }

  mcpTokens.push({
    name: tokenName,
    category,
    subcategory,
    description,
    usage,
    example
  });
}

// Generate TypeScript content
const mcpTsContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 *
 * Generated from: src/styles/_theme.sass
 * Generated on: ${new Date().toISOString()}
 *
 * This file is automatically generated during the build process.
 * To update: Edit the source SASS files and run \`npm run extract:tokens\`
 */

export interface DesignToken {
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  example?: string;
  usage: string;
}

export const TOKEN_CATEGORIES = {
  BORDER: 'Border',
  FILL: 'Fill',
  TEXT: 'Text',
  SURFACE: 'Surface',
  SPACING: 'Spacing',
  RADIUS: 'Border Radius',
  SIZE: 'Size',
  TYPOGRAPHY: 'Typography',
  SHADOW: 'Shadow',
  ICON: 'Icon',
  INPUT: 'Input',
  TRANSITION: 'Transition',
  OPACITY: 'Opacity',
  OTHER: 'Other'
} as const;

export const tokens: DesignToken[] = ${JSON.stringify(mcpTokens, null, 2)};

// Helper functions
export const getTokensByCategory = (category: string): DesignToken[] => {
  return tokens.filter(t => t.category === category);
};

export const getTokensBySubcategory = (category: string, subcategory: string): DesignToken[] => {
  return tokens.filter(t => t.category === category && t.subcategory === subcategory);
};

export const searchTokens = (query: string): DesignToken[] => {
  const lowerQuery = query.toLowerCase();
  return tokens.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery) ||
    t.subcategory?.toLowerCase().includes(lowerQuery)
  );
};

export const getTokenByName = (name: string): DesignToken | undefined => {
  // Allow with or without -- prefix
  const normalized = name.startsWith('--') ? name : \`--\${name}\`;
  return tokens.find(t => t.name === normalized);
};
`;

// Ensure mcp-server/src/data directory exists
const mcpDataDir = path.join(__dirname, '../mcp-server/src/data');
if (!fs.existsSync(mcpDataDir)) {
  fs.mkdirSync(mcpDataDir, { recursive: true });
}

// Write MCP TypeScript file
fs.writeFileSync(mcpTokensPath, mcpTsContent);
console.log(`✅ MCP token data generated at ${mcpTokensPath}`);