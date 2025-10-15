import { confirm } from '@inquirer/prompts'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import pc from 'picocolors'

/**
 * Generates a config file template with smart defaults and comments
 */
export async function initConfigFile(cwd: string, detectedScopes: string[]): Promise<boolean> {
  const configPath = join(cwd, '.pr-pilotrc.json')

  // Check if config already exists
  if (existsSync(configPath)) {
    console.log(pc.yellow('\n⚠️  .pr-pilotrc.json already exists'))
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
    console.log(pc.green('\n✅ Created .pr-pilotrc.json'))
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
    detectedScopes.length > 0 ? detectedScopes.slice(0, 5) : ['frontend', 'backend', 'docs']

  const config = {
    commit: {
      format: 'conventional',
      scopes: scopesArray,
      maxLength: 100,
    },
    hooks: {
      lint: true,
      format: true,
      test: false,
    },
    pr: {
      base: 'auto',
      draft: false,
      labels: [],
      reviewers: [],
      template: true,
    },
  }

  return JSON.stringify(config, null, 2) + '\n'
}
