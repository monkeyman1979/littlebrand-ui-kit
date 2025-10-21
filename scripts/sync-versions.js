#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read main package.json
const mainPkgPath = path.join(__dirname, '../package.json');
const mainPkg = JSON.parse(fs.readFileSync(mainPkgPath, 'utf-8'));

// Read MCP server package.json
const mcpPkgPath = path.join(__dirname, '../mcp-server/package.json');
const mcpPkg = JSON.parse(fs.readFileSync(mcpPkgPath, 'utf-8'));

// Sync version
const mainVersion = mainPkg.version;
const mcpVersion = mcpPkg.version;

if (mainVersion !== mcpVersion) {
  console.log(`🔄 Syncing MCP server version: ${mcpVersion} → ${mainVersion}`);
  mcpPkg.version = mainVersion;
  mcpPkg.description = `MCP server for littlebrand-ui-kit v${mainVersion}`;

  fs.writeFileSync(mcpPkgPath, JSON.stringify(mcpPkg, null, 2) + '\n');
  console.log(`✅ MCP server version synced to ${mainVersion}`);
} else {
  console.log(`✅ Versions already in sync: ${mainVersion}`);
}
