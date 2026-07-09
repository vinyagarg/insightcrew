'use client'

import { useEffect, useState, use } from 'react'

interface Section {
  heading: string
  content: string
  confidence: string
  sources: { id: number; title: string; url: string; snippet: string }[]
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${apiUrl}/api/research/${sessionId}/report`)
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
    return <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading report...</div>
  }

  if (error) {
    return <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'red', padding: '2rem' }}>Error: {error}</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Research Report</h1>
      {sections.length === 0 && <p>No sections found.</p>}
      {sections.map((section, idx) => (
        <div key={idx} style={{ background: '#151b2e', padding: '1.5rem', marginBottom: '1rem', borderRadius: '8px', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{section.heading}</h2>
          <p style={{ color: '#ccc', lineHeight: '1.6' }}>{section.content}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>Confidence: {section.confidence}</p>
        </div>
      ))}
    </div>
  )
}