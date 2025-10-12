import { input } from '@inquirer/prompts'
import type { SimpleCommitAnswers } from '../types.js'

/**
 * Simple prompts for beginners
 * Just asks one question: What changed?
 */
export async function promptSimpleCommit(): Promise<SimpleCommitAnswers> {
  const message = await input({
    message: '📝 What did you change?',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Please describe your changes'
      }
      if (value.length > 200) {
        return 'Message too long (max 200 characters)'
      }
      return true
    },
  })

  return { message: message.trim() }
}
