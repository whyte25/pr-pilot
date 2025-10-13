import simpleGit from 'simple-git'

interface CreateCommitOptions {
  message: string
  type?: string
  scope?: string
  breaking?: boolean
}

export async function createCommit(cwd: string, options: CreateCommitOptions) {
  const git = simpleGit(cwd)
  const { message, type, scope, breaking } = options

  // Check if there are changes to commit
  const status = await git.status()
  if (status.files.length === 0) {
    return {
      success: false,
      message: 'No changes to commit',
    }
  }

  // Stage all changes
  await git.add('.')

  // Build commit message
  let commitMessage = message

  if (type) {
    // Conventional commit format
    const breakingPrefix = breaking ? '!' : ''
    const scopePart = scope ? `(${scope})` : ''
    commitMessage = `${type}${scopePart}${breakingPrefix}: ${message}`

    if (breaking) {
      commitMessage += '\n\nBREAKING CHANGE: ' + message
    }
  }

  // Create commit
  await git.commit(commitMessage)

  // Get commit hash
  const log = await git.log({ maxCount: 1 })
  const commit = log.latest

  return {
    success: true,
    commit: {
      hash: commit?.hash,
      message: commitMessage,
      author: commit?.author_name,
      date: commit?.date,
    },
  }
}
