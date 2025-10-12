import { simpleGit, type SimpleGit } from 'simple-git'
import ora from 'ora'
import pc from 'picocolors'

/**
 * Commits changes with the given message
 * Stages all files and commits with --no-verify to bypass hooks
 */
export async function commitChanges(cwd: string, message: string): Promise<void> {
  const git: SimpleGit = simpleGit(cwd)
  const spinner = ora('Committing changes...').start()

  try {
    // Stage all changes
    await git.add('./*')

    // Commit with --no-verify (we run hooks ourselves)
    await git.commit(message, { '--no-verify': null })

    spinner.succeed('Changes committed')
  } catch (error: any) {
    spinner.fail('Failed to commit')

    if (error.message?.includes('nothing to commit')) {
      console.log(pc.yellow('\n💡 No changes to commit. Working tree is clean.\n'))
      throw new Error('Nothing to commit')
    }

    throw error
  }
}

/**
 * Pushes changes to remote
 * Sets upstream if branch doesn't exist on remote
 */
export async function pushChanges(cwd: string): Promise<void> {
  const git: SimpleGit = simpleGit(cwd)
  const spinner = ora('Pushing to remote...').start()

  try {
    const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD'])
    const branch = currentBranch.trim()

    // Push with --set-upstream
    await git.push('origin', branch, ['--set-upstream'])

    spinner.succeed('Pushed to remote')
  } catch (error: any) {
    spinner.fail('Failed to push')

    if (error.message?.includes('rejected')) {
      console.log(pc.yellow('\n💡 Push rejected. Try: git pull --rebase origin <branch>\n'))
    }

    throw error
  }
}

/**
 * Gets list of changed files
 */
export async function getChangedFiles(cwd: string): Promise<string[]> {
  const git: SimpleGit = simpleGit(cwd)
  const status = await git.status()

  return [
    ...status.modified,
    ...status.created,
    ...status.deleted,
    ...status.renamed.map((r) => r.to),
  ]
}

/**
 * Gets current branch name
 */
export async function getCurrentBranch(cwd: string): Promise<string> {
  const git: SimpleGit = simpleGit(cwd)
  const branch = await git.revparse(['--abbrev-ref', 'HEAD'])
  return branch.trim()
}

/**
 * Checks if working directory is clean
 */
export async function isWorkingTreeClean(cwd: string): Promise<boolean> {
  const git: SimpleGit = simpleGit(cwd)
  const status = await git.status()
  return status.isClean()
}
