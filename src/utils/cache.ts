import { existsSync, readFileSync, writeFileSync, mkdirSync, appendFileSync } from 'fs'
import { join, dirname } from 'path'

interface CacheData {
  commitFormat?: 'conventional' | 'simple'
  baseBranch?: string
  lastUsed?: string
}

/**
 * Gets the cache file path
 */
function getCachePath(cwd: string): string {
  return join(cwd, '.pr-pilot', 'cache.json')
}

/**
 * Reads cache data
 */
export function readCache(cwd: string): CacheData {
  const cachePath = getCachePath(cwd)

  if (!existsSync(cachePath)) {
    return {}
  }

  try {
    const data = readFileSync(cachePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

/**
 * Writes cache data
 */
export function writeCache(cwd: string, data: Partial<CacheData>): void {
  const cachePath = getCachePath(cwd)
  const cacheDir = dirname(cachePath)

  // Ensure cache directory exists
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true })
    // Ensure .pr-pilot is in .gitignore when creating cache for first time
    ensureCacheInGitignore(cwd)
  }

  // Merge with existing cache
  const existing = readCache(cwd)
  const merged = { ...existing, ...data, lastUsed: new Date().toISOString() }

  try {
    writeFileSync(cachePath, JSON.stringify(merged, null, 2))
  } catch {
    // Silently fail - cache is not critical
  }
}

/**
 * Gets cached commit format preference
 */
export function getCachedCommitFormat(cwd: string): 'conventional' | 'simple' | null {
  const cache = readCache(cwd)
  return cache.commitFormat || null
}

/**
 * Caches commit format preference
 */
export function cacheCommitFormat(cwd: string, format: 'conventional' | 'simple'): void {
  writeCache(cwd, { commitFormat: format })
}

/**
 * Gets cached base branch
 */
export function getCachedBaseBranch(cwd: string): string | null {
  const cache = readCache(cwd)
  return cache.baseBranch || null
}

/**
 * Caches base branch
 */
export function cacheBaseBranch(cwd: string, branch: string): void {
  writeCache(cwd, { baseBranch: branch })
}

/**
 * Ensures .pr-pilot is in .gitignore
 */
export function ensureCacheInGitignore(cwd: string): void {
  const gitignorePath = join(cwd, '.gitignore')
  const cacheEntry = '.pr-pilot'

  // If .gitignore doesn't exist, create it with .pr-pilot
  if (!existsSync(gitignorePath)) {
    try {
      writeFileSync(gitignorePath, `${cacheEntry}\n`)
    } catch {
      // Silently fail - not critical
    }
    return
  }

  // Check if .pr-pilot is already in .gitignore
  try {
    const gitignoreContent = readFileSync(gitignorePath, 'utf-8')
    if (gitignoreContent.includes(cacheEntry)) {
      return // Already there
    }

    // Add .pr-pilot to .gitignore
    const newLine = gitignoreContent.endsWith('\n') ? '' : '\n'
    appendFileSync(gitignorePath, `${newLine}${cacheEntry}\n`)
  } catch {
    // Silently fail - not critical
  }
}
