'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFileDiff } from '@/hooks/queries'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, FileCode, Loader2, X } from 'lucide-react'

interface FileDiffDialogProps {
  filePath: string | null
  onClose: () => void
}

export function FileDiffDialog({ filePath, onClose }: FileDiffDialogProps) {
  const { data: diff, isLoading, error } = useFileDiff(filePath)

  console.log(diff)

  return (
    <AnimatePresence>
      {filePath && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[80%] lg:w-[70%] bg-background border-l shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b bg-muted/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 p-4">
                <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
                    <h2 className="font-semibold text-sm truncate">{filePath}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">File changes</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-3"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading changes...</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center"
                >
                  <div className="rounded-full bg-destructive/10 p-3">
                    <X className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Failed to load diff</p>
                    <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
                  </div>
                </motion.div>
              )}

              {diff && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-mono text-[13px] leading-relaxed"
                >
                  {diff.split('\n').map((line, index) => {
                    const isAddition = line.startsWith('+') && !line.startsWith('+++')
                    const isDeletion = line.startsWith('-') && !line.startsWith('---')
                    const isChunkHeader = line.startsWith('@@')
                    const isFileHeader =
                      line.startsWith('+++') || line.startsWith('---') || line.startsWith('diff') || line.startsWith('new file')

                    // Calculate line numbers
                    let oldLineNum = ''
                    let newLineNum = ''
                    
                    if (!isFileHeader && !isChunkHeader) {
                      if (isDeletion) {
                        oldLineNum = String(index)
                        newLineNum = ' '
                      } else if (isAddition) {
                        oldLineNum = ' '
                        newLineNum = String(index)
                      } else {
                        oldLineNum = String(index)
                        newLineNum = String(index)
                      }
                    }

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(index * 0.001, 0.3) }}
                        className={`
                          group flex items-stretch
                          ${isAddition ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : ''}
                          ${isDeletion ? 'bg-red-500/5 hover:bg-red-500/10' : ''}
                          ${isChunkHeader ? 'bg-blue-500/10 hover:bg-blue-500/15' : ''}
                          ${isFileHeader ? 'bg-muted/30' : ''}
                          ${!isAddition && !isDeletion && !isChunkHeader && !isFileHeader ? 'hover:bg-muted/20' : ''}
                          transition-colors
                        `}
                      >
                        {/* Line numbers */}
                        {!isFileHeader && !isChunkHeader && (
                          <div className="flex shrink-0 select-none text-muted-foreground/40 text-xs">
                            <span className="inline-block w-12 text-right px-2 py-1 border-r border-border/50">
                              {oldLineNum}
                            </span>
                            <span className="inline-block w-12 text-right px-2 py-1 border-r border-border/50">
                              {newLineNum}
                            </span>
                          </div>
                        )}
                        
                        {/* Diff indicator */}
                        <div
                          className={`
                            shrink-0 w-8 flex items-center justify-center text-xs font-bold
                            ${isAddition ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : ''}
                            ${isDeletion ? 'text-red-600 dark:text-red-400 bg-red-500/10' : ''}
                            ${isChunkHeader ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10' : ''}
                            ${isFileHeader ? 'text-muted-foreground bg-muted/50' : ''}
                          `}
                        >
                          {isAddition && '+'}
                          {isDeletion && '-'}
                          {isChunkHeader && '@'}
                        </div>

                        {/* Line content */}
                        <div
                          className={`
                            flex-1 px-4 py-1 overflow-x-auto
                            ${isAddition ? 'text-emerald-700 dark:text-emerald-300' : ''}
                            ${isDeletion ? 'text-red-700 dark:text-red-300' : ''}
                            ${isChunkHeader ? 'text-blue-700 dark:text-blue-300 font-semibold' : ''}
                            ${isFileHeader ? 'text-muted-foreground font-semibold text-xs' : ''}
                            ${!isAddition && !isDeletion && !isChunkHeader && !isFileHeader ? 'text-foreground/90' : ''}
                          `}
                        >
                          {line.slice(1) || ' '}
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}

              {!isLoading && !error && !diff && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-3"
                >
                  <div className="rounded-full bg-muted p-3">
                    <FileCode className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No changes to display</p>
                </motion.div>
              )}
            </div>

            {/* Footer with stats */}
            {diff && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-t bg-muted/30 backdrop-blur-sm p-4"
              >
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                    >
                      <span className="font-mono">
                        +
                        {
                          diff.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++'))
                            .length
                        }
                      </span>
                      additions
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="gap-1 bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20"
                    >
                      <span className="font-mono">
                        -
                        {
                          diff.split('\n').filter((l) => l.startsWith('-') && !l.startsWith('---'))
                            .length
                        }
                      </span>
                      deletions
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
