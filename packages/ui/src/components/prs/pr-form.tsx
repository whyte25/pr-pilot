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
import { GitPullRequest } from 'lucide-react'
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
  draft: z.boolean(),
})

const mockBranches = [
  { value: 'main', label: 'main' },
  { value: 'develop', label: 'develop' },
  { value: 'feature/new-ui', label: 'feature/new-ui' },
  { value: 'fix/bug-123', label: 'fix/bug-123' },
]

export function PRForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      baseBranch: 'main',
      headBranch: '',
      draft: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success('Pull request created successfully!', {
      description: values.title,
    })
    console.log(values)
  }

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
            {/* Branch Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="baseBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Branch *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select base branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockBranches.map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.label}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select head branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockBranches.map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.label}
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
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <GitPullRequest className="h-4 w-4" />
              Create Pull Request
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
