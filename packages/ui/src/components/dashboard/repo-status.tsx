'use client'

import { GitBranch, Loader2, AlertCircle, CheckCircle2, FileEdit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGitStatus, useRepoInfo } from '@/hooks/queries/use-git-queries'

export function RepoStatus() {
  const { data: status, isLoading: statusLoading } = useGitStatus()
  const { data: repoInfo, isLoading: repoLoading } = useRepoInfo()

  const isLoading = statusLoading || repoLoading
  const hasChanges = status && (
    status.modified.length > 0 ||
    status.created.length > 0 ||
    status.deleted.length > 0 ||
    status.not_added.length > 0 ||
    status.staged.length > 0 ||
    status.files.length > 0
  )
  const totalChanges = status ? (
    status.modified.length +
    status.created.length +
    status.deleted.length +
    status.not_added.length +
    status.staged.length
  ) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Repository Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Loading status...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Branch */}
            {repoInfo && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Branch</span>
                <Badge variant="outline" className="font-mono">
                  {repoInfo.branch}
                </Badge>
              </div>
            )}

            {/* Status */}
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className={`rounded-full p-3 mb-3 ${hasChanges ? 'bg-orange-500/10' : 'bg-green-500/10'}`}>
                {hasChanges ? (
                  <FileEdit className="h-6 w-6 text-orange-500" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                )}
              </div>
              <p className="text-sm font-medium">
                {hasChanges ? `${totalChanges} ${totalChanges === 1 ? 'change' : 'changes'}` : 'Working tree clean'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {hasChanges ? 'You have uncommitted changes' : 'No changes to commit'}
              </p>
            </div>

            {/* Change Details */}
            {hasChanges && status && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                {status.modified.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Modified</span>
                    <Badge variant="secondary">{status.modified.length}</Badge>
                  </div>
                )}
                {status.created.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Created</span>
                    <Badge variant="secondary">{status.created.length}</Badge>
                  </div>
                )}
                {status.deleted.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Deleted</span>
                    <Badge variant="secondary">{status.deleted.length}</Badge>
                  </div>
                )}
                {status.not_added.length > 0 && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">Untracked</span>
                    <Badge variant="secondary">{status.not_added.length}</Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
