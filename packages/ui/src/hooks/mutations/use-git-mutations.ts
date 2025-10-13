import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCommit,
  switchBranch,
  createBranch,
  deleteBranch,
  stashChanges,
} from '@/services/git.actions'
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
      queryClient.invalidateQueries({ queryKey: queryKeys.git.status() })
    },
  })
}

/**
 * Hook to switch branch
 */
export function useSwitchBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { branchName: string; force?: boolean }) => {
      const result = await switchBranch(params.branchName, params.force)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.git.branch() })
      queryClient.invalidateQueries({ queryKey: queryKeys.git.branches() })
      queryClient.invalidateQueries({ queryKey: queryKeys.git.status() })
      queryClient.invalidateQueries({ queryKey: queryKeys.git.files() })
    },
  })
}

/**
 * Hook to create a new branch
 */
export function useCreateBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (branchName: string) => {
      const result = await createBranch(branchName)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.git.branches() })
    },
  })
}

/**
 * Hook to delete a branch
 */
export function useDeleteBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (branchName: string) => {
      const result = await deleteBranch(branchName)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.git.branches() })
    },
  })
}

/**
 * Hook to stash changes
 */
export function useStashChanges() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message?: string) => {
      const result = await stashChanges(message)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.git.status() })
      queryClient.invalidateQueries({ queryKey: queryKeys.git.files() })
    },
  })
}
