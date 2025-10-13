import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCommit } from '@/services/git.actions'
import { queryKeys } from '@/constants/query-keys'

/**
 * Hook to create a commit
 */
export function useCreateCommit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { message: string; files: string[] }) => {
      const result = await createCommit(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.git.files() })
      queryClient.invalidateQueries({ queryKey: queryKeys.git.history() })
    },
  })
}
