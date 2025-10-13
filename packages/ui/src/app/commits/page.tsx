'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { GitCommit, Plus, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useQueryState, parseAsInteger } from 'nuqs'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useCommitHistory, useRepoInfo } from '@/hooks/queries/use-git-queries'
import { useRepository } from '@/hooks/queries/use-github-queries'
import { formatDistanceToNow } from 'date-fns'

const ITEMS_PER_PAGE = 10

function CommitsContent() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { data: commits, isLoading, error } = useCommitHistory(100) // Fetch more to paginate
  const { data: repo } = useRepository()

  // Paginate commits
  const totalPages = commits ? Math.ceil(commits.length / ITEMS_PER_PAGE) : 0
  const paginatedCommits = commits?.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Commits</h1>
            <p className="text-muted-foreground">
              View and manage your commits
            </p>
          </div>

          <Button size="lg" className="gap-2" asChild>
            <Link href="/commits/new">
              <Plus className="h-4 w-4" />
              New Commit
            </Link>
          </Button>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Recent Commits
            </CardTitle>
            <CardDescription>
              Your commit history will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load commits. Please check your repository.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Loading commits...</p>
              </div>
            )}

            {!isLoading && !error && commits && commits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <GitCommit className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No commits yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first commit to get started
                </p>
                <Button className="mt-4 gap-2" asChild>
                  <Link href="/commits/new">
                    <Plus className="h-4 w-4" />
                    Create Commit
                  </Link>
                </Button>
              </div>
            )}

            {!isLoading && !error && paginatedCommits && paginatedCommits.length > 0 && (
              <>
                <div className="space-y-3">
                  {paginatedCommits.map((commit) => {
                    const commitUrl = repo
                      ? `https://github.com/${repo.fullName}/commit/${commit.hash}`
                      : null

                    return (
                      <div
                        key={commit.hash}
                        className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                      >
                        <GitCommit className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            {commitUrl ? (
                              <a
                                href={commitUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-sm leading-tight hover:underline"
                              >
                                {commit.message}
                              </a>
                            ) : (
                              <h3 className="font-medium text-sm leading-tight">{commit.message}</h3>
                            )}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant="outline" className="font-mono text-xs">
                                {commit.hash.substring(0, 7)}
                              </Badge>
                              {commitUrl && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  asChild
                                >
                                  <a href={commitUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{commit.author}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(commit.date), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center pt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage(Math.max(1, page - 1))}
                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setPage(pageNum)}
                              isActive={pageNum === page}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

export default function CommitsPage() {
  return (
    <Suspense fallback={
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppShell>
    }>
      <CommitsContent />
    </Suspense>
  )
}
