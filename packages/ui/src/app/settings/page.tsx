'use client'

import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure PR Pilot settings
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Manage your pr-pilot.config.ts settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Settings editor coming soon</p>
              <p className="text-xs text-muted-foreground mt-1">
                Visual editor for pr-pilot.config.ts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
