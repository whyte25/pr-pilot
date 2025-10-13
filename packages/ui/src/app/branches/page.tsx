'use client'

import { motion } from 'framer-motion'
import { GitBranch } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BranchesPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">
            View and manage your Git branches
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              All Branches
            </CardTitle>
            <CardDescription>
              Your branches will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <GitBranch className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No branches found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Branch information will be loaded from your repository
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
