'use client'

import { GitBranch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RepoStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Repository Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-muted p-3 mb-3">
            <GitBranch className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Working tree clean</p>
          <p className="text-xs text-muted-foreground mt-1">
            No changes to commit
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
