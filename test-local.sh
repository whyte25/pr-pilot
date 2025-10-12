#!/bin/bash

# PR Pilot Local Test Script
# Usage: ./test-local.sh [project-path]

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PR_PILOT_CLI="$SCRIPT_DIR/dist/cli.js"

# Check if dist/cli.js exists
if [ ! -f "$PR_PILOT_CLI" ]; then
    echo -e "${YELLOW}Building pr-pilot first...${NC}"
    cd "$SCRIPT_DIR"
    pnpm run build
    echo ""
fi

# Determine project directory
if [ -n "$1" ]; then
    PROJECT_DIR="$1"
else
    PROJECT_DIR="$(pwd)"
fi

# Change to project directory
cd "$PROJECT_DIR" || exit 1

echo -e "${GREEN}Testing PR Pilot in: $PROJECT_DIR${NC}"
echo -e "${GREEN}Using CLI from: $PR_PILOT_CLI${NC}"
echo ""

# Run pr-pilot
node "$PR_PILOT_CLI" "$@"
