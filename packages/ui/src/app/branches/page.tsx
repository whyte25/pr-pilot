'use client'

import { AppShell } from '@/components/layout/app-shell'
import { Alert, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useCreateBranch,
  useDeleteBranch,
  useStashChanges,
  useSwitchBranch,
} from '@/hooks/mutations/use-git-mutations'
import { useAllBranches, useCurrentBranch } from '@/hooks/queries/use-git-queries'
import { useRepository } from '@/hooks/queries/use-github-queries'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Check,
  ExternalLink,
  GitBranch,
  GitMerge,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function BranchesPage() {
  const { data: branches, isLoading, error, refetch } = useAllBranches()
  const { data: currentBranch } = useCurrentBranch()
  const { data: repo } = useRepository()
  const switchBranch = useSwitchBranch()
  const createBranch = useCreateBranch()
  const deleteBranch = useDeleteBranch()
  const stashChanges = useStashChanges()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newBranchName, setNewBranchName] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null)
  const [switchConflictDialogOpen, setSwitchConflictDialogOpen] = useState(false)
  const [conflictDetails, setConflictDetails] = useState<{
    branchName: string
    files: string[]
    error: string
  } | null>(null)

  const handleSwitchBranch = async (branchName: string, force = false) => {
    try {
      await switchBranch.mutateAsync({ branchName, force })
      toast.success('Branch switched successfully', {
        description: `Switched to ${branchName}`,
      })
      setSwitchConflictDialogOpen(false)
      setConflictDetails(null)
      refetch()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Check if it's a conflict error
      if (
        errorMessage.includes('would be overwritten') ||
        errorMessage.includes('commit your changes')
      ) {
        // Extract file names from error message
        const fileMatches =
          errorMessage.match(/[\w/.-]+\.(tsx?|jsx?|json|ts|js|css|scss|md)/g) || []
        setConflictDetails({
          branchName,
          files: fileMatches,
          error: errorMessage,
        })
        setSwitchConflictDialogOpen(true)
      } else {
        toast.error('Failed to switch branch', {
          description: errorMessage,
        })
      }
    }
  }

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) {
      toast.error('Branch name is required')
      return
    }

    try {
      await createBranch.mutateAsync(newBranchName.trim())
      toast.success('Branch created successfully', {
        description: `Created branch ${newBranchName}`,
      })
      setNewBranchName('')
      setCreateDialogOpen(false)
      refetch()
    } catch (error) {
      toast.error('Failed to create branch', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleDeleteBranch = async () => {
    if (!branchToDelete) return

    try {
      await deleteBranch.mutateAsync(branchToDelete)
      toast.success('Branch deleted successfully', {
        description: `Deleted branch ${branchToDelete}`,
      })
      setBranchToDelete(null)
      setDeleteDialogOpen(false)
      refetch()
    } catch (error) {
      toast.error('Failed to delete branch', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
            <p className="text-muted-foreground">View and manage your Git branches</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                New Branch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Branch</DialogTitle>
                <DialogDescription>
                  Create a new branch from the current branch ({currentBranch || 'unknown'})
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="branch-name">Branch Name</Label>
                  <Input
                    id="branch-name"
                    placeholder="feature/my-new-feature"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateBranch()
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBranch} disabled={createBranch.isPending}>
                  {createBranch.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Branch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Branches List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              All Branches
            </CardTitle>
            <CardDescription>
              {branches && branches.length > 0
                ? `${branches.length} ${branches.length === 1 ? 'branch' : 'branches'} in your repository`
                : 'Your branches will appear here'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Failed to load branches. Please check your repository.</AlertTitle>
              </Alert>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Loading branches...</p>
              </div>
            )}

            {!isLoading && !error && branches && branches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <GitBranch className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No branches found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Branch information will be loaded from your repository
                </p>
              </div>
            )}

            {!isLoading && !error && branches && branches.length > 0 && (
              <div className="space-y-2">
                {branches.map((branch) => {
                  const isCurrent = branch.name === currentBranch
                  const branchUrl = repo
                    ? `https://github.com/${repo.fullName}/tree/${branch.name}`
                    : null

                  return (
                    <div
                      key={branch.name}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <GitBranch
                          className={`h-5 w-5 flex-shrink-0 ${isCurrent ? 'text-green-500' : 'text-muted-foreground'}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm truncate">{branch.name}</h3>
                            {isCurrent && (
                              <Badge variant="default" className="flex-shrink-0">
                                <Check className="h-3 w-3 mr-1" />
                                Current
                              </Badge>
                            )}
                          </div>
                          {branch.commit && (
                            <p className="text-xs text-muted-foreground truncate">
                              {branch.commit.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!isCurrent && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSwitchBranch(branch.name)}
                              disabled={switchBranch.isPending}
                            >
                              {switchBranch.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <GitMerge className="h-4 w-4 mr-2" />
                                  Switch
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setBranchToDelete(branch.name)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {branchUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            asChild
                          >
                            <a href={branchUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the branch <strong>{branchToDelete}</strong>. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBranchToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBranch}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteBranch.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Branch
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Switch Conflict Resolution Dialog */}
        <AlertDialog open={switchConflictDialogOpen} onOpenChange={setSwitchConflictDialogOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Uncommitted Changes Detected
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  You have uncommitted changes that would be overwritten when switching to{' '}
                  <strong>{conflictDetails?.branchName}</strong>.
                </p>

                {conflictDetails && conflictDetails.files.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Affected files:</p>
                    {conflictDetails.files.length <= 5 ? (
                      <ul className="space-y-1 text-sm">
                        {conflictDetails.files.map((file, index) => (
                          <li key={index} className="flex items-center gap-2 font-mono text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            {file}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-2">
                        <ul className="space-y-1 text-sm">
                          {conflictDetails.files.slice(0, 3).map((file, index) => (
                            <li key={index} className="flex items-center gap-2 font-mono text-xs">
                              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                              {file}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground">
                          ...and {conflictDetails.files.length - 3} more files
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm">Choose how to proceed:</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <AlertDialogCancel
                  onClick={() => {
                    setSwitchConflictDialogOpen(false)
                    setConflictDetails(null)
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSwitchConflictDialogOpen(false)
                    setConflictDetails(null)
                    // Navigate to commits page to commit changes
                    window.location.href = '/commits/new'
                  }}
                  className="w-full sm:w-auto"
                >
                  Commit Changes
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    if (conflictDetails) {
                      try {
                        await stashChanges.mutateAsync(
                          `WIP: switching to ${conflictDetails.branchName}`
                        )
                        await handleSwitchBranch(conflictDetails.branchName, false)
                        toast.success('Changes stashed and branch switched')
                      } catch (error) {
                        toast.error('Failed to stash changes', {
                          description: error instanceof Error ? error.message : 'Unknown error',
                        })
                      }
                    }
                  }}
                  disabled={stashChanges.isPending}
                  className="w-full sm:w-auto"
                >
                  {stashChanges.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Stash & Switch
                </Button>
                <AlertDialogAction
                  onClick={() => {
                    if (conflictDetails) {
                      handleSwitchBranch(conflictDetails.branchName, true)
                    }
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                >
                  {switchBranch.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Force Switch (Discard Changes)
                </AlertDialogAction>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  )
}
