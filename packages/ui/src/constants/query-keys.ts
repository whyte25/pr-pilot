/**
 * Centralized query keys for TanStack Query
 * Makes it easy to invalidate queries across the app
 */
export const queryKeys = {
  // Git queries
  git: {
    all: ['git'] as const,
    status: () => [...queryKeys.git.all, 'status'] as const,
    files: () => [...queryKeys.git.all, 'files'] as const,
    branch: () => [...queryKeys.git.all, 'branch'] as const,
    branches: () => [...queryKeys.git.all, 'branches'] as const,
    history: (limit?: number) => [...queryKeys.git.all, 'history', limit] as const,
    repo: () => [...queryKeys.git.all, 'repo'] as const,
    diff: (filePath: string | null) => [...queryKeys.git.all, 'diff', filePath] as const,
  },

  // GitHub queries
  github: {
    all: ['github'] as const,
    repo: () => [...queryKeys.github.all, 'repo'] as const,
    prs: (state?: 'open' | 'closed' | 'all') => [...queryKeys.github.all, 'prs', state] as const,
    branches: () => [...queryKeys.github.all, 'branches'] as const,
  },

  // Auth queries
  auth: {
    all: ['auth'] as const,
    isAuthenticated: () => [...queryKeys.auth.all, 'isAuthenticated'] as const,
    status: () => [...queryKeys.auth.all, 'status'] as const,
  },
} as const
