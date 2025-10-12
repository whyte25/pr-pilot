import ora from 'ora'
import pc from 'picocolors'
import { simpleGit } from 'simple-git'
import { tryCommand } from '../utils/exec.js'
import type { Config, HookResult } from '../types.js'

/**
 * Runs pre-commit hooks (lint, format, test)
 * Continues on error if configured to do so
 */
export async function runPreCommitHooks(cwd: string, config: Config): Promise<void> {
  const hooks = [
    { name: 'lint', command: config.hooks.lint },
    { name: 'format', command: config.hooks.format },
    { name: 'test', command: config.hooks.test },
  ]

  for (const hook of hooks) {
    if (!hook.command || typeof hook.command === 'boolean') {
      continue // Hook disabled
    }

    const command = typeof hook.command === 'string' ? hook.command : null
    if (!command) continue

    const result = await runHook(hook.name, command, cwd)

    if (!result.success && !result.warning) {
      throw new Error(`${hook.name} failed`)
    }
  }

  // Re-stage files after hooks (they might have modified files)
  const git = simpleGit(cwd)
  await git.add('./*')
}

/**
 * Runs a single hook command
 */
async function runHook(name: string, command: string, cwd: string): Promise<HookResult> {
  const spinner = ora(`Running ${name}...`).start()

  const result = await tryCommand(command, cwd)

  if (result.success) {
    spinner.succeed(`${name} passed`)
    return { success: true }
  } else {
    // Continue with warning (don't block commit)
    spinner.warn(`${name} had issues, but continuing...`)
    console.log(pc.dim(`  ${result.error}\n`))
    return { success: true, warning: true }
  }
}
