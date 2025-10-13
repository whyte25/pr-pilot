# @pr-pilot/core

CLI tool that automates the full PR workflow: commit formatting, pre-commit hooks, pushing, and PR creation.

## Installation

### One-Time Use (Recommended)

```bash
npx pr-pilot
```

No installation needed. npx downloads and runs the latest version.

### Global Install

```bash
npm install -g pr-pilot
pr-pilot
```

### Project-Local Install

```bash
pnpm add -D pr-pilot
```

Add to `package.json`:

```json
{
  "scripts": {
    "pr": "pr-pilot"
  }
}
```

## Usage

### Simple Mode

For quick commits without ceremony:

```bash
$ pr-pilot

✈️  PR Pilot - Simple Mode

📝 What did you change? Fixed login bug
✓ Committing changes...
✓ Pushing to remote...
✓ Creating pull request...
https://github.com/your-org/repo/pull/123

Done!
```

### Conventional Commits Mode

Auto-detected when your project has commitlint configured:

```bash
$ pr-pilot

✈️  PR Pilot - Conventional Commits

Type of change? fix
Scope of change? auth
Short description: resolve token expiration issue
Longer description (optional):
Are there breaking changes? No
Issue references: closes #123

✓ Running lint...
✓ Running format...
✓ Committing changes...
✓ Pushing to remote...
✓ Creating pull request...
https://github.com/your-org/repo/pull/124

Done!
```

### PR-Only Mode

Create a PR from existing commits when your working tree is clean:

```bash
$ pr-pilot

✈️  PR Pilot - Conventional Commits

💡 No changes to commit. Working tree is clean.

? Do you have committed changes you want to create a PR for? Yes

✈️  PR Pilot - Create PR

📍 Current branch: feat/new-feature

? Which branch do you want to create a PR against?
❯ main
  dev
  Other (specify branch name)

Checking commits ahead of main...

✅ 3 commit(s) ahead of main:
  • feat: add user authentication
  • fix: resolve token expiration
  • docs: update API documentation

? PR title: feat: add user authentication and fixes
? PR description (optional): Implements OAuth2 authentication
? Type of change (select all that apply):
❯ ◉ Bug fix
  ◉ New feature
  ◯ Breaking change
  ◉ Documentation

✓ Pull request created!
🎉 https://github.com/your-org/repo/pull/125

Done!
```

**Key capabilities:**

- Select base branch (main, master, develop, dev, or custom)
- View all commits ahead of base branch
- Multi-select change types (bugfix, feature, docs, etc.)
- Validates branch existence before proceeding

## CLI Options

```bash
pr-pilot [options]

Options:
  --conventional    Force conventional commits mode
  --simple          Force simple commit message mode
  --no-lint         Skip linting
  --no-format       Skip formatting
  --draft           Create draft PR
  -h, --help        Show help
  -v, --version     Show version
```

## Configuration

PR Pilot works without configuration. For customization, create `pr-pilot.config.ts`:

```typescript
// Simple way (works with npx)
export default {
  // ... your config
}

// Or with type safety (requires @pr-pilot/core installed)
import { defineConfig } from '@pr-pilot/core'
export default defineConfig({
  // Commit settings
  commit: {
    format: 'conventional', // 'conventional' | 'simple'
    scopes: ['web', 'api', 'docs'], // or 'auto' to detect from monorepo
    maxLength: 100,
  },

  // Pre-commit hooks
  hooks: {
    lint: 'pnpm run lint:fix', // or true to auto-detect
    format: true, // auto-detects format command
    test: false, // disabled by default
  },

  // Git settings
  git: {
    promptForBranch: 'always', // 'always' | 'protected' | 'never'
    protectedBranches: ['main', 'master', 'develop', 'dev'],
  },

  // PR settings
  pr: {
    base: 'auto', // or 'main', 'dev', etc.
    draft: false,
    labels: ['auto-created'],
    reviewers: ['@team-leads'],
    template: true, // use .github/PULL_REQUEST_TEMPLATE.md
  },
})
```

### Minimal Config

Override only what you need:

```typescript
export default defineConfig({
  commit: {
    scopes: ['frontend', 'backend', 'infra'],
  },
})
```

### Embed in package.json

```json
{
  "pr-pilot": {
    "commit": {
      "scopes": ["web", "api"]
    }
  }
}
```

## How It Works

### Auto-Detection

PR Pilot inspects your project to determine:

- **Package manager** — Checks lock files (pnpm-lock.yaml, yarn.lock, package-lock.json)
- **Commit format** — Looks for commitlint config files
- **Scopes** — Scans monorepo structure (apps/, packages/ directories)
- **Hooks** — Reads package.json scripts (lint, format, test)
- **Base branch** — Queries GitHub API for repository default branch

### Smart Defaults

- Projects without commitlint use simple mode
- Projects with commitlint use conventional commits mode
- Monorepos get auto-detected scopes from directory structure
- Lint/format scripts run automatically if they exist in package.json

### Graceful Fallbacks

- No GitHub CLI? Displays manual PR creation link
- No lint script? Skips silently
- No commitlint? Falls back to simple mode
- Everything degrades without breaking the workflow

## Examples

### Simple Project

```bash
# No config needed
$ pr-pilot
What did you change? Added dark mode
Done!
```

### Monorepo with Conventional Commits

```bash
# Auto-detects scopes from apps/ and packages/
$ pr-pilot
Type? feat
Scope? web  # auto-suggested from changed files
Subject? add dark mode toggle
Done!
```

### Custom Workflow

```typescript
// pr-pilot.config.ts
export default defineConfig({
  hooks: {
    lint: 'pnpm run lint:strict',
    format: true,
    test: 'pnpm run test:changed',
  },
  pr: {
    draft: true,
    labels: ['needs-review'],
  },
})
```

```bash
$ pr-pilot
# Runs strict lint, format, and tests
# Creates draft PR with label
Done!
```

## Requirements

- **Node.js** >= 18
- **Git** repository with configured remote
- **GitHub CLI** (optional, auto-installed if missing)
  - Install: `brew install gh` or visit [cli.github.com](https://cli.github.com)
  - Authenticate: `gh auth login`

## Troubleshooting

### "No changes to commit"

Your working tree is clean. Stage changes with `git add` or make new edits.

### "GitHub CLI not authenticated"

Run `gh auth login` to authenticate with GitHub.

### "No scopes detected"

Add scopes manually to your config:

```typescript
export default defineConfig({
  commit: {
    scopes: ['frontend', 'backend', 'docs'],
  },
})
```

### Lint/format not running

Ensure your package.json includes these scripts:

- `lint` or `lint:fix`
- `format` or `format:fix`

Or specify custom commands:

```typescript
export default defineConfig({
  hooks: {
    lint: 'eslint --fix .',
    format: 'prettier --write .',
  },
})
```

## Comparison

### vs Manual PR Creation

| Manual                 | PR Pilot      |
| ---------------------- | ------------- |
| 10+ steps              | 1 command     |
| Remember commit format | Auto-detected |
| Run lint manually      | Automatic     |
| Copy/paste PR template | Auto-filled   |
| 5+ minutes             | 30 seconds    |

### vs Other Tools

- **Simpler than commitizen** — No setup, works immediately
- **Smarter than git aliases** — Detects project structure
- **Faster than manual workflow** — Automates every step
- **Flexible for all levels** — Beginner to advanced users

## License

MIT © Fas
