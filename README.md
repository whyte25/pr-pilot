# ✈️ PR Pilot

> Your PR autopilot - create pull requests with ease

PR Pilot automates the tedious parts of creating pull requests. It detects your project setup, guides you through commits, and creates PRs automatically.

## Features

- ✅ **Zero config** - Works immediately in any Git repo
- ✅ **Smart detection** - Auto-detects commit format, scopes, and tools
- ✅ **Conventional commits** - Optional support with auto-suggestions
- ✅ **Pre-commit hooks** - Runs lint/format automatically
- ✅ **GitHub integration** - Creates PRs via GitHub CLI
- ✅ **Beginner friendly** - Simple mode asks just one question
- ✅ **Powerful** - Full customization for advanced users

## Quick Start

```bash
# Run in your project
npx @scrollz/pr-pilot

# That's it! 🚀
```

## Installation

### One-time use (recommended)

```bash
npx @scrollz/pr-pilot
```

### Global install

```bash
npm install -g @scrollz/pr-pilot
pr-pilot
```

### Project install

```bash
pnpm add -D @scrollz/pr-pilot
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

### Beginner Mode (Simple)

Just run it and answer one question:

```bash
$ pr-pilot

✈️  PR Pilot - Simple Mode

📝 What did you change? Fixed login bug
✓ Committing changes...
✓ Pushing to remote...
✓ Creating pull request...
🎉 https://github.com/your-org/repo/pull/123

✅ Done!
```

### Intermediate Mode (Conventional Commits)

If your project has commitlint, it auto-detects and uses conventional commits:

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
🎉 https://github.com/your-org/repo/pull/124

✅ Done!
```

### Force Conventional Mode

```bash
pr-pilot --conventional
```

### CLI Options

```bash
pr-pilot [options]

Options:
  --conventional    Use conventional commits
  --simple          Use simple commit message
  --no-lint         Skip linting
  --no-format       Skip formatting
  --draft           Create draft PR
  -h, --help        Show help
  -v, --version     Show version
```

## Configuration

PR Pilot works without configuration, but you can customize it:

### Create `pr-pilot.config.ts`

```typescript
import { defineConfig } from '@scrollz/pr-pilot'

export default defineConfig({
  // Commit settings
  commit: {
    format: 'conventional', // 'conventional' | 'simple'
    scopes: ['web', 'api', 'docs'], // or 'auto' to detect
    maxLength: 100,
  },

  // Pre-commit hooks
  hooks: {
    lint: 'pnpm run lint:fix', // or true to auto-detect
    format: true, // auto-detects format command
    test: false, // disabled by default
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

```typescript
// Just override what you need
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

### 1. Auto-Detection

PR Pilot detects:

- **Package manager** (pnpm, npm, yarn, bun) from lock files
- **Commit format** (conventional or simple) from commitlint config
- **Scopes** from monorepo structure (apps/, packages/, etc.)
- **Hooks** from package.json scripts (lint, format)
- **Base branch** from GitHub repo settings

### 2. Smart Defaults

- Beginners get simple mode (one question)
- Projects with commitlint get conventional mode
- Monorepos get auto-detected scopes
- Lint/format run automatically if scripts exist

### 3. Graceful Fallbacks

- No GitHub CLI? Shows manual PR link
- No lint script? Skips silently
- No commitlint? Uses simple mode
- Everything degrades gracefully

## Examples

### Example 1: Simple Project

```bash
# No config needed
$ pr-pilot
📝 What did you change? Added dark mode
✅ Done!
```

### Example 2: Monorepo with Conventional Commits

```bash
# Auto-detects scopes from apps/ and packages/
$ pr-pilot
Type? feat
Scope? web  # auto-suggested from changed files
Subject? add dark mode toggle
✅ Done!
```

### Example 3: Custom Workflow

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
✅ Done!
```

## Requirements

- **Node.js** >= 18
- **Git** repository with remote
- **GitHub CLI** (optional, for PR creation)
  - Install: `brew install gh` or see [cli.github.com](https://cli.github.com)
  - Authenticate: `gh auth login`

## Troubleshooting

### "No changes to commit"

Your working tree is clean. Make some changes first.

### "GitHub CLI not authenticated"

Run `gh auth login` to authenticate.

### "No scopes detected"

Add scopes to your config:

```typescript
export default defineConfig({
  commit: {
    scopes: ['frontend', 'backend', 'docs'],
  },
})
```

### Lint/format not running

Check your package.json has these scripts:

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

- **Simpler** than commitizen (no setup needed)
- **Smarter** than git aliases (detects project setup)
- **Faster** than manual workflow (automates everything)
- **Flexible** for all skill levels (beginner to advanced)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © Scrollz Team

## Links

- [Documentation](https://github.com/your-org/pr-pilot)
- [Issues](https://github.com/your-org/pr-pilot/issues)
- [Changelog](CHANGELOG.md)

---

Made with ❤️ by the Scrollz team
