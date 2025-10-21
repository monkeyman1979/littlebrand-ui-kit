#!/usr/bin/env node
/**
 * LittleBrand UI Kit MCP Server
 *
 * This MCP server provides tools for discovering components, design tokens,
 * and generating code examples for the LittleBrand UI Kit.
 *
 * Features:
 * - Component discovery and documentation
 * - Design token lookup and search
 * - Code generation for Vue components
 * - Theme configuration helpers
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { components, getComponentByName, getComponentsByCategory, searchComponents, COMPONENT_CATEGORIES } from "./data/components.js";
import { tokens, getTokensByCategory, searchTokens, getTokenByName, TOKEN_CATEGORIES } from "./data/tokens.js";
// Create MCP server instance
const server = new McpServer({
    name: "littlebrand-mcp-server",
    version: "1.0.0"
});
// Response format enum
var ResponseFormat;
(function (ResponseFormat) {
    ResponseFormat["MARKDOWN"] = "markdown";
    ResponseFormat["JSON"] = "json";
})(ResponseFormat || (ResponseFormat = {}));
// ============================================================================
// COMPONENT DISCOVERY TOOLS
// ============================================================================
/**
 * List all available LittleBrand UI Kit components
 */
server.registerTool("lb_list_components", {
    title: "List LittleBrand Components",
    description: `List all available components in the LittleBrand UI Kit with their categories.

Returns a comprehensive list of all 33+ Vue components organized by category (Form, Button, Feedback, Navigation, Display, Utility).

Args:
  - category (optional): Filter by specific category
    Options: "Form Components", "Button Components", "Feedback Components", "Navigation Components", "Display Components", "Utility Components"
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For Markdown: Formatted list grouped by category with component names and descriptions
  For JSON: Array of component objects with full metadata

Examples:
  - Use when: "Show me all available components"
  - Use when: "List all form components"
  - Use when: "What components are available?"

The response includes component names, categories, descriptions, and import paths.`,
    inputSchema: {
        category: z.string()
            .optional()
            .describe("Filter by category (e.g., 'Form Components', 'Button Components')"),
        response_format: z.nativeEnum(ResponseFormat)
            .default(ResponseFormat.MARKDOWN)
            .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const filteredComponents = params.category
            ? getComponentsByCategory(params.category)
            : components;
        if (filteredComponents.length === 0) {
            return {
                content: [{
                        type: "text",
                        text: `No components found${params.category ? ` in category "${params.category}"` : ''}. Available categories: ${Object.values(COMPONENT_CATEGORIES).join(', ')}`
                    }]
            };
        }
        let result;
        if (params.response_format === ResponseFormat.MARKDOWN) {
            const lines = [
                `# LittleBrand UI Kit Components${params.category ? ` - ${params.category}` : ''}`,
                "",
                `Total: ${filteredComponents.length} components`,
                ""
            ];
            // Group by category
            const byCategory = new Map();
            filteredComponents.forEach(comp => {
                if (!byCategory.has(comp.category)) {
                    byCategory.set(comp.category, []);
                }
                byCategory.get(comp.category).push(comp);
            });
            byCategory.forEach((comps, cat) => {
                lines.push(`## ${cat}`);
                lines.push("");
                comps.forEach(comp => {
                    lines.push(`### ${comp.name}`);
                    lines.push(comp.description);
                    lines.push(`**Import**: \`import { ${comp.name} } from '${comp.importPath}'\``);
                    lines.push("");
                });
            });
            result = lines.join("\n");
        }
        else {
            const response = {
                total: filteredComponents.length,
                category: params.category || "all",
                components: filteredComponents.map(c => ({
                    name: c.name,
                    category: c.category,
                    description: c.description,
                    importPath: c.importPath,
                    features: c.features
                }))
            };
            result = JSON.stringify(response, null, 2);
        }
        return {
            content: [{ type: "text", text: result }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
/**
 * Search for components by name, description, or features
 */
server.registerTool("lb_search_components", {
    title: "Search LittleBrand Components",
    description: `Search for components by name, description, features, or category.

Performs a fuzzy search across component names, descriptions, features, and categories to find matching components.

Args:
  - query (string): Search term (minimum 2 characters)
    Examples: "button", "form", "input", "dialog", "navigation"
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For Markdown: List of matching components with descriptions
  For JSON: Array of matched component objects

Examples:
  - Use when: "Find components with icon support"
  - Use when: "Search for input components"
  - Use when: "Which components handle validation?"

The search is case-insensitive and matches partial strings.`,
    inputSchema: {
        query: z.string()
            .min(2, "Query must be at least 2 characters")
            .max(100, "Query must not exceed 100 characters")
            .describe("Search term to match against component names, descriptions, and features"),
        response_format: z.nativeEnum(ResponseFormat)
            .default(ResponseFormat.MARKDOWN)
            .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const results = searchComponents(params.query);
        if (results.length === 0) {
            return {
                content: [{
                        type: "text",
                        text: `No components found matching "${params.query}". Try broader search terms like "button", "input", "form", or "dialog".`
                    }]
            };
        }
        let result;
        if (params.response_format === ResponseFormat.MARKDOWN) {
            const lines = [
                `# Search Results: "${params.query}"`,
                "",
                `Found ${results.length} matching component${results.length !== 1 ? 's' : ''}`,
                ""
            ];
            results.forEach(comp => {
                lines.push(`## ${comp.name}`);
                lines.push(`**Category**: ${comp.category}`);
                lines.push(`**Description**: ${comp.description}`);
                lines.push(`**Import**: \`import { ${comp.name} } from '${comp.importPath}'\``);
                if (comp.features.length > 0) {
                    lines.push("**Key Features**:");
                    comp.features.slice(0, 3).forEach(feature => {
                        lines.push(`- ${feature}`);
                    });
                }
                lines.push("");
            });
            result = lines.join("\n");
        }
        else {
            const response = {
                query: params.query,
                total: results.length,
                results: results.map(c => ({
                    name: c.name,
                    category: c.category,
                    description: c.description,
                    importPath: c.importPath,
                    features: c.features
                }))
            };
            result = JSON.stringify(response, null, 2);
        }
        return {
            content: [{ type: "text", text: result }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
/**
 * Get detailed information about a specific component
 */
server.registerTool("lb_get_component_info", {
    title: "Get Component Details",
    description: `Get comprehensive documentation for a specific LittleBrand component.

Returns complete information including props, slots, events, usage examples, and features for any component.

Args:
  - name (string): Component name (case-insensitive)
    Examples: "LbButton", "LbInput", "LbDialog", "LbSelect", "LbCheckbox"
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For Markdown: Formatted documentation with sections for description, props, slots, emits, usage
  For JSON: Complete component metadata object with all fields

The response includes:
  - Component description and category
  - All props with types, defaults, and options
  - Available slots for customization
  - Emitted events
  - Usage code examples
  - Feature list

Examples:
  - Use when: "Show me how to use LbButton"
  - Use when: "What props does LbInput accept?"
  - Use when: "Give me LbDialog documentation"

Error Handling:
  - Returns "Component not found" if name doesn't match any component
  - Suggests similar component names if available`,
    inputSchema: {
        name: z.string()
            .min(1, "Component name is required")
            .describe("Component name (e.g., 'LbButton', 'LbInput')"),
        response_format: z.nativeEnum(ResponseFormat)
            .default(ResponseFormat.MARKDOWN)
            .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const component = getComponentByName(params.name);
        if (!component) {
            return {
                content: [{
                        type: "text",
                        text: `Component "${params.name}" not found. Use lb_search_components or lb_list_components to find available components.`
                    }],
                isError: true
            };
        }
        let result;
        if (params.response_format === ResponseFormat.MARKDOWN) {
            const lines = [
                `# ${component.name}`,
                "",
                component.description,
                "",
                `**Category**: ${component.category}`,
                `**Import**: \`import { ${component.name} } from '${component.importPath}'\``,
                ""
            ];
            if (component.features.length > 0) {
                lines.push("## Features");
                lines.push("");
                component.features.forEach(feature => {
                    lines.push(`- ${feature}`);
                });
                lines.push("");
            }
            if (component.props.length > 0) {
                lines.push("## Props");
                lines.push("");
                component.props.forEach(prop => {
                    const required = prop.required ? ' *(required)*' : '';
                    const defaultVal = prop.default ? ` - Default: \`${prop.default}\`` : '';
                    lines.push(`### ${prop.name}${required}`);
                    lines.push(`- **Type**: \`${prop.type}\`${defaultVal}`);
                    lines.push(`- **Description**: ${prop.description}`);
                    if (prop.options && prop.options.length > 0) {
                        lines.push(`- **Options**: ${prop.options.map(o => `\`'${o}'\``).join(', ')}`);
                    }
                    lines.push("");
                });
            }
            if (component.slots.length > 0) {
                lines.push("## Slots");
                lines.push("");
                component.slots.forEach(slot => {
                    lines.push(`### ${slot.name}`);
                    lines.push(slot.description);
                    lines.push("");
                });
            }
            if (component.emits.length > 0) {
                lines.push("## Events");
                lines.push("");
                component.emits.forEach(emit => {
                    lines.push(`### @${emit.name}`);
                    lines.push(emit.description);
                    if (emit.parameters) {
                        lines.push(`**Parameters**: \`${emit.parameters}\``);
                    }
                    lines.push("");
                });
            }
            lines.push("## Usage");
            lines.push("");
            lines.push("```vue");
            lines.push(component.usage);
            lines.push("```");
            result = lines.join("\n");
        }
        else {
            result = JSON.stringify(component, null, 2);
        }
        return {
            content: [{ type: "text", text: result }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
// ============================================================================
// DESIGN TOKEN TOOLS
// ============================================================================
/**
 * List all design tokens by category
 */
server.registerTool("lb_list_tokens", {
    title: "List Design Tokens",
    description: `List all available design tokens in the LittleBrand UI Kit.

Returns CSS custom properties (tokens) organized by category for colors, spacing, typography, and more.

Args:
  - category (optional): Filter by specific token category
    Options: "Border", "Fill", "Text", "Surface", "Spacing", "Border Radius", "Size", "Typography", "Shadow", "Icon", "Input", "Transition", "Opacity"
  - limit (number): Maximum number of tokens to return (1-200, default: 50)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For Markdown: Formatted list of tokens with descriptions and usage examples
  For JSON: Array of token objects with complete metadata

Examples:
  - Use when: "Show me all spacing tokens"
  - Use when: "List typography tokens"
  - Use when: "What color tokens are available?"

The response includes token names, categories, descriptions, and usage examples.
Total available tokens: 300+`,
    inputSchema: {
        category: z.string()
            .optional()
            .describe("Filter by category (e.g., 'Spacing', 'Typography', 'Border')"),
        limit: z.number()
            .int()
            .min(1)
            .max(200)
            .default(50)
            .describe("Maximum number of tokens to return"),
        response_format: z.nativeEnum(ResponseFormat)
            .default(ResponseFormat.MARKDOWN)
            .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const filteredTokens = params.category
            ? getTokensByCategory(params.category)
            : tokens;
        if (filteredTokens.length === 0) {
            return {
                content: [{
                        type: "text",
                        text: `No tokens found${params.category ? ` in category "${params.category}"` : ''}. Available categories: ${Object.values(TOKEN_CATEGORIES).join(', ')}`
                    }]
            };
        }
        const limitedTokens = filteredTokens.slice(0, params.limit);
        const hasMore = filteredTokens.length > params.limit;
        let result;
        if (params.response_format === ResponseFormat.MARKDOWN) {
            const lines = [
                `# Design Tokens${params.category ? ` - ${params.category}` : ''}`,
                "",
                `Showing ${limitedTokens.length} of ${filteredTokens.length} tokens`,
                ""
            ];
            if (hasMore) {
                lines.push(`*Note: Response limited to ${params.limit} tokens. Use higher limit or filter by category to see more.*`);
                lines.push("");
            }
            // Group by category
            const byCategory = new Map();
            limitedTokens.forEach(token => {
                if (!byCategory.has(token.category)) {
                    byCategory.set(token.category, []);
                }
                byCategory.get(token.category).push(token);
            });
            byCategory.forEach((toks, cat) => {
                lines.push(`## ${cat}`);
                lines.push("");
                toks.forEach(token => {
                    lines.push(`### \`${token.name}\``);
                    lines.push(token.description);
                    lines.push(`**Usage**: \`${token.usage}\``);
                    if (token.example) {
                        lines.push(`**Example**: ${token.example}`);
                    }
                    lines.push("");
                });
            });
            result = lines.join("\n");
        }
        else {
            const response = {
                total: filteredTokens.length,
                showing: limitedTokens.length,
                hasMore,
                category: params.category || "all",
                tokens: limitedTokens
            };
            result = JSON.stringify(response, null, 2);
        }
        return {
            content: [{ type: "text", text: result }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
/**
 * Search for design tokens
 */
server.registerTool("lb_search_tokens", {
    title: "Search Design Tokens",
    description: `Search for design tokens by name, description, or category.

Performs a fuzzy search across token names and descriptions to find CSS variables.

Args:
  - query (string): Search term (minimum 2 characters)
    Examples: "primary", "spacing", "border", "font", "shadow"
  - limit (number): Maximum results to return (1-100, default: 20)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For Markdown: List of matching tokens with usage examples
  For JSON: Array of matched token objects

Examples:
  - Use when: "Find tokens for button styling"
  - Use when: "Search for primary color tokens"
  - Use when: "What tokens control spacing?"

The search is case-insensitive and matches partial strings in token names and descriptions.`,
    inputSchema: {
        query: z.string()
            .min(2, "Query must be at least 2 characters")
            .max(100, "Query must not exceed 100 characters")
            .describe("Search term to match against token names and descriptions"),
        limit: z.number()
            .int()
            .min(1)
            .max(100)
            .default(20)
            .describe("Maximum number of results to return"),
        response_format: z.nativeEnum(ResponseFormat)
            .default(ResponseFormat.MARKDOWN)
            .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const results = searchTokens(params.query);
        if (results.length === 0) {
            return {
                content: [{
                        type: "text",
                        text: `No tokens found matching "${params.query}". Try terms like "primary", "spacing", "border", "font", or "shadow".`
                    }]
            };
        }
        const limitedResults = results.slice(0, params.limit);
        const hasMore = results.length > params.limit;
        let result;
        if (params.response_format === ResponseFormat.MARKDOWN) {
            const lines = [
                `# Token Search: "${params.query}"`,
                "",
                `Found ${results.length} matching tokens (showing ${limitedResults.length})`,
                ""
            ];
            if (hasMore) {
                lines.push(`*Note: ${results.length - limitedResults.length} more tokens available. Increase limit to see more.*`);
                lines.push("");
            }
            limitedResults.forEach(token => {
                lines.push(`## \`${token.name}\``);
                lines.push(`**Category**: ${token.category}${token.subcategory ? ` / ${token.subcategory}` : ''}`);
                lines.push(`**Description**: ${token.description}`);
                lines.push(`**Usage**: \`${token.usage}\``);
                if (token.example) {
                    lines.push(`**Example**: ${token.example}`);
                }
                lines.push("");
            });
            result = lines.join("\n");
        }
        else {
            const response = {
                query: params.query,
                total: results.length,
                showing: limitedResults.length,
                hasMore,
                results: limitedResults
            };
            result = JSON.stringify(response, null, 2);
        }
        return {
            content: [{ type: "text", text: result }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
/**
 * Get specific token information
 */
server.registerTool("lb_get_token_info", {
    title: "Get Token Details",
    description: `Get detailed information about a specific design token.

Returns complete documentation for a CSS custom property including description, usage, and examples.

Args:
  - name (string): Token name (with or without -- prefix)
    Examples: "lb-border-primary-normal", "--lb-space-md", "lb-font-heading"

Returns:
  Complete token information including category, description, usage example, and practical examples.

Examples:
  - Use when: "What is --lb-border-primary-normal?"
  - Use when: "How do I use lb-space-md?"
  - Use when: "Tell me about the lb-font-heading token"

Error Handling:
  - Returns "Token not found" if name doesn't match
  - Suggests using lb_search_tokens to find similar tokens`,
    inputSchema: {
        name: z.string()
            .min(1, "Token name is required")
            .describe("Token name (e.g., 'lb-border-primary-normal', '--lb-space-md')")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const token = getTokenByName(params.name);
        if (!token) {
            return {
                content: [{
                        type: "text",
                        text: `Token "${params.name}" not found. Use lb_search_tokens or lb_list_tokens to find available tokens.`
                    }],
                isError: true
            };
        }
        const lines = [
            `# ${token.name}`,
            "",
            `**Category**: ${token.category}${token.subcategory ? ` / ${token.subcategory}` : ''}`,
            "",
            `## Description`,
            token.description,
            "",
            `## Usage`,
            "```css",
            token.usage,
            "```"
        ];
        if (token.example) {
            lines.push("");
            lines.push("## Example");
            lines.push(token.example);
        }
        return {
            content: [{ type: "text", text: lines.join("\n") }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
// ============================================================================
// CODE GENERATION TOOLS
// ============================================================================
/**
 * Generate component usage example
 */
server.registerTool("lb_generate_component_example", {
    title: "Generate Component Example",
    description: `Generate Vue.js code examples for LittleBrand components.

Creates ready-to-use Vue component code with proper imports, template syntax, and prop configurations.

Args:
  - component (string): Component name (e.g., "LbButton", "LbInput")
  - scenario (string): Use case description
    Examples: "submit form button", "email input with validation", "primary action dialog"
  - include_script (boolean): Include <script setup> section (default: true)

Returns:
  Complete Vue component code with:
  - Import statements
  - Template with component usage
  - Script setup (if requested)
  - Proper prop configurations
  - Event handlers where applicable

Examples:
  - Use when: "Generate a form with email input and submit button"
  - Use when: "Show me LbDialog for confirming deletion"
  - Use when: "Create a navigation bar example"

The generated code follows Vue 3 Composition API patterns and LittleBrand best practices.`,
    inputSchema: {
        component: z.string()
            .min(1, "Component name is required")
            .describe("Component name (e.g., 'LbButton', 'LbInput', 'LbDialog')"),
        scenario: z.string()
            .max(500, "Scenario description too long")
            .default("basic usage")
            .describe("Use case or scenario (e.g., 'form submit button', 'search input')"),
        include_script: z.boolean()
            .default(true)
            .describe("Include <script setup> section with reactive state")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const component = getComponentByName(params.component);
        if (!component) {
            return {
                content: [{
                        type: "text",
                        text: `Component "${params.component}" not found. Use lb_search_components or lb_list_components to find available components.`
                    }],
                isError: true
            };
        }
        const lines = [];
        if (params.include_script) {
            lines.push("<script setup>");
            lines.push(`import { ${component.name} } from '${component.importPath}'`);
            // Add reactive imports for interactive examples
            if (component.emits.length > 0 || component.props.some(p => p.name === 'modelValue')) {
                lines.push("import { ref } from 'vue'");
                lines.push("");
                // Add reactive state based on component type
                if (component.props.some(p => p.name === 'modelValue')) {
                    const valueType = component.category === 'Form Components' ? 'text' : 'value';
                    lines.push(`const ${valueType} = ref('')`);
                }
                // Add handlers for emits
                if (component.emits.some(e => e.name === 'click')) {
                    lines.push("const handleClick = () => {");
                    lines.push("  console.log('Button clicked')");
                    lines.push("}");
                }
            }
            lines.push("</script>");
            lines.push("");
        }
        lines.push("<template>");
        lines.push(`  <!-- ${params.scenario} -->`);
        // Use the component's built-in usage example as base
        const usageLines = component.usage.split('\n');
        usageLines.forEach(line => {
            lines.push(`  ${line}`);
        });
        lines.push("</template>");
        return {
            content: [{
                    type: "text",
                    text: lines.join("\n")
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
/**
 * Generate theme configuration
 */
server.registerTool("lb_generate_theme_config", {
    title: "Generate Theme Config",
    description: `Generate JavaScript code for customizing LittleBrand UI Kit theme colors.

Creates ready-to-use applyTheme() configuration code for runtime theme customization.

Args:
  - colors (object): Color configuration with optional keys:
    - primary: Primary brand color (hex)
    - secondary: Secondary brand color (hex)
    - neutral: Neutral/gray color (hex)
    - success: Success state color (hex)
    - warning: Warning state color (hex)
    - error: Error state color (hex)
    - info: Info state color (hex)
  - saturation_curve ('natural' | 'vivid' | 'muted'): Color saturation curve (default: 'natural')
    - natural: Balanced saturation
    - vivid: More saturated/bold colors
    - muted: Less saturated/subtle colors

Returns:
  Complete JavaScript code with:
  - Import statement for applyTheme
  - Color configuration object
  - applyTheme() function call
  - Comments explaining the configuration

Examples:
  - Use when: "Generate theme config for purple and orange brand colors"
  - Use when: "Create a corporate blue theme"
  - Use when: "Set up custom brand colors"

The generated code uses LittleBrand's runtime theming system which automatically generates
all color scales, dark mode variants, and semantic tokens from single color values.`,
    inputSchema: {
        colors: z.object({
            primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color (e.g., #8b5cf6)").optional(),
            secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color").optional(),
            neutral: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color").optional(),
            success: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color").optional(),
            warning: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color").optional(),
            error: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color").optional(),
            info: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be hex color").optional()
        }).describe("Color configuration object with hex color values"),
        saturation_curve: z.enum(['natural', 'vivid', 'muted'])
            .default('natural')
            .describe("Color saturation curve: 'natural' (balanced), 'vivid' (bold), 'muted' (subtle)")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const hasColors = Object.keys(params.colors).length > 0;
        if (!hasColors) {
            return {
                content: [{
                        type: "text",
                        text: "Error: At least one color must be provided (primary, secondary, neutral, success, warning, error, or info)"
                    }],
                isError: true
            };
        }
        const lines = [
            "// LittleBrand UI Kit Theme Configuration",
            "import { applyTheme } from 'littlebrand-ui-kit'",
            "",
            "// Apply custom theme colors",
            "// This generates complete color scales, dark mode, and semantic tokens automatically",
            "applyTheme({",
        ];
        // Add configured colors
        Object.entries(params.colors).forEach(([key, value]) => {
            lines.push(`  ${key}: '${value}',  // ${key.charAt(0).toUpperCase() + key.slice(1)} brand color`);
        });
        // Remove trailing comma from last entry
        const lastLineIndex = lines.length - 1;
        if (lines[lastLineIndex].endsWith(',')) {
            lines[lastLineIndex] = lines[lastLineIndex].slice(0, -1);
        }
        lines.push(`}${params.saturation_curve !== 'natural' ? `, '${params.saturation_curve}'` : ''})  // Saturation curve: ${params.saturation_curve}`);
        lines.push("");
        lines.push("// This generates:");
        lines.push("// - 12-step color scales for each color");
        lines.push("// - Dark mode optimized colors");
        lines.push("// - Alpha/transparent variants");
        lines.push("// - All semantic tokens (borders, fills, text, surfaces)");
        return {
            content: [{
                    type: "text",
                    text: lines.join("\n")
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
// ============================================================================
// DOCUMENTATION TOOLS
// ============================================================================
/**
 * Get installation and setup guide
 */
server.registerTool("lb_get_installation_guide", {
    title: "Get Installation Guide",
    description: `Get installation and setup instructions for LittleBrand UI Kit.

Returns comprehensive guide for installing and configuring the UI kit in Vue.js projects.

Args:
  - method ('plugin' | 'import' | 'all'): Installation method (default: 'all')
    - plugin: Global plugin registration
    - import: Tree-shakeable individual imports
    - all: Show all methods

Returns:
  Complete installation guide including:
  - npm install command
  - Setup code for chosen method
  - Style imports
  - Optional theme configuration
  - Usage examples

Examples:
  - Use when: "How do I install LittleBrand UI Kit?"
  - Use when: "Show me setup instructions"
  - Use when: "How to configure the UI kit?"`,
    inputSchema: {
        method: z.enum(['plugin', 'import', 'all'])
            .default('all')
            .describe("Installation method: 'plugin' (global), 'import' (tree-shakeable), 'all' (show both)")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const lines = [
            "# LittleBrand UI Kit - Installation Guide",
            "",
            "## Installation",
            "",
            "Install via npm:",
            "```bash",
            "npm install littlebrand-ui-kit",
            "```",
            ""
        ];
        if (params.method === 'plugin' || params.method === 'all') {
            lines.push("## Method 1: Global Plugin (All Components)");
            lines.push("");
            lines.push("Register all components globally:");
            lines.push("");
            lines.push("```javascript");
            lines.push("// main.js");
            lines.push("import { createApp } from 'vue'");
            lines.push("import App from './App.vue'");
            lines.push("import { LittleBrandUI, applyTheme } from 'littlebrand-ui-kit'");
            lines.push("import 'littlebrand-ui-kit/style.css'");
            lines.push("");
            lines.push("// OPTIONAL: Customize theme colors");
            lines.push("applyTheme({");
            lines.push("  primary: '#AB4ABA',");
            lines.push("  secondary: '#F76B15'");
            lines.push("})");
            lines.push("");
            lines.push("const app = createApp(App)");
            lines.push("app.use(LittleBrandUI)  // All components available globally");
            lines.push("app.mount('#app')");
            lines.push("```");
            lines.push("");
            lines.push("Now use components anywhere without importing:");
            lines.push("```vue");
            lines.push("<template>");
            lines.push("  <lb-button variant=\"filled\">Click Me</lb-button>");
            lines.push("</template>");
            lines.push("```");
            lines.push("");
        }
        if (params.method === 'import' || params.method === 'all') {
            lines.push("## Method 2: Import as Needed (Recommended - Tree-shaking)");
            lines.push("");
            lines.push("Import only what you need:");
            lines.push("");
            lines.push("```javascript");
            lines.push("// main.js - Setup and theme");
            lines.push("import { createApp } from 'vue'");
            lines.push("import App from './App.vue'");
            lines.push("import { applyTheme } from 'littlebrand-ui-kit'");
            lines.push("import 'littlebrand-ui-kit/style.css'");
            lines.push("");
            lines.push("applyTheme({ primary: '#8b5cf6' })");
            lines.push("");
            lines.push("const app = createApp(App)");
            lines.push("app.mount('#app')");
            lines.push("```");
            lines.push("");
            lines.push("```vue");
            lines.push("<!-- Component.vue -->");
            lines.push("<script setup>");
            lines.push("import { LbButton, LbInput } from 'littlebrand-ui-kit'");
            lines.push("</script>");
            lines.push("");
            lines.push("<template>");
            lines.push("  <lb-button variant=\"filled\">Click Me</lb-button>");
            lines.push("  <lb-input v-model=\"text\" placeholder=\"Enter text\" />");
            lines.push("</template>");
            lines.push("```");
            lines.push("");
        }
        lines.push("## Next Steps");
        lines.push("");
        lines.push("- Explore components: Use `lb_list_components`");
        lines.push("- Customize theme: Use `lb_generate_theme_config`");
        lines.push("- View design tokens: Use `lb_list_tokens`");
        lines.push("- Generate examples: Use `lb_generate_component_example`");
        return {
            content: [{ type: "text", text: lines.join("\n") }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
/**
 * Get theming and customization guide
 */
server.registerTool("lb_get_theming_guide", {
    title: "Get Theming Guide",
    description: `Get comprehensive theming and customization guide for LittleBrand UI Kit.

Returns detailed documentation on customizing colors, typography, spacing, and other design aspects.

Args:
  - topic ('colors' | 'typography' | 'tokens' | 'all'): Focus area (default: 'all')
    - colors: Color customization with applyTheme()
    - typography: Font customization
    - tokens: CSS variable overrides
    - all: Complete guide

Returns:
  Theming guide with:
  - Runtime color customization
  - CSS variable overrides
  - Typography setup
  - Dark mode configuration
  - Code examples

Examples:
  - Use when: "How do I customize colors?"
  - Use when: "How to change fonts?"
  - Use when: "What theming options are available?"`,
    inputSchema: {
        topic: z.enum(['colors', 'typography', 'tokens', 'all'])
            .default('all')
            .describe("Topic: 'colors', 'typography', 'tokens', or 'all'")
    },
    annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
    }
}, async (params) => {
    try {
        const lines = [
            "# LittleBrand UI Kit - Theming Guide",
            ""
        ];
        if (params.topic === 'colors' || params.topic === 'all') {
            lines.push("## Color Customization");
            lines.push("");
            lines.push("### Runtime Theme (Recommended)");
            lines.push("");
            lines.push("Customize colors instantly with JavaScript:");
            lines.push("");
            lines.push("```javascript");
            lines.push("import { applyTheme } from 'littlebrand-ui-kit'");
            lines.push("");
            lines.push("// Just provide single colors - everything else is generated!");
            lines.push("applyTheme({");
            lines.push("  primary: '#8b5cf6',   // Your brand purple");
            lines.push("  secondary: '#f59e0b'  // Your brand orange");
            lines.push("})");
            lines.push("```");
            lines.push("");
            lines.push("This automatically generates:");
            lines.push("- 12-step color scales for each color");
            lines.push("- Dark mode colors");
            lines.push("- Alpha/transparent versions");
            lines.push("- All semantic tokens (borders, fills, text, surfaces)");
            lines.push("");
            lines.push("### Saturation Curves");
            lines.push("");
            lines.push("```javascript");
            lines.push("// Natural (default) - balanced");
            lines.push("applyTheme({ primary: '#6366f1' }, 'natural')");
            lines.push("");
            lines.push("// Vivid - more saturated, bold");
            lines.push("applyTheme({ primary: '#6366f1' }, 'vivid')");
            lines.push("");
            lines.push("// Muted - less saturated, subtle");
            lines.push("applyTheme({ primary: '#6366f1' }, 'muted')");
            lines.push("```");
            lines.push("");
        }
        if (params.topic === 'typography' || params.topic === 'all') {
            lines.push("## Typography Customization");
            lines.push("");
            lines.push("LittleBrand uses three independent font families:");
            lines.push("");
            lines.push("```css");
            lines.push(":root {");
            lines.push("  /* Headings (h1-h6) */");
            lines.push("  --lb-font-heading: 'Playfair Display', serif;");
            lines.push("  ");
            lines.push("  /* Body text (paragraphs) */");
            lines.push("  --lb-font-body: 'Inter', sans-serif;");
            lines.push("  ");
            lines.push("  /* UI elements (buttons, labels) */");
            lines.push("  --lb-font-label: 'Inter', sans-serif;");
            lines.push("  ");
            lines.push("  /* Font sizes */");
            lines.push("  --lb-font-size-body-base: 15px;");
            lines.push("  --lb-font-size-label-base: 14px;");
            lines.push("}");
            lines.push("```");
            lines.push("");
        }
        if (params.topic === 'tokens' || params.topic === 'all') {
            lines.push("## CSS Variable Overrides");
            lines.push("");
            lines.push("Override any design token:");
            lines.push("");
            lines.push("```css");
            lines.push(":root {");
            lines.push("  /* Border radius */");
            lines.push("  --lb-radius-md: 12px;");
            lines.push("  ");
            lines.push("  /* Spacing */");
            lines.push("  --lb-space-md: 16px;");
            lines.push("  ");
            lines.push("  /* Shadows */");
            lines.push("  --lb-shadow-md: 0 4px 6px rgba(0,0,0,0.1);");
            lines.push("}");
            lines.push("```");
            lines.push("");
            lines.push("Available token categories:");
            lines.push("- Border: `--lb-border-*`");
            lines.push("- Fill: `--lb-fill-*`");
            lines.push("- Text: `--lb-text-*`");
            lines.push("- Surface: `--lb-surface-*`");
            lines.push("- Spacing: `--lb-space-*`");
            lines.push("- Radius: `--lb-radius-*`");
            lines.push("- Typography: `--lb-font-*`");
            lines.push("");
            lines.push("Use `lb_list_tokens` to see all 300+ tokens.");
            lines.push("");
        }
        if (params.topic === 'all') {
            lines.push("## Dark Mode");
            lines.push("");
            lines.push("Enable dark mode by adding a class or attribute:");
            lines.push("");
            lines.push("```html");
            lines.push("<!-- Using class -->");
            lines.push("<body class=\"dark\">");
            lines.push("");
            lines.push("<!-- Using data attribute -->");
            lines.push("<html data-theme=\"dark\">");
            lines.push("```");
            lines.push("");
            lines.push("All color tokens automatically switch to dark-optimized values.");
        }
        return {
            content: [{ type: "text", text: lines.join("\n") }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
// ============================================================================
// SERVER STARTUP
// ============================================================================
async function main() {
    console.error("LittleBrand UI Kit MCP Server starting...");
    // Create stdio transport
    const transport = new StdioServerTransport();
    // Connect server to transport
    await server.connect(transport);
    console.error("LittleBrand UI Kit MCP Server running on stdio");
    console.error(`Loaded ${components.length} components and ${tokens.length} design tokens`);
}
// Run the server
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map