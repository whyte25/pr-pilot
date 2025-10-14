#!/usr/bin/env node

import { select } from '@inquirer/prompts'
import pc from 'picocolors'
import { loadConfig } from './config/loader.js'
import { detectScopes } from './detectors/scopes.js'
import { runConventionalFlow } from './flows/conventional.js'
import { runSimpleFlow } from './flows/simple.js'
import { cacheCommitFormat, getCachedCommitFormat } from './utils/cache.js'
import { initConfigFile } from './utils/init-config.js'
import { startUI } from './commands/ui.js'

/**
 * CLI entry point for PR Pilot
 * Parses arguments and runs appropriate flow
 */
async function main() {
  const cwd = process.cwd()
  const args = process.argv.slice(2)

  try {
    // Parse CLI flags
    const flags = parseFlags(args)

    // Show help
    if (flags.help) {
      showHelp()
      return
    }

    // Show version
    if (flags.version) {
      showVersion()
      return
    }

    // UI command - start the web UI
    if (flags.ui) {
      const port = flags.port || 3000
      await startUI(port)
      return
    }

    // Init command - generate config file
    if (flags.init) {
      const config = await loadConfig(cwd)
      const scopes = await detectScopes(cwd, config)
      await initConfigFile(cwd, scopes)
      return
    }

    // Load config with smart defaults
    const config = await loadConfig(cwd)

    // Check if user has a preference cached (first-run experience)
    let commitFormat = config.commit.format
    const cachedFormat = getCachedCommitFormat(cwd)

    // If no CLI flag and no cached preference, ask once
    if (!flags.conventional && !flags.simple && !cachedFormat) {
      console.log(pc.cyan('\n✈️  Welcome to PR Pilot!\n'))
      console.log('Choose your preferred workflow:\n')

      commitFormat = await select({
        message: 'How do you want to create commits?',
        choices: [
          {
            value: 'simple' as const,
            name: 'Simple',
            description: 'Just describe what you changed (beginner-friendly)',
          },
          {
            value: 'conventional' as const,
            name: 'Conventional Commits',
            description: 'Type, scope, and subject (e.g., feat(web): add login)',
          },
        ],
        default: commitFormat,
      })

      // Cache the choice
      cacheCommitFormat(cwd, commitFormat)
      console.log(pc.dim('\n💡 Preference saved! Use --simple or --conventional to override\n'))
    } else if (cachedFormat && !flags.conventional && !flags.simple) {
      // Use cached preference
      commitFormat = cachedFormat
    }

    // Override config with CLI flags
    if (flags.conventional) {
      commitFormat = 'conventional'
    }
    if (flags.simple) {
      commitFormat = 'simple'
    }
    if (flags.noLint) {
      config.hooks.lint = false
    }
    if (flags.noFormat) {
      config.hooks.format = false
    }
    if (flags.draft) {
      config.pr.draft = true
    }

    // Run appropriate flow
    if (commitFormat === 'conventional') {
      await runConventionalFlow(cwd, config)
    } else {
      await runSimpleFlow(cwd, config)
    }
  } catch (error: any) {
    if (error.message === 'Nothing to commit') {
      // Already handled in flow
      process.exit(0)
    }

    console.error(pc.red(`\n❌ Error: ${error.message}\n`))

    if (process.env.DEBUG) {
      console.error(error.stack)
    }

    process.exit(1)
  }
}

/**
 * Parses CLI flags from arguments
 */
function parseFlags(args: string[]) {
  // Extract port number if provided
  const portIndex = args.findIndex((arg) => arg === '--port' || arg === '-p')
  const port =
    portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1], 10) : undefined

  return {
    help: args.includes('--help') || args.includes('-h'),
    version: args.includes('--version') || args.includes('-v'),
    ui: args.includes('ui') || args.includes('--ui'),
    port,
    init: args.includes('init') || args.includes('--init'),
    conventional: args.includes('--conventional'),
    simple: args.includes('--simple'),
    noLint: args.includes('--no-lint'),
    noFormat: args.includes('--no-format'),
    draft: args.includes('--draft'),
  }
}

/**
 * Shows help message
 */
function showHelp() {
  console.log(`
${pc.cyan('✈️  PR Pilot')} - Your PR autopilot

${pc.bold('Usage:')}
  ${pc.dim('$')} pr-pilot [command] [options]

${pc.bold('Commands:')}
  ui                Open PR Pilot UI in browser
  init              Generate .pr-pilotrc.json with smart defaults

${pc.bold('Options:')}
  --conventional    Use conventional commits (type, scope, subject)
  --simple          Use simple commit message (beginner-friendly)
  --no-lint         Skip linting
  --no-format       Skip formatting
  --draft           Create draft PR
  -p, --port        Port for UI server (default: 3000)
  -h, --help        Show this help
  -v, --version     Show version

${pc.bold('Examples:')}
  ${pc.dim('$')} pr-pilot ui                 ${pc.dim('# Open beautiful web UI')}
  ${pc.dim('$')} pr-pilot ui --port 4000     ${pc.dim('# Use custom port')}
  ${pc.dim('$')} pr-pilot                    ${pc.dim('# First run: asks your preference, then caches it')}
  ${pc.dim('$')} pr-pilot init              ${pc.dim('# Generate .pr-pilotrc.json config')}
  ${pc.dim('$')} pr-pilot --conventional     ${pc.dim('# Override cached preference')}
  ${pc.dim('$')} pr-pilot --draft            ${pc.dim('# Create draft PR')}
  ${pc.dim('$')} pr-pilot --no-lint          ${pc.dim('# Skip linting this time')}

${pc.bold('First Run:')}
  On first run, PR Pilot asks your preferred workflow once and caches it.
  Use --simple or --conventional flags to override anytime.

${pc.bold('Configuration:')}
  Run ${pc.cyan('pr-pilot init')} to generate .pr-pilotrc.json
  Or create it manually for advanced customization
  See: https://github.com/whyte25/pr-pilot#configuration

${pc.bold('Learn more:')}
  ${pc.dim('https://github.com/whyte25/pr-pilot')}
`)
}

/**
 * Shows version
 */
function showVersion() {
  // Will be replaced during build
  console.log('0.1.0')
}

// Run CLI
main()
