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

  // Build commands to execute
  const commands = ['git add .', `git commit -m "${commitMessage.replace(/"/g, '\\"')}"`]

  return {
    success: true,
    changedFiles: status.files.length,
    commitMessage,
    commands,
    message: `Ready to commit ${status.files.length} file(s). Run the commands below to create the commit.`,
    files: status.files.map((f) => ({
      path: f.path,
      status: f.working_dir,
    })),
  }
}
