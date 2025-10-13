'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PRDetailViewProps {
  pr: {
    number: number
    title: string
    body: string | null
    author: string
    state: string
    draft: boolean | undefined
    createdAt: string
    url: string
    head: string
    base: string
  }
  onBack: () => void
}

export function PRDetailView({ pr, onBack }: PRDetailViewProps) {
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
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{pr.title}</h1>
              <p className="text-muted-foreground">
                #{pr.number} opened by {pr.author}
              </p>
            </div>
          </div>

          <Button variant="outline" asChild>
            <a href={pr.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </Button>
        </motion.div>

        {/* PR Details */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {pr.body || 'No description provided.'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">State</span>
                  <Badge variant={pr.state === 'open' ? 'default' : 'secondary'}>
                    {pr.state}
                  </Badge>
                </div>
                {pr.draft && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Draft</span>
                    <Badge variant="secondary">Yes</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Branches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">From</span>
                  <p className="font-mono text-sm">{pr.head}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">To</span>
                  <p className="font-mono text-sm">{pr.base}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
