# LittleBrand UI Kit MCP Server

A Model Context Protocol (MCP) server that enables AI assistants to discover, document, and generate code for the [LittleBrand UI Kit](https://www.npmjs.com/package/littlebrand-ui-kit).

## Features

This MCP server provides 10 powerful tools for working with LittleBrand UI Kit:

### Component Discovery
- **`lb_list_components`** - List all 33+ Vue components by category
- **`lb_search_components`** - Search components by name, description, or features
- **`lb_get_component_info`** - Get comprehensive documentation for any component

### Design Token System
- **`lb_list_tokens`** - Browse 312 design tokens (colors, spacing, typography)
- **`lb_search_tokens`** - Search tokens by name or description
- **`lb_get_token_info`** - Get detailed information about specific tokens

### Code Generation
- **`lb_generate_component_example`** - Generate ready-to-use Vue component code
- **`lb_generate_theme_config`** - Generate theme configuration JavaScript

### Documentation
- **`lb_get_installation_guide`** - Get installation and setup instructions
- **`lb_get_theming_guide`** - Get theming and customization guide

## Installation

The MCP server is **automatically included** when you install `littlebrand-ui-kit` via npm:

```bash
npm install littlebrand-ui-kit
```

All dependencies (`@modelcontextprotocol/sdk`, `zod`) are bundled with the main package - no additional installation required!

## Usage

### For Claude Code (Recommended for Projects)

Create `.claude/config.json` in your project root:

```json
{
  "mcpServers": {
    "littlebrand-ui-kit": {
      "command": "node",
      "args": [
        "./node_modules/littlebrand-ui-kit/mcp-server/dist/index.js"
      ]
    }
  }
}
```

**Then restart Claude Code** (fully quit and relaunch). The MCP server will load automatically.

### For Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "littlebrand-ui-kit": {
      "command": "node",
      "args": [
        "/absolute/path/to/your-project/node_modules/littlebrand-ui-kit/mcp-server/dist/index.js"
      ]
    }
  }
}
```

Replace `/absolute/path/to/your-project/` with your actual project path where `littlebrand-ui-kit` is installed.

### With Other MCP Clients

The server uses stdio transport and can be integrated with any MCP-compatible client:

```bash
node ./node_modules/littlebrand-ui-kit/mcp-server/dist/index.js
```

### Verifying Setup

After restarting your AI assistant, test the connection:

```
"Show me all available LittleBrand components"
```

You should see the assistant use tools like `lb_list_components` to provide accurate information.

## Example Queries

Once connected, try asking Claude:

- "Show me all available LittleBrand components"
- "How do I use the LbButton component?"
- "Generate a form with email input and submit button"
- "What spacing tokens are available?"
- "Create a theme config with purple and orange brand colors"
- "Search for components with icon support"
- "Show me typography tokens"

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run dev
```

## Architecture

- **`src/index.ts`** - Main server with tool registrations
- **`src/data/components.ts`** - Component metadata (33+ components)
- **`src/data/tokens.ts`** - Design token metadata (312 tokens)
- **`dist/`** - Compiled JavaScript output

## Available Components

The server provides documentation for all LittleBrand components:

- **Form**: LbInput, LbTextarea, LbSelect, LbCheckbox, LbRadio, LbSwitch, LbFormField, LbChatInput
- **Buttons**: LbButton, LbSegmentButton
- **Feedback**: LbDialog, LbSnackbar, LbBottomSheet
- **Navigation**: LbNavigationBar
- **Display**: LbAvatar, LbBadge, LbChip, LbDivider, LbProgress
- **Utility**: LbPopover, LbMenu, LbDropdown, LbCalendar, LbDatePicker

## Design Token Categories

Access complete documentation for:

- **Colors**: Border, Fill, Text, Surface (with 8 color variants × multiple states)
- **Spacing**: 14 spacing sizes (2xs to 10xl)
- **Typography**: Font families, sizes, weights, line heights
- **Layout**: Border radius, sizes, shadows
- **Other**: Icons, inputs, transitions, opacity

## License

MIT © LittleBrand

## Links

- [LittleBrand UI Kit](https://www.npmjs.com/package/littlebrand-ui-kit)
- [GitHub Repository](https://github.com/monkeyman1979/littlebrand-ui-kit)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
