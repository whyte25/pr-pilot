import { spawn } from 'child_process'
import pc from 'picocolors'
import { confirm } from '@inquirer/prompts'

/**
 * Authenticates GitHub CLI
 * Opens browser for OAuth flow
 */
export async function authenticateGitHubCLI(): Promise<boolean> {
  console.log(pc.cyan('\n🔐 GitHub CLI Authentication\n'))
  console.log('This will open your browser to authenticate with GitHub.\n')

  const proceed = await confirm({
    message: 'Authenticate now?',
    default: true,
  })

  if (!proceed) {
    return false
  }

  console.log(pc.dim('\nOpening browser...\n'))

  return new Promise((resolve) => {
    const ghCmd = process.env.GH_PATH || 'gh'
    const authProcess = spawn(ghCmd, ['auth', 'login', '--web'], {
      stdio: 'inherit',
    })

    authProcess.on('close', (code) => {
      if (code === 0) {
        console.log(pc.green('\n✅ Authentication successful!\n'))
        resolve(true)
      } else {
        console.log(pc.yellow('\n⚠️  Authentication cancelled or failed\n'))
        resolve(false)
      }
    })

    authProcess.on('error', () => {
      console.log(pc.red('\n❌ Failed to start authentication\n'))
      resolve(false)
    })
  })
}
