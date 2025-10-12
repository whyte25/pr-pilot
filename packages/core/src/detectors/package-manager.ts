import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { PackageManager } from '../types.js'

/**
 * Detects which package manager the project uses
 * Checks lock files and package.json packageManager field
 */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  // Check lock files (most reliable)
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun'
  if (existsSync(join(cwd, 'package-lock.json'))) return 'npm'

  // Check package.json packageManager field
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      if (pkg.packageManager) {
        const pm = pkg.packageManager.split('@')[0] as PackageManager
        if (['npm', 'pnpm', 'yarn', 'bun'].includes(pm)) {
          return pm
        }
      }
    } catch {
      // Invalid package.json, continue
    }
  }

  // Default to npm
  return 'npm'
}

/**
 * Gets the run command for the detected package manager
 *
 * @example
 * ```ts
 * const pm = await detectPackageManager(process.cwd())
 * const cmd = getRunCommand(pm, 'lint:fix')
 * // Returns: "pnpm run lint:fix"
 * ```
 */
export function getRunCommand(pm: PackageManager, script: string): string {
  const commands: Record<PackageManager, string> = {
    npm: `npm run ${script}`,
    pnpm: `pnpm run ${script}`,
    yarn: `yarn ${script}`,
    bun: `bun run ${script}`,
  }
  return commands[pm]
}
