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