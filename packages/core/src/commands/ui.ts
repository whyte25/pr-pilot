import { spawn, execSync } from 'child_process'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import pc from 'picocolors'

// UI is hosted on GitHub releases or CDN
const UI_VERSION = '1.0.0'
const UI_DOWNLOAD_URL = `https://github.com/whyte25/pr-pilot/releases/download/ui-v${UI_VERSION}/ui.tar.gz`

/**
 * Get the UI cache directory
 */
function getUICacheDir(): string {
  const cacheDir = join(homedir(), '.pr-pilot', 'ui', UI_VERSION)
  return cacheDir
}

/**
 * Check if UI is cached
 */
function isUICached(): boolean {
  const cacheDir = getUICacheDir()
  return existsSync(join(cacheDir, 'index.html'))
}

/**
 * Download and extract UI
 */
async function downloadUI(): Promise<void> {
  const cacheDir = getUICacheDir()

  console.log(pc.cyan('\n📦 Downloading PR Pilot UI...'))
  console.log(pc.dim(`   Version: ${UI_VERSION}`))
  console.log(pc.dim(`   Size: ~2MB (one-time download)\n`))

  // Create cache directory
  mkdirSync(cacheDir, { recursive: true })

  try {
    // Download using curl (available on all platforms)
    const tarPath = join(cacheDir, 'ui.tar.gz')

    execSync(`curl -L -o "${tarPath}" "${UI_DOWNLOAD_URL}"`, {
      stdio: 'inherit',
    })

    // Extract
    console.log(pc.cyan('\n📂 Extracting...'))
    execSync(`tar -xzf "${tarPath}" -C "${cacheDir}"`, {
      stdio: 'inherit',
    })

    // Clean up tar file
    execSync(`rm "${tarPath}"`)

    console.log(pc.green('✅ UI downloaded successfully!\n'))
  } catch (error) {
    console.error(pc.red('\n❌ Failed to download UI'))
    console.error(pc.dim('   Please check your internet connection'))
    throw error
  }
}

/**
 * Start the PR Pilot UI
 */
export async function startUI(port = 3000) {
  console.log(pc.cyan('🚀 Starting PR Pilot UI...'))

  // Check if UI is cached
  if (!isUICached()) {
    console.log(pc.yellow('\n⚠️  UI not found in cache'))
    console.log(pc.dim('   First run: downloading UI assets...\n'))

    try {
      await downloadUI()
    } catch {
      console.error(pc.red('\n❌ Failed to start UI'))
      console.error(pc.dim('   Run with DEBUG=* for more details'))
      process.exit(1)
    }
  }

  const uiPath = getUICacheDir()

  // Start a simple dev server using pnpm dlx serve
  console.log(pc.cyan(`\n✨ Starting server on port ${port}...`))

  const serverProcess = spawn('npx', ['serve', uiPath, '-p', port.toString(), '-s'], {
    stdio: 'inherit',
    shell: true,
  })

  // Wait a bit then open browser
  setTimeout(() => {
    const url = `http://localhost:${port}`
    console.log(pc.green(`\n✅ PR Pilot UI running at ${url}`))
    console.log(pc.dim('   Press Ctrl+C to stop\n'))

    // Try to open browser
    const platform = process.platform
    const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open'

    try {
      spawn(cmd, [url], { stdio: 'ignore', detached: true }).unref()
    } catch {
      // Silently fail if can't open browser
    }
  }, 2000)

  // Handle shutdown
  process.on('SIGINT', () => {
    console.log(pc.yellow('\n\n👋 Shutting down PR Pilot UI...'))
    serverProcess.kill()
    process.exit(0)
  })

  // Keep process alive
  await new Promise(() => {})
}
