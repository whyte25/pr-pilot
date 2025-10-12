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
  let justInstalled = false

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

    // Installation successful, MUST authenticate now
    justInstalled = true
  }

  // Check if authenticated
  const authenticated = await isGitHubCLIAuthenticated()

  if (!authenticated) {
    if (justInstalled) {
      console.log(pc.cyan("\n🔐 Now let's authenticate with GitHub...\n"))
    } else {
      console.log(pc.yellow('\n⚠️  GitHub CLI is not authenticated\n'))
    }

    const authSuccess = await authenticateGitHubCLI(justInstalled)
    if (!authSuccess) {
      if (justInstalled) {
        console.log(pc.red('\n❌ Authentication is required to use pr-pilot\n'))
        console.log(pc.dim('Run: gh auth login\n'))
      } else {
        console.log(pc.dim('\n💡 You can authenticate later with: gh auth login\n'))
      }
      return false
    }

    // After successful auth, show success message
    console.log(pc.green('\n✅ GitHub CLI is ready!\n'))
  }

  // All good!
  return true
}
