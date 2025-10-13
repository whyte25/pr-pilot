'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { PRForm } from '@/components/prs/pr-form'
import { PRPreview } from '@/components/prs/pr-preview'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  baseBranch: z.string({
    required_error: 'Please select a base branch',
  }),
  headBranch: z.string({
    required_error: 'Please select a head branch',
  }),
  changeTypes: z.array(z.string()).min(1, 'Select at least one type of change'),
  draft: z.boolean(),
})

export default function NewPRPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      baseBranch: 'main',
      headBranch: '',
      changeTypes: [],
      draft: false,
    },
  })

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

          <Button size="lg" className="gap-2" disabled>
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
            <PRForm form={form} />
          </motion.div>

          {/* Right: Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PRPreview form={form} />
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
