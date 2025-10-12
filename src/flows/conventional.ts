import pc from 'picocolors'
import { promptConventionalCommit, buildConventionalMessage } from '../prompts/conventional.js'
import { commitChanges, pushChanges, isWorkingTreeClean, getChangedFiles } from '../actions/git.js'
import { createPullRequest } from '../actions/pr.js'
import { runPreCommitHooks } from '../actions/hooks.js'
import { detectScopes, suggestScopeFromChanges } from '../detectors/scopes.js'
import type { Config } from '../types.js'

/**
 * Conventional commit flow for intermediate users
 * Asks for type, scope, subject, and runs hooks
 */
export async function runConventionalFlow(cwd: string, config: Config): Promise<void> {
  console.log(pc.cyan('\n✈️  PR Pilot - Conventional Commits\n'))

  // Check if there are changes
  const isClean = await isWorkingTreeClean(cwd)
  if (isClean) {
    console.log(pc.yellow('💡 No changes to commit. Working tree is clean.\n'))
    return
  }

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

  // Create PR
  const prTitle = `${answers.type}(${answers.scope}): ${answers.subject}`
  const prBody = buildPRBody(answers.subject, answers.body, answers.type)
  await createPullRequest(cwd, prTitle, prBody, config)

  console.log(pc.green('✅ Done!\n'))
}

/**
 * Builds PR body with template structure
 */
function buildPRBody(subject: string, body: string | undefined, type: string): string {
  const typeCheckboxes = {
    feat: '- [x] New feature',
    fix: '- [x] Bug fix',
    docs: '- [x] Documentation',
    refactor: '- [x] Code refactoring',
    perf: '- [x] Performance improvement',
  }

  const checkedType = typeCheckboxes[type as keyof typeof typeCheckboxes] || '- [ ] Other'
  const otherTypes = Object.entries(typeCheckboxes)
    .filter(([key]) => key !== type)
    .map(([, value]) => value.replace('[x]', '[ ]'))

  return `## Description

${body || subject}

## Type of Change

${checkedType}
${otherTypes.join('\n')}
- [ ] Breaking change

## Changes Made

<!-- List the key changes made in this PR -->
`
}
