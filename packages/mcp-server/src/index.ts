import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js'
import { analyzeChangesTool } from './tools/analyze-changes.js'
import { createCommitTool } from './tools/create-commit.js'
import { createPRTool } from './tools/create-pr.js'
import { validateCommitTool } from './tools/validate-commit.js'

/**
 * PR Pilot MCP Server
 * Exposes PR automation tools to AI assistants
 */
class PRPilotMCPServer {
  private server: Server
  private tools: Tool[]

  constructor() {
    this.server = new Server(
      {
        name: 'pr-pilot',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    // Register all tools
    this.tools = [analyzeChangesTool, createCommitTool, createPRTool, validateCommitTool]

    this.setupHandlers()
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools,
    }))

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args = {} } = request.params

      try {
        switch (name) {
          case 'analyze_changes':
            return await this.handleAnalyzeChanges(args)
          case 'create_commit':
            return await this.handleCreateCommit(args)
          case 'create_pr':
            return await this.handleCreatePR(args)
          case 'validate_commit':
            return await this.handleValidateCommit(args)
          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${message}`,
            },
          ],
        }
      }
    })
  }

  private async handleAnalyzeChanges(args: Record<string, unknown>) {
    const cwd = (args.cwd as string) || process.cwd()

    // Import dynamically to avoid loading core until needed
    const { analyzeChanges } = await import('./handlers/analyze-changes.js')
    const result = await analyzeChanges(cwd)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }

  private async handleCreateCommit(args: Record<string, unknown>) {
    const cwd = (args.cwd as string) || process.cwd()
    const message = args.message as string
    const type = args.type as string | undefined
    const scope = args.scope as string | undefined
    const breaking = args.breaking as boolean | undefined

    if (!message) {
      throw new Error('message is required')
    }

    const { createCommit } = await import('./handlers/create-commit.js')
    const result = await createCommit(cwd, {
      message,
      type,
      scope,
      breaking,
    })

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }

  private async handleCreatePR(args: Record<string, unknown>) {
    const cwd = (args.cwd as string) || process.cwd()
    const title = args.title as string
    const body = args.body as string | undefined
    const base = args.base as string | undefined
    const draft = args.draft as boolean | undefined

    if (!title) {
      throw new Error('title is required')
    }

    const { createPR } = await import('./handlers/create-pr.js')
    const result = await createPR(cwd, {
      title,
      body,
      base,
      draft,
    })

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }

  private async handleValidateCommit(args: Record<string, unknown>) {
    const message = args.message as string

    if (!message) {
      throw new Error('message is required')
    }

    const { validateCommit } = await import('./handlers/validate-commit.js')
    const result = await validateCommit(message)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }

  async start() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('PR Pilot MCP Server running on stdio')
  }
}

// Start the server
const server = new PRPilotMCPServer()
server.start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
