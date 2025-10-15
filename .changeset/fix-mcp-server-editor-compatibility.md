---
"@pr-pilot/mcp": patch
---

Fix MCP server compatibility with code editors (Windsurf, Cursor, VS Code)

- **Fixed**: Duplicate shebang causing syntax error when running `npx @pr-pilot/mcp`
- **Changed**: `create_commit` and `create_pr` now return commands instead of executing them directly
- **Improved**: Tools work seamlessly in all editors by returning commands for the AI to execute
- **Benefit**: No more hanging or blocking when AI assistants try to create commits/PRs

The MCP server now follows best practices by being read-only for analysis and returning actionable commands for the AI assistant to execute through the editor's command tools.
