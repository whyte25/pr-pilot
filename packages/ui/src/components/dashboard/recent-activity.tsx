'use client'

import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-muted p-3 mb-3">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No recent activity</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your commits and PRs will appear here
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
