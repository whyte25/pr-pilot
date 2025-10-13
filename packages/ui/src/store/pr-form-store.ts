import { create } from 'zustand'

interface PRFormState {
  title: string
  description: string
  baseBranch: string
  headBranch: string
  changeTypes: string[]
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setBaseBranch: (branch: string) => void
  setHeadBranch: (branch: string) => void
  setChangeTypes: (types: string[]) => void
  reset: () => void
}

const initialState = {
  title: '',
  description: '',
  baseBranch: '',
  headBranch: '',
  changeTypes: [] as string[],
}

export const usePRFormStore = create<PRFormState>((set) => ({
  ...initialState,
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setBaseBranch: (baseBranch) => set({ baseBranch }),
  setHeadBranch: (headBranch) => set({ headBranch }),
  setChangeTypes: (changeTypes) => set({ changeTypes }),
  reset: () => set(initialState),
}))
