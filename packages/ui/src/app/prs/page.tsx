'use client'

import { AppShell } from '@/components/layout/app-shell'
import { PRDetailView } from '@/components/prs/pr-detail-view'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePullRequest, usePullRequests } from '@/hooks/queries/use-github-queries'
import { motion } from 'framer-motion'
import { AlertCircle, ExternalLink, GitPullRequest, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { parseAsInteger, useQueryState } from 'nuqs'
import { Suspense } from 'react'

function PRsContent() {
  const [prNumber, setPrNumber] = useQueryState('number', parseAsInteger)
  const { data: prs, isLoading, error } = usePullRequests('open')
  const { data: selectedPR, isLoading: prLoading } = usePullRequest(prNumber || 0)

  // Show detail view if PR number is in query
  if (prNumber && selectedPR) {
    return <PRDetailView pr={selectedPR} backToPRs={() => setPrNumber(null)} />
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pull Requests</h1>
            <p className="text-muted-foreground">Manage your pull requests</p>
          </div>

          <Button size="lg" className="gap-2" asChild>
            <Link href="/prs/new">
              <Plus className="h-4 w-4" />
              New PR
            </Link>
          </Button>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Recent Pull Requests
            </CardTitle>
            <CardDescription>Your PRs will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  Failed to load pull requests. Please check your GitHub authentication.
                </AlertTitle>
              </Alert>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Loading pull requests...</p>
              </div>
            )}

            {!isLoading && !error && prs && prs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <GitPullRequest className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No pull requests yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first PR to get started
                </p>
              </div>
            )}

            {!isLoading && !error && prs && prs.length > 0 && (
              <div className="space-y-3">
                {prs.map((pr) => (
                  <div
                    key={pr.number}
                    onClick={() => setPrNumber(pr.number)}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <GitPullRequest className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{pr.title}</h3>
                          {pr.draft && <Badge variant="secondary">Draft</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          #{pr.number} opened by {pr.author}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                      <a href={pr.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

export default function PRsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </AppShell>
      }
    >
      <PRsContent />
    </Suspense>
  )
}
