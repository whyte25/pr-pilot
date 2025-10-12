import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import type { Config } from '../config/schema.js'

/**
 * Detects available scopes for conventional commits
 * Scans monorepo structure or uses configured scopes
 */
export async function detectScopes(cwd: string, config: Config): Promise<string[]> {
  // If scopes disabled, return empty
  if (config.commit.scopes === false) {
    return []
  }

  // If user provided scopes, use them
  if (Array.isArray(config.commit.scopes)) {
    return config.commit.scopes
  }

  // Auto-detect scopes
  const scopes: string[] = []
  const isMonorepo = await detectMonorepo(cwd)

  if (isMonorepo) {
    // Scan common monorepo directories
    const monorepoRoots = ['apps', 'packages', 'services', 'libs', 'tools', 'scripts']

    for (const root of monorepoRoots) {
      const rootPath = join(cwd, root)
      if (existsSync(rootPath)) {
        const subdirs = getSubdirectories(rootPath)
        scopes.push(...subdirs)
      }
    }
  }

  // Add common generic scopes
  scopes.push('repo', 'docs', 'ci', 'deps', 'config')

  // Remove duplicates and sort
  return [...new Set(scopes)].sort()
}

/**
 * Detects if project is a monorepo
 */
async function detectMonorepo(cwd: string): Promise<boolean> {
  // Check for monorepo config files
  const monorepoFiles = ['pnpm-workspace.yaml', 'lerna.json', 'nx.json', 'turbo.json']

  for (const file of monorepoFiles) {
    if (existsSync(join(cwd, file))) {
      return true
    }
  }

  // Check package.json for workspaces
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      if (pkg.workspaces) {
        return true
      }
    } catch {
      // Invalid package.json
    }
  }

  return false
}

/**
 * Gets subdirectories in a directory (ignores hidden and node_modules)
 */
function getSubdirectories(dir: string): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules'
      )
      .map((entry) => entry.name)
  } catch {
    return []
  }
}

/**
 * Suggests scope based on changed files
 * Useful for auto-suggesting the most relevant scope
 */
export function suggestScopeFromChanges(changedFiles: string[]): string | null {
  if (changedFiles.length === 0) return null

  // Count occurrences of each directory
  const scopeCounts = new Map<string, number>()

  for (const file of changedFiles) {
    const parts = file.split('/')
    if (parts.length > 1) {
      const scope = parts[0]
      scopeCounts.set(scope, (scopeCounts.get(scope) || 0) + 1)
    }
  }

  // Return most common scope
  if (scopeCounts.size > 0) {
    const sorted = [...scopeCounts.entries()].sort((a, b) => b[1] - a[1])
    return sorted[0][0]
  }

  return null
}
