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
 * import { defineConfig } from '@scrollz/pr-pilot'
 *
 * export default defineConfig({
 *   commit: {
 *     scopes: ['web', 'api', 'docs']
 *   }
 * })
 * ```
 */
export function defineConfig(config: z.input<typeof configSchema>): Config {
  return configSchema.parse(config)
}
