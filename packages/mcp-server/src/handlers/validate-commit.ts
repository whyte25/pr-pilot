const CONVENTIONAL_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
]

export async function validateCommit(message: string) {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if message is empty
  if (!message || message.trim().length === 0) {
    errors.push('Commit message cannot be empty')
    return { valid: false, errors, warnings }
  }

  // Check length
  const firstLine = message.split('\n')[0]
  if (firstLine.length > 100) {
    errors.push(
      `Header must not be longer than 100 characters, current length is ${firstLine.length}`
    )
  }

  if (firstLine.length < 10) {
    warnings.push('Commit message is very short, consider adding more detail')
  }

  // Check conventional commit format
  const conventionalPattern =
    /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?:\s.+/
  const isConventional = conventionalPattern.test(firstLine)

  if (isConventional) {
    // Extract parts
    const match = firstLine.match(
      /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\((.+)\))?(!)?:\s(.+)/
    )

    if (match) {
      const [, type, , scope, breaking, description] = match

      // Validate type
      if (!CONVENTIONAL_TYPES.includes(type)) {
        errors.push(`Invalid type: ${type}`)
      }

      // Validate scope
      if (scope && scope.length > 20) {
        warnings.push('Scope is quite long, consider shortening it')
      }

      // Validate description
      if (description.length < 5) {
        warnings.push('Description is very short')
      }

      if (description[0] !== description[0].toLowerCase()) {
        warnings.push('Description should start with lowercase')
      }

      if (description.endsWith('.')) {
        warnings.push('Description should not end with a period')
      }

      // Check for breaking change
      if (breaking && !message.includes('BREAKING CHANGE:')) {
        warnings.push('Breaking change indicator (!) used but no BREAKING CHANGE: footer found')
      }
    }
  } else {
    warnings.push(
      'Commit message does not follow conventional commits format (type(scope): description)'
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    format: isConventional ? 'conventional' : 'simple',
  }
}
