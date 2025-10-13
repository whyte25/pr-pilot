#!/usr/bin/env node

/**
 * PR Pilot UI - Web interface launcher
 * 
 * Usage: pr-pilot-ui [port]
 * Example: pr-pilot-ui 4000
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Parse arguments
let port = '3000'
const args = process.argv.slice(2)

for (const arg of args) {
  if (arg.startsWith('--port=') || arg.startsWith('--PORT=')) {
    port = arg.split('=')[1]
  } else if (arg === '-h' || arg === '--help') {
    console.log('Usage: pr-pilot-ui [--port=PORT]')
    console.log('')
    console.log('Options:')
    console.log('  --port=PORT    Port to run on (default: 3000)')
    console.log('  -h, --help     Show this help')
    console.log('')
    console.log('Examples:')
    console.log('  pr-pilot-ui')
    console.log('  pr-pilot-ui --port=4000')
    console.log('  npx @pr-pilot/ui --port=8080')
    process.exit(0)
  } else if (!arg.startsWith('-')) {
    // Support positional argument for backwards compatibility
    port = arg
  }
}

// Validate port
const portNum = parseInt(port, 10)
if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
  console.error('❌ Invalid port number. Must be between 1-65535')
  console.error('   Usage: pr-pilot-ui --port=PORT')
  process.exit(1)
}

console.log(`🚀 Starting PR Pilot UI on port ${port}...`)
console.log(`   Open http://localhost:${port}\n`)

// Start Next.js server
const server = spawn('npx', ['next', 'start', '-p', port], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
})

server.on('error', (error) => {
  console.error('❌ Failed to start UI server:', error.message)
  process.exit(1)
})

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ UI server exited with code ${code}`)
    process.exit(code)
  }
})

// Handle termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down PR Pilot UI...')
  server.kill('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  server.kill('SIGTERM')
  process.exit(0)
})
