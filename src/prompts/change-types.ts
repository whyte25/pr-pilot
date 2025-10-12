import { checkbox } from '@inquirer/prompts'

/**
 * Prompts user to select types of changes in the PR
 * Returns array of selected change types
 */
export async function promptChangeTypes(): Promise<string[]> {
  const changeTypes = await checkbox({
    message: 'Type of change (select all that apply):',
    choices: [
      { name: 'Bug fix', value: 'bugfix' },
      { name: 'New feature', value: 'feature' },
      { name: 'Breaking change', value: 'breaking' },
      { name: 'Documentation', value: 'docs' },
      { name: 'Code refactoring', value: 'refactor' },
      { name: 'Performance improvement', value: 'perf' },
    ],
    validate: (items) => {
      if (items.length === 0) {
        return 'Please select at least one type of change'
      }
      return true
    },
  })

  return changeTypes
}

/**
 * Builds the "Type of Change" section for PR body
 */
export function buildChangeTypeSection(changeTypes: string[]): string {
  const typeMap: Record<string, string> = {
    bugfix: 'Bug fix',
    feature: 'New feature',
    breaking: 'Breaking change',
    docs: 'Documentation',
    refactor: 'Code refactoring',
    perf: 'Performance improvement',
  }

  let section = '## Type of Change\n\n'
  Object.entries(typeMap).forEach(([key, label]) => {
    const checked = changeTypes.includes(key) ? 'x' : ' '
    section += `- [${checked}] ${label}\n`
  })

  return section
}
