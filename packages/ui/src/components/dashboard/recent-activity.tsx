'use client'

import { Clock, GitCommit, GitPullRequest, Loader2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Route } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCommitHistory } from '@/hooks/queries/use-git-queries'
import { usePullRequests, useRepository } from '@/hooks/queries/use-github-queries'
import { formatDistanceToNow } from 'date-fns'

export function RecentActivity() {
  const { data: commits, isLoading: commitsLoading } = useCommitHistory(5)
  const { data: prs, isLoading: prsLoading } = usePullRequests('open')
  const { data: repo } = useRepository()

  const isLoading = commitsLoading || prsLoading

  // Combine and sort activities
  const activities = [
    ...(commits || []).map((commit) => ({
      type: 'commit' as const,
      title: commit.message,
      date: new Date(commit.date),
      author: commit.author,
      hash: commit.hash,
    })),
    ...(prs || []).slice(0, 5).map((pr) => ({
      type: 'pr' as const,
      title: pr.title,
      date: new Date(pr.createdAt),
      author: pr.author,
      number: pr.number,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your commits and PRs will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const commitUrl = activity.type === 'commit' && repo && 'hash' in activity
                ? `https://github.com/${repo.fullName}/commit/${activity.hash}`
                : null
              const prUrl = activity.type === 'pr' ? `/prs/${'number' in activity ? activity.number : ''}` : null
              
              return (
                <div
                  key={`${activity.type}-${index}`}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  {activity.type === 'commit' ? (
                    <GitCommit className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  ) : (
                    <GitPullRequest className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {prUrl ? (
                      <Link href={prUrl as Route} className="text-sm font-medium leading-tight truncate hover:underline block">
                        {activity.title}
                      </Link>
                    ) : commitUrl ? (
                      <a
                        href={commitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium leading-tight truncate hover:underline block"
                      >
                        {activity.title}
                      </a>
                    ) : (
                      <p className="text-sm font-medium leading-tight truncate">{activity.title}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.date, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.type === 'commit' && 'hash' in activity && (
                      <Badge variant="outline" className="font-mono text-xs flex-shrink-0">
                        {activity.hash.substring(0, 7)}
                      </Badge>
                    )}
                    {activity.type === 'pr' && 'number' in activity && (
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        #{activity.number}
                      </Badge>
                    )}
                    {(commitUrl || prUrl) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        asChild
                      >
                        {commitUrl ? (
                          <a href={commitUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <Link href={prUrl! as Route}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
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
  )
}
