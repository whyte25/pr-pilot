# @pr-pilot/ui

Web interface for PR Pilot. Provides a visual workflow for creating commits and pull requests with real-time Git integration.

**Status:** 🚧 In Beta

## Overview

A Next.js application that wraps PR Pilot's core functionality in a modern web UI. Includes:

- **Commit builder** with conventional commit support
- **PR form** with live preview and markdown editor
- **Branch management** and Git status visualization
- **GitHub authentication** via OAuth
- **Real-time file diff viewer**
- **AI-powered commit suggestions** (planned)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **Git:** simple-git + GitHub REST API
- **Editor:** Tiptap (markdown WYSIWYG)
- **Animations:** Framer Motion

## Development

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Git repository with remote

### Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
# Production build
pnpm run build

# Start production server
pnpm run start
```

### Lint & Format

```bash
# Run ESLint
pnpm run lint

# Check formatting
pnpm run format

# Fix formatting
pnpm run format:fix
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── commits/           # Commit creation flow
│   ├── prs/               # PR creation and list
│   ├── branches/          # Branch management
│   ├── settings/          # Configuration UI
│   └── analyze/           # AI commit suggestions
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── commits/          # Commit-specific components
│   ├── prs/              # PR-specific components
│   ├── layout/           # App shell and navigation
│   └── settings/         # Settings components
├── hooks/                # Custom React hooks
│   ├── queries/          # TanStack Query hooks
│   └── mutations/        # TanStack Mutation hooks
├── services/             # API and business logic
│   ├── git.service.ts    # Git operations
│   ├── github.service.ts # GitHub API
│   └── auth.service.ts   # Authentication
└── store/                # Zustand stores
    ├── config-store.ts   # User configuration
    └── auth-store.ts     # Auth state
```

## Key Features

### Commit Builder

- Auto-detects conventional commit format from project
- Suggests scopes from monorepo structure
- Validates commit message length and format
- Shows changed files with diff preview
- Runs pre-commit hooks before committing

### PR Form

- Rich markdown editor with live preview
- Auto-fills PR template from `.github/PULL_REQUEST_TEMPLATE.md`
- Multi-select change types (bugfix, feature, docs, etc.)
- Configurable labels and reviewers
- Draft PR support
- Base branch selection

### GitHub Integration

- OAuth authentication flow
- Token stored in httpOnly cookies (secure)
- Repository metadata fetching
- Branch listing and validation
- PR creation via GitHub API

## Configuration

The UI reads from `pr-pilot.config.ts` in your project root:

```typescript
import { defineConfig } from '@pr-pilot/core'

export default defineConfig({
  commit: {
    format: 'conventional',
    scopes: ['web', 'api', 'docs'],
    maxLength: 100,
  },
  pr: {
    base: 'main',
    draft: false,
    labels: ['auto-created'],
    reviewers: ['@team-leads'],
  },
})
```

Settings are also editable in the UI at `/settings`.

## Environment Variables

Create `.env.local`:

```bash
# GitHub OAuth (optional, for enhanced features)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t pr-pilot-ui .

# Run container
docker run -p 3000:3000 pr-pilot-ui
```

### Static Export

```bash
# Build static site
pnpm run build

# Output in ./out directory
```

## Roadmap

- [x] Commit creation with conventional format
- [x] PR creation with markdown editor
- [x] GitHub authentication
- [x] File diff viewer
- [x] Config editor UI
- [ ] AI-powered commit suggestions
- [ ] PR template loading from `.github/`
- [ ] Multi-repository support
- [ ] Commit history visualization
- [ ] Branch comparison view

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

MIT
