'use client'

import { FileCode, FilePlus, FileX } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const mockFiles = [
  { path: 'src/app/analyze/page.tsx', status: 'A', additions: 189, deletions: 0 },
  {
    path: 'src/components/analyze/ai-analysis-result.tsx',
    status: 'A',
    additions: 156,
    deletions: 0,
  },
  { path: 'src/components/commits/commit-form.tsx', status: 'M', additions: 8, deletions: 12 },
  { path: 'src/components/prs/pr-form.tsx', status: 'M', additions: 6, deletions: 8 },
]

const statusConfig = {
  M: { label: 'Modified', icon: FileCode, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  A: { label: 'Added', icon: FilePlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  D: { label: 'Deleted', icon: FileX, color: 'text-red-500', bg: 'bg-red-500/10' },
}

export function ChangedFilesList() {
  const stats = {
    modified: mockFiles.filter((f) => f.status === 'M').length,
    added: mockFiles.filter((f) => f.status === 'A').length,
    deleted: mockFiles.filter((f) => f.status === 'D').length,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Changed Files</CardTitle>
            <CardDescription>{mockFiles.length} files changed</CardDescription>
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
            {stats.deleted > 0 && (
              <Badge variant="secondary" className="gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                {stats.deleted}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {mockFiles.map((file) => {
            const config = statusConfig[file.status as keyof typeof statusConfig]
            const Icon = config.icon

            return (
              <div
                key={file.path}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className={cn('rounded-md p-2', config.bg)}>
                  <Icon className={cn('h-4 w-4', config.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <code className="block truncate font-mono text-sm">{file.path}</code>
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
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
