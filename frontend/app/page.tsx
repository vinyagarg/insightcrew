'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { PipelineView } from '@/components/pipeline-view'
import { useSessionStatus } from '@/hooks/use-session-status'

export default function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()
  const { status, stages, error, isPolling } = useSessionStatus(sessionId)
  const [navigationError, setNavigationError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'done') {
      const timer = setTimeout(() => {
        router.push(`/session/${sessionId}/report`)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [status, sessionId, router])

  if (navigationError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full p-6 rounded-lg bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2">Error</h2>
          <p className="text-muted-foreground">{navigationError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <PipelineView stages={stages} status={status} error={error} isPolling={isPolling} />
    </div>
  )
}
