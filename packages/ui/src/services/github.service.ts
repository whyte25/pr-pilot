import { Octokit } from '@octokit/rest'

/**
 * Get or create an Octokit instance
 * Always creates a new instance to ensure fresh token
 */
export function getOctokit(token?: string): Octokit {
  return new Octokit({
    auth: token || process.env.GITHUB_TOKEN,
  })
}

/**
 * Parse GitHub repository URL
 */
export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/)
  if (!match) return null

  return {
    owner: match[1],
    repo: match[2],
  }
}

/**
 * Create a pull request
 */
export async function createPullRequest(params: {
  owner: string
  repo: string
  title: string
  body?: string
  head: string
  base: string
  draft?: boolean
  token?: string
}) {
  const client = getOctokit(params.token)

  const response = await client.pulls.create({
    owner: params.owner,
    repo: params.repo,
    title: params.title,
    body: params.body || '',
    head: params.head,
    base: params.base,
    draft: params.draft || false,
  })

  return response.data
}

/**
 * List pull requests
 */
export async function listPullRequests(params: {
  owner: string
  repo: string
  state?: 'open' | 'closed' | 'all'
  token?: string
}) {
  const client = getOctokit(params.token)

  const response = await client.pulls.list({
    owner: params.owner,
    repo: params.repo,
    state: params.state || 'open',
    per_page: 30,
  })

  return response.data.map((pr) => ({
    number: pr.number,
    title: pr.title,
    state: pr.state,
    draft: pr.draft,
    author: pr.user?.login || 'unknown',
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    url: pr.html_url,
  }))
}

/**
 * Get a single pull request
 */
export async function getPullRequest(params: {
  owner: string
  repo: string
  prNumber: number
  token?: string
}) {
  const client = getOctokit(params.token)

  const response = await client.pulls.get({
    owner: params.owner,
    repo: params.repo,
    pull_number: params.prNumber,
  })

  const pr = response.data

  return {
    number: pr.number,
    title: pr.title,
    body: pr.body,
    state: pr.state,
    draft: pr.draft,
    author: pr.user?.login || 'unknown',
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    url: pr.html_url,
    head: pr.head.ref,
    base: pr.base.ref,
    mergeable: pr.mergeable,
    changedFiles: pr.changed_files,
    additions: pr.additions,
    deletions: pr.deletions,
    commits: pr.commits,
  }
}

/**
 * Get repository information
 */
export async function getRepository(params: { owner: string; repo: string; token?: string }) {
  const client = getOctokit(params.token)

  const response = await client.repos.get({
    owner: params.owner,
    repo: params.repo,
  })

  return {
    name: response.data.name,
    fullName: response.data.full_name,
    description: response.data.description,
    defaultBranch: response.data.default_branch,
    private: response.data.private,
    url: response.data.html_url,
  }
}

/**
 * List branches
 */
export async function listBranches(params: { owner: string; repo: string; token?: string }) {
  const client = getOctokit(params.token)

  const response = await client.repos.listBranches({
    owner: params.owner,
    repo: params.repo,
    per_page: 100,
  })

  return response.data.map((branch) => ({
    name: branch.name,
    protected: branch.protected,
    commit: {
      sha: branch.commit.sha,
      url: branch.commit.url,
    },
  }))
}
