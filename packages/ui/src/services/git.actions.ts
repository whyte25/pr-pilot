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
    return { success: true, data: status }
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
