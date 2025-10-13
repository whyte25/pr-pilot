import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ConfigState {
  commit: {
    format: 'conventional' | 'simple'
    scopes: 'auto' | string[] | false
    maxLength: number
  }
  hooks: {
    lint: boolean | string
    format: boolean | string
    test: boolean | string
  }
  git: {
    promptForBranch: 'always' | 'protected' | 'never'
    protectedBranches: string[]
  }
  pr: {
    base: 'auto' | string
    draft: boolean
    labels: string[]
    reviewers: string[]
    template: boolean
  }
}

interface ConfigStore extends ConfigState {
  updateCommit: (commit: Partial<ConfigState['commit']>) => void
  updateHooks: (hooks: Partial<ConfigState['hooks']>) => void
  updateGit: (git: Partial<ConfigState['git']>) => void
  updatePr: (pr: Partial<ConfigState['pr']>) => void
  resetToDefaults: () => void
}

const defaultConfig: ConfigState = {
  commit: {
    format: 'conventional',
    scopes: 'auto',
    maxLength: 100,
  },
  hooks: {
    lint: true,
    format: true,
    test: false,
  },
  git: {
    promptForBranch: 'always',
    protectedBranches: ['main', 'master', 'develop', 'dev'],
  },
  pr: {
    base: 'auto',
    draft: false,
    labels: [],
    reviewers: [],
    template: true,
  },
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      ...defaultConfig,
      updateCommit: (commit) =>
        set((state) => ({
          commit: { ...state.commit, ...commit },
        })),
      updateHooks: (hooks) =>
        set((state) => ({
          hooks: { ...state.hooks, ...hooks },
        })),
      updateGit: (git) =>
        set((state) => ({
          git: { ...state.git, ...git },
        })),
      updatePr: (pr) =>
        set((state) => ({
          pr: { ...state.pr, ...pr },
        })),
      resetToDefaults: () => set(defaultConfig),
    }),
    {
      name: 'pr-pilot-config',
    }
  )
)
