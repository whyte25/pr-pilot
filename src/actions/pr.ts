import ora from 'ora'
import pc from 'picocolors'
import { runCommand } from '../utils/exec.js'
import { ensureGitHubCLI } from '../github/setup.js'
import type { Config } from '../types.js'

/**
 * Creates a GitHub PR using gh CLI
 * Note: GitHub CLI check should be done earlier in the flow
 */
export async function createPullRequest(
  cwd: string,
  title: string,
  body: string,
  config: Config
): Promise<void> {
  // Quick check if gh is available (already checked earlier, but verify)
  const ready = await ensureGitHubCLI()

  if (!ready) {
    showManualPRInstructions()
    return
  }

  // Create PR
  const spinner = ora('Creating pull request...').start()

  try {
    const args = ['pr', 'create', '--title', title, '--body', body]

    // Add optional flags
    if (config.pr.draft) {
      args.push('--draft')
    }

    if (config.pr.labels.length > 0) {
      args.push('--label', config.pr.labels.join(','))
    }

    if (config.pr.reviewers.length > 0) {
      args.push('--reviewer', config.pr.reviewers.join(','))
    }

    const command = `gh ${args.map((arg) => `"${arg}"`).join(' ')}`
    const output = await runCommand(command, cwd)

    spinner.succeed('Pull request created!')
    console.log(pc.green('\n🎉 ' + output + '\n'))
  } catch (error: any) {
    spinner.fail('Failed to create PR')
    console.log(pc.red(`\n❌ ${error.message}\n`))
    showManualPRInstructions()
  }
}

/**
 * Shows instructions for creating PR manually
 */
function showManualPRInstructions(): void {
  console.log(pc.cyan('\n💡 Create PR manually:'))
  console.log(pc.dim('   1. Visit your repository on GitHub'))
  console.log(pc.dim('   2. Click "Compare & pull request"'))
  console.log(pc.dim('   3. Or run: gh pr create\n'))
}
