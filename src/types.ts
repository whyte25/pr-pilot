/**
 * Core types for PR Pilot
 */

export type CommitFormat = 'conventional' | 'simple'
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
export type BranchPromptMode = 'always' | 'protected' | 'never'
export type PRBase = 'auto' | 'main' | 'master' | 'develop' | 'dev' | (string & {})

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
    /** Commit message format: 'conventional' or 'simple' */
    format: CommitFormat
    /** Scopes: 'auto' to detect, array of strings, or false to disable */
    scopes: 'auto' | string[] | false
    /** Maximum commit message length (50-200) */
    maxLength: number
  }
  hooks: {
    /** Lint command: true (auto-detect), false (disable), or custom command */
    lint: boolean | string
    /** Format command: true (auto-detect), false (disable), or custom command */
    format: boolean | string
    /** Test command: true (auto-detect), false (disable), or custom command */
    test: boolean | string
  }
  git: {
    /** When to prompt for branch creation: 'always', 'protected', or 'never' */
    promptForBranch: BranchPromptMode
    /** List of protected branch names */
    protectedBranches: string[]
  }
  pr: {
    /** Base branch: 'auto', 'main', 'master', 'develop', 'dev', or custom */
    base: PRBase
    /** Create draft PR */
    draft: boolean
    /** Labels to add to PR */
    labels: string[]
    /** Reviewers to request */
    reviewers: string[]
    /** Use PR template from .github/PULL_REQUEST_TEMPLATE.md */
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
