# Fix Configuration Issues and Optimize UI Package Size

## 🎯 Overview

This PR addresses critical configuration issues in the core package and dramatically reduces the UI package size from **113 MB to 7.4 MB** (93% reduction).

## 📦 Core Package (@pr-pilot/core)

### Problems Fixed

1. **Invalid Import Statement**
   - Generated config had `import { defineConfig } from "pr-pilot"` which doesn't exist
   - Caused confusion for users trying to use the config

2. **TypeScript Dependency Error**
   ```
   ❌ Error: Cannot find package 'typescript' imported from
   /Users/apple/.npm/_npx/53c2026370b5a58a/node_modules/cosmiconfig/dist/loaders.js
   ```

   - Occurred when using `npx pr-pilot` because TypeScript wasn't available in npx context
   - Cosmiconfig tried to load `.ts` files but couldn't find TypeScript

### Solutions Implemented

#### 1. Changed to JSON Config Format

- **Before**: `pr-pilot.config.ts` with TypeScript imports
- **After**: `.pr-pilotrc.json` with clean JSON structure

```json
{
  "commit": {
    "format": "conventional",
    "scopes": ["frontend", "backend", "docs"],
    "maxLength": 100
  },
  "hooks": {
    "lint": true,
    "format": true,
    "test": false
  },
  "pr": {
    "base": "auto",
    "draft": false,
    "labels": [],
    "reviewers": [],
    "template": true
  }
}
```

#### 2. TypeScript as Optional Peer Dependency

- Moved `typescript` from `dependencies` to optional `peerDependencies`
- Users can still use TypeScript configs if they have `@pr-pilot/core` installed locally
- No breaking changes for users with TypeScript in their projects

#### 3. Updated Config Loader Priority

```typescript
searchPlaces: [
  '.pr-pilotrc.json', // ← Prioritized
  '.pr-pilotrc',
  'package.json',
  'pr-pilot.config.js',
  'pr-pilot.config.cjs',
  'pr-pilot.config.mjs',
  'pr-pilot.config.ts', // ← Last resort
]
```

#### 4. Documentation Updates

- Updated README with JSON examples
- Added TypeScript config as "Advanced" option
- Updated CLI help text

### Files Changed

- `packages/core/src/utils/init-config.ts` - Generate JSON instead of TS
- `packages/core/src/config/loader.ts` - Prioritize JSON formats
- `packages/core/package.json` - Move TypeScript to peer deps
- `packages/core/README.md` - Update all examples
- `packages/core/src/cli.ts` - Update help text

---

## 🎨 UI Package (@pr-pilot/ui)

### Problem

The UI package was **113 MB** - too large for practical use with `npx`, causing:

- Slow installation times
- High bandwidth usage
- Poor user experience

### Solution: Next.js Standalone Architecture

Inspired by the `check-site-meta` package (8.31 MB), implemented a standalone server approach:

#### 1. New Bin Script (`bin/pr-pilot-ui.ts`)

```typescript
// Spawns standalone Next.js server as child process
const server = spawn('node', [standaloneServer], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { HOSTNAME: host, PORT: String(port), NODE_ENV: 'production' },
})
```

Features:

- Port and host configuration
- Interactive browser opening prompt
- Graceful shutdown handling
- Cross-platform compatibility

#### 2. Build Preparation Script (`scripts/prepare-publish.js`)

```javascript
// Copies only necessary files to dist/
- Standalone server from .next/standalone
- Static assets from .next/static
- Compiled bin script
```

#### 3. Optimized Package Structure

```json
{
  "files": ["dist"], // Only ship dist folder
  "bin": {
    "pr-pilot-ui": "./dist/bin/pr-pilot-ui.js"
  }
}
```

### Results

| Metric            | Before  | After   | Improvement     |
| ----------------- | ------- | ------- | --------------- |
| **Package Size**  | 113 MB  | 7.4 MB  | **93% smaller** |
| **Unpacked Size** | ~400 MB | 28.3 MB | **93% smaller** |
| **Files**         | 3000+   | 781     | **74% fewer**   |

### Comparison

- **check-site-meta**: 8.31 MB (256 files)
- **@pr-pilot/ui**: 7.4 MB (781 files) ✅

We're actually **smaller** than the reference package!

### Files Changed

- `packages/ui/bin/pr-pilot-ui.ts` - New standalone server launcher
- `packages/ui/scripts/prepare-publish.js` - Build preparation script
- `packages/ui/package.json` - Updated build process and files
- `packages/ui/.gitignore` - Keep standalone build
- `packages/ui/.npmignore` - Exclude unnecessary files

---

## 🧪 Testing

### Core Package

```bash
# Test config generation
pnpm run test:core init

# Verify no TypeScript errors with npx
npx @pr-pilot/core init
```

### UI Package

```bash
# Build and test locally
cd packages/ui
pnpm build
node dist/bin/pr-pilot-ui.js --help
node dist/bin/pr-pilot-ui.js --port=3456

# Check package size
npm pack --dry-run
```

---

## 📝 Migration Guide

### For Core Package Users

**If you have an existing `pr-pilot.config.ts`:**

Option 1: Convert to JSON (recommended)

```bash
# Run init to generate new JSON config
npx pr-pilot init
```

Option 2: Keep TypeScript config

```bash
# Install @pr-pilot/core locally
pnpm add -D @pr-pilot/core
```

### For UI Package Users

No changes required! The package works the same way:

```bash
npx @pr-pilot/ui
npx @pr-pilot/ui --port=4000
```

---

## 🚀 Benefits

1. **Better npx Experience** - No TypeScript dependency errors
2. **Faster Installation** - 93% smaller UI package
3. **Lower Bandwidth** - Saves ~105 MB per install
4. **Cleaner Config** - JSON is simpler for most users
5. **Still Flexible** - TypeScript configs still supported

---

## ✅ Checklist

- [x] Core package builds successfully
- [x] UI package builds successfully
- [x] MCP server builds successfully (no changes, verified)
- [x] Documentation updated
- [x] Changeset created
- [x] All examples use new JSON format
- [x] Package sizes verified
- [x] No breaking changes for TypeScript users

---

## 📊 Impact

- **Core**: Patch version (fixes bugs, no breaking changes)
- **UI**: Minor version (new features, significant improvements)
- **MCP**: No changes
