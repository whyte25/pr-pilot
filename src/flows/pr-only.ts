import pc from 'picocolors'
import { input, select } from '@inquirer/prompts'
import { simpleGit } from 'simple-git'
import { createPullRequest } from '../actions/pr.js'
import { ensureGitHubCLI } from '../github/setup.js'
import { pushChanges, getCurrentBranch } from '../actions/git.js'
import { promptChangeTypes, buildChangeTypeSection } from '../prompts/change-types.js'
import type { Config } from '../types.js'

/**
 * PR-only flow for when changes are already committed
 * Creates PR from current branch to selected base branch
 */
export async function runPROnlyFlow(cwd: string, config: Config): Promise<void> {
  console.log(pc.cyan('\n✈️  PR Pilot - Create PR\n'))

  // Check GitHub CLI early
  const ghReady = await ensureGitHubCLI()
  if (!ghReady) {
    console.log(pc.red('\n❌ GitHub CLI is required to create PRs\n'))
    return
  }

  const git = simpleGit(cwd)
  const currentBranch = await getCurrentBranch(cwd)

  console.log(pc.green(`📍 Current branch: ${currentBranch}\n`))

  // Get available base branches
  const branches = await git.branch()
  const baseBranchOptions = ['main', 'master', 'develop', 'dev'].filter(
    (branch) => branches.all.includes(`origin/${branch}`) || branches.all.includes(branch)
  )

  // Add "Other" option to allow custom branch
  const choices = [
    ...baseBranchOptions.map((branch) => ({
      name: branch,
      value: branch,
    })),
    {
      name: 'Other (specify branch name)',
      value: '__other__',
    },
  ]

  // Ask which base branch to create PR against
  let baseBranch = await select({
    message: 'Which branch do you want to create a PR against?',
    choices,
    default: config.pr?.base || baseBranchOptions[0] || '__other__',
  })

  // If user selected "Other", ask for branch name
  if (baseBranch === '__other__') {
    baseBranch = await input({
      message: 'Enter the base branch name:',
      validate: (value) => {
        if (!value.trim()) return 'Branch name cannot be empty'
        return true
      },
    })
  }

  // Verify the branch exists
  const branchExists =
    branches.all.includes(`origin/${baseBranch}`) || branches.all.includes(baseBranch)
  if (!branchExists) {
    console.log(
      pc.yellow(`\n⚠️  Warning: Branch '${baseBranch}' not found in remote or local branches`)
    )
    console.log(pc.dim('Available branches:'))
    branches.all.slice(0, 10).forEach((b) => console.log(pc.dim(`  • ${b}`)))
    console.log()

    const proceed = await input({
      message: 'Continue anyway? (y/N):',
      default: 'n',
    })

    if (proceed.toLowerCase() !== 'y') {
      console.log(pc.yellow('Cancelled.\n'))
      return
    }
  }

  console.log(pc.dim(`\nChecking commits ahead of ${baseBranch}...\n`))

  // Check if there are commits ahead of base branch FIRST
  try {
    // Prefer remote branch if it exists, otherwise use local
    const branchRef = branches.all.includes(`origin/${baseBranch}`)
      ? `origin/${baseBranch}`
      : baseBranch
    const log = await git.log({ from: branchRef, to: currentBranch })

    if (log.all.length === 0) {
      console.log(pc.yellow(`💡 No commits ahead of ${baseBranch}.\n`))
      console.log(pc.dim('Your branch is up to date with the base branch.\n'))
      return
    }

    console.log(pc.bold(`✅ ${log.all.length} commit(s) ahead of ${baseBranch}:\n`))
    log.all.slice(0, 10).forEach((commit) => {
      const shortMsg = commit.message.split('\n')[0]
      console.log(pc.dim(`  • ${shortMsg}`))
    })
    if (log.all.length > 10) {
      console.log(pc.dim(`  ... and ${log.all.length - 10} more`))
    }
    console.log()

    // Check if current branch needs to be pushed
    const status = await git.status()
    if (status.ahead > 0) {
      console.log(pc.yellow(`⚠️  You have ${status.ahead} unpushed commit(s)\n`))
      await pushChanges(cwd)
      console.log()
    }

    // Ask for PR title (default to latest commit message)
    const defaultTitle = log.latest?.message.split('\n')[0] || 'Update'
    const prTitle = await input({
      message: 'PR title:',
      default: defaultTitle,
      validate: (value) => {
        if (!value.trim()) return 'PR title cannot be empty'
        return true
      },
    })

    // Ask for PR description
    const prBody = await input({
      message: 'PR description (optional):',
      default: '',
    })

    // Ask for type of change
    const changeTypes = await promptChangeTypes()

    // Build full PR body with commits and change types
    const fullBody = buildPRBody(
      prBody,
      log.all.map((c) => c.message.split('\n')[0]),
      changeTypes
    )

    // Create PR with the selected base branch
    await createPullRequest(cwd, prTitle, fullBody, config, baseBranch)

    console.log(pc.green('✅ Done!\n'))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(pc.red(`\n❌ Error: ${message}\n`))

    if (message.includes('unknown revision')) {
      console.log(pc.dim(`💡 The branch '${baseBranch}' may not exist or is not up to date.\n`))
      console.log(pc.dim('Try: git fetch origin\n'))
    } else {
      console.log(pc.dim('Make sure the base branch exists and is up to date.\n'))
    }
  }
}

/**
 * Builds PR body with commit list and change types
 */
function buildPRBody(description: string, commits: string[], changeTypes: string[]): string {
  let body = '## Description\n\n'
  body += description || 'This PR includes the following changes:\n'
  body += '\n## Commits\n\n'
  commits.forEach((msg) => {
    body += `- ${msg}\n`
  })
  body += '\n'
  body += buildChangeTypeSection(changeTypes)

  return body
}
