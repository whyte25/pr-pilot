'use server'

import { cookies } from 'next/headers'

const TOKEN_KEY = 'github_token'
const PERSIST_KEY = 'github_token_persist'

/**
 * Save GitHub token to httpOnly cookies (server-side)
 */
export async function saveGitHubTokenServer(token: string, persistAfterSession = false) {
  try {
    const cookieStore = await cookies()

    const cookieOptions: {
      httpOnly: boolean
      secure: boolean
      sameSite: 'strict'
      path: string
      maxAge?: number
    } = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    }

    if (persistAfterSession) {
      // Persist for 30 days
      cookieOptions.maxAge = 30 * 24 * 60 * 60
    }
    // If not persisting, cookie will be session-only

    cookieStore.set(TOKEN_KEY, token, cookieOptions)
    cookieStore.set(PERSIST_KEY, persistAfterSession.toString(), cookieOptions)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save token',
    }
  }
}

/**
 * Get GitHub token from httpOnly cookies (server-side)
 */
export async function getGitHubTokenServer(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(TOKEN_KEY)?.value || null
  } catch {
    return null
  }
}

/**
 * Check if token should persist
 */
export async function shouldPersistTokenServer(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(PERSIST_KEY)?.value === 'true'
  } catch {
    return false
  }
}

/**
 * Remove GitHub token from cookies (server-side)
 */
export async function removeGitHubTokenServer() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(TOKEN_KEY)
    cookieStore.delete(PERSIST_KEY)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove token',
    }
  }
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticatedServer(): Promise<boolean> {
  const token = await getGitHubTokenServer()
  return !!token
}
