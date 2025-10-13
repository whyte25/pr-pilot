'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, GitPullRequest, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { PRForm } from '@/components/prs/pr-form'
import { PRPreview } from '@/components/prs/pr-preview'

export default function NewPRPage() {
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
              <h1 className="text-3xl font-bold tracking-tight">Create Pull Request</h1>
              <p className="text-muted-foreground">
                Open a pull request from your current branch
              </p>
            </div>
          </div>

          <Button size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generate
          </Button>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: PR Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PRForm />
          </motion.div>

          {/* Right: Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PRPreview />
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
