import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveGitHubTokenServer, removeGitHubTokenServer } from '@/services/auth.actions'
import { queryKeys } from '@/constants/query-keys'

/**
 * Hook to save GitHub token
 */
export function useSaveGitHubToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { token: string; persistAfterSession: boolean }) => {
      const result = await saveGitHubTokenServer(params.token, params.persistAfterSession)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    },
  })
}

/**
 * Hook to remove GitHub token
 */
export function useRemoveGitHubToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const result = await removeGitHubTokenServer()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    },
  })
}
