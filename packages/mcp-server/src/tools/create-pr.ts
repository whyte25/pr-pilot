import { Tool } from '@modelcontextprotocol/sdk/types.js'

export const createPRTool: Tool = {
  name: 'create_pr',
  description:
    "Prepare a GitHub pull request from the current branch. Returns the commands needed to push the branch and create the PR. The AI assistant should then execute these commands using the editor's command execution tool. Requires GitHub CLI to be installed and authenticated.",
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'PR title',
      },
      body: {
        type: 'string',
        description: 'PR description/body',
      },
      base: {
        type: 'string',
        description: 'Base branch to merge into (e.g., main, dev)',
      },
      draft: {
        type: 'boolean',
        description: 'Create as draft PR',
      },
      cwd: {
        type: 'string',
        description: 'Working directory (defaults to current directory)',
      },
    },
    required: ['title'],
  },
}
