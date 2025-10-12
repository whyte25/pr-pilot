import { z } from 'zod'

/**
 * Zod schema for validating user configuration
 */
export const configSchema = z.object({
  commit: z
    .object({
      format: z.enum(['conventional', 'simple']).default('conventional'),
      scopes: z.union([z.literal('auto'), z.array(z.string()), z.literal(false)]).default('auto'),
      maxLength: z.number().min(50).max(200).default(100),
    })
    .default({}),

  hooks: z
    .object({
      lint: z.union([z.boolean(), z.string()]).default(true),
      format: z.union([z.boolean(), z.string()]).default(true),
      test: z.union([z.boolean(), z.string()]).default(false),
    })
    .default({}),

  git: z
    .object({
      promptForBranch: z.enum(['always', 'protected', 'never']).default('always'),
      protectedBranches: z.array(z.string()).default(['main', 'master', 'develop', 'dev']),
    })
    .default({}),

  pr: z
    .object({
      base: z.union([z.literal('auto'), z.string()]).default('auto'),
      draft: z.boolean().default(false),
      labels: z.array(z.string()).default([]),
      reviewers: z.array(z.string()).default([]),
      template: z.boolean().default(true),
    })
    .default({}),
})

export type Config = z.infer<typeof configSchema>

/**
 * Helper function for users to define config with type safety
 *
 * @example
 * ```ts
 * // pr-pilot.config.ts
 * import { defineConfig } from 'pr-pilot'
 *
 * export default defineConfig({
 *   commit: {
 *     format: 'conventional', // or 'simple'
 *     scopes: ['web', 'api', 'docs']
 *   },
 *   git: {
 *     promptForBranch: 'always', // or 'protected' or 'never'
 *   },
 *   pr: {
 *     base: 'auto', // or 'main', 'dev', etc.
 *   }
 * })
 * ```
 */
export function defineConfig(
  config: Partial<{
    commit: {
      format?: 'conventional' | 'simple'
      scopes?: 'auto' | string[] | false
      maxLength?: number
    }
    hooks: {
      lint?: boolean | string
      format?: boolean | string
      test?: boolean | string
    }
    git: {
      promptForBranch?: 'always' | 'protected' | 'never'
      protectedBranches?: string[]
    }
    pr: {
      base?: 'auto' | 'main' | 'master' | 'develop' | 'dev' | string
      draft?: boolean
      labels?: string[]
      reviewers?: string[]
      template?: boolean
    }
  }>
): Config {
  return configSchema.parse(config)
}
