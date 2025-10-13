'use client'

import { motion } from 'framer-motion'
import { Github, Shield } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GitHubAuthSheet } from '@/components/settings/github-auth-sheet'
import { ConfigEditor } from '@/components/settings/config-editor'

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure PR Pilot settings and integrations</p>
        </motion.div>

        {/* GitHub Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Integration
              </CardTitle>
              <CardDescription>
                Connect your GitHub account to create pull requests and manage repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">GitHub Personal Access Token</p>
                  <p className="text-xs text-muted-foreground">
                    Required for creating PRs and accessing private repositories
                  </p>
                </div>
                <GitHubAuthSheet />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Your data security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Secure Token Storage</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All tokens are stored in httpOnly cookies, preventing access from client-side
                      JavaScript.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">No Data Collection</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PR Pilot runs entirely on your machine. We don&apos;t collect or store any of
                      your data.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configuration */}
        <ConfigEditor />
      </div>
    </AppShell>
  )
}
