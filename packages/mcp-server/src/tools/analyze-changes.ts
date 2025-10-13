import { Tool } from '@modelcontextprotocol/sdk/types.js'

export const analyzeChangesTool: Tool = {
  name: 'analyze_changes',
  description:
    'Analyze git changes in the current repository and suggest a commit message with type, scope, and description following conventional commits format.',
  inputSchema: {
    type: 'object',
    properties: {
      cwd: {
        type: 'string',
        description: 'Working directory (defaults to current directory)',
      },
    },
  },
}
