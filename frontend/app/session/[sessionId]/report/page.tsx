'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL, API_HEADERS } from '@/lib/constants'
import ReportHeader from '@/components/ReportHeader'
import ReportSection from '@/components/ReportSection'
import ReportTOC from '@/components/ReportTOC'
import SourcesList from '@/components/SourcesList'

export interface Section {
  heading: string
  content: string
  confidence: 'high' | 'medium' | 'low'
  sources: { id: number; title: string; url: string; snippet: string }[]
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API_URL}/api/research/${sessionId}/report`, {
          headers: API_HEADERS,
        })
        const data = await res.json()
        setSections(data.sections || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [sessionId])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading report...
      </div>
    )
  }

  if (error || sections.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white', padding: '2rem' }}>
        <p style={{ color: error ? 'red' : '#888', marginBottom: '1rem' }}>
          {error || 'This report is no longer available. It may have expired after a server restart — please start a new search.'}
        </p>
        <button
          onClick={() => router.push('/')}
          style={{ background: '#333', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          Start New Research
        </button>
      </div>
    )
  }

  const query = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('insightcrew_research_history') || '[]')
        .find((s: { sessionId: string }) => s.sessionId === sessionId)?.query || ''
    : ''

  const allSources = sections.flatMap((s) => s.sources)

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ReportHeader query={query} sections={sections} />
        <div className="flex gap-8 mt-8">
          <div className="flex-1 space-y-12 min-w-0">
            {sections.map((section, idx) => (
              <ReportSection key={idx} section={section} sectionIndex={idx} />
            ))}
            <SourcesList sources={allSources} />
          </div>
          <div className="hidden lg:block w-64 shrink-0">
            <ReportTOC sections={sections} />
          </div>
        </div>
      </div>
    </div>
  )
}