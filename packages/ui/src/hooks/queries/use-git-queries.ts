import { useQuery } from '@tanstack/react-query'
import { getFiles, getBranch, getHistory, getRepo, getDiff } from '@/services/git.actions'
import { queryKeys } from '@/constants/query-keys'

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

      console.log('useFileDiff: Fetching diff for', filePath)
      const result = await getDiff(filePath)
      console.log('useFileDiff: Result', result)

      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    enabled: !!filePath,
    retry: false, // Don't retry on error
  })
}
