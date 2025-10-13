'use server'

import {
  getGitStatus,
  getChangedFiles,
  createCommit as gitCreateCommit,
  getCurrentBranch,
  getBranches,
  getCommitHistory,
  getRepoInfo,
  getFileDiff,
} from './git.service'

/**
 * Get Git status
 */
export async function getStatus() {
  try {
    const status = await getGitStatus()
    // Convert to plain object for client component serialization
    return {
      success: true,
      data: {
        not_added: status.not_added,
        conflicted: status.conflicted,
        created: status.created,
        deleted: status.deleted,
        modified: status.modified,
        renamed: status.renamed.map((r) => ({
          from: r.from,
          to: r.to,
        })),
        staged: status.staged,
        // Convert files array to plain objects
        files: status.files.map((file) => ({
          path: file.path,
          index: file.index,
          working_dir: file.working_dir,
        })),
        ahead: status.ahead,
        behind: status.behind,
        current: status.current,
        tracking: status.tracking,
        isClean: status.isClean(),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get Git status',
    }
  }
}

/**
 * Get changed files with stats
 */
export async function getFiles() {
  try {
    const files = await getChangedFiles()
    return { success: true, data: files }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get changed files',
    }
  }
}

/**
 * Create a commit
 */
export async function createCommit(params: { message: string; files: string[] }) {
  try {
    await gitCreateCommit(params.message, params.files)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create commit',
    }
  }
}

/**
 * Get current branch
 */
export async function getBranch() {
  try {
    const branch = await getCurrentBranch()
    return { success: true, data: branch }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get current branch',
    }
  }
}

/**
 * Get all branches
 */
export async function getAllBranches() {
  try {
    const branches = await getBranches()
    return { success: true, data: branches }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get branches',
    }
  }
}

/**
 * Get commit history
 */
export async function getHistory(limit = 10) {
  try {
    const history = await getCommitHistory(undefined, limit)
    return { success: true, data: history }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get commit history',
    }
  }
}

/**
 * Get repository info
 */
export async function getRepo() {
  try {
    const info = await getRepoInfo()
    return { success: true, data: info }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get repository info',
    }
  }
}

/**
 * Switch to a different branch
 */
export async function switchBranch(branchName: string, force = false) {
  try {
    const git = await import('./git.service').then((m) => m.getGitAsync())
    if (force) {
      await git.checkout(['-f', branchName])
    } else {
      await git.checkout(branchName)
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to switch branch',
    }
  }
}

/**
 * Create a new branch
 */
export async function createBranch(branchName: string) {
  try {
    const git = await import('./git.service').then((m) => m.getGitAsync())
    await git.checkoutLocalBranch(branchName)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create branch',
    }
  }
}

/**
 * Delete a branch
 */
export async function deleteBranch(branchName: string) {
  try {
    const git = await import('./git.service').then((m) => m.getGitAsync())
    await git.deleteLocalBranch(branchName)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete branch',
    }
  }
}

/**
 * Stash changes
 */
export async function stashChanges(message?: string) {
  try {
    const git = await import('./git.service').then((m) => m.getGitAsync())
    if (message) {
      await git.stash(['push', '-m', message])
    } else {
      await git.stash(['push'])
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to stash changes',
    }
  }
}

/**
 * Get diff for a specific file
 */
export async function getDiff(filePath: string) {
  try {
    const diff = await getFileDiff(filePath)

    if (!diff || diff.trim() === '') {
      return {
        success: false,
        error: 'No changes found for this file',
      }
    }

    return { success: true, data: diff }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get file diff',
    }
  }
}
