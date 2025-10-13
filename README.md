# PR Pilot

Automate pull request creation from commit to merge. PR Pilot detects your project structure, enforces commit conventions, runs pre-commit hooks, and opens PRs—all from a single command.

## Monorepo Structure

This repository uses Turborepo to manage four packages:

| Package                                 | Purpose                         | Status            |
| --------------------------------------- | ------------------------------- | ----------------- |
| [`@pr-pilot/core`](./packages/core)     | CLI and core automation library | ✅ Stable         |
| [`pr-pilot-mcp`](./packages/mcp-server) | MCP server for AI assistants    | ✅ Stable         |
| [`@pr-pilot/ui`](./packages/ui)         | Next.js web interface           | 🚧 In Development |
| `@pr-pilot/vscode`                      | VS Code extension               | 📋 Planned        |

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Development mode (watch)
pnpm run dev

# Run linting
pnpm run lint

# Format code
pnpm run format
```

## What PR Pilot Does

1. **Detects** your project setup (package manager, commit format, monorepo structure)
2. **Guides** you through creating a properly formatted commit
3. **Runs** pre-commit hooks (lint, format, tests)
4. **Pushes** changes to your remote
5. **Opens** a pull request with auto-filled metadata

All from running `npx pr-pilot`.

## Documentation

- **[Core CLI](./packages/core)** — Main command-line interface and usage
- **[MCP Server](./packages/mcp-server)** — AI assistant integration
- **[UI Package](./packages/ui)** — Web interface (in development)

## Requirements

- **Node.js** >= 18
- **pnpm** >= 8 (for development)
- **Git** with configured remote
- **GitHub CLI** (optional, auto-installed if needed)

## License

MIT © Fas

---

For end-user documentation, see [`packages/core/README.md`](./packages/core/README.md).
