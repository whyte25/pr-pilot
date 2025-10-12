# Contributing to PR Pilot

Thank you for your interest in contributing to PR Pilot. This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm
- Git
- GitHub CLI (for testing PR creation)

### Setup

1. Fork and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/pr-pilot.git
cd pr-pilot
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm run build
```

4. Test locally:

```bash
./test-local.sh
```

## Development Workflow

### Making Changes

1. Create a new branch:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. Make your changes and test them:

```bash
pnpm run build
./test-local.sh
```

3. Run linting and type checking:

```bash
pnpm run lint
pnpm run typecheck
```

4. Commit your changes following conventional commits:

```bash
git commit -m "feat(scope): description"
```

### Commit Message Format

We use conventional commits. Format: `type(scope): subject`

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Scopes:**

- `cli`: CLI interface
- `config`: Configuration
- `github`: GitHub integration
- `prompts`: User prompts
- `actions`: Git/PR actions
- `detectors`: Auto-detection logic
- `flows`: Workflow implementations
- `utils`: Utility functions
- `docs`: Documentation
- `deps`: Dependencies
- `release`: Release process

**Examples:**

```bash
feat(prompts): add multi-select for change types
fix(actions): pass base branch to gh pr create
docs: update readme with new features
refactor(flows): simplify pr-only flow logic
```

### Testing

Test your changes in a real repository:

```bash
# In pr-pilot directory
pnpm run build

# Test in another project
cd /path/to/test-project
node /path/to/pr-pilot/dist/cli.js
```

Or use the test script:

```bash
./test-local.sh /path/to/test-project
```

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Prefer `unknown` over `any` for error handling
- Use explicit return types for public functions
- Document complex logic with comments

### File Organization

```
src/
├── actions/      # Git and PR operations
├── config/       # Configuration loading
├── detectors/    # Auto-detection logic
├── flows/        # Main workflow implementations
├── github/       # GitHub CLI integration
├── prompts/      # User interaction prompts
├── utils/        # Utility functions
└── types.ts      # Type definitions
```

### Naming Conventions

- Files: kebab-case (`pr-only.ts`)
- Functions: camelCase (`createPullRequest`)
- Types/Interfaces: PascalCase (`Config`, `CommitAnswers`)
- Constants: UPPER_SNAKE_CASE (`COMMIT_TYPES`)

## Pull Request Process

1. Ensure your code passes all checks:

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

2. Update documentation if needed:
   - README.md for user-facing changes
   - Code comments for implementation details
   - CHANGELOG.md for notable changes

3. Create a pull request:
   - Use a clear, descriptive title
   - Follow the PR template
   - Link related issues
   - Add screenshots/examples if applicable

4. Address review feedback:
   - Make requested changes
   - Push updates to your branch
   - Respond to comments

## Project Structure

### Key Files

- `src/cli.ts` - CLI entry point
- `src/flows/` - Main workflow logic
- `src/actions/` - Git and GitHub operations
- `src/prompts/` - User interaction
- `src/config/` - Configuration handling

### Adding a New Feature

1. Determine the appropriate location:
   - New workflow? Add to `src/flows/`
   - New prompt? Add to `src/prompts/`
   - New action? Add to `src/actions/`

2. Create the implementation:

```typescript
// src/prompts/new-feature.ts
export async function promptNewFeature(): Promise<string> {
  // Implementation
}
```

3. Export from index if needed:

```typescript
// src/index.ts
export { promptNewFeature } from './prompts/new-feature.js'
```

4. Add tests and documentation

## Reporting Issues

### Bug Reports

Include:

- PR Pilot version (`pr-pilot --version`)
- Node.js version (`node --version`)
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages/logs

### Feature Requests

Include:

- Use case description
- Proposed solution
- Alternative solutions considered
- Impact on existing features

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
