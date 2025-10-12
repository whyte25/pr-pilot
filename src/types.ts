/**
 * Core types for PR Pilot
 */

export type CommitFormat = 'conventional' | 'simple'
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export type ConventionalType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'style'
  | 'refactor'
  | 'perf'
  | 'test'
  | 'build'
  | 'ci'
  | 'chore'
  | 'revert'

/**
 * User configuration for PR Pilot
 */
export interface Config {
  commit: {
    format: CommitFormat
    scopes: 'auto' | string[] | false
    maxLength: number
  }
  hooks: {
    lint: boolean | string
    format: boolean | string
    test: boolean | string
  }
  pr: {
    base: 'auto' | string
    draft: boolean
    labels: string[]
    reviewers: string[]
    template: boolean
  }
}

/**
 * Simple commit answers (beginner flow)
 */
export interface SimpleCommitAnswers {
  message: string
}

/**
 * Conventional commit answers (intermediate flow)
 */
export interface ConventionalCommitAnswers {
  type: ConventionalType
  scope: string
  subject: string
  body?: string
  breaking?: boolean
  breakingDescription?: string
  issues?: string
}

/**
 * Detected project information
 */
export interface ProjectInfo {
  packageManager: PackageManager
  isMonorepo: boolean
  hasCommitlint: boolean
  hasLintScript: boolean
  hasFormatScript: boolean
  defaultBranch?: string
  scopes: string[]
}

/**
 * Hook execution result
 */
export interface HookResult {
  success: boolean
  skipped?: boolean
  warning?: boolean
  error?: Error
}
