'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import ReportHeader from '@/components/ReportHeader'
import ReportTOC from '@/components/ReportTOC'
import ReportSection from '@/components/ReportSection'
import SourcesList from '@/components/SourcesList'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useReport } from '@/hooks/useReport'
import { useResearchHistory } from '@/hooks/useResearchHistory'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const router = useRouter()
  const { userName, logout } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const { report, isLoading, error } = useReport(sessionId || '')
  const { history } = useResearchHistory()

  useEffect(() => {
    params.then((p) => setSessionId(p.sessionId))
  }, [params])

  useEffect(() => {
    if (sessionId && history.length > 0) {
      const session = history.find((s) => s.sessionId === sessionId)
      if (session) {
        setQuery(session.query)
      }
    }
  }, [sessionId, history])

  if (!sessionId) {
    return null
  }

  return (
    <>
      <Header userName={userName} onLogout={logout} />
      <main className="min-h-screen bg-background">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </motion.div>

          {isLoading && !report && (
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>

              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 p-6 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <div>
                <p className="text-lg font-semibold text-destructive">
                  Failed to load report
                </p>
                <p className="text-sm text-destructive/80 mt-2">
                  {error}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                Go Home
              </Button>
            </motion.div>
          )}

          {report && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <ReportHeader query={query} sections={report.sections} />

                <div className="space-y-12">
                  {report.sections.map((section, idx) => (
                    <ReportSection
                      key={idx}
                      section={section}
                      sectionIndex={idx}
                    />
                  ))}
                </div>

                {report.sections.length > 0 && (
                  <SourcesList
                    sources={report.sections.flatMap((s) => s.sources)}
                  />
                )}
              </div>

              {report.sections.length > 0 && (
                <div className="lg:col-span-1">
                  <ReportTOC sections={report.sections} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}