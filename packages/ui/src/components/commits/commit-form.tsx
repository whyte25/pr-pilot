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
import { Textarea } from '@/components/ui/textarea'
import { useCreateCommit } from '@/hooks/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { GitCommit, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const commitTypes = [
  { value: 'feat', label: 'feat', description: 'New feature', color: 'bg-blue-500' },
  { value: 'fix', label: 'fix', description: 'Bug fix', color: 'bg-red-500' },
  { value: 'docs', label: 'docs', description: 'Documentation', color: 'bg-purple-500' },
  { value: 'style', label: 'style', description: 'Code style', color: 'bg-pink-500' },
  { value: 'refactor', label: 'refactor', description: 'Refactoring', color: 'bg-yellow-500' },
  { value: 'perf', label: 'perf', description: 'Performance', color: 'bg-orange-500' },
  { value: 'test', label: 'test', description: 'Testing', color: 'bg-green-500' },
  { value: 'chore', label: 'chore', description: 'Maintenance', color: 'bg-gray-500' },
]

const formSchema = z.object({
  type: z.string({
    required_error: 'Please select a commit type',
  }),
  scope: z.string().optional(),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(100, 'Message must be less than 100 characters'),
  body: z.string().optional(),
  breaking: z.boolean(),
})

interface CommitFormProps {
  selectedFiles?: string[]
}

export function CommitForm({ selectedFiles = [] }: CommitFormProps) {
  const router = useRouter()
  const createCommit = useCreateCommit()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'feat',
      scope: '',
      message: '',
      body: '',
      breaking: false,
    },
  })

  const watchedValues = form.watch()
  const commitMessage = `${watchedValues.type}${watchedValues.scope ? `(${watchedValues.scope})` : ''}${watchedValues.breaking ? '!' : ''}: ${watchedValues.message || ''}`

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedFiles.length === 0) {
      toast.error('No files selected', {
        description: 'Please select at least one file to commit',
      })
      return
    }

    const fullMessage = `${values.type}${values.scope ? `(${values.scope})` : ''}${values.breaking ? '!' : ''}: ${values.message}`
    const bodyText = values.body || ''

    createCommit.mutate(
      {
        message: bodyText ? `${fullMessage}\n\n${bodyText}` : fullMessage,
        files: selectedFiles,
      },
      {
        onSuccess: () => {
          toast.success('Commit created successfully!', {
            description: commitMessage,
          })
          form.reset()
          router.push('/commits')
        },
        onError: (error) => {
          toast.error('Failed to create commit', {
            description: error.message,
          })
        },
      }
    )
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommit className="h-5 w-5" />
          Commit Details
        </CardTitle>
        <CardDescription>Follow conventional commits format</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Type Field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {commitTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${t.color}`} />
                            <span className="font-mono font-semibold">{t.label}</span>
                            <span className="text-muted-foreground">- {t.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scope Field */}
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scope (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., api, ui, auth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of changes" {...field} />
                  </FormControl>
                  <FormDescription>{field.value?.length || 0}/100 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Body Field */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of changes..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Breaking Change Field */}
            <FormField
              control={form.control}
              name="breaking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-normal">Breaking change</FormLabel>
                  {field.value && (
                    <Badge variant="destructive" className="gap-1 ml-auto">
                      <Zap className="h-3 w-3" />
                      Breaking
                    </Badge>
                  )}
                </FormItem>
              )}
            />

            {/* Preview */}
            {watchedValues.message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-muted/50 p-4"
              >
                <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
                <code className="block font-mono text-sm">{commitMessage}</code>
                {watchedValues.body && (
                  <p className="mt-2 text-sm text-muted-foreground">{watchedValues.body}</p>
                )}
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/commits')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={createCommit.isPending || selectedFiles.length === 0}
            >
              {createCommit.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <GitCommit className="h-4 w-4" />
                  </motion.div>
                  Creating...
                </>
              ) : (
                <>
                  <GitCommit className="h-4 w-4" />
                  Create Commit
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
