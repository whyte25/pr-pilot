'use client'

import { motion } from 'framer-motion'
import { TrendingUp, FileCode, GitCommit, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    label: 'Files Analyzed',
    value: '4',
    icon: FileCode,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Lines Changed',
    value: '+351 -20',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Commit Type',
    value: 'feat',
    icon: GitCommit,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    label: 'Analysis Time',
    value: '2.3s',
    icon: Clock,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
]

export function AnalysisStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 md:grid-cols-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
