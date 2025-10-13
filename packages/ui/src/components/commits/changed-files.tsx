'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileCode, FilePlus, FileX, Search, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useChangedFiles } from '@/hooks/queries/use-git-queries'
import { useQueryState } from 'nuqs'
import { FileDiffDialog } from './file-diff-dialog'
const statusConfig = {
  M: { label: 'Modified', icon: FileCode, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  A: { label: 'Added', icon: FilePlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  D: { label: 'Deleted', icon: FileX, color: 'text-red-500', bg: 'bg-red-500/10' },
  R: { label: 'Renamed', icon: FileCode, color: 'text-blue-500', bg: 'bg-blue-500/10' },
}

interface ChangedFilesProps {
  onSelectionChange?: (files: string[]) => void
}

export function ChangedFiles({ onSelectionChange }: ChangedFilesProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectedFile, setSelectedFile] = useQueryState('file')

  const { data: files, isLoading, error } = useChangedFiles()

  // Initialize selected files when data loads
  useEffect(() => {
    if (files && selected.size === 0) {
      setSelected(new Set(files.map((f) => f.path)))
    }
  }, [files])

  // Notify parent when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selected))
    }
  }, [selected, onSelectionChange])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Changed Files</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Changed Files</CardTitle>
          <CardDescription>Error loading files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-destructive">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filesList = files || []
  const filteredFiles = filesList.filter((file) =>
    file.path.toLowerCase().includes(search.toLowerCase())
  )

  const toggleFile = (path: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(path)) {
      newSelected.delete(path)
    } else {
      newSelected.add(path)
    }
    setSelected(newSelected)
  }

  const stats = {
    modified: filesList.filter((f) => f.status === 'M').length,
    added: filesList.filter((f) => f.status === 'A').length,
    deleted: filesList.filter((f) => f.status === 'D').length,
  }

  return (
    <>
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Changed Files</CardTitle>
            <CardDescription>
              {selected.size} of {filesList.length} files selected
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {stats.modified > 0 && (
              <Badge variant="secondary" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                {stats.modified}
              </Badge>
            )}
            {stats.added > 0 && (
              <Badge variant="secondary" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                {stats.added}
              </Badge>
            )}
            {stats.deleted > 0 && (
              <Badge variant="secondary" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                {stats.deleted}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* File List */}
        {filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {filesList.length === 0 ? 'No changed files' : 'No files match your search'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredFiles.map((file, index) => {
              const config = statusConfig[file.status as keyof typeof statusConfig]
              const Icon = config.icon
              const isSelected = selected.has(file.path)

              return (
                <motion.div
                  key={file.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg border p-3 transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80 hover:bg-muted/50'
                  )}
                  onClick={() => toggleFile(file.path)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleFile(file.path)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <div className={cn('rounded-md p-2', config.bg)}>
                    <Icon className={cn('h-4 w-4', config.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(file.path)
                      }}
                      className="block truncate font-mono text-sm text-left hover:underline hover:text-primary transition-colors w-full"
                    >
                      {file.path}
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                      {file.additions > 0 && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          +{file.additions}
                        </span>
                      )}
                      {file.deletions > 0 && (
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                          -{file.deletions}
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge variant="outline" className={cn('text-xs', config.color)}>
                    {config.label}
                  </Badge>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>

    {/* Diff Viewer Dialog */}
    <FileDiffDialog filePath={selectedFile} onClose={() => setSelectedFile(null)} />
  </>
  )
}
