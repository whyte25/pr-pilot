'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Wand2, Zap, Brain, FileCode, GitCommit } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AIAnalysisResult } from '@/components/analyze/ai-analysis-result'
import { ChangedFilesList } from '@/components/analyze/changed-files-list'
import { AnalysisStats } from '@/components/analyze/analysis-stats'

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalyzed(true)
    }, 3000)
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-violet-500/5 to-background" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">AI Analyze</h1>
                  <Badge className="gap-1 bg-gradient-to-r from-primary to-violet-600">
                    <Sparkles className="h-3 w-3" />
                    Premium
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Let AI analyze your changes and suggest the perfect commit message
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Wand2 className="h-4 w-4" />
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Analysis Stats */}
        <AnimatePresence>
          {hasAnalyzed && <AnalysisStats />}
        </AnimatePresence>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Changed Files */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ChangedFilesList />
          </motion.div>

          {/* Right: AI Analysis Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIAnalysisResult isAnalyzing={isAnalyzing} hasAnalyzed={hasAnalyzed} />
          </motion.div>
        </div>

        {/* Premium Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-violet-500/20 bg-gradient-to-br from-primary/5 to-violet-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-violet-500" />
                Premium AI Features
              </CardTitle>
              <CardDescription>
                Unlock the full power of AI-assisted Git workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <Brain className="h-5 w-5 text-violet-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Context</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyzes your entire codebase for context
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <FileCode className="h-5 w-5 text-violet-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Diff Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Deep understanding of code changes
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <GitCommit className="h-5 w-5 text-violet-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">History Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Learns from your commit patterns
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  )
}
