'use client'

import { motion } from 'framer-motion'
import { GitCommit, GitPullRequest, Sparkles } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'

const actions = [
  {
    icon: GitCommit,
    label: 'Create Commit',
    description: 'Stage changes and commit with conventional format',
    href: '/commits/new',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: GitPullRequest,
    label: 'Create PR',
    description: 'Open a pull request from your current branch',
    href: '/prs/new',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconColor: 'text-violet-500',
  },
  {
    icon: Sparkles,
    label: 'AI Analyze',
    description: 'Let AI suggest commit message from your changes',
    href: '/analyze',
    gradient: 'from-primary/10 to-violet-500/10',
    iconColor: 'text-violet-500',
    badge: 'Pro',
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1 * index,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full"
        >
          <Link href={action.href as Route} className="block h-full">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg hover:shadow-primary/5">
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-1 flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`rounded-lg bg-background p-2.5 ring-1 ring-border/50 ${action.iconColor}`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  {action.badge && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {action.badge}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
