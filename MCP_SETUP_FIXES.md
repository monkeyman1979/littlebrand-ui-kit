# MCP Server Setup Fixes - Summary

## Problem
The MCP server wasn't working when users installed `littlebrand-ui-kit` because the runtime dependencies (`@modelcontextprotocol/sdk` and `zod`) weren't being installed alongside the UI kit.

## Root Cause
The MCP server's dependencies were only listed in `mcp-server/package.json`, but when users installed the main package, those dependencies weren't available at runtime.

## Solution

### 1. Added Dependencies to Main Package
Added MCP server runtime dependencies to the main `package.json`:

```json
"dependencies": {
  "@modelcontextprotocol/sdk": "^1.6.1",
  "@vueuse/core": "^13.8.0",
  "culori": "^4.0.2",
  "zod": "^3.23.8"
}
```

**Why this works**: When users `npm install littlebrand-ui-kit`, these dependencies are now installed automatically in their `node_modules`, making them available to the MCP server.

### 2. Updated Setup Instructions

#### For Claude Code (Project-Specific)
Users create `.claude/config.json` in their project root:

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

**Benefits**:
- ✅ Version automatically matches installed UI kit
- ✅ Fully offline (no internet needed after install)
- ✅ MCP data guaranteed in sync with UI kit
- ✅ Simple relative path (no absolute paths)

#### For Claude Desktop
Similar approach but with absolute path:

```json
{
  "mcpServers": {
    "littlebrand-ui-kit": {
      "command": "node",
      "args": [
        "/absolute/path/to/project/node_modules/littlebrand-ui-kit/mcp-server/dist/index.js"
      ]
    }
  }
}
```

### 3. Updated Documentation
- **README.md**: Updated AI Assistant Integration section (lines 366-452)
- **mcp-server/README.md**: Updated Installation and Usage sections (lines 27-96)
- Removed incorrect `npx` references
- Added clear Claude Code instructions
- Emphasized that dependencies are bundled

## Testing Process

1. Added dependencies to main package.json
2. Ran `npm install` in ui-kit project
3. Used `npm link` to test in another project:
   ```bash
   cd littlebrand-ui-kit && npm link
   cd ../littlebrand && npm link littlebrand-ui-kit
   ```
4. Created `.claude/config.json` in test project
5. Tested MCP server startup: ✅ Success
6. Restarted Claude Code
7. Verified MCP tools available

## Files Changed

1. `/package.json` - Added MCP dependencies
2. `/README.md` - Updated MCP setup instructions
3. `/mcp-server/README.md` - Updated installation guide

## What Users Need to Do

After we publish the next version (0.8.1+):

1. Install or update the package:
   ```bash
   npm install littlebrand-ui-kit
   ```

2. Create `.claude/config.json` in their project:
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

3. Restart Claude Code (fully quit and relaunch)

4. Test with: "Show me all available LittleBrand components"

## Before Publishing Checklist

- [x] Add MCP dependencies to main package.json
- [x] Update main README.md
- [x] Update mcp-server/README.md
- [ ] Build and test: `npm run build`
- [ ] Verify MCP server works in test project
- [ ] Update CHANGELOG.md
- [ ] Bump version: `npm version 0.8.1`
- [ ] Publish: `npm publish`
- [ ] Test installation from npm
- [ ] Verify MCP server works from published package

## Notes

- The `bin` entry in package.json (`"littlebrand-mcp": "./mcp-server/dist/index.js"`) is already configured
- The MCP server files are already included in the publish (`"files"` array includes `mcp-server/dist`)
- Users can also use `npx littlebrand-mcp` after install, but the node_modules approach is more reliable
