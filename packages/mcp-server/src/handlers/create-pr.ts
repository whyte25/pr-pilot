import { exec } from 'child_process'
import { promisify } from 'util'
import simpleGit from 'simple-git'

const execAsync = promisify(exec)

interface CreatePROptions {
  title: string
  body?: string
  base?: string
  draft?: boolean
}

export async function createPR(cwd: string, options: CreatePROptions) {
  const git = simpleGit(cwd)
  const { title, body, base, draft } = options

  // Check if gh CLI is installed
  try {
    await execAsync('gh --version', { cwd })
  } catch {
    return {
      success: false,
      message: 'GitHub CLI (gh) is not installed. Install it from https://cli.github.com',
    }
  }

  // Get current branch
  const status = await git.status()
  const currentBranch = status.current

  if (!currentBranch) {
    return {
      success: false,
      message: 'Not on a branch',
    }
  }

  // Check if branch is pushed
  try {
    await git.fetch()
    const branches = await git.branch(['-r'])
    const remoteBranch = `origin/${currentBranch}`

    if (!branches.all.includes(remoteBranch)) {
      // Push branch
      await git.push('origin', currentBranch, ['--set-upstream'])
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to push branch: ${error}`,
    }
  }

  // Build gh pr create command
  const args = ['pr', 'create', '--title', title]

  if (body) {
    args.push('--body', body)
  }

  if (base) {
    args.push('--base', base)
  }

  if (draft) {
    args.push('--draft')
  }

  try {
    const { stdout } = await execAsync(`gh ${args.map((a) => `"${a}"`).join(' ')}`, {
      cwd,
    })

    // Extract PR URL from output
    const urlMatch = stdout.match(/https:\/\/github\.com\/[^\s]+/)
    const prUrl = urlMatch ? urlMatch[0] : null

    return {
      success: true,
      pr: {
        url: prUrl,
        title,
        base: base || 'main',
        draft: draft || false,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      message: `Failed to create PR: ${message}`,
    }
  }
}
