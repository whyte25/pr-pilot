# Contributing to PR Pilot

Contributions are welcome. This guide covers setup, workflow, and standards for the PR Pilot monorepo.

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8 (required for monorepo)
- **Git** with configured remote
- **GitHub CLI** (for testing PR creation features)

## Setup

```bash
# Clone the repository
git clone https://github.com/whyte25/pr-pilot.git
cd pr-pilot

# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test
```

## Monorepo Structure

This is a Turborepo monorepo with three active packages:

```
packages/
├── core/          # @pr-pilot/core - CLI and automation library
├── mcp-server/    # pr-pilot-mcp - MCP server for AI assistants
└── ui/            # @pr-pilot/ui - Next.js web interface (in development)
```

## Development Workflow

### Creating a Branch

```bash
# Feature branch
git checkout -b feat/add-feature-name

# Bug fix branch
git checkout -b fix/resolve-issue-name

# Documentation
git checkout -b docs/update-section
```

### Making Changes

1. **Make your edits** in the appropriate package
2. **Build** to verify compilation:
   ```bash
   pnpm run build
   ```
3. **Lint** to catch issues:
   ```bash
   pnpm run lint
   ```
4. **Format** code:
   ```bash
   pnpm run format
   ```
5. **Test** locally in a real repository:

   ```bash
   # For core package
   cd packages/core
   pnpm run build
   node dist/cli.js

   # For UI package
   cd packages/ui
   pnpm run dev
   ```

### Commit Standards

We enforce conventional commits via commitlint. Format: `type(scope): subject`

#### Types

| Type       | Purpose                 | Example                                       |
| ---------- | ----------------------- | --------------------------------------------- |
| `feat`     | New feature             | `feat(ui): add markdown editor to PR form`    |
| `fix`      | Bug fix                 | `fix(core): resolve port validation error`    |
| `docs`     | Documentation           | `docs: rewrite README with technical clarity` |
| `refactor` | Code restructuring      | `refactor(mcp): extract validation logic`     |
| `perf`     | Performance improvement | `perf(core): cache git root detection`        |
| `test`     | Add/update tests        | `test(core): add unit tests for detectors`    |
| `build`    | Build system changes    | `build: update tsup configuration`            |
| `ci`       | CI/CD changes           | `ci: add type check to workflow`              |
| `chore`    | Maintenance             | `chore(deps): upgrade dependencies`           |
| `style`    | Code formatting         | `style(ui): fix prettier formatting`          |

#### Scopes

Scopes are auto-detected from the `packages/` directory plus a few cross-cutting concerns:

**Package scopes** (auto-detected):

- `core` — @pr-pilot/core package
- `ui` — @pr-pilot/ui package
- `mcp-server` — pr-pilot-mcp package

**Cross-cutting scopes:**

- `monorepo` — Workspace-wide changes (turbo.json, pnpm-workspace.yaml)
- `repo` — Repository configuration (.gitignore, .editorconfig)
- `ci` — CI/CD workflows and configuration
- `docs` — Documentation files (README, CONTRIBUTING)
- `deps` — Dependency updates across packages
- `release` — Release process and versioning

**Scope is required** — Every commit must have a scope to clarify which part of the monorepo is affected

#### Examples

```bash
# Good commits
feat(ui): integrate rich text editor for PR descriptions
fix(core): validate port number range in UI command
docs: update MCP server configuration examples
refactor(mcp): use execFile to prevent command injection
perf(ui): optimize git status polling interval
test(core): add tests for scope detection
ci: enable type checking in lint workflow

# Bad commits (will be rejected)
feat: added stuff
fix bug
update code
WIP
```

### Commit Message Body (Optional)

For complex changes, add a body explaining **why** (not what):

```bash
git commit -m "refactor(core): extract port validation to separate function

Port parsing logic was duplicated and lacked validation.
Extracted to validatePort() with proper range checking (1-65535)
and clear error messages for invalid input."
```

### Breaking Changes

Mark breaking changes with `!` and explain in footer:

```bash
git commit -m "feat(core)!: change config file format to ESM

BREAKING CHANGE: pr-pilot.config.js must now use ESM syntax.
Update your config to use 'export default defineConfig(...)' instead
of 'module.exports = defineConfig(...)'.

Migration: Rename .js to .mjs or add "type": "module" to package.json."
```

## Code Standards

### TypeScript

- **Strict mode enabled** — No implicit `any`, strict null checks
- **Explicit return types** for exported functions
- **Prefer `unknown` over `any`** for error handling
- **Use type imports** — `import type { Config } from './types.js'`

### File Naming

- **kebab-case** for files: `pr-only-flow.ts`
- **camelCase** for functions: `createPullRequest`
- **PascalCase** for types: `Config`, `CommitAnswers`
- **UPPER_SNAKE_CASE** for constants: `DEFAULT_PORT`, `COMMIT_TYPES`

### Project Structure

#### Core Package (`packages/core/src/`)

```
actions/        # Git and GitHub operations (commit, push, PR creation)
config/         # Configuration loading and schema validation
detectors/      # Auto-detection (package manager, commit format, scopes)
flows/          # Main workflows (simple, conventional, PR-only)
github/         # GitHub CLI integration and authentication
prompts/        # User interaction with @inquirer/prompts
utils/          # Utility functions
commands/       # CLI commands (ui server, etc.)
types.ts        # Shared type definitions
cli.ts          # CLI entry point
index.ts        # Public API exports
```

#### UI Package (`packages/ui/src/`)

```
app/            # Next.js App Router pages
components/     # React components
  ├── ui/       # shadcn/ui primitives
  ├── commits/  # Commit-specific components
  ├── prs/      # PR-specific components
  └── layout/   # App shell and navigation
hooks/          # Custom React hooks
  ├── queries/  # TanStack Query hooks
  └── mutations/# TanStack Mutation hooks
services/       # Business logic and API calls
store/          # Zustand state stores
```

#### MCP Server (`packages/mcp-server/src/`)

```
handlers/       # Tool implementations (analyze, commit, PR, validate)
index.ts        # MCP server setup and tool registration
```

## Pull Request Process

### Before Submitting

Run all checks locally:

```bash
# Lint all packages
pnpm run lint

# Type check
pnpm run typecheck

# Format code
pnpm run format

# Build
pnpm run build
```

### PR Requirements

1. **Clear title** following conventional commit format
2. **Description** explaining what and why
3. **Link related issues** using "Closes #123" or "Fixes #456"
4. **Update documentation** if adding/changing features
5. **Add tests** for new functionality (when applicable)
6. **Screenshots/examples** for UI changes

### PR Template

```markdown
## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Description

Brief explanation of what this PR does and why.

## Related Issues

Closes #123

## Testing

How to test these changes:

1. Step one
2. Step two

## Screenshots (if applicable)

[Add screenshots for UI changes]
```

### Review Process

- **CI must pass** — Lint, type check, build
- **At least one approval** required
- **Address feedback** — Make requested changes or discuss alternatives
- **Squash and merge** — Maintainers will squash commits on merge

## Testing

### Manual Testing

Test the core CLI in a real repository:

```bash
# Build core package
cd packages/core
pnpm run build

# Test in another project
cd /path/to/test-project
node /path/to/pr-pilot/packages/core/dist/cli.js
```

### UI Testing

```bash
cd packages/ui
pnpm run dev

# Open http://localhost:3000
# Test commit and PR creation flows
```

### MCP Server Testing

```bash
cd packages/mcp-server
pnpm run build

# Test with MCP inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

## Reporting Issues

### Bug Reports

Include:

- **Version:** `pr-pilot --version`
- **Environment:** Node.js version, OS, shell
- **Steps to reproduce:** Exact commands run
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happened
- **Error output:** Full error messages and stack traces

### Feature Requests

Include:

- **Use case:** Problem you're trying to solve
- **Proposed solution:** How you envision it working
- **Alternatives:** Other approaches considered
- **Impact:** Who benefits and how

## Release Process

We use [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

### Creating a Changeset

When you make changes that should trigger a release:

```bash
# Create a changeset
pnpm changeset

# Follow the prompts:
# 1. Select packages to bump (core, mcp-server)
# 2. Choose version bump type:
#    - patch: Bug fixes (1.0.0 → 1.0.1)
#    - minor: New features (1.0.0 → 1.1.0)
#    - major: Breaking changes (1.0.0 → 2.0.0)
# 3. Write a summary of changes

# Commit the changeset
git add .changeset/
git commit -m "chore: add changeset for feature X"
```

### Release Workflow

1. **Push to main** — Commits with changesets trigger the release workflow
2. **Version PR created** — GitHub Action creates a "Version Packages" PR
3. **Review and merge** — Check the version bumps and changelog
4. **Auto-publish** — Merging the PR publishes to npm automatically

### Manual Release (Maintainers)

```bash
# Version packages
pnpm run version-packages

# Publish to npm
pnpm run release
```

## Questions?

- **Bugs/Features:** Open an issue
- **Discussions:** Start a GitHub discussion
- **Security:** Email maintainers privately

## License

By contributing, you agree your contributions will be licensed under MIT.
