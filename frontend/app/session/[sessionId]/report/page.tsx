'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ReportView } from '@/components/report-view'
import { SessionSidebar } from '@/components/session-sidebar'

export interface ReportSection {
  heading: string
  content: string
  confidence: 'high' | 'medium' | 'low'
  sources: Array<{
    id: number
    title: string
    url: string
    snippet: string
  }>
}

export interface ReportData {
  sections: ReportSection[]
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()
  const [report, setReport] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          throw new Error('API URL not configured')
        }

        const response = await fetch(
          `${apiUrl}/api/research/${sessionId}/report`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch report: ${response.statusText}`)
        }

        const data = await response.json()
        setReport(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load report'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full p-6 rounded-lg bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2">
            {error ? 'Error' : 'No Report'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || 'No report data available'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-accent text-background font-medium hover:bg-accent/90 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <SessionSidebar sessionId={sessionId} />
      <ReportView report={report} />
    </div>
  )
}
