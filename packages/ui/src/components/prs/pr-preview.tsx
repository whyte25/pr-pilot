'use client'

import { Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PRPreview() {
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview
        </CardTitle>
        <CardDescription>
          How your PR will look
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Branch Info */}
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">feature/new-ui</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline">main</Badge>
          </div>

          {/* Preview Content */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Fill in the form to see a preview
            </p>
            
            <div className="space-y-3">
              <div className="h-6 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-muted animate-pulse" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-border p-3">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground">Files</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-2xl font-bold text-emerald-500">0</div>
              <div className="text-xs text-muted-foreground">Additions</div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-xs text-muted-foreground">Deletions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
