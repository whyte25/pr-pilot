import { confirm } from '@inquirer/prompts'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import pc from 'picocolors'

/**
 * Generates a config file template with smart defaults and comments
 */
export async function initConfigFile(cwd: string, detectedScopes: string[]): Promise<boolean> {
  const configPath = join(cwd, 'pr-pilot.config.ts')

  // Check if config already exists
  if (existsSync(configPath)) {
    console.log(pc.yellow('\n⚠️  pr-pilot.config.ts already exists'))
    const overwrite = await confirm({
      message: 'Overwrite existing config?',
      default: false,
    })

    if (!overwrite) {
      return false
    }
  }

  // Generate config template
  const template = generateConfigTemplate(detectedScopes)

  try {
    writeFileSync(configPath, template, 'utf-8')
    console.log(pc.green('\n✅ Created pr-pilot.config.ts'))
    console.log(pc.dim('   Edit this file to customize your workflow\n'))
    return true
  } catch {
    console.log(pc.red('\n❌ Failed to create config file'))
    return false
  }
}

/**
 * Generates config file template with comments
 */
function generateConfigTemplate(detectedScopes: string[]): string {
  const scopesArray =
    detectedScopes.length > 0
      ? `['${detectedScopes.slice(0, 5).join("', '")}']`
      : "['frontend', 'backend', 'docs']"

  return `/**
 * PR Pilot Configuration
 * 
 * This file is optional. PR Pilot works great without it!
 * Uncomment and customize the options you need.
 * 
 * For TypeScript users with @pr-pilot/core installed:
 * import { defineConfig } from '@pr-pilot/core'
 * export default defineConfig({ ... })
 * 
 * Learn more: https://github.com/whyte25/pr-pilot#configuration
 */
export default {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Commit Settings
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  commit: {
    // Commit message format
    // 'conventional' = type(scope): subject (e.g., feat(web): add login)
    // 'simple' = just a message (e.g., Add login feature)
    format: 'conventional', // or 'simple'

    // Scopes for conventional commits
    // 'auto' = detect from your project structure
    // string[] = custom scopes
    // false = disable scopes
    scopes: ${scopesArray}, // or 'auto' or false

    // Maximum commit message length
    maxLength: 100,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Pre-commit Hooks
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  hooks: {
    // Run linter before commit
    // true = auto-detect from package.json scripts
    // string = custom command (e.g., 'pnpm run lint:strict')
    // false = disable
    lint: true, // or 'pnpm run lint:fix' or false

    // Run formatter before commit
    format: true, // or 'pnpm run format:write' or false

    // Run tests before commit (disabled by default - can be slow)
    test: false, // or 'pnpm run test:changed' or true
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Pull Request Settings
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  pr: {
    // Base branch for PRs
    // 'auto' = detect from GitHub repo settings
    // string = specific branch (e.g., 'main', 'dev', 'develop')
    base: 'auto', // or 'main' or 'dev'

    // Create draft PR by default
    draft: false,

    // Auto-add labels to PR
    labels: [], // e.g., ['auto-created', 'needs-review']

    // Auto-request reviewers
    reviewers: [], // e.g., ['@team-leads', '@senior-devs']

    // Use PR template if exists (.github/PULL_REQUEST_TEMPLATE.md)
    template: true,
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Examples
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Example 1: Minimal config (just scopes)
// export default {
//   commit: {
//     scopes: ['web', 'api', 'mobile']
//   }
// }

// Example 2: Strict workflow
// export default {
//   hooks: {
//     lint: 'pnpm run lint:strict',
//     format: 'pnpm run format:check', // check only, don't auto-fix
//     test: 'pnpm run test:affected'
//   },
//   pr: {
//     draft: true, // always create draft PRs
//     labels: ['needs-review']
//   }
// }

// Example 3: Simple mode for beginners
// export default {
//   commit: {
//     format: 'simple', // no type/scope, just message
//     scopes: false
//   },
//   hooks: {
//     lint: false, // skip linting
//     format: false
//   }
// }
`
}
