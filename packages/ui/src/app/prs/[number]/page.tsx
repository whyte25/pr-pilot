'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, GitPullRequest, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePullRequest } from '@/hooks/queries/use-github-queries'

export default function PRDetailPage() {
  const params = useParams()
  const prNumber = parseInt(params.number as string, 10)
  
  const { data: pr, isLoading, error } = usePullRequest(prNumber)

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/prs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pull Request #{prNumber}</h1>
              <p className="text-muted-foreground">
                View pull request details
              </p>
            </div>
          </div>

          {pr && (
            <Button size="lg" className="gap-2" asChild>
              <a href={pr.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          )}
        </motion.div>

        {/* Content */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load pull request. Please check your GitHub authentication.
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Loading pull request...</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && pr && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* PR Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <GitPullRequest className="h-5 w-5 text-green-500" />
                        {pr.title}
                      </CardTitle>
                      <CardDescription>
                        #{pr.number} opened by {pr.author}
                      </CardDescription>
                    </div>
                    {pr.draft && <Badge variant="secondary">Draft</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {pr.body ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {pr.body}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No description provided</p>
                  )}
                </CardContent>
              </Card>

              {/* Files Changed */}
              <Card>
                <CardHeader>
                  <CardTitle>Files Changed</CardTitle>
                  <CardDescription>
                    {pr.changedFiles} {pr.changedFiles === 1 ? 'file' : 'files'} changed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-emerald-500">
                        +{pr.additions}
                      </div>
                      <div className="text-sm text-muted-foreground">additions</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-red-500">
                        -{pr.deletions}
                      </div>
                      <div className="text-sm text-muted-foreground">deletions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">State</span>
                    <Badge variant={pr.state === 'open' ? 'default' : 'secondary'}>
                      {pr.state}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Draft</span>
                    <span>{pr.draft ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mergeable</span>
                    <span>{pr.mergeable ? 'Yes' : 'No'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Branches */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Branches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">From</div>
                    <Badge variant="outline" className="font-mono">
                      {pr.head}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Into</div>
                    <Badge variant="outline" className="font-mono">
                      {pr.base}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
