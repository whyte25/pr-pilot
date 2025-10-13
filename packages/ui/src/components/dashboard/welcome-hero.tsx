'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function WelcomeHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 p-8"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-violet-500/5" />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-sm backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">pr-pilot</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground/60">on</span>
              <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs">main</code>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
