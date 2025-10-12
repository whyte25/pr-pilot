import { existsSync } from 'fs'
import { join } from 'path'

import { commandExists, tryCommand } from '../utils/exec.js'

/**
 * Checks if GitHub CLI is installed and in PATH
 */
export async function isGitHubCLIInstalled(): Promise<boolean> {
  // Try running gh --version
  const hasGH = await commandExists('gh')
  if (hasGH) return true

  // On Windows, check common installation paths
  if (process.platform === 'win32') {
    const commonPaths = [
      'C:\\Program Files\\GitHub CLI\\gh.exe',
      join(process.env.LOCALAPPDATA || '', 'Programs', 'GitHub CLI', 'gh.exe'),
    ]

    for (const path of commonPaths) {
      if (existsSync(path)) {
        process.env.GH_PATH = path
        return true
      }
    }
  }

  return false
}

/**
 * Checks if GitHub CLI is authenticated
 */
export async function isGitHubCLIAuthenticated(): Promise<boolean> {
  const ghCmd = process.env.GH_PATH || 'gh'
  const result = await tryCommand(`"${ghCmd}" auth status`, process.cwd())
  return (result.success && result.output?.includes('Logged in')) || false
}
