import simpleGit, { SimpleGit, StatusResult, DiffResult } from 'simple-git'
import path from 'path'

let git: SimpleGit | null = null
let gitRoot: string | null = null

/**
 * Find the Git root directory
 */
async function findGitRoot(startDir?: string): Promise<string> {
  if (gitRoot) return gitRoot

  const tempGit = simpleGit(startDir || process.cwd())
  try {
    const root = await tempGit.revparse(['--show-toplevel'])
    gitRoot = root.trim()
    return gitRoot
  } catch {
    // Fallback to current directory
    return startDir || process.cwd()
  }
}

/**
 * Get or create a simple-git instance
 * Always uses the Git root directory to ensure paths work correctly
 */
export async function getGitAsync(baseDir?: string): Promise<SimpleGit> {
  if (!git || !gitRoot) {
    const startDir = baseDir || process.cwd()
    const tempGit = simpleGit(startDir)

    try {
      // Find the Git root directory
      const root = await tempGit.revparse(['--show-toplevel'])
      gitRoot = root.trim()
      console.log('🔍 Git root directory:', gitRoot)
      console.log('📂 Current working directory:', startDir)
      git = simpleGit(gitRoot)
    } catch (error) {
      // Fallback to current directory if not in a Git repo
      console.log('⚠️ Not in a Git repo, using:', startDir)
      git = simpleGit(startDir)
    }
  }
  return git
}

/**
 * Get or create a simple-git instance (sync version for backwards compatibility)
 */
export function getGit(baseDir?: string): SimpleGit {
  if (!git) {
    git = simpleGit(baseDir || process.cwd())
  }
  return git
}

/**
 * Get the current Git status
 */
export async function getGitStatus(baseDir?: string): Promise<StatusResult> {
  const gitInstance = getGit(baseDir)
  return await gitInstance.status()
}

/**
 * Get changed files with their status
 */
export async function getChangedFiles(baseDir?: string) {
  const status = await getGitStatus(baseDir)

  console.log('📊 Git Status Summary:')
  console.log('  Modified:', status.modified.length, status.modified)
  console.log('  Created:', status.created.length, status.created)
  console.log('  Deleted:', status.deleted.length, status.deleted)
  console.log('  Renamed:', status.renamed.length, status.renamed)
  console.log('  Not added:', status.not_added.length, status.not_added)
  console.log('  Staged:', status.staged.length, status.staged)

  const files = [
    ...status.modified.map((file) => ({ path: file, status: 'M' as const })),
    ...status.created.map((file) => ({ path: file, status: 'A' as const })),
    ...status.deleted.map((file) => ({ path: file, status: 'D' as const })),
    ...status.renamed.map((file) => ({ path: file.to, status: 'R' as const })),
    ...status.not_added.map((file) => ({ path: file, status: 'A' as const })),
  ]

  console.log('📁 Total files returned:', files.length)

  // Get diff stats for each file
  const filesWithStats = await Promise.all(
    files.map(async (file) => {
      try {
        const diff = await getGit(baseDir).diff(['--numstat', 'HEAD', '--', file.path])
        const match = diff.match(/^(\d+)\s+(\d+)/)

        return {
          ...file,
          additions: match ? parseInt(match[1], 10) : 0,
          deletions: match ? parseInt(match[2], 10) : 0,
        }
      } catch {
        return {
          ...file,
          additions: 0,
          deletions: 0,
        }
      }
    })
  )

  return filesWithStats
}

/**
 * Create a commit
 */
export async function createCommit(
  message: string,
  files: string[],
  baseDir?: string
): Promise<void> {
  const gitInstance = getGit(baseDir)

  // Add files
  await gitInstance.add(files)

  // Commit
  await gitInstance.commit(message)
}

/**
 * Get current branch name
 */
export async function getCurrentBranch(baseDir?: string): Promise<string> {
  const gitInstance = getGit(baseDir)
  const status = await gitInstance.status()
  return status.current || 'main'
}

/**
 * Get all branches
 */
export async function getBranches(baseDir?: string) {
  const gitInstance = getGit(baseDir)
  const branches = await gitInstance.branch()

  return {
    current: branches.current,
    all: branches.all,
    branches: branches.branches,
  }
}

/**
 * Get commit history
 */
export async function getCommitHistory(baseDir?: string, limit = 10) {
  const gitInstance = getGit(baseDir)
  const log = await gitInstance.log({ maxCount: limit })

  return log.all.map((commit) => ({
    hash: commit.hash,
    message: commit.message,
    author: commit.author_name,
    date: commit.date,
  }))
}

/**
 * Get repository info
 */
export async function getRepoInfo(baseDir?: string) {
  const gitInstance = getGit(baseDir)

  const [remotes, branch, status] = await Promise.all([
    gitInstance.getRemotes(true),
    getCurrentBranch(baseDir),
    getGitStatus(baseDir),
  ])

  const origin = remotes.find((r) => r.name === 'origin')

  return {
    branch,
    remote: origin?.refs.fetch || '',
    ahead: status.ahead,
    behind: status.behind,
    clean: status.isClean(),
  }
}

/**
 * Get diff for a specific file
 * Works universally by using Git's status to find the file and get its diff
 * For new files, shows the full content as a diff
 */
export async function getFileDiff(filePath: string, baseDir?: string): Promise<string> {
  const gitInstance = await getGitAsync(baseDir)

  try {
    // Get the status to find all changed files
    const status = await gitInstance.status()

    // Find the file in the status (it might have different path formats)
    const allFiles = [
      ...status.modified,
      ...status.created,
      ...status.deleted,
      ...status.renamed.map((r) => r.to),
      ...status.not_added,
    ]

    // Check if the file exists in the changed files
    const matchingFile = allFiles.find(
      (f) => f === filePath || f.endsWith(filePath) || filePath.endsWith(f)
    )

    if (!matchingFile) {
      console.log('File not found in Git status:', filePath)
      return ''
    }

    console.log('Found matching file:', matchingFile)
    const isNewFile =
      status.not_added.includes(matchingFile) || status.created.includes(matchingFile)
    console.log('File is new:', isNewFile)

    // For new files, show the full content as a diff
    if (isNewFile) {
      try {
        const fs = await import('fs/promises')
        const path = await import('path')
        const gitRoot = await gitInstance.revparse(['--show-toplevel'])
        const fullPath = path.join(gitRoot.trim(), matchingFile)
        const content = await fs.readFile(fullPath, 'utf-8')

        // Format as a diff (all lines as additions)
        const lines = content.split('\n')
        const diffLines = [
          `diff --git a/${matchingFile} b/${matchingFile}`,
          'new file mode 100644',
          `--- /dev/null`,
          `+++ b/${matchingFile}`,
          `@@ -0,0 +1,${lines.length} @@`,
          ...lines.map((line) => `+${line}`),
        ]

        console.log('✓ Generated diff for new file')
        return diffLines.join('\n')
      } catch (error) {
        console.log('✗ Failed to read new file:', error)
        return ''
      }
    }

    // Try to get diff using the exact path from Git status
    let diff = ''

    // 1. Try without any revision (just the file) - for unstaged changes
    try {
      diff = await gitInstance.raw(['diff', matchingFile])
      console.log('Strategy 1 (raw diff file) result:', diff ? `${diff.length} chars` : 'empty')
      if (diff && diff.trim()) {
        console.log('✓ Got diff from raw diff')
        return diff
      }
    } catch (e) {
      console.log('✗ Raw diff failed:', e)
    }

    // 2. Try with -- separator
    try {
      diff = await gitInstance.diff(['--', matchingFile])
      console.log('Strategy 2 (with --) result:', diff ? `${diff.length} chars` : 'empty')
      if (diff && diff.trim()) {
        console.log('✓ Got diff from unstaged changes')
        return diff
      }
    } catch (e) {
      console.log('✗ Unstaged diff failed:', e)
    }

    // 2. Try staged changes
    try {
      diff = await gitInstance.diff(['--cached', '--', matchingFile])
      console.log('Strategy 2 result:', diff ? `${diff.length} chars` : 'empty')
      if (diff && diff.trim()) {
        console.log('✓ Got diff from staged changes')
        return diff
      }
    } catch (e) {
      console.log('✗ Staged diff failed:', e)
    }

    // 3. Try against HEAD
    try {
      diff = await gitInstance.diff(['HEAD', '--', matchingFile])
      console.log('Strategy 3 result:', diff ? `${diff.length} chars` : 'empty')
      if (diff && diff.trim()) {
        console.log('✓ Got diff from HEAD')
        return diff
      }
    } catch (e) {
      console.log('✗ HEAD diff failed:', e)
    }

    // 4. Last resort: use raw git command
    try {
      diff = await gitInstance.raw(['diff', '--', matchingFile])
      console.log('Strategy 4 (raw) result:', diff ? `${diff.length} chars` : 'empty')
      if (diff && diff.trim()) {
        console.log('✓ Got diff from raw command')
        return diff
      }
    } catch (e) {
      console.log('✗ Raw diff failed:', e)
    }

    console.log('⚠️ All diff strategies failed for:', matchingFile)
    return ''
  } catch (error) {
    console.error('Error getting file diff:', error)
    return ''
  }
}
