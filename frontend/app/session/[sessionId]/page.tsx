'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import PipelineTimeline from '@/components/PipelineTimeline'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { usePolling } from '@/hooks/usePolling'
import { ArrowLeft } from 'lucide-react'

export default function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const router = useRouter()
  const { userName, logout } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { pipelineData, isLoading, error, retry } = usePolling(sessionId || '', !!sessionId)

  // Resolve params
  useEffect(() => {
    params.then((p) => setSessionId(p.sessionId))
  }, [params])

  // Auto-navigate on completion
  useEffect(() => {
    if (pipelineData?.status === 'done') {
      const timer = setTimeout(
        () => router.push(`/session/${sessionId}/report`),
        500
      )
      return () => clearTimeout(timer)
    }
  }, [pipelineData?.status, sessionId, router])

  if (!sessionId) {
    return null
  }

  return (
    <>
      <Header userName={userName} onLogout={logout} />
      <main className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="mb-8"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              Researching...
            </h1>
            <p className="text-muted-foreground">
              Our AI team is gathering and analyzing information for your query.
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && !pipelineData && (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-3"
                >
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-16 w-full" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pipeline Timeline */}
          {pipelineData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PipelineTimeline
                stages={pipelineData.stages}
                error={error}
                onRetry={retry}
              />
            </motion.div>
          )}

          {/* Error State */}
          {!isLoading && !pipelineData && error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 p-6 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <div>
                <p className="text-lg font-semibold text-destructive">
                  Failed to start research
                </p>
                <p className="text-sm text-destructive/80 mt-2">
                  {error}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Go Home
                </Button>
                <Button onClick={retry}>
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
