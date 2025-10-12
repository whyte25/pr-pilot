import pc from 'picocolors'
import { confirm } from '@inquirer/prompts'
import { commitChanges, isWorkingTreeClean, promptForBranch, pushChanges } from '../actions/git.js'
import { createPullRequest } from '../actions/pr.js'
import { ensureGitHubCLI } from '../github/setup.js'
import { promptSimpleCommit } from '../prompts/simple.js'
import { promptChangeTypes, buildChangeTypeSection } from '../prompts/change-types.js'
import { runPROnlyFlow } from './pr-only.js'
import type { Config } from '../types.js'

/**
 * Simple flow for beginners
 * Just asks: "What did you change?" and handles the rest
 */
export async function runSimpleFlow(cwd: string, config: Config): Promise<void> {
  console.log(pc.cyan('\n✈️  PR Pilot - Simple Mode\n'))

  // Check GitHub CLI early (so user knows upfront)
  const ghReady = await ensureGitHubCLI()
  if (!ghReady) {
    console.log(pc.yellow('\n💡 You can still commit and push, but PR creation will be manual.\n'))
  }

  // Check if there are changes
  const isClean = await isWorkingTreeClean(cwd)
  if (isClean) {
    console.log(pc.yellow('💡 No changes to commit. Working tree is clean.\n'))

    // Ask if they want to create PR from existing commits
    const createPR = await confirm({
      message: 'Do you have committed changes you want to create a PR for?',
      default: false,
    })

    if (createPR) {
      await runPROnlyFlow(cwd, config)
    }
    return
  }

  // Prompt for branch creation if on protected branch
  await promptForBranch(cwd, config.git)

  // Ask one question
  const answers = await promptSimpleCommit()

  // Ask for type of changes for PR (before commit)
  const changeTypes = await promptChangeTypes()

  // Commit
  await commitChanges(cwd, answers.message)

  // Push
  await pushChanges(cwd)

  // Build PR body with change types
  const prBody = `## Description\n\n${answers.message}\n\n${buildChangeTypeSection(changeTypes)}`

  // Create PR
  await createPullRequest(cwd, answers.message, prBody, config)

  console.log(pc.green('✅ Done!\n'))
}
