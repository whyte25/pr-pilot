#!/usr/bin/env node

/**
 * Prepares the package for publishing by copying only necessary files
 * This dramatically reduces package size
 */

import { cpSync, mkdirSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const distDir = join(rootDir, 'dist')
const standaloneDir = join(rootDir, '.next/standalone/open-source/pr-pilot/packages/ui')

console.log('📦 Preparing package for publish...')

// Clean dist directory
try {
  rmSync(distDir, { recursive: true, force: true })
} catch {}

// Create dist structure
mkdirSync(distDir, { recursive: true })

// Copy standalone server files
console.log('   Copying standalone server...')
cpSync(standaloneDir, join(distDir, 'standalone'), {
  recursive: true,
  filter: (src) => {
    // Exclude source maps and other unnecessary files
    if (src.endsWith('.map')) return false
    return true
  }
})

// Copy static files
console.log('   Copying static assets...')
cpSync(join(rootDir, '.next/static'), join(distDir, 'standalone/.next/static'), {
  recursive: true
})

// Copy public files (if exists)
const publicDir = join(rootDir, 'public')
try {
  console.log('   Copying public assets...')
  cpSync(publicDir, join(distDir, 'standalone/public'), {
    recursive: true
  })
} catch (err) {
  if (err.code !== 'ENOENT') throw err
  console.log('   No public directory found, skipping...')
}

// Copy bin
console.log('   Copying bin...')
cpSync(join(rootDir, 'bin/dist'), join(distDir, 'bin'), {
  recursive: true
})

console.log('✅ Package prepared successfully!')
console.log(`   Output: ${distDir}`)
