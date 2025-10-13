'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useConfigStore } from '@/store/config-store'
import { motion } from 'framer-motion'
import { Check, GitBranch, GitCommit, GitPullRequest, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ConfigEditor() {
  const config = useConfigStore()
  const [customScopes, setCustomScopes] = useState<string>(
    Array.isArray(config.commit.scopes) ? config.commit.scopes.join(', ') : ''
  )
  const [protectedBranches, setProtectedBranches] = useState<string>(
    config.git.protectedBranches.join(', ')
  )
  const [labels, setLabels] = useState<string>(config.pr.labels.join(', '))
  const [reviewers, setReviewers] = useState<string>(config.pr.reviewers.join(', '))

  const handleSaveScopes = () => {
    if (customScopes.trim()) {
      const scopesArray = customScopes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      config.updateCommit({ scopes: scopesArray })
      toast.success('Custom scopes saved')
    }
  }

  const handleSaveProtectedBranches = () => {
    const branchesArray = protectedBranches
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean)
    config.updateGit({ protectedBranches: branchesArray })
    toast.success('Protected branches saved')
  }

  const handleSaveLabels = () => {
    const labelsArray = labels
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)
    config.updatePr({ labels: labelsArray })
    toast.success('Default labels saved')
  }

  const handleSaveReviewers = () => {
    const reviewersArray = reviewers
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
    config.updatePr({ reviewers: reviewersArray })
    toast.success('Default reviewers saved')
  }

  return (
    <div className="space-y-6">
      {/* Commit Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Commit Settings
            </CardTitle>
            <CardDescription>Configure commit message format and scopes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Commit Format */}
            <div className="space-y-2">
              <Label>Commit Format</Label>
              <Select
                value={config.commit.format}
                onValueChange={(value: 'conventional' | 'simple') =>
                  config.updateCommit({ format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conventional">Conventional (type(scope): message)</SelectItem>
                  <SelectItem value="simple">Simple (message only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {config.commit.format === 'conventional'
                  ? 'Example: feat(ui): add settings page'
                  : 'Example: Add settings page'}
              </p>
            </div>

            {/* Scopes */}
            {config.commit.format === 'conventional' && (
              <div className="space-y-2">
                <Label>Scopes</Label>
                <div className="flex gap-2 mb-2">
                  <Button
                    variant={config.commit.scopes === 'auto' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => config.updateCommit({ scopes: 'auto' })}
                  >
                    Auto-detect
                  </Button>
                  <Button
                    variant={config.commit.scopes === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => config.updateCommit({ scopes: false })}
                  >
                    Disabled
                  </Button>
                  <Button
                    variant={Array.isArray(config.commit.scopes) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (customScopes.trim()) {
                        handleSaveScopes()
                      }
                    }}
                  >
                    Custom
                  </Button>
                </div>
                {Array.isArray(config.commit.scopes) && (
                  <div className="space-y-2">
                    <Input
                      placeholder="web, api, docs (comma-separated)"
                      value={customScopes}
                      onChange={(e) => setCustomScopes(e.target.value)}
                      onBlur={handleSaveScopes}
                    />
                    <div className="flex flex-wrap gap-2">
                      {config.commit.scopes.map((scope) => (
                        <Badge key={scope} variant="secondary">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Max Length */}
            <div className="space-y-2">
              <Label>Max Commit Message Length</Label>
              <Input
                type="number"
                min={50}
                max={200}
                value={config.commit.maxLength}
                onChange={(e) =>
                  config.updateCommit({ maxLength: parseInt(e.target.value) || 100 })
                }
              />
              <p className="text-xs text-muted-foreground">
                Current: {config.commit.maxLength} characters
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Git Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Git Settings
            </CardTitle>
            <CardDescription>Configure branch protection and prompts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Branch Prompt */}
            <div className="space-y-2">
              <Label>Prompt for Branch Name</Label>
              <Select
                value={config.git.promptForBranch}
                onValueChange={(value: 'always' | 'protected' | 'never') =>
                  config.updateGit({ promptForBranch: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Always</SelectItem>
                  <SelectItem value="protected">Only for protected branches</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Protected Branches */}
            <div className="space-y-2">
              <Label>Protected Branches</Label>
              <Input
                placeholder="main, master, develop (comma-separated)"
                value={protectedBranches}
                onChange={(e) => setProtectedBranches(e.target.value)}
                onBlur={handleSaveProtectedBranches}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {config.git.protectedBranches.map((branch) => (
                  <Badge key={branch} variant="secondary">
                    {branch}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PR Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Pull Request Settings
            </CardTitle>
            <CardDescription>Configure default PR settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Base Branch */}
            <div className="space-y-2">
              <Label>Default Base Branch</Label>
              <Input
                placeholder="auto, main, develop, etc."
                value={config.pr.base}
                onChange={(e) => config.updatePr({ base: e.target.value || 'auto' })}
              />
              <p className="text-xs text-muted-foreground">
                Use &quot;auto&quot; to detect automatically
              </p>
            </div>

            {/* Draft PR */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Create as Draft by Default</Label>
                <p className="text-xs text-muted-foreground">PRs will be created as drafts</p>
              </div>
              <Switch
                checked={config.pr.draft}
                onCheckedChange={(checked) => config.updatePr({ draft: checked })}
              />
            </div>

            {/* Use Template */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Use PR Template</Label>
                <p className="text-xs text-muted-foreground">
                  Auto-fill from .github/pull_request_template.md
                </p>
              </div>
              <Switch
                checked={config.pr.template}
                onCheckedChange={(checked) => config.updatePr({ template: checked })}
              />
            </div>

            {/* Default Labels */}
            <div className="space-y-2">
              <Label>Default Labels</Label>
              <Input
                placeholder="bug, feature, enhancement (comma-separated)"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                onBlur={handleSaveLabels}
              />
              {config.pr.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.pr.labels.map((label) => (
                    <Badge key={label} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Default Reviewers */}
            <div className="space-y-2">
              <Label>Default Reviewers</Label>
              <Input
                placeholder="username1, username2 (comma-separated)"
                value={reviewers}
                onChange={(e) => setReviewers(e.target.value)}
                onBlur={handleSaveReviewers}
              />
              {config.pr.reviewers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.pr.reviewers.map((reviewer) => (
                    <Badge key={reviewer} variant="secondary">
                      @{reviewer}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hooks Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Git Hooks
            </CardTitle>
            <CardDescription>Configure pre-commit and pre-push hooks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lint Hook */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Run Linter</Label>
                <p className="text-xs text-muted-foreground">Run linter before commits</p>
              </div>
              <Switch
                checked={config.hooks.lint !== false}
                onCheckedChange={(checked) => config.updateHooks({ lint: checked })}
              />
            </div>

            {/* Format Hook */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Run Formatter</Label>
                <p className="text-xs text-muted-foreground">Run formatter before commits</p>
              </div>
              <Switch
                checked={config.hooks.format !== false}
                onCheckedChange={(checked) => config.updateHooks({ format: checked })}
              />
            </div>

            {/* Test Hook */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Run Tests</Label>
                <p className="text-xs text-muted-foreground">Run tests before commits</p>
              </div>
              <Switch
                checked={config.hooks.test !== false}
                onCheckedChange={(checked) => config.updateHooks({ test: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Reset all settings to defaults</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => {
                config.resetToDefaults()
                setCustomScopes('')
                setProtectedBranches('main, master, develop, dev')
                setLabels('')
                setReviewers('')
                toast.success('Settings reset to defaults')
              }}
            >
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
