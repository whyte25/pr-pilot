import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { CommitFormat } from '../types.js'

/**
 * Detects if project uses conventional commits
 * Checks for commitlint config files and dependencies
 */
export async function detectCommitFormat(cwd: string): Promise<CommitFormat> {
  // Check for commitlint config files
  const commitlintFiles = [
    'commitlint.config.ts',
    'commitlint.config.js',
    'commitlint.config.cjs',
    'commitlint.config.mjs',
    '.commitlintrc',
    '.commitlintrc.json',
    '.commitlintrc.js',
  ]

  for (const file of commitlintFiles) {
    if (existsSync(join(cwd, file))) {
      return 'conventional'
    }
  }

  // Check package.json for commitlint
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

      // Check for commitlint in dependencies
      const hasCommitlint =
        pkg.devDependencies?.['@commitlint/cli'] ||
        pkg.dependencies?.['@commitlint/cli'] ||
        pkg.commitlint

      if (hasCommitlint) {
        return 'conventional'
      }
    } catch {
      // Invalid package.json, continue
    }
  }

  // Default to simple for beginners
  return 'simple'
}
