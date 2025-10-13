# pr-pilot-mcp

MCP (Model Context Protocol) server that exposes PR Pilot's automation tools to AI assistants like Claude, Cursor, and Windsurf.

## What This Does

Provides four tools that AI assistants can invoke to automate Git workflows:

| Tool              | Purpose                                   | Key Parameters                         |
| ----------------- | ----------------------------------------- | -------------------------------------- |
| `analyze_changes` | Suggest conventional commit from git diff | `cwd` (optional)                       |
| `create_commit`   | Create a formatted commit                 | `message`, `type`, `scope`, `breaking` |
| `create_pr`       | Open a GitHub pull request                | `title`, `body`, `base`, `draft`       |
| `validate_commit` | Check commit message format               | `message`                              |

## Installation

### Global Install

```bash
npm install -g pr-pilot-mcp
```

### One-Time Use

```bash
npx -y pr-pilot-mcp
```

## Configuration

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "pr-pilot": {
      "command": "npx",
      "args": ["-y", "pr-pilot-mcp"]
    }
  }
}
```

### Cursor

Add to Cursor's MCP settings:

```json
{
  "mcpServers": {
    "pr-pilot": {
      "command": "npx",
      "args": ["-y", "pr-pilot-mcp"]
    }
  }
}
```

### Windsurf

Add to Windsurf's MCP configuration:

```json
{
  "mcpServers": {
    "pr-pilot": {
      "command": "npx",
      "args": ["-y", "pr-pilot-mcp"]
    }
  }
}
```

### Other MCP Clients

The server runs on stdio and follows the MCP specification. Any compliant client can use it:

```bash
# Run directly
npx pr-pilot-mcp

# Or if installed globally
pr-pilot-mcp
```

## Tools Reference

### `analyze_changes`

Analyzes git changes and suggests a conventional commit message.

**Parameters:**

- `cwd` (string, optional) — Working directory path

**Returns:**

```json
{
  "success": true,
  "analysis": {
    "type": "feat",
    "scope": "auth",
    "description": "add OAuth2 login",
    "files": ["src/auth/oauth.ts", "src/auth/types.ts"],
    "stats": {
      "modified": 2,
      "created": 1,
      "deleted": 0,
      "staged": 3
    }
  },
  "suggestion": "feat(auth): add OAuth2 login"
}
```

### `create_commit`

Creates a git commit with conventional format.

**Parameters:**

- `message` (string, required) — Commit message or description
- `type` (string, optional) — Commit type (feat, fix, docs, style, refactor, perf, test, chore)
- `scope` (string, optional) — Commit scope
- `breaking` (boolean, optional) — Mark as breaking change

**Returns:**

```json
{
  "success": true,
  "commit": {
    "hash": "a1b2c3d",
    "message": "feat(auth): add OAuth2 login",
    "author": "John Doe <john@example.com>",
    "date": "2025-01-13T18:00:00Z"
  }
}
```

### `create_pr`

Creates a GitHub pull request.

**Parameters:**

- `title` (string, required) — PR title
- `body` (string, optional) — PR description
- `base` (string, optional) — Base branch (default: main)
- `draft` (boolean, optional) — Create as draft PR
- `cwd` (string, optional) — Working directory path

**Returns:**

```json
{
  "success": true,
  "pr": {
    "url": "https://github.com/owner/repo/pull/123",
    "title": "feat: add OAuth2 login",
    "base": "main",
    "draft": false
  }
}
```

### `validate_commit`

Validates a commit message against conventional commits standards.

**Parameters:**

- `message` (string, required) — Commit message to validate

**Returns:**

```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "format": "conventional"
}
```

## Example Usage

Once configured, ask your AI assistant:

**Analyze changes:**

```
Can you analyze my git changes and suggest a commit message?
```

**Create a commit:**

```
Create a commit with message "add user authentication" as a feat with scope "auth"
```

**Create a PR:**

```
Create a PR titled "feat: add user authentication" to the dev branch
```

**Validate a commit message:**

```
Is this a valid commit message: "feat(auth): add login page"?
```

The AI will invoke the appropriate PR Pilot tools automatically.

## Requirements

- **Node.js** >= 20.8.1
- **Git** repository
- **GitHub CLI** (for `create_pr` tool)
  - Install: `brew install gh` or visit [cli.github.com](https://cli.github.com)
  - Authenticate: `gh auth login`

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run locally
node dist/index.js
```

## License

MIT
