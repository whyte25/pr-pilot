'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { useRemoveGitHubToken, useSaveGitHubToken } from '@/hooks/mutations'
import { useAuthStatus } from '@/hooks/queries'
import { validateGitHubToken } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth-store'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Github, Shield, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function GitHubAuthSheet() {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState('')
  const [persistAfterSession, setPersistAfterSession] = useState(false)

  // Zustand for UI state
  const { showToken, toggleShowToken, setShowToken } = useAuthStore()

  // TanStack Query for server state
  const { data: authStatus, isLoading } = useAuthStatus()
  const saveToken = useSaveGitHubToken()
  const removeToken = useRemoveGitHubToken()

  const isAuthenticated = authStatus?.isAuthenticated || false
  const maskedToken = authStatus?.maskedToken || ''

  const handleSave = () => {
    if (!token.trim()) {
      toast.error('Please enter a GitHub token')
      return
    }

    if (!validateGitHubToken(token)) {
      toast.error('Invalid GitHub token format', {
        description: 'Token should start with ghp_, gho_, ghu_, ghs_, or ghr_',
      })
      return
    }

    saveToken.mutate(
      { token, persistAfterSession },
      {
        onSuccess: () => {
          setToken('')
          setShowToken(false)
          setOpen(false)
          toast.success('GitHub token saved successfully!', {
            description: persistAfterSession
              ? 'Token will persist for 30 days'
              : 'Token will be deleted when browser closes',
          })
        },
        onError: (error) => {
          toast.error('Failed to save token', {
            description: error.message,
          })
        },
      }
    )
  }

  const handleRemove = () => {
    removeToken.mutate(undefined, {
      onSuccess: () => {
        setToken('')
        setPersistAfterSession(false)
        setOpen(false)
        toast.success('GitHub token removed successfully')
      },
      onError: (error) => {
        toast.error('Failed to remove token', {
          description: error.message,
        })
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          {isAuthenticated ? 'Manage GitHub Token' : 'Connect GitHub'}
          {isAuthenticated && (
            <Badge variant="secondary" className="gap-1 ml-1">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
              <Github className="h-5 w-5 text-white" />
            </div>
            GitHub Authentication
          </SheetTitle>
          <SheetDescription>
            Connect your GitHub account to create pull requests and manage repositories
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6 px-4">
          {/* Current Status */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Connected to GitHub</p>
                  <code className="text-xs text-muted-foreground mt-1 block">{maskedToken}</code>
                  <p className="text-xs text-muted-foreground mt-2">
                    {authStatus?.persistAfterSession
                      ? '🔒 Token persists for 30 days'
                      : '⏱️ Token expires when browser closes'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Token Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-token">
                GitHub Personal Access Token
                {!isAuthenticated && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id="github-token"
                  type={showToken ? 'text' : 'password'}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={toggleShowToken}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Create a token at{' '}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/settings/tokens
                </a>
              </p>
            </div>

            {/* Persist Option */}
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-violet-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Persist after session</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Keep token for 30 days. Otherwise, it will be deleted when browser closes.
                  </p>
                </div>
              </div>
              <Switch checked={persistAfterSession} onCheckedChange={setPersistAfterSession} />
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Your token is stored securely in httpOnly cookies and never exposed to client-side
                JavaScript.
              </p>
            </div>
          </div>
        </div>

        <SheetFooter>
          <div className="flex gap-2 w-full">
            {isAuthenticated && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2" disabled={removeToken.isPending}>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove your GitHub token from secure storage. You&apos;ll need to
                      add it again to use GitHub features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {removeToken.isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                          </motion.div>
                          Removing...
                        </>
                      ) : (
                        'Yes, remove token'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </SheetClose>
            <Button
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-violet-600"
              onClick={handleSave}
              disabled={saveToken.isPending || !token.trim()}
            >
              {saveToken.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Github className="h-4 w-4" />
                  </motion.div>
                  Saving...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  {isAuthenticated ? 'Update' : 'Save'}
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
