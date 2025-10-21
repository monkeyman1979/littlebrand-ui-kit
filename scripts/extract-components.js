#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Component categories based on directory structure and known types
const COMPONENT_CATEGORIES = {
  FORM: 'Form Components',
  BUTTON: 'Button Components',
  FEEDBACK: 'Feedback Components',
  NAVIGATION: 'Navigation Components',
  DISPLAY: 'Display Components',
  UTILITY: 'Utility Components'
};

// Categorize component based on name and known patterns
function categorizeComponent(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('input') || lowerName.includes('textarea') ||
      lowerName.includes('select') || lowerName.includes('checkbox') ||
      lowerName.includes('radio') || lowerName.includes('switch') ||
      lowerName.includes('formfield')) {
    return COMPONENT_CATEGORIES.FORM;
  }

  if (lowerName.includes('button') || lowerName.includes('segment')) {
    return COMPONENT_CATEGORIES.BUTTON;
  }

  if (lowerName.includes('dialog') || lowerName.includes('snackbar') ||
      lowerName.includes('bottomsheet')) {
    return COMPONENT_CATEGORIES.FEEDBACK;
  }

  if (lowerName.includes('navigation')) {
    return COMPONENT_CATEGORIES.NAVIGATION;
  }

  if (lowerName.includes('avatar') || lowerName.includes('badge') ||
      lowerName.includes('chip') || lowerName.includes('divider') ||
      lowerName.includes('progress')) {
    return COMPONENT_CATEGORIES.DISPLAY;
  }

  return COMPONENT_CATEGORIES.UTILITY;
}

// Parse a .vue.d.ts file and extract component metadata
function parseComponentDeclaration(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.vue.d.ts');

  const component = {
    name: fileName,
    category: categorizeComponent(fileName),
    description: '',
    props: [],
    slots: [],
    emits: [],
    importPath: 'littlebrand-ui-kit',
    features: [],
    usage: ''
  };

  // Extract Props interface
  const propsMatch = content.match(/export interface (\w+Props)\s*{([^}]+)}/s);
  if (propsMatch) {
    const propsBody = propsMatch[2];
    const propLines = propsBody.split('\n').filter(line => line.trim());

    propLines.forEach(line => {
      const match = line.match(/(\w+)\??\s*:\s*([^\/]+)/);
      if (match) {
        const [, name, type] = match;
        const isOptional = line.includes('?:');
        const typeClean = type.trim();

        // Extract options from union types
        let options = [];
        if (typeClean.includes("'")) {
          const optionsMatch = typeClean.match(/'([^']+)'/g);
          if (optionsMatch) {
            options = optionsMatch.map(o => o.replace(/'/g, ''));
          }
        }

        component.props.push({
          name,
          type: typeClean,
          required: !isOptional,
          description: `${name} property`,
          options: options.length > 0 ? options : undefined
        });
      }
    });
  }

  // Extract Slots interface
  const slotsMatch = content.match(/export interface (\w+Slots)\s*{([^}]+)}/s);
  if (slotsMatch) {
    const slotsBody = slotsMatch[2];
    const slotLines = slotsBody.split('\n').filter(line => line.trim() && !line.includes('//'));

    slotLines.forEach(line => {
      const match = line.match(/['"]?([^'":\s]+)['"]?\s*\(/);
      if (match) {
        const slotName = match[1];
        component.slots.push({
          name: slotName,
          description: `${slotName} slot`
        });
      }
    });
  }

  // Extract Emits interface
  const emitsMatch = content.match(/export interface (\w+Emits)\s*{([^}]+)}/s);
  if (emitsMatch) {
    const emitsBody = emitsMatch[2];
    const emitLines = emitsBody.split('\n').filter(line => line.trim());

    emitLines.forEach(line => {
      const match = line.match(/(\w+|'[\w-]+')\s*:\s*\(([^)]*)\)/);
      if (match) {
        const [, name, params] = match;
        const eventName = name.replace(/'/g, '');
        component.emits.push({
          name: eventName,
          description: `${eventName} event`,
          parameters: params.trim() || undefined
        });
      }
    });
  }

  return component;
}

// Generate basic usage example
function generateUsageExample(component) {
  const hasModelValue = component.props.some(p => p.name === 'modelValue');
  const hasSlots = component.slots.length > 0;

  let usage = `<${component.name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1)}`;

  // Add common props
  if (component.props.some(p => p.name === 'variant')) {
    usage += ` variant="filled"`;
  }
  if (component.props.some(p => p.name === 'color')) {
    usage += ` color="primary"`;
  }
  if (hasModelValue) {
    usage += ` v-model="value"`;
  }

  if (hasSlots) {
    usage += `>\n  Content here\n</${component.name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1)}>`;
  } else {
    usage += ` />`;
  }

  return usage;
}

// Main extraction logic
async function extractComponents() {
  console.log('🔍 Extracting component metadata...');

  // Find all .vue.d.ts files
  const declarationFiles = await glob('src/components/**/*.vue.d.ts', {
    cwd: path.join(__dirname, '..'),
    absolute: true
  });

  console.log(`📦 Found ${declarationFiles.length} component declaration files`);

  const components = [];

  for (const filePath of declarationFiles) {
    try {
      const component = parseComponentDeclaration(filePath);

      // Generate features list based on props
      const features = [];
      if (component.props.some(p => p.name === 'variant' && p.options)) {
        features.push(`Multiple variants: ${component.props.find(p => p.name === 'variant').options.join(', ')}`);
      }
      if (component.props.some(p => p.name === 'color' && p.options)) {
        features.push(`Color options: ${component.props.find(p => p.name === 'color').options.join(', ')}`);
      }
      if (component.props.some(p => p.name === 'size' && p.options)) {
        features.push(`Sizes: ${component.props.find(p => p.name === 'size').options.join(', ')}`);
      }
      if (component.props.some(p => p.name === 'disabled')) {
        features.push('Disabled state');
      }
      if (component.props.some(p => p.name === 'invalid')) {
        features.push('Validation states');
      }
      if (component.slots.some(s => s.name.includes('icon'))) {
        features.push('Icon support');
      }

      component.features = features;
      component.usage = generateUsageExample(component);
      component.description = `${component.name} component`;

      components.push(component);
    } catch (error) {
      console.error(`❌ Error parsing ${filePath}:`, error.message);
    }
  }

  // Sort by category then name
  components.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  console.log(`✅ Extracted ${components.length} components`);

  // Generate TypeScript file
  const mcpTsContent = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 *
 * Generated from: src/components/ *.vue.d.ts files
 * Generated on: ${new Date().toISOString()}
 *
 * This file is automatically generated during the build process.
 * To update: Edit component .vue.d.ts files and run \`npm run extract:components\`
 */

export interface ComponentProp {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
  options?: string[];
}

export interface ComponentSlot {
  name: string;
  description: string;
}

export interface ComponentEmit {
  name: string;
  description: string;
  parameters?: string;
}

export interface Component {
  name: string;
  category: string;
  description: string;
  props: ComponentProp[];
  slots: ComponentSlot[];
  emits: ComponentEmit[];
  usage: string;
  features: string[];
  importPath: string;
}

export const COMPONENT_CATEGORIES = ${JSON.stringify(COMPONENT_CATEGORIES, null, 2)} as const;

export const components: Component[] = ${JSON.stringify(components, null, 2)};

// Quick lookup helpers
export const getComponentByName = (name: string): Component | undefined => {
  return components.find(c => c.name.toLowerCase() === name.toLowerCase());
};

export const getComponentsByCategory = (category: string): Component[] => {
  return components.filter(c => c.category === category);
};

export const searchComponents = (query: string): Component[] => {
  const lowerQuery = query.toLowerCase();
  return components.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.features.some(f => f.toLowerCase().includes(lowerQuery)) ||
    c.category.toLowerCase().includes(lowerQuery)
  );
};
`;

  // Ensure directory exists
  const mcpDataDir = path.join(__dirname, '../mcp-server/src/data');
  if (!fs.existsSync(mcpDataDir)) {
    fs.mkdirSync(mcpDataDir, { recursive: true });
  }

  // Write file
  const outputPath = path.join(mcpDataDir, 'components.ts');
  fs.writeFileSync(outputPath, mcpTsContent);
  console.log(`✅ MCP component data generated at ${outputPath}`);
  console.log(`📊 ${components.length} components across ${new Set(components.map(c => c.category)).size} categories`);
}

// Run extraction
extractComponents().catch(error => {
  console.error('❌ Component extraction failed:', error);
  process.exit(1);
});
