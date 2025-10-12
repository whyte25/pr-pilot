import pc from 'picocolors'
import { confirm } from '@inquirer/prompts'
import {
  commitChanges,
  getChangedFiles,
  isWorkingTreeClean,
  promptForBranch,
  pushChanges,
} from '../actions/git.js'
import { runPreCommitHooks } from '../actions/hooks.js'
import { createPullRequest } from '../actions/pr.js'
import { detectScopes, suggestScopeFromChanges } from '../detectors/scopes.js'
import { ensureGitHubCLI } from '../github/setup.js'
import { buildConventionalMessage, promptConventionalCommit } from '../prompts/conventional.js'
import { promptChangeTypes, buildChangeTypeSection } from '../prompts/change-types.js'
import { runPROnlyFlow } from './pr-only.js'
import type { Config } from '../types.js'

/**
 * Conventional commit flow for intermediate users
 * Asks for type, scope, subject, and runs hooks
 */
export async function runConventionalFlow(cwd: string, config: Config): Promise<void> {
  console.log(pc.cyan('\n✈️  PR Pilot - Conventional Commits\n'))

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
  await promptForBranch(cwd)

  // Detect scopes
  const scopes = await detectScopes(cwd, config)
  if (scopes.length === 0) {
    console.log(pc.red('❌ No scopes detected. Please configure scopes in pr-pilot.config.ts\n'))
    return
  }

  // Suggest scope from changed files
  const changedFiles = await getChangedFiles(cwd)
  const suggestedScope = suggestScopeFromChanges(changedFiles)

  // Prompt for commit details
  const answers = await promptConventionalCommit(scopes, suggestedScope, config.commit.maxLength)

  // Build commit message
  const commitMessage = buildConventionalMessage(answers)

  // Run pre-commit hooks (lint, format)
  const hasHooks = config.hooks.lint || config.hooks.format || config.hooks.test
  if (hasHooks) {
    await runPreCommitHooks(cwd, config)
  }

  // Commit
  await commitChanges(cwd, commitMessage)

  // Push
  await pushChanges(cwd)

  // Ask for type of changes for PR
  const changeTypes = await promptChangeTypes()

  // Create PR
  const prTitle = `${answers.type}(${answers.scope}): ${answers.subject}`
  const prBody = buildPRBody(answers.subject, answers.body, changeTypes)
  await createPullRequest(cwd, prTitle, prBody, config)

  console.log(pc.green('✅ Done!\n'))
}

/**
 * Builds PR body with template structure
 */
function buildPRBody(subject: string, body: string | undefined, changeTypes: string[]): string {
  return `## Description

${body || subject}

${buildChangeTypeSection(changeTypes)}

## Changes Made

<!-- List the key changes made in this PR -->
`
}
