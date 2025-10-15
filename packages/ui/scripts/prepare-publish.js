#!/usr/bin/env node

/**
 * Prepares the package for publishing by copying only necessary files
 * This dramatically reduces package size
 */

import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const distDir = join(rootDir, 'dist')

// Find the standalone directory dynamically
// Next.js creates it with the full workspace path structure
function findStandaloneDir() {
  const standaloneBase = join(rootDir, '.next/standalone')

  if (!existsSync(standaloneBase)) {
    throw new Error('Standalone build not found. Run `next build` first.')
  }

  // Walk the directory tree to find server.js
  function findServerJs(dir) {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isFile() && entry.name === 'server.js') {
        return dirname(fullPath)
      }

      if (entry.isDirectory() && entry.name !== 'node_modules') {
        const found = findServerJs(fullPath)
        if (found) return found
      }
    }

    return null
  }

  const found = findServerJs(standaloneBase)
  if (!found) {
    throw new Error('Could not find server.js in standalone build')
  }

  return found
}

const standaloneDir = findStandaloneDir()

console.log('📦 Preparing package for publish...')
console.log(`   Standalone dir: ${standaloneDir}`)

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
  },
})

// Copy static files
console.log('   Copying static assets...')
cpSync(join(rootDir, '.next/static'), join(distDir, 'standalone/.next/static'), {
  recursive: true,
})

// Copy public files (if exists)
const publicDir = join(rootDir, 'public')
try {
  console.log('   Copying public assets...')
  cpSync(publicDir, join(distDir, 'standalone/public'), {
    recursive: true,
  })
} catch (err) {
  if (err.code !== 'ENOENT') throw err
  console.log('   No public directory found, skipping...')
}

// Copy bin
console.log('   Copying bin...')
cpSync(join(rootDir, 'bin/dist'), join(distDir, 'bin'), {
  recursive: true,
})

console.log('✅ Package prepared successfully!')
console.log(`   Output: ${distDir}`)
