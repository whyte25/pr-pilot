import { Tool } from '@modelcontextprotocol/sdk/types.js'

export const createCommitTool: Tool = {
  name: 'create_commit',
  description:
    'Create a git commit with the specified message. Supports conventional commits format with type, scope, and breaking changes.',
  inputSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Commit message or description (for conventional commits)',
      },
      type: {
        type: 'string',
        description:
          'Commit type (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert)',
        enum: [
          'feat',
          'fix',
          'docs',
          'style',
          'refactor',
          'perf',
          'test',
          'build',
          'ci',
          'chore',
          'revert',
        ],
      },
      scope: {
        type: 'string',
        description: 'Commit scope (e.g., api, ui, auth)',
      },
      breaking: {
        type: 'boolean',
        description: 'Whether this is a breaking change',
      },
      cwd: {
        type: 'string',
        description: 'Working directory (defaults to current directory)',
      },
    },
    required: ['message'],
  },
}
