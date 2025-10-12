import simpleGit from 'simple-git'

export async function analyzeChanges(cwd: string) {
  const git = simpleGit(cwd)

  // Check if there are changes
  const status = await git.status()
  const hasChanges =
    status.files.length > 0 || status.staged.length > 0 || status.modified.length > 0

  if (!hasChanges) {
    return {
      success: false,
      message: 'No changes detected',
    }
  }

  // Get diff
  const diff = await git.diff()
  const stagedDiff = await git.diff(['--staged'])

  // Analyze files changed
  const files = [...new Set([...status.files.map((f) => f.path)])]

  // Detect scope from files
  const scope = detectScope(files)

  // Detect type from diff
  const type = detectType(diff + stagedDiff, files)

  // Generate description
  const description = generateDescription(files, diff + stagedDiff)

  return {
    success: true,
    analysis: {
      type,
      scope,
      description,
      files,
      stats: {
        modified: status.modified.length,
        created: status.created.length,
        deleted: status.deleted.length,
        staged: status.staged.length,
      },
    },
    suggestion: scope ? `${type}(${scope}): ${description}` : `${type}: ${description}`,
  }
}

function detectScope(files: string[]): string | null {
  // Common scope patterns
  const scopePatterns: Record<string, RegExp[]> = {
    api: [/api\//i, /server\//i, /backend\//i],
    ui: [/ui\//i, /components\//i, /pages\//i, /app\//i],
    auth: [/auth/i, /login/i, /session/i],
    db: [/database/i, /migrations/i, /schema/i, /prisma/i],
    config: [/config/i, /\.config\./i, /settings/i],
    docs: [/docs\//i, /README/i, /\.md$/i],
    test: [/test/i, /spec/i, /__tests__/i],
    ci: [/\.github/i, /\.gitlab/i, /ci\//i],
    deps: [/package\.json/i, /pnpm-lock/i, /yarn\.lock/i],
  }

  for (const [scope, patterns] of Object.entries(scopePatterns)) {
    if (files.some((file) => patterns.some((pattern) => pattern.test(file)))) {
      return scope
    }
  }

  // Try to extract from directory structure
  const dirs = files.map((f) => f.split('/')[0]).filter((d) => d && !d.startsWith('.'))
  const commonDir = dirs.find((d, i, arr) => arr.filter((x) => x === d).length > 1)

  return commonDir || null
}

function detectType(diff: string, files: string[]): string {
  const lowerDiff = diff.toLowerCase()
  const fileStr = files.join(' ').toLowerCase()

  // Check for specific patterns
  if (fileStr.includes('test') || fileStr.includes('spec')) return 'test'
  if (fileStr.includes('doc') || fileStr.includes('readme')) return 'docs'
  if (fileStr.includes('.github') || fileStr.includes('ci')) return 'ci'
  if (fileStr.includes('package.json')) return 'deps'

  // Check diff content
  if (lowerDiff.includes('fix') || lowerDiff.includes('bug')) return 'fix'
  if (lowerDiff.includes('test')) return 'test'
  if (lowerDiff.includes('refactor')) return 'refactor'
  if (lowerDiff.includes('style') || lowerDiff.includes('format')) return 'style'
  if (lowerDiff.includes('perf') || lowerDiff.includes('performance')) return 'perf'

  // Default to feat for new files, fix for modifications
  const hasNewFiles = files.some((f) => !diff.includes(`--- a/${f}`))
  return hasNewFiles ? 'feat' : 'fix'
}

function generateDescription(files: string[], diff: string): string {
  // Try to extract meaningful description from diff
  const lines = diff.split('\n')
  const addedLines = lines.filter((l) => l.startsWith('+') && !l.startsWith('+++')).slice(0, 5)

  if (addedLines.length > 0) {
    // Try to find function/class names
    const codePattern = /(function|class|const|let|export)\s+(\w+)/
    for (const line of addedLines) {
      const match = line.match(codePattern)
      if (match) {
        return `add ${match[2]}`
      }
    }
  }

  // Fallback to file-based description
  if (files.length === 1) {
    const fileName = files[0]
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '')
    return `update ${fileName}`
  }

  return `update ${files.length} files`
}
