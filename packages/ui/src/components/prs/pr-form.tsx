'use client'

import { PRDescriptionEditor } from '@/components/prs/pr-description-editor'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCreatePullRequest } from '@/hooks/mutations/use-github-mutations'
import { useRepoInfo } from '@/hooks/queries/use-git-queries'
import { useBranches, useRepository } from '@/hooks/queries/use-github-queries'
import { useConfigStore } from '@/store/config-store'
import { AlertCircle, GitPullRequest, Loader2 } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  baseBranch: z.string({
    required_error: 'Please select a base branch',
  }),
  headBranch: z.string({
    required_error: 'Please select a head branch',
  }),
  changeTypes: z.array(z.string()).min(1, 'Select at least one type of change'),
  draft: z.boolean(),
  labels: z.array(z.string()).optional(),
  reviewers: z.array(z.string()).optional(),
})

const CHANGE_TYPES = [
  { value: 'bugfix', label: 'Bug fix' },
  { value: 'feature', label: 'New feature' },
  { value: 'breaking', label: 'Breaking change' },
  { value: 'docs', label: 'Documentation' },
  { value: 'refactor', label: 'Code refactoring' },
  { value: 'perf', label: 'Performance improvement' },
] as const

interface PRFormProps {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>
}

export function PRForm({ form }: PRFormProps) {
  // Fetch data
  const { data: branches, isLoading: branchesLoading, error: branchesError } = useBranches()
  const { data: repo, isLoading: repoLoading } = useRepository()
  const { data: repoInfo } = useRepoInfo()
  const createPR = useCreatePullRequest()
  const config = useConfigStore()

  // Set defaults when data loads (only once)
  const defaultsSet = React.useRef(false)
  if (!defaultsSet.current && repo?.defaultBranch && repoInfo?.branch) {
    // Use config for base branch (auto = repo default)
    const baseBranch = config.pr.base === 'auto' ? repo.defaultBranch : config.pr.base
    form.setValue('baseBranch', baseBranch)
    form.setValue('headBranch', repoInfo.branch)
    form.setValue('draft', config.pr.draft)
    form.setValue('labels', config.pr.labels)
    form.setValue('reviewers', config.pr.reviewers)
    defaultsSet.current = true
  }

  // Build PR body with proper format
  function buildPRBody(values: z.infer<typeof formSchema>): string {
    let body = '## Description\n\n'
    body += values.description || 'This PR includes the following changes:\n'
    body += '\n\n## Type of Change\n\n'

    // Add change type checkboxes
    CHANGE_TYPES.forEach((type) => {
      const checked = values.changeTypes.includes(type.value) ? 'x' : ' '
      body += `- [${checked}] ${type.label}\n`
    })

    return body
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const prBody = buildPRBody(values)

      const pr = await createPR.mutateAsync({
        title: values.title,
        body: prBody,
        head: values.headBranch,
        base: values.baseBranch,
        draft: values.draft,
      })

      if (pr) {
        toast.success('Pull request created successfully!', {
          description: `PR #${pr.number}: ${values.title}`,
          action: {
            label: 'View PR',
            onClick: () => window.open(pr.html_url, '_blank'),
          },
        })
        form.reset()
      }
    } catch (error) {
      toast.error('Failed to create pull request', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const isLoading = branchesLoading || repoLoading || createPR.isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5" />
          PR Details
        </CardTitle>
        <CardDescription>Fill in the details for your pull request</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {branchesError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  Failed to load branches. Please check your GitHub authentication in settings.
                </AlertTitle>
              </Alert>
            )}

            {/* Branch Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="baseBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Branch *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SelectTrigger className="max-w-[250px]">
                                <SelectValue
                                  placeholder={
                                    branchesLoading ? 'Loading...' : 'Select base branch'
                                  }
                                />
                              </SelectTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{field.value || 'Select base branch'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormControl>
                      <SelectContent>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.name} value={branch.name}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Branch to merge into</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Head Branch *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SelectTrigger className="max-w-[250px]">
                                <SelectValue
                                  placeholder={
                                    branchesLoading ? 'Loading...' : 'Select head branch'
                                  }
                                />
                              </SelectTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{field.value || 'Select head branch'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormControl>
                      <SelectContent>
                        {branches?.map((branch) => (
                          <SelectItem key={branch.name} value={branch.name}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Branch with changes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of changes" {...field} />
                  </FormControl>
                  <FormDescription>{field.value?.length || 0}/200 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field - Rich Editor */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <PRDescriptionEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Detailed description of changes..."
                    />
                  </FormControl>
                  <FormDescription>
                    Use markdown formatting to describe your changes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Change Types */}
            <FormField
              control={form.control}
              name="changeTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Type of Change *</FormLabel>
                    <FormDescription>Select all that apply</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {CHANGE_TYPES.map((type) => (
                      <FormField
                        key={type.value}
                        control={form.control}
                        name="changeTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={type.value}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, type.value])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== type.value)
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {type.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Labels Field */}
            {config.pr.labels.length > 0 && (
              <FormField
                control={form.control}
                name="labels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Labels (from config)</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {config.pr.labels.map((label) => (
                        <Badge key={label} variant="secondary">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>Default labels from your settings</FormDescription>
                  </FormItem>
                )}
              />
            )}

            {/* Reviewers Field */}
            {config.pr.reviewers.length > 0 && (
              <FormField
                control={form.control}
                name="reviewers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reviewers (from config)</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {config.pr.reviewers.map((reviewer) => (
                        <Badge key={reviewer} variant="outline">
                          @{reviewer}
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>Default reviewers from your settings</FormDescription>
                  </FormItem>
                )}
              />
            )}

            {/* Draft Checkbox */}
            <FormField
              control={form.control}
              name="draft"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-normal">Create as draft</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex gap-2 mt-3">
            <Button type="button" variant="outline" className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
              {createPR.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <GitPullRequest className="h-4 w-4" />
                  Create Pull Request
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
