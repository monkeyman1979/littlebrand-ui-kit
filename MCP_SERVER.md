# LittleBrand UI Kit - MCP Server

The LittleBrand UI Kit includes an integrated MCP (Model Context Protocol) server that enables AI assistants to accurately discover components, design tokens, and generate code.

## Why Use the MCP Server?

**Problem**: LLMs often hallucinate component prop names, design token variables, and API details when working with UI kits.

**Solution**: The MCP server provides a **source of truth** that LLMs can query to get accurate, up-to-date information about:
- Component props, slots, and events
- Design token variable names
- Usage examples and documentation

## Installation

The MCP server is automatically included when you install `littlebrand-ui-kit`. No separate installation needed!

```bash
npm install littlebrand-ui-kit
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "littlebrand": {
      "command": "node",
      "args": [
        "/absolute/path/to/your-project/node_modules/littlebrand-ui-kit/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Or use the bin command directly:

```json
{
  "mcpServers": {
    "littlebrand": {
      "command": "npx",
      "args": ["littlebrand-mcp"]
    }
  }
}
```

## Usage with Claude Code

Create a skill for LittleBrand:

```markdown
# .claude/skills/littlebrand.md

You are expert at building UI with LittleBrand UI Kit.

## CRITICAL RULES:
1. ALWAYS use the MCP server to verify component props and token names
2. NEVER guess token variable names - use `lb_search_tokens` first
3. NEVER guess component props - use `lb_get_component_info` first

## Workflow:
1. Before using any component: `lb_get_component_info`
2. Before using any design token: `lb_search_tokens`
3. Generate code only after confirming exact names from MCP
```

## Available Tools

### Component Discovery
- `lb_list_components` - List all components by category
- `lb_search_components` - Search components by features
- `lb_get_component_info` - Get full component documentation

### Design Tokens
- `lb_list_tokens` - Browse all design tokens
- `lb_search_tokens` - Search tokens by name
- `lb_get_token_info` - Get specific token details

### Code Generation
- `lb_generate_component_example` - Generate Vue component code
- `lb_generate_theme_config` - Generate theme configuration

### Documentation
- `lb_get_installation_guide` - Installation instructions
- `lb_get_theming_guide` - Theming guide

## Example Queries

Once connected, try asking Claude:

```
"What props does LbButton accept?"
"Search for components with validation support"
"What's the exact token name for primary button background?"
"Generate a form with email input and submit button"
"Show me all spacing tokens"
```

## Auto-Generation

The MCP server data is **automatically generated** from your source code during build:

```bash
npm run build
```

This ensures the MCP server is always in sync with your actual components and tokens - **no manual updates needed**!

### Build Process

1. `extract:tokens` - Parses SASS files → generates `mcp-server/src/data/tokens.ts`
2. `extract:components` - Parses `.vue.d.ts` files → generates `mcp-server/src/data/components.ts`
3. `sync:versions` - Keeps MCP server version matched to UI kit version
4. `build:mcp` - Compiles TypeScript MCP server

## Development

If you're contributing to LittleBrand UI Kit:

### Adding a New Component

1. Create your Vue component with `.vue.d.ts` declaration
2. Run `npm run build`
3. ✅ MCP server automatically includes the new component!

### Adding Design Tokens

1. Add tokens to SASS files
2. Run `npm run build`
3. ✅ MCP server automatically includes the new tokens!

### Updating Component Props

1. Edit the `.vue.d.ts` file
2. Run `npm run build`
3. ✅ MCP server reflects the changes!

## Version Locking

The MCP server version is automatically synced with the UI kit version. When you use `littlebrand-ui-kit@0.7.0`, you get the MCP server that knows exactly that version's components and tokens.

## Troubleshooting

### MCP server not found

Make sure you're pointing to the correct path in your MCP config. The server is located at:
```
node_modules/littlebrand-ui-kit/mcp-server/dist/index.js
```

### Outdated component/token information

Run `npm run build` to regenerate the MCP data from source.

### LLM still hallucinating

Make sure to:
1. Create a Claude Code skill that enforces MCP usage
2. Add instructions to your project's `CLAUDE.md`
3. Ask Claude to verify names with the MCP server before writing code

## Technical Details

- **Transport**: stdio
- **Language**: TypeScript
- **Auto-generated**: Yes, from source during build
- **Components**: 24+
- **Design Tokens**: 280+
- **Tools**: 10

## Links

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [GitHub Repository](https://github.com/monkeyman1979/littlebrand-ui-kit)
- [NPM Package](https://www.npmjs.com/package/littlebrand-ui-kit)
