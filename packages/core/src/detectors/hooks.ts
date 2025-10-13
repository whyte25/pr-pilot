import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { PackageManager } from '../types.js'
import { getRunCommand } from './package-manager.js'

/**
 * Detects available pre-commit hooks (lint, format, test)
 * Returns commands to run or false if not available
 */
export async function detectHooks(
  cwd: string,
  pm: PackageManager
): Promise<{
  lint: boolean | string
  format: boolean | string
  test: boolean | string
}> {
  const pkg = readPackageJson(cwd)

  return {
    lint: detectLintCommand(pkg, pm),
    format: detectFormatCommand(pkg, pm),
    test: false, // Disabled by default (tests can be slow)
  }
}

/**
 * Detects lint command from package.json scripts
 */
function detectLintCommand(pkg: any, pm: PackageManager): boolean | string {
  if (!pkg?.scripts) return false

  // Check for lint scripts in order of preference
  const lintScripts = ['lint:fix', 'lint', 'eslint:fix', 'eslint']

  for (const script of lintScripts) {
    if (pkg.scripts[script]) {
      return getRunCommand(pm, script)
    }
  }

  return false
}

/**
 * Detects format command from package.json scripts
 */
function detectFormatCommand(pkg: any, pm: PackageManager): boolean | string {
  if (!pkg?.scripts) return false

  // Check for format scripts in order of preference
  const formatScripts = ['format:fix', 'format:write', 'format', 'prettier:fix', 'prettier']

  for (const script of formatScripts) {
    if (pkg.scripts[script]) {
      return getRunCommand(pm, script)
    }
  }

  return false
}

/**
 * Reads and parses package.json
 */
function readPackageJson(cwd: string): any {
  const pkgPath = join(cwd, 'package.json')
  if (!existsSync(pkgPath)) return null

  try {
    return JSON.parse(readFileSync(pkgPath, 'utf-8'))
  } catch {
    return null
  }
}
