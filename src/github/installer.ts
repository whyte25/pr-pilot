import { spawn } from 'child_process'
import pc from 'picocolors'
import ora from 'ora'
import { confirm } from '@inquirer/prompts'

interface InstallResult {
  success: boolean
  needsRestart: boolean
  message?: string
}

/**
 * Installs GitHub CLI based on platform
 */
export async function installGitHubCLI(): Promise<InstallResult> {
  console.log(pc.yellow('\n⚠️  GitHub CLI is not installed\n'))
  console.log('GitHub CLI is needed to create pull requests automatically.')
  console.log(
    pc.dim('Without it, you can still commit and push, but need to create PRs manually.\n')
  )

  const install = await confirm({
    message: 'Install GitHub CLI now?',
    default: true,
  })

  if (!install) {
    return { success: false, needsRestart: false }
  }

  const platform = process.platform

  if (platform === 'darwin') {
    return installMacOS()
  } else if (platform === 'linux') {
    return installLinux()
  } else if (platform === 'win32') {
    return installWindows()
  }

  return {
    success: false,
    needsRestart: false,
    message: `Unsupported platform: ${platform}`,
  }
}

/**
 * Installs on macOS using Homebrew
 */
async function installMacOS(): Promise<InstallResult> {
  console.log(pc.cyan('\n📦 Installing via Homebrew...\n'))
  console.log(pc.dim('This may take a few minutes.\n'))

  return new Promise((resolve) => {
    const process = spawn('brew', ['install', 'gh'], {
      stdio: 'inherit',
    })

    const timeout = setTimeout(() => {
      process.kill()
      resolve({
        success: false,
        needsRestart: false,
        message: 'Installation timeout',
      })
    }, 300000) // 5 minutes

    process.on('close', (code) => {
      clearTimeout(timeout)
      if (code === 0) {
        console.log(pc.green('\n✅ GitHub CLI installed successfully!\n'))
        resolve({ success: true, needsRestart: false })
      } else {
        resolve({
          success: false,
          needsRestart: false,
          message: `Installation failed with code ${code}`,
        })
      }
    })

    process.on('error', (error) => {
      clearTimeout(timeout)
      resolve({
        success: false,
        needsRestart: false,
        message: error.message,
      })
    })
  })
}

/**
 * Installs on Linux using package manager
 */
async function installLinux(): Promise<InstallResult> {
  console.log(pc.cyan('\n📦 Installing via package manager...\n'))

  // Try apt-get first (Debian/Ubuntu)
  const spinner = ora('Detecting package manager...').start()

  return new Promise((resolve) => {
    const commands = [
      ['sudo', 'apt-get', 'update'],
      ['sudo', 'apt-get', 'install', '-y', 'gh'],
    ]

    let currentIndex = 0

    const runNext = () => {
      if (currentIndex >= commands.length) {
        spinner.succeed('Installation complete')
        console.log(pc.green('\n✅ GitHub CLI installed successfully!\n'))
        resolve({ success: true, needsRestart: false })
        return
      }

      const cmd = commands[currentIndex]
      spinner.text = `Running: ${cmd.join(' ')}`

      const process = spawn(cmd[0], cmd.slice(1), {
        stdio: 'inherit',
      })

      process.on('close', (code) => {
        if (code === 0) {
          currentIndex++
          runNext()
        } else {
          spinner.fail('Installation failed')
          resolve({
            success: false,
            needsRestart: false,
            message: `Command failed: ${cmd.join(' ')}`,
          })
        }
      })

      process.on('error', (error) => {
        spinner.fail('Installation failed')
        resolve({
          success: false,
          needsRestart: false,
          message: error.message,
        })
      })
    }

    runNext()
  })
}

/**
 * Installs on Windows using winget
 */
async function installWindows(): Promise<InstallResult> {
  console.log(pc.cyan('\n📦 Installing via winget...\n'))

  return new Promise((resolve) => {
    const process = spawn('winget', ['install', '--id', 'GitHub.cli', '--silent'], {
      stdio: 'inherit',
    })

    const timeout = setTimeout(() => {
      process.kill()
      resolve({
        success: false,
        needsRestart: false,
        message: 'Installation timeout',
      })
    }, 300000)

    process.on('close', (code) => {
      clearTimeout(timeout)
      if (code === 0) {
        console.log(pc.green('\n✅ GitHub CLI installed successfully!\n'))
        console.log(pc.yellow('⚠️  Please restart your terminal for changes to take effect\n'))
        resolve({ success: true, needsRestart: true })
      } else {
        resolve({
          success: false,
          needsRestart: false,
          message: `Installation failed with code ${code}`,
        })
      }
    })

    process.on('error', (error) => {
      clearTimeout(timeout)
      resolve({
        success: false,
        needsRestart: false,
        message: error.message,
      })
    })
  })
}
