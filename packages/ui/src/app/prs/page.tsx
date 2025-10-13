'use client'

import { motion } from 'framer-motion'
import { GitPullRequest, Plus } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PRsPage() {
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
            <p className="text-muted-foreground">
              Manage your pull requests
            </p>
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
            <CardDescription>
              Your PRs will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <GitPullRequest className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No pull requests yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first PR to get started
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
