import { Tool } from '@modelcontextprotocol/sdk/types.js'

export const validateCommitTool: Tool = {
  name: 'validate_commit',
  description:
    'Validate a commit message against conventional commits standards. Returns validation result with any errors or warnings.',
  inputSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Commit message to validate',
      },
    },
    required: ['message'],
  },
}
