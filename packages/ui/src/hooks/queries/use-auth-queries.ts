import { useQuery } from '@tanstack/react-query'
import {
  getGitHubTokenServer,
  shouldPersistTokenServer,
  isAuthenticatedServer,
} from '@/services/auth.actions'
import { queryKeys } from '@/constants/query-keys'

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  return useQuery({
    queryKey: queryKeys.auth.isAuthenticated(),
    queryFn: async () => {
      return await isAuthenticatedServer()
    },
  })
}

/**
 * Hook to get masked token (for display)
 */
export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: async () => {
      const [token, shouldPersist] = await Promise.all([
        getGitHubTokenServer(),
        shouldPersistTokenServer(),
      ])

      return {
        isAuthenticated: !!token,
        maskedToken: token ? maskToken(token) : null,
        persistAfterSession: shouldPersist,
      }
    },
  })
}

// Helper to mask token
function maskToken(token: string): string {
  if (token.length <= 8) return '****'
  return `${token.slice(0, 4)}${'*'.repeat(token.length - 8)}${token.slice(-4)}`
}
