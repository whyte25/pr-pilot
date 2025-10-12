# @pr-pilot/mcp-server

MCP (Model Context Protocol) server for PR Pilot - expose PR automation tools to AI assistants.

**Works with any MCP-compatible client:**

- Claude Desktop
- Cursor
- Windsurf
- Cline
- Continue
- Any other MCP client

## Features

Provides 4 powerful tools for AI assistants:

### 1. `analyze_changes`

Analyze git changes and suggest a conventional commit message.

**Parameters:**

- `cwd` (optional): Working directory

**Returns:**

- Suggested commit message with type, scope, and description
- File statistics
- List of changed files

### 2. `create_commit`

Create a git commit with conventional commits format.

**Parameters:**

- `message` (required): Commit message or description
- `type` (optional): Commit type (feat, fix, docs, etc.)
- `scope` (optional): Commit scope
- `breaking` (optional): Whether this is a breaking change
- `cwd` (optional): Working directory

**Returns:**

- Commit hash
- Full commit message
- Author and date

### 3. `create_pr`

Create a GitHub pull request.

**Parameters:**

- `title` (required): PR title
- `body` (optional): PR description
- `base` (optional): Base branch (default: main)
- `draft` (optional): Create as draft PR
- `cwd` (optional): Working directory

**Returns:**

- PR URL
- PR details

### 4. `validate_commit`

Validate a commit message against conventional commits standards.

**Parameters:**

- `message` (required): Commit message to validate

**Returns:**

- Validation result (valid/invalid)
- List of errors and warnings
- Detected format (conventional/simple)

## Installation

### Global Installation

```bash
npm install -g @pr-pilot/mcp-server
```

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "pr-pilot": {
      "command": "npx",
      "args": ["-y", "@pr-pilot/mcp-server"]
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "pr-pilot": {
      "command": "npx",
      "args": ["-y", "@pr-pilot/mcp-server"]
    }
  }
}
```

### Windsurf

Add to Windsurf MCP configuration:

```json
{
  "mcpServers": {
    "pr-pilot": {
      "command": "npx",
      "args": ["-y", "@pr-pilot/mcp-server"]
    }
  }
}
```

### Cline / Continue

Add to your MCP settings file:

```json
{
  "mcpServers": {
    "pr-pilot": {
      "command": "npx",
      "args": ["-y", "@pr-pilot/mcp-server"]
    }
  }
}
```

### Any MCP Client

The server runs on stdio and follows the MCP specification, so it works with any compliant client:

```bash
# Run directly
npx @pr-pilot/mcp-server

# Or if installed globally
pr-pilot-mcp
```

## Example Usage

Once configured, you can ask your AI assistant:

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

The AI will use the appropriate PR Pilot tools to help you!

## Requirements

- Node.js >= 20.8.1
- Git
- GitHub CLI (for `create_pr` tool)

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
