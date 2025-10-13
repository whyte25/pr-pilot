import { useQuery } from '@tanstack/react-query'
import { listPullRequests, getRepoDetails, listBranches } from '@/services/github.actions'
import { queryKeys } from '@/constants/query-keys'

/**
 * Hook to list pull requests
 */
export function usePullRequests(state: 'open' | 'closed' | 'all' = 'open') {
  return useQuery({
    queryKey: queryKeys.github.prs(state),
    queryFn: async () => {
      const result = await listPullRequests(state)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to get repository details
 */
export function useRepository() {
  return useQuery({
    queryKey: queryKeys.github.repo(),
    queryFn: async () => {
      const result = await getRepoDetails()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}

/**
 * Hook to list branches
 */
export function useBranches() {
  return useQuery({
    queryKey: queryKeys.github.branches(),
    queryFn: async () => {
      const result = await listBranches()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
  })
}
