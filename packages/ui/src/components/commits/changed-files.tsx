'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCode, FilePlus, FileX, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// Mock data - will be replaced with real Git data
const mockFiles = [
  { path: 'src/components/ui/button.tsx', status: 'M', additions: 12, deletions: 3 },
  { path: 'src/app/page.tsx', status: 'M', additions: 45, deletions: 12 },
  { path: 'src/components/new-component.tsx', status: 'A', additions: 89, deletions: 0 },
  { path: 'src/old-file.ts', status: 'D', additions: 0, deletions: 156 },
  { path: 'README.md', status: 'M', additions: 5, deletions: 2 },
]

const statusConfig = {
  M: { label: 'Modified', icon: FileCode, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  A: { label: 'Added', icon: FilePlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  D: { label: 'Deleted', icon: FileX, color: 'text-red-500', bg: 'bg-red-500/10' },
}

export function ChangedFiles() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set(mockFiles.map((f) => f.path)))

  const filteredFiles = mockFiles.filter((file) =>
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
    modified: mockFiles.filter((f) => f.status === 'M').length,
    added: mockFiles.filter((f) => f.status === 'A').length,
    deleted: mockFiles.filter((f) => f.status === 'D').length,
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Changed Files</CardTitle>
            <CardDescription>
              {selected.size} of {mockFiles.length} files selected
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              {stats.modified}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              {stats.added}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              {stats.deleted}
            </Badge>
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
                  <code className="block truncate font-mono text-sm">
                    {file.path}
                  </code>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      +{file.additions}
                    </span>
                    <span className="text-xs text-red-600 dark:text-red-400">
                      -{file.deletions}
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className={cn('text-xs', config.color)}>
                  {config.label}
                </Badge>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
