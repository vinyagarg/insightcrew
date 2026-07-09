'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  userName: string | null
  onLogout: () => void
}

export default function Header({ userName, onLogout }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    onLogout()
    router.push('/welcome')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-display font-bold text-accent">
            InsightCrew
          </div>
        </div>

        {userName && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {userName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
