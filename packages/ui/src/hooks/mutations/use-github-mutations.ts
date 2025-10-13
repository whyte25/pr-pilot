import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPullRequest } from '@/services/github.actions'
import { queryKeys } from '@/constants/query-keys'

/**
 * Hook to create a pull request
 */
export function useCreatePullRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      title: string
      body?: string
      head: string
      base: string
      draft?: boolean
    }) => {
      const result = await createPullRequest(params)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      // Invalidate PR list
      queryClient.invalidateQueries({ queryKey: queryKeys.github.prs() })
    },
  })
}
