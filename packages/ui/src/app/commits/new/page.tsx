'use client'

import { ChangedFiles } from '@/components/commits/changed-files'
import { CommitForm } from '@/components/commits/commit-form'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function NewCommitPage() {
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
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Commit</h1>
              <p className="text-muted-foreground">
                Stage changes and commit with conventional format
              </p>
            </div>
          </div>

          <Button size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Suggest
          </Button>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Changed Files */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ChangedFiles />
          </motion.div>

          {/* Right: Commit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CommitForm />
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
