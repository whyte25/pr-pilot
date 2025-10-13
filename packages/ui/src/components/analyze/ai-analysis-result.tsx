'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface AIAnalysisResultProps {
  isAnalyzing: boolean
  hasAnalyzed: boolean
}

const suggestions = [
  {
    type: 'feat',
    scope: 'ui',
    message: 'add premium AI analysis page with streaming animations',
    confidence: 95,
    reasoning: 'Added new feature with significant UI components and animations',
  },
  {
    type: 'feat',
    scope: 'components',
    message: 'implement AI-powered commit message suggestions',
    confidence: 88,
    reasoning: 'New AI analysis functionality with multiple components',
  },
  {
    type: 'refactor',
    scope: 'forms',
    message: 'migrate to shadcn checkbox components',
    confidence: 82,
    reasoning: 'Replaced custom checkbox implementations with shadcn components',
  },
]

export function AIAnalysisResult({ isAnalyzing, hasAnalyzed }: AIAnalysisResultProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [copied, setCopied] = useState(false)

  const currentSuggestion = suggestions[selectedSuggestion]
  const fullMessage = `${currentSuggestion.type}(${currentSuggestion.scope}): ${currentSuggestion.message}`

  // Streaming text effect
  useEffect(() => {
    if (hasAnalyzed && !isAnalyzing) {
      setDisplayedText('')
      let index = 0
      const interval = setInterval(() => {
        if (index <= fullMessage.length) {
          setDisplayedText(fullMessage.slice(0, index))
          index++
        } else {
          clearInterval(interval)
        }
      }, 30)
      return () => clearInterval(interval)
    }
  }, [hasAnalyzed, isAnalyzing, selectedSuggestion, fullMessage])

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMessage)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          AI Suggestions
        </CardTitle>
        <CardDescription>
          AI-generated commit messages based on your changes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="mb-4 rounded-full bg-gradient-to-br from-primary to-violet-600 p-4"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <p className="text-sm font-medium">Analyzing your changes...</p>
              <p className="text-xs text-muted-foreground mt-1">
                This may take a few seconds
              </p>
            </motion.div>
          )}

          {/* Empty State */}
          {!isAnalyzing && !hasAnalyzed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="rounded-full bg-muted p-3 mb-3">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Ready to analyze</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Analyze Changes" to get AI suggestions
              </p>
            </motion.div>
          )}

          {/* Results */}
          {!isAnalyzing && hasAnalyzed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Suggestion */}
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-violet-500 border-violet-500/50">
                    {currentSuggestion.confidence}% confident
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-2"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <code className="block font-mono text-sm mb-3">
                  {displayedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5"
                  />
                </code>

                <p className="text-xs text-muted-foreground">
                  {currentSuggestion.reasoning}
                </p>
              </div>

              {/* Alternative Suggestions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Alternative suggestions
                </p>
                {suggestions.map((suggestion, index) => (
                  index !== selectedSuggestion && (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedSuggestion(index)}
                      className="group flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-all hover:border-violet-500/50 hover:bg-violet-500/5"
                    >
                      <div className="flex-1">
                        <code className="block font-mono text-xs">
                          {suggestion.type}({suggestion.scope}): {suggestion.message}
                        </code>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {suggestion.confidence}%
                        </Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </motion.button>
                  )
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  Regenerate
                </Button>
                <Button className="flex-1 gap-2 bg-gradient-to-r from-primary to-violet-600">
                  <Sparkles className="h-4 w-4" />
                  Use This
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
