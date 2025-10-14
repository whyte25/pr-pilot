#!/usr/bin/env node

/**
 * PR Pilot UI - Web interface launcher
 * Spawns the Next.js standalone server for minimal package size
 */

import { spawn } from 'child_process'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import readline from 'readline'

// Get directory paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Default config
const DEFAULT_PORT = 3000
const DEFAULT_HOST = 'localhost'

// Parse CLI arguments
const args = process.argv.slice(2)
let port = DEFAULT_PORT
let host = DEFAULT_HOST
let showHelp = false

for (let i = 0; i < args.length; i++) {
  const arg = args[i]

  if (arg === '-h' || arg === '--help') {
    showHelp = true
  } else if (arg === '-p' || arg === '--port') {
    port = parseInt(args[++i], 10)
  } else if (arg.startsWith('--port=')) {
    port = parseInt(arg.split('=')[1], 10)
  } else if (arg === '-b' || arg === '--bind') {
    host = args[++i]
  } else if (arg.startsWith('--bind=')) {
    host = arg.split('=')[1]
  } else if (!arg.startsWith('-')) {
    // Support positional argument for port
    port = parseInt(arg, 10)
  }
}

// Show help
if (showHelp) {
  console.log(`
✈️  PR Pilot UI - Web Interface

Usage:
  pr-pilot-ui [port] [options]

Options:
  -p, --port <number>    Port to run on (default: 3000)
  -b, --bind <address>   Address to bind (default: localhost)
  -h, --help             Show this help

Examples:
  pr-pilot-ui
  pr-pilot-ui 4000
  pr-pilot-ui --port=8080
  pr-pilot-ui --port=3000 --bind=0.0.0.0
  npx @pr-pilot/ui --port=4000
`)
  process.exit(0)
}

// Validate port
if (isNaN(port) || port < 1 || port > 65535) {
  console.error('❌ Invalid port number. Must be between 1-65535')
  process.exit(1)
}

// Check if standalone build exists
const standaloneServer = join(rootDir, 'standalone/server.js')
if (!existsSync(standaloneServer)) {
  console.error('❌ Standalone server not found!')
  console.error('   Expected: dist/standalone/server.js')
  console.error('   Run: pnpm run build')
  process.exit(1)
}

console.log(`\n✈️  PR Pilot UI`)
console.log(`   Starting server...`)

// Set up environment
const env = {
  ...process.env,
  HOSTNAME: host,
  PORT: String(port),
  NODE_ENV: 'production' as const,
}

// Spawn the standalone Next.js server
const server = spawn('node', [standaloneServer], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: env as NodeJS.ProcessEnv,
})

// Set up readline for interactive prompts
const io = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Handle server output
server.stdout.on('data', (data) => {
  const message = String(data)

  // Customize Next.js output
  if (message.startsWith('   ▲ Next.js')) {
    process.stdout.write(message.replace('Next.js', 'Using Next.js'))
    return
  }

  if (message.startsWith('   - Local:')) {
    process.stdout.write(`   - Local: http://${host}:${port}\n   - Ready! 🚀\n\n`)
    return
  }

  process.stdout.write(message)

  // When server is ready, ask to open browser
  if (message.includes('✓ Ready in')) {
    io.question(' ? Open browser? (Y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer === '') {
        console.log(` → Opening http://${host}:${port}`)

        // Open browser (cross-platform)
        const open = async () => {
          const { default: openModule } = await import('open')
          await openModule(`http://${host}:${port}`)
        }
        open().catch(() => {
          console.log(' → Could not open browser automatically')
        })
      } else {
        console.log(' → Skipping browser launch')
      }
      io.close()
    })
  }
})

// Handle server errors
server.stderr.on('data', (data) => {
  process.stderr.write(`${data}`)
})

// Handle server exit
server.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✅ Server stopped')
  } else {
    console.error(`\n❌ Server exited with code ${code}`)
  }
  process.exit(code || 0)
})

// Handle cleanup
const cleanup = () => {
  console.log(`\n\n👋 Shutting down server on port ${port}...`)
  server.kill('SIGTERM')
  io.close()
  process.exit(0)
}

process.on('SIGINT', cleanup) // Ctrl + C
process.on('SIGTERM', cleanup) // Kill command
