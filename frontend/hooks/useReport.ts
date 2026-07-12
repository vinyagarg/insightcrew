import { useEffect, useState } from 'react'
import { API_URL, API_HEADERS } from '@/lib/constants'

export interface Citation {
  id: number
  title: string
  url: string
  snippet: string
}

export interface ReportSection {
  heading: string
  content: string
  confidence: 'high' | 'medium' | 'low'
  sources: Citation[]
}

export interface Report {
  sections: ReportSection[]
}

export function useReport(sessionId: string) {
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/api/research/${sessionId}/report`, {
          method: 'GET',
          headers: API_HEADERS,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch report: ${response.statusText}`)
        }

        const data = await response.json()
        setReport(data)
        setError(null)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load report'
        setError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      fetchReport()
    }
  }, [sessionId])

  return {
    report,
    isLoading,
    error,
  }
}
