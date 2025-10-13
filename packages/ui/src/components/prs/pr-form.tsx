'use client'

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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { GitPullRequest, Loader2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import * as React from 'react'
import { useBranches, useRepository } from '@/hooks/queries/use-github-queries'
import { useCreatePullRequest } from '@/hooks/mutations/use-github-mutations'
import { useRepoInfo } from '@/hooks/queries/use-git-queries'
import { Alert, AlertDescription } from '@/components/ui/alert'
const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  baseBranch: z.string({
    required_error: 'Please select a base branch',
  }),
  headBranch: z.string({
    required_error: 'Please select a head branch',
  }),
  draft: z.boolean(),
})

export function PRForm() {
  // Fetch data
  const { data: branches, isLoading: branchesLoading, error: branchesError } = useBranches()
  const { data: repo, isLoading: repoLoading } = useRepository()
  const { data: repoInfo } = useRepoInfo()
  const createPR = useCreatePullRequest()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      baseBranch: repo?.defaultBranch || 'main',
      headBranch: repoInfo?.branch || '',
      draft: false,
    },
  })

  // Update default values when data loads
  React.useEffect(() => {
    if (repo?.defaultBranch && !form.getValues('baseBranch')) {
      form.setValue('baseBranch', repo.defaultBranch)
    }
    if (repoInfo?.branch && !form.getValues('headBranch')) {
      form.setValue('headBranch', repoInfo.branch)
    }
  }, [repo, repoInfo, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const pr = await createPR.mutateAsync({
        title: values.title,
        body: values.description,
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
                <AlertDescription>
                  Failed to load branches. Please check your GitHub authentication in settings.
                </AlertDescription>
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
                        <SelectTrigger>
                          <SelectValue placeholder={branchesLoading ? "Loading..." : "Select base branch"} />
                        </SelectTrigger>
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
                        <SelectTrigger>
                          <SelectValue placeholder={branchesLoading ? "Loading..." : "Select head branch"} />
                        </SelectTrigger>
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

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of changes..."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Supports Markdown formatting</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
