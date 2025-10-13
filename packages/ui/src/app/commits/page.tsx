'use client'

import { motion } from 'framer-motion'
import { GitCommit, Plus } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CommitsPage() {
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
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
