'use server'

import {
  createPullRequest as ghCreatePR,
  listPullRequests as ghListPRs,
  getRepository,
  listBranches as ghListBranches,
  parseRepoUrl,
} from './github.service'
import { getRepoInfo } from './git.service'
import { getGitHubTokenServer } from './auth.actions'

/**
 * Create a pull request
 */
export async function createPullRequest(params: {
  title: string
  body?: string
  head: string
  base: string
  draft?: boolean
}) {
  try {
    const token = await getGitHubTokenServer()
    if (!token) {
      return {
        success: false,
        error: 'GitHub token not found. Please authenticate in settings.',
      }
    }

    // Get repo info from Git
    const repoInfo = await getRepoInfo()
    const parsed = parseRepoUrl(repoInfo.remote)

    if (!parsed) {
      return {
        success: false,
        error: 'Could not parse repository URL',
      }
    }

    const pr = await ghCreatePR({
      owner: parsed.owner,
      repo: parsed.repo,
      title: params.title,
      body: params.body,
      head: params.head,
      base: params.base,
      draft: params.draft,
      token,
    })

    return { success: true, data: pr }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create pull request',
    }
  }
}

/**
 * List pull requests
 */
export async function listPullRequests(state: 'open' | 'closed' | 'all' = 'open') {
  try {
    const token = await getGitHubTokenServer()
    if (!token) {
      return {
        success: false,
        error: 'GitHub token not found. Please authenticate in settings.',
      }
    }

    const repoInfo = await getRepoInfo()
    const parsed = parseRepoUrl(repoInfo.remote)

    if (!parsed) {
      return {
        success: false,
        error: 'Could not parse repository URL',
      }
    }

    const prs = await ghListPRs({
      owner: parsed.owner,
      repo: parsed.repo,
      state,
      token,
    })

    return { success: true, data: prs }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list pull requests',
    }
  }
}

/**
 * Get repository information
 */
export async function getRepoDetails() {
  try {
    const token = await getGitHubTokenServer()
    if (!token) {
      return {
        success: false,
        error: 'GitHub token not found. Please authenticate in settings.',
      }
    }

    const repoInfo = await getRepoInfo()
    const parsed = parseRepoUrl(repoInfo.remote)

    if (!parsed) {
      return {
        success: false,
        error: 'Could not parse repository URL',
      }
    }

    const repo = await getRepository({
      owner: parsed.owner,
      repo: parsed.repo,
      token,
    })

    return { success: true, data: repo }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get repository details',
    }
  }
}

/**
 * List branches from GitHub
 */
export async function listBranches() {
  try {
    const token = await getGitHubTokenServer()
    if (!token) {
      return {
        success: false,
        error: 'GitHub token not found. Please authenticate in settings.',
      }
    }

    const repoInfo = await getRepoInfo()
    const parsed = parseRepoUrl(repoInfo.remote)

    if (!parsed) {
      return {
        success: false,
        error: 'Could not parse repository URL',
      }
    }

    const branches = await ghListBranches({
      owner: parsed.owner,
      repo: parsed.repo,
      token,
    })

    return { success: true, data: branches }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list branches',
    }
  }
}
