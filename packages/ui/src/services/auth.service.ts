import Cookies from 'js-cookie'

const TOKEN_KEY = 'github_token'
const PERSIST_KEY = 'github_token_persist'

export interface AuthConfig {
  token: string
  persistAfterSession: boolean
}

/**
 * Save GitHub token to cookies
 */
export function saveGitHubToken(token: string, persistAfterSession = false) {
  const cookieOptions: Cookies.CookieAttributes = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  }

  if (persistAfterSession) {
    // Persist for 30 days
    cookieOptions.expires = 30
  }
  // If not persisting, cookie will be session-only (deleted when browser closes)

  Cookies.set(TOKEN_KEY, token, cookieOptions)
  Cookies.set(PERSIST_KEY, persistAfterSession.toString(), cookieOptions)
}

/**
 * Get GitHub token from cookies
 */
export function getGitHubToken(): string | null {
  return Cookies.get(TOKEN_KEY) || null
}

/**
 * Check if token should persist after session
 */
export function shouldPersistToken(): boolean {
  return Cookies.get(PERSIST_KEY) === 'true'
}

/**
 * Remove GitHub token from cookies
 */
export function removeGitHubToken() {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(PERSIST_KEY)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getGitHubToken()
}

/**
 * Mask token for display (show first 4 and last 4 characters)
 */
export function maskToken(token: string): string {
  if (token.length <= 8) return '****'
  return `${token.slice(0, 4)}${'*'.repeat(token.length - 8)}${token.slice(-4)}`
}

/**
 * Validate GitHub token format
 */
export function validateGitHubToken(token: string): boolean {
  // GitHub tokens start with ghp_, gho_, ghu_, ghs_, or ghr_
  const tokenPattern = /^gh[pousr]_[A-Za-z0-9_]{36,}$/
  return tokenPattern.test(token)
}
