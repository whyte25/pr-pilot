import pc from 'picocolors'
import { isGitHubCLIInstalled, isGitHubCLIAuthenticated } from './checker.js'
import { authenticateGitHubCLI } from './auth.js'
import { installGitHubCLI } from './installer.js'

/**
 * Ensures GitHub CLI is installed and authenticated
 * Offers to install and authenticate if needed
 *
 * @returns true if ready to use, false if user declined or failed
 */
export async function ensureGitHubCLI(): Promise<boolean> {
  // Check if installed
  const installed = await isGitHubCLIInstalled()

  if (!installed) {
    // Not installed, offer to install
    const result = await installGitHubCLI()

    if (!result.success) {
      console.log(pc.dim('\n💡 You can install GitHub CLI later from: https://cli.github.com\n'))
      return false
    }

    if (result.needsRestart) {
      console.log(pc.yellow('\n⚠️  Please restart your terminal and run pr-pilot again\n'))
      return false
    }

    // Installation successful, continue to auth
  }

  // Check if authenticated
  const authenticated = await isGitHubCLIAuthenticated()

  if (!authenticated) {
    console.log(pc.yellow('\n⚠️  GitHub CLI is not authenticated\n'))

    const authSuccess = await authenticateGitHubCLI()
    if (!authSuccess) {
      console.log(pc.dim('\n💡 You can authenticate later with: gh auth login\n'))
      return false
    }
  }

  // All good!
  return true
}
