# Local Testing

## Using npm scripts (recommended)

```bash
pnpm test:core    # Test CLI
pnpm test:ui      # Test UI on port 3000
pnpm test:mcp     # Test MCP server
```

## Using test script directly

```bash
./test-local.sh core           # Test CLI
./test-local.sh ui             # Test UI (port 3000)
./test-local.sh ui --port=4000 # Test UI on port 4000
./test-local.sh mcp            # Test MCP server
./test-local.sh build          # Build all packages
```

## Manual testing

```bash
# Core CLI
cd packages/core && pnpm run build
node dist/cli.js

# UI
cd packages/ui && pnpm run build
node bin/pr-pilot-ui.js --port=3000

# MCP
cd packages/mcp-server && pnpm run build
node dist/index.js
```
