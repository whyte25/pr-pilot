#!/bin/bash
set -e

# Quick test script for PR Pilot packages
# Usage: ./test-local.sh [command]
#
# Commands:
#   core    - Test CLI in current directory
#   ui      - Test UI server
#   mcp     - Test MCP server
#   build   - Build all packages

ROOT="$(cd "$(dirname "$0")" && pwd)"

case "${1:-core}" in
  core)
    echo "Testing @pr-pilot/core CLI"
    cd "$ROOT/packages/core"
    pnpm run build
    node dist/cli.js
    ;;
    
  ui)
    echo "  Testing @pr-pilot/ui"
    cd "$ROOT/packages/ui"
    
    # Only build if .next doesn't exist
    if [ ! -d ".next" ]; then
      echo "  Building UI (first time)..."
      pnpm run build
    fi
    
    chmod +x bin/pr-pilot-ui.js
    # Pass all remaining args (e.g., --port=4000)
    shift
    ./bin/pr-pilot-ui.js "$@"
    ;;
    
  mcp)
    echo "Testing @pr-pilot/mcp"
    cd "$ROOT/packages/mcp-server"
    pnpm run build
    npx @modelcontextprotocol/inspector node dist/index.js
    ;;
    
  build)
    echo "Building all packages"
    cd "$ROOT"
    pnpm run build
    ;;
    
  *)
    echo "Usage: ./test-local.sh [core|ui|mcp|build]"
    exit 1
    ;;
esac
