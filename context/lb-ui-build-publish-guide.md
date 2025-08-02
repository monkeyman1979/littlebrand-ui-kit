# LittleBrand UI Kit - Build & Publish Guide

This guide covers everything you need to know about building, testing, and publishing the LittleBrand UI Kit to npm.

## Table of Contents
1. [Building the Library](#building-the-library)
2. [Testing Locally](#testing-locally)
3. [Controlling Package Contents](#controlling-package-contents)
4. [Pre-Publish Verification](#pre-publish-verification)
5. [Publishing to npm](#publishing-to-npm)
6. [Unpublishing & Recovery](#unpublishing--recovery)

## Building the Library

### Basic Build Command
```bash
npm run build
```

This creates a `dist/` folder containing:
- `littlebrand-ui.es.js` - ES module build for modern bundlers
- `littlebrand-ui.umd.js` - UMD build for direct browser usage
- `style.css` - Compiled CSS from all component styles

### What Happens During Build
1. Vite bundles all Vue components
2. SASS files are compiled to CSS
3. TypeScript declarations are generated
4. Tree-shaking optimizations are applied

## Testing Locally

### Step 1: Link Your Package
In the UI kit project directory:
```bash
npm run build
npm link
```

This creates a global symbolic link to your local package.

### Step 2: Create a Test Project
In a different directory:
```bash
# Create test project
mkdir test-littlebrand
cd test-littlebrand
npm init -y

# Install Vue 3 (peer dependency)
npm install vue@3

# Link to your local UI kit
npm link littlebrand-ui-kit
```

### Step 3: Test the Import
Create `test.js`:
```javascript
// Test individual imports
import { LbButton, LbInput } from 'littlebrand-ui-kit'
import 'littlebrand-ui-kit/style.css'

// Test plugin install
import LittleBrandUI from 'littlebrand-ui-kit'
```

### Step 4: Unlink When Done
```bash
# In test project
npm unlink littlebrand-ui-kit

# In UI kit project
npm unlink
```

## Controlling Package Contents

### The "files" Field
Your `package.json` controls what gets published:

```json
"files": [
  "dist",
  "src/components",
  "src/styles"
]
```

### What Gets Included
✅ **Included:**
- Everything in `dist/`
- All component source files in `src/components/`
- All SASS files in `src/styles/`
- `package.json` (always included)
- `README.md` (always included)
- `LICENSE` (always included)

❌ **Excluded:**
- `/context` folder (documentation)
- `/src/examples` folder
- Development configs (`vite.config.js`, etc.)
- `.git` directory
- `node_modules`
- Any file starting with `.` (like `.gitignore`)

### Default npm Exclusions
npm automatically excludes:
- `.git`
- `.gitignore`
- `node_modules`
- `.npmignore`
- Development files

## Pre-Publish Verification

### 1. Dry Run (See What Would Be Published)
```bash
npm pack --dry-run
```

This lists all files that would be included without creating anything.

### 2. Create Test Package
```bash
npm pack
```

Creates `littlebrand-ui-kit-0.1.0.tgz` in your current directory.

### 3. Inspect Package Contents

**List contents without extracting:**
```bash
tar -tzf littlebrand-ui-kit-0.1.0.tgz
```

**Extract and examine:**
```bash
# Create temp directory
mkdir temp-check

# Extract package
tar -xzf littlebrand-ui-kit-0.1.0.tgz -C temp-check

# View structure
ls -la temp-check/package/

# Clean up
rm -rf temp-check
rm littlebrand-ui-kit-0.1.0.tgz
```

### Expected Structure
```
package/
├── dist/
│   ├── littlebrand-ui.es.js
│   ├── littlebrand-ui.umd.js
│   └── style.css
├── src/
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ... (all components)
│   └── styles/
│       ├── _base.sass
│       ├── _colors.sass
│       └── ... (all styles)
├── package.json
├── README.md
└── LICENSE
```

## Publishing to npm

### Prerequisites
1. npm account: `npm login`
2. Unique package name
3. Valid version in package.json

### Publishing Options

#### Option 1: Beta Release (Recommended for First Time)
```bash
# Publish as beta
npm publish --tag beta

# Users must explicitly install beta version
# npm install littlebrand-ui-kit@beta
```

#### Option 2: Scoped Package (For Testing)
Change package.json:
```json
"name": "@yourusername/littlebrand-ui-kit"
```

Then publish:
```bash
npm publish --access public
```

#### Option 3: Production Release
```bash
# Final verification
npm pack --dry-run

# Publish to npm
npm publish
```

### Post-Publish Verification
```bash
# View on npm
npm view littlebrand-ui-kit

# Test installation in new project
npm install littlebrand-ui-kit
```

## Unpublishing & Recovery

### Within 72 Hours
You can unpublish if:
- No other packages depend on it
- Published less than 72 hours ago

```bash
# Unpublish specific version
npm unpublish littlebrand-ui-kit@0.1.0

# Unpublish entire package (use with caution!)
npm unpublish littlebrand-ui-kit --force
```

### After 72 Hours
You can only deprecate:
```bash
npm deprecate littlebrand-ui-kit@0.1.0 "This version has issues, please use 0.2.0"
```

### Best Practices to Avoid Issues

1. **Always test with npm pack first**
2. **Use beta tags for initial releases**
3. **Start with version 0.1.0 or 0.0.1**
4. **Keep sensitive data out of the package**
5. **Review every file that will be published**

### Version Management
```bash
# Patch release (0.1.0 → 0.1.1)
npm version patch

# Minor release (0.1.0 → 0.2.0)
npm version minor

# Major release (0.1.0 → 1.0.0)
npm version major
```

## Common Issues & Solutions

### Issue: Accidentally published wrong files
**Solution:** Unpublish within 72 hours and republish with correct files.

### Issue: Package name already taken
**Solution:** Use scoped package name: `@username/littlebrand-ui-kit`

### Issue: Build files not updated
**Solution:** Always run `npm run build` before `npm publish`

### Issue: Peer dependency warnings
**Solution:** Ensure Vue 3 is listed in peerDependencies, not dependencies

## Quick Checklist Before Publishing

- [ ] Run `npm run build`
- [ ] Test with `npm link` in separate project
- [ ] Verify files with `npm pack --dry-run`
- [ ] Check version number is correct
- [ ] Ensure README.md is updated
- [ ] Verify no sensitive information included
- [ ] Consider using beta tag for first release