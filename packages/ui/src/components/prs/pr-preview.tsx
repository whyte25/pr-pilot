'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangedFiles } from '@/hooks/queries/use-git-queries'
import { Eye } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

interface PRPreviewProps {
  form: UseFormReturn<any>
}

export function PRPreview({ form }: PRPreviewProps) {
  const { data: files } = useChangedFiles()

  // Watch form values directly - no useEffect needed!
  const title = form.watch('title')
  const description = form.watch('description')
  const baseBranch = form.watch('baseBranch')
  const headBranch = form.watch('headBranch')
  const changeTypes = form.watch('changeTypes') || []

  // Calculate stats
  const stats = files?.reduce(
    (acc, file) => ({
      files: acc.files + 1,
      additions: acc.additions + file.additions,
      deletions: acc.deletions + file.deletions,
    }),
    { files: 0, additions: 0, deletions: 0 }
  ) || { files: 0, additions: 0, deletions: 0 }

  const hasContent = title || description || changeTypes.length > 0

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview
        </CardTitle>
        <CardDescription>How your PR will look</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Branch Info */}
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{headBranch || 'head'}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline">{baseBranch || 'base'}</Badge>
          </div>

          {/* Preview Content */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 min-h-[120px]">
            {hasContent ? (
              <div className="space-y-3">
                {title && <h3 className="font-semibold text-sm">{title}</h3>}
                {description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
                )}
                {changeTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {changeTypes.map((type: string) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">
                Fill in the form to see a preview
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-border p-3">
              <div className="text-2xl font-bold">{stats.files}</div>
              <div className="text-xs text-muted-foreground">Files</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-2xl font-bold text-emerald-500">{stats.additions}</div>
              <div className="text-xs text-muted-foreground">Additions</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-2xl font-bold text-red-500">{stats.deletions}</div>
              <div className="text-xs text-muted-foreground">Deletions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
