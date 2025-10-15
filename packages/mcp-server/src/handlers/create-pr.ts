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
  let needsPush = false
  try {
    await git.fetch()
    const branches = await git.branch(['-r'])
    const remoteBranch = `origin/${currentBranch}`
    needsPush = !branches.all.includes(remoteBranch)
  } catch (error) {
    return {
      success: false,
      message: `Failed to check remote branch: ${error}`,
    }
  }

  // Build commands to execute
  // Use single quotes to avoid shell injection vulnerabilities
  const escapeShell = (str: string) => `'${str.replace(/'/g, "'\\''")}'`
  const commands = []

  if (needsPush) {
    commands.push(`git push origin ${currentBranch} --set-upstream`)
  }

  // Build gh pr create command
  const args = ['gh', 'pr', 'create', '--title', escapeShell(title)]

  if (body) {
    args.push('--body', escapeShell(body))
  }

  if (base) {
    args.push('--base', base)
  }

  if (draft) {
    args.push('--draft')
  }

  commands.push(args.join(' '))

  return {
    success: true,
    needsPush,
    currentBranch,
    commands,
    message: needsPush
      ? `Branch '${currentBranch}' needs to be pushed. Run the commands below to create the PR.`
      : `Branch '${currentBranch}' is already pushed. Run the command below to create the PR.`,
    instructions: {
      title,
      base: base || 'main',
      draft: draft || false,
      branch: currentBranch,
    },
  }
}
