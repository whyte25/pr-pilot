import { useQuery } from '@tanstack/react-query'
import {
  getStatus,
  getFiles,
  getBranch,
  getAllBranches,
  getHistory,
  getRepo,
  getDiff,
} from '@/services/git.actions'
import { queryKeys } from '@/constants/query-keys'

/**
 * Hook to get git status
 */
export function useGitStatus() {
  return useQuery({
    queryKey: queryKeys.git.status(),
    queryFn: async () => {
      const result = await getStatus()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to get changed files
 */
export function useChangedFiles() {
  return useQuery({
    queryKey: queryKeys.git.files(),
    queryFn: async () => {
      const result = await getFiles()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to get current branch
 */
export function useCurrentBranch() {
  return useQuery({
    queryKey: queryKeys.git.branch(),
    queryFn: async () => {
      const result = await getBranch()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to get all branches
 */
export function useAllBranches() {
  return useQuery({
    queryKey: queryKeys.git.branches(),
    queryFn: async () => {
      const result = await getAllBranches()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to get commit history
 */
export function useCommitHistory(limit = 10) {
  return useQuery({
    queryKey: queryKeys.git.history(limit),
    queryFn: async () => {
      const result = await getHistory(limit)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to get repository info
 */
export function useRepoInfo() {
  return useQuery({
    queryKey: queryKeys.git.repo(),
    queryFn: async () => {
      const result = await getRepo()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to get file diff
 */
export function useFileDiff(filePath: string | null) {
  return useQuery({
    queryKey: queryKeys.git.diff(filePath),
    queryFn: async () => {
      if (!filePath) return null

      const result = await getDiff(filePath)

      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    enabled: !!filePath,
    retry: false, // Don't retry on error
  })
}
