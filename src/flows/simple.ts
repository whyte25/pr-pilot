import pc from 'picocolors'
import { promptSimpleCommit } from '../prompts/simple.js'
import { commitChanges, pushChanges, isWorkingTreeClean, promptForBranch } from '../actions/git.js'
import { createPullRequest } from '../actions/pr.js'
import type { Config } from '../types.js'

/**
 * Simple flow for beginners
 * Just asks: "What did you change?" and handles the rest
 */
export async function runSimpleFlow(cwd: string, config: Config): Promise<void> {
  console.log(pc.cyan('\n✈️  PR Pilot - Simple Mode\n'))

  // Check if there are changes
  const isClean = await isWorkingTreeClean(cwd)
  if (isClean) {
    console.log(pc.yellow('💡 No changes to commit. Working tree is clean.\n'))
    return
  }

  // Prompt for branch creation if on protected branch
  await promptForBranch(cwd)

  // Ask one question
  const answers = await promptSimpleCommit()

  // Commit
  await commitChanges(cwd, answers.message)

  // Push
  await pushChanges(cwd)

  // Create PR
  await createPullRequest(cwd, answers.message, answers.message, config)

  console.log(pc.green('✅ Done!\n'))
}
