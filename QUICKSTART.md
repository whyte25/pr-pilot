# PR Pilot - Quick Start Guide

## Test It Right Now (3 Steps)

### 1. Make Some Changes

```bash
cd /Users/apple/Documents/code/zedi/scrollz-frontend-new
echo "test" > test-pr-pilot.txt
git add test-pr-pilot.txt
```

### 2. Run PR Pilot

```bash
cd packages/pr-pilot
node dist/cli.js --simple
```

### 3. Follow the Prompt

```
PR Pilot - Simple Mode

What did you change? Testing PR Pilot
✓ Committing changes...
✓ Pushing to remote...
✓ Creating pull request...
Done!
```

---

## Try Conventional Mode

```bash
node dist/cli.js --conventional
```

You'll be asked:

- Type of change? (feat/fix/docs/etc)
- Scope? (auto-detected from your changes)
- Short description?
- Breaking changes?

---

## Add to Your Workflow

### Option 1: Add Script to Root

```json
// /Users/apple/Documents/code/zedi/scrollz-frontend-new/package.json
{
  "scripts": {
    "pr": "tsx packages/pr-pilot/src/cli.ts"
  }
}
```

Then use:

```bash
pnpm pr
```

### Option 2: Link Globally

```bash
cd packages/pr-pilot
npm link
cd ../..
pr-pilot
```

### Option 3: Use Directly

```bash
node packages/pr-pilot/dist/cli.js
```

---

## Create a Config (Optional)

```bash
cd /Users/apple/Documents/code/zedi/scrollz-frontend-new
cat > pr-pilot.config.ts << 'EOF'
import { defineConfig } from './packages/pr-pilot/dist/index.js'

export default defineConfig({
  commit: {
    scopes: ['web', 'admin', 'api', 'ui', 'docs']
  },
  hooks: {
    lint: true,  // auto-detects pnpm run lint:fix
    format: true // auto-detects pnpm run format:fix
  }
})
EOF
```

---

## What It Does

1. **Detects your setup** (package manager, commit format, scopes)
2. **Asks questions** (simple or conventional)
3. **Runs hooks** (lint, format if available)
4. **Commits changes** (with proper message)
5. **Pushes to remote** (sets upstream if needed)
6. **Creates PR** (via GitHub CLI or shows link)

---

## All Commands

```bash
# Show help
node dist/cli.js --help

# Show version
node dist/cli.js --version

# Simple mode (1 question)
node dist/cli.js --simple

# Conventional mode (guided)
node dist/cli.js --conventional

# Skip linting
node dist/cli.js --no-lint

# Skip formatting
node dist/cli.js --no-format

# Create draft PR
node dist/cli.js --draft
```

---

## Troubleshooting

### "No changes to commit"

Make some changes first:

```bash
echo "test" > test.txt
git add test.txt
```

### "GitHub CLI not authenticated"

Authenticate:

```bash
gh auth login
```

### "Command not found: node"

You need Node.js >= 18. Install from [nodejs.org](https://nodejs.org)

---

## Next Steps

1. Test it with real changes
2. Try both simple and conventional modes
3. Create a config file (optional)
4. Add to your workflow
5. Share with your team!

---

**That's it! You're ready to use PR Pilot!**
