import { AppShell } from '@/components/layout/app-shell'
import { WelcomeHero } from '@/components/dashboard/welcome-hero'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RepoStatus } from '@/components/dashboard/repo-status'
import { RecentActivity } from '@/components/dashboard/recent-activity'

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-8">
        {/* Hero Section */}
        <WelcomeHero />

        {/* Quick Actions - Primary CTAs */}
        <QuickActions />

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Repository Status */}
          <RepoStatus />

          {/* Right: Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </AppShell>
  )
}
