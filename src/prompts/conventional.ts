import { input, select, confirm } from '@inquirer/prompts'
import type { ConventionalCommitAnswers, ConventionalType } from '../types.js'

const COMMIT_TYPES: { value: ConventionalType; name: string; description: string }[] = [
  { value: 'feat', name: 'feat', description: 'A new feature' },
  { value: 'fix', name: 'fix', description: 'A bug fix' },
  { value: 'docs', name: 'docs', description: 'Documentation changes' },
  { value: 'refactor', name: 'refactor', description: 'Code refactoring' },
  { value: 'style', name: 'style', description: 'Code style changes' },
  { value: 'perf', name: 'perf', description: 'Performance improvements' },
  { value: 'test', name: 'test', description: 'Adding or updating tests' },
  { value: 'build', name: 'build', description: 'Build system changes' },
  { value: 'ci', name: 'ci', description: 'CI configuration changes' },
  { value: 'chore', name: 'chore', description: 'Other changes' },
]

/**
 * Conventional commit prompts for intermediate users
 * Asks for type, scope, subject, and optional details
 */
export async function promptConventionalCommit(
  scopes: string[],
  suggestedScope?: string | null,
  maxLength = 100
): Promise<ConventionalCommitAnswers> {
  // Type selection
  const type = await select({
    message: 'Type of change?',
    choices: COMMIT_TYPES,
    default: 'feat',
  })

  // Scope selection
  const scope = await select({
    message: 'Scope of change?',
    choices: scopes.map((s) => ({ value: s, name: s })),
    default: suggestedScope || scopes[0],
  })

  // Subject
  const subject = await input({
    message: 'Short description (imperative tense):',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Description is required'
      }
      if (value.length > maxLength) {
        return `Too long (max ${maxLength} characters)`
      }
      if (value.endsWith('.')) {
        return 'Do not end with a period'
      }
      return true
    },
  })

  // Optional body
  const body = await input({
    message: 'Longer description (optional):',
    required: false,
  })

  // Breaking changes
  const breaking = await confirm({
    message: 'Are there breaking changes?',
    default: false,
  })

  let breakingDescription: string | undefined
  if (breaking) {
    breakingDescription = await input({
      message: 'Describe the breaking change:',
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Breaking change description is required'
        }
        return true
      },
    })
  }

  // Issue references
  const issues = await input({
    message: 'Issue references (e.g., "closes #123"):',
    required: false,
  })

  return {
    type,
    scope,
    subject: subject.trim(),
    body: body?.trim() || undefined,
    breaking,
    breakingDescription: breakingDescription?.trim(),
    issues: issues?.trim() || undefined,
  }
}

/**
 * Builds a conventional commit message from answers
 */
export function buildConventionalMessage(answers: ConventionalCommitAnswers): string {
  let message = `${answers.type}(${answers.scope}): ${answers.subject}`

  if (answers.body) {
    message += `\n\n${answers.body}`
  }

  if (answers.breaking && answers.breakingDescription) {
    message += `\n\nBREAKING CHANGE: ${answers.breakingDescription}`
  }

  if (answers.issues) {
    message += `\n\n${answers.issues}`
  }

  return message
}
