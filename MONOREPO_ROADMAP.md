# PR Pilot Monorepo Roadmap

## ✅ Phase 1: Monorepo Setup (COMPLETED)

- [x] Convert to Turborepo monorepo
- [x] Move core CLI to `packages/core`
- [x] Configure pnpm workspace
- [x] Update build scripts
- [x] Test build and CLI functionality

## 📋 Phase 2: MCP Server (NEXT)

### Package: `@pr-pilot/mcp-server`

**Location:** `packages/mcp-server`

**Features:**

- Expose PR Pilot tools to AI assistants (Claude, etc.)
- Tools:
  - `create_commit` - Create a commit with conventional format
  - `create_pr` - Create a pull request
  - `analyze_changes` - Analyze git changes and suggest commit message
  - `validate_commit` - Validate commit message format

**Tech Stack:**

- `@modelcontextprotocol/sdk` - MCP SDK
- `@pr-pilot/core` - Core functionality

**Hosting Options:**

1. **NPM Package** (Recommended for MVP)
   - Users run: `npx @pr-pilot/mcp-server`
   - No hosting needed
   - Easy to use

2. **Cloudflare Workers** (For global deployment)
   - Free tier
   - Global edge network
   - Serverless

3. **Railway/Fly.io** (For persistent server)
   - Simple deployment
   - Free tier available

### Implementation Steps:

1. Create `packages/mcp-server` directory
2. Install MCP SDK dependencies
3. Create server entry point
4. Implement tools using `@pr-pilot/core`
5. Add configuration for MCP clients
6. Test with Claude Desktop
7. Publish to npm

## 📋 Phase 3: VS Code Extension

### Package: `@pr-pilot/vscode`

**Location:** `packages/vscode`

**Features:**

- Sidebar UI for commits and PRs
- Quick actions in Git view
- Webview for interactive commit creation
- Status bar integration
- Command palette commands

**Tech Stack:**

- VS Code Extension API
- React for webviews
- `@pr-pilot/core` for logic

**Commands:**

- `PR Pilot: Create Commit`
- `PR Pilot: Create PR`
- `PR Pilot: Initialize Config`

## 📋 Phase 4: Web UI

### Package: `@pr-pilot/ui`

**Location:** `packages/ui`

**Features:**

- Standalone web UI (like Prisma Studio)
- Run with `pr-pilot ui`
- Visual commit and PR creation
- Repository insights
- Configuration editor

**Tech Stack:**

- Next.js 15 (App Router)
- shadcn/ui components
- TailwindCSS
- Lucide icons
- `@pr-pilot/core` for backend

**Pages:**

- `/` - Dashboard
- `/commits` - Create commits
- `/prs` - Create PRs
- `/config` - Configuration editor
- `/history` - Commit/PR history

## 🚀 Quick Commands

```bash
# Build all packages
pnpm run build

# Run in dev mode
pnpm run dev

# Build specific package
pnpm --filter @pr-pilot/core build

# Add dependency to specific package
pnpm --filter @pr-pilot/core add <package>

# Run CLI locally
node packages/core/dist/cli.js
```

## 📦 Package Dependencies

```
@pr-pilot/core (base)
├── @pr-pilot/mcp-server (depends on core)
├── @pr-pilot/vscode (depends on core)
└── @pr-pilot/ui (depends on core)
```

## 🎯 Next Immediate Steps

1. **Create MCP Server Package**
   - Most valuable for AI integration
   - Relatively simple to implement
   - Can be published quickly

2. **Test MCP Server with Claude**
   - Add to Claude Desktop config
   - Test all tools
   - Document usage

3. **Publish MCP Server**
   - Publish to npm as `@pr-pilot/mcp-server`
   - Update main README with MCP instructions

4. **Then move to VS Code Extension**
   - More complex but high value
   - Requires special prompt and planning
