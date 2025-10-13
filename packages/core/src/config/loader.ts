import { cosmiconfig } from 'cosmiconfig'
import { configSchema, type Config } from './schema.js'
import { detectCommitFormat } from '../detectors/commit-format.js'
import { detectPackageManager } from '../detectors/package-manager.js'
import { detectHooks } from '../detectors/hooks.js'

/**
 * Loads and merges user config with smart defaults
 * Searches for config in multiple locations
 */
export async function loadConfig(cwd: string): Promise<Config> {
  // Search for user config
  const explorer = cosmiconfig('pr-pilot', {
    searchPlaces: [
      'pr-pilot.config.ts',
      'pr-pilot.config.js',
      'pr-pilot.config.cjs',
      'pr-pilot.config.mjs',
      '.pr-pilotrc',
      '.pr-pilotrc.json',
      'package.json', // Can embed in package.json
    ],
  })

  const result = await explorer.search(cwd)
  const userConfig = result?.config || {}

  // Generate smart defaults
  const defaults = await generateDefaults(cwd)

  // Merge user config with defaults (user config takes precedence)
  const merged = mergeConfig(defaults, userConfig)

  // Validate with Zod
  return configSchema.parse(merged)
}

/**
 * Generates smart defaults based on project detection
 */
async function generateDefaults(cwd: string): Promise<Partial<Config>> {
  const commitFormat = await detectCommitFormat(cwd)
  const packageManager = await detectPackageManager(cwd)
  const hooks = await detectHooks(cwd, packageManager)

  return {
    commit: {
      format: commitFormat,
      scopes: 'auto',
      maxLength: 100,
    },
    hooks,
    git: {
      promptForBranch: 'always',
      protectedBranches: ['main', 'master', 'develop', 'dev'],
    },
    pr: {
      base: 'auto',
      draft: false,
      labels: [],
      reviewers: [],
      template: true,
    },
  }
}

/**
 * Deep merges two config objects
 * User config takes precedence over defaults
 */
function mergeConfig(defaults: Partial<Config>, user: Partial<Config>): any {
  return {
    commit: {
      ...defaults.commit,
      ...user.commit,
    },
    hooks: {
      ...defaults.hooks,
      ...user.hooks,
    },
    git: {
      ...defaults.git,
      ...user.git,
    },
    pr: {
      ...defaults.pr,
      ...user.pr,
    },
  }
}
