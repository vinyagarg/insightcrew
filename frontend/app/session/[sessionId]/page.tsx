'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'

interface Stage {
  name: string
  status: string
  output: unknown
}

export default function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()
  const [stages, setStages] = useState<Stage[]>([])
  const [status, setStatus] = useState('running')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let intervalId: ReturnType<typeof setInterval>

    const poll = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${apiUrl}/api/research/${sessionId}/status`)
        const data = await res.json()

        if (!isMounted) return

        setStatus(data.status)
        setStages(data.stages || [])

        if (data.status === 'done') {
          clearInterval(intervalId)
          setTimeout(() => {
            if (isMounted) router.push(`/session/${sessionId}/report`)
          }, 500)
        } else if (data.status === 'error') {
          clearInterval(intervalId)
          setError('Research failed on the server.')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch status')
        }
      }
    }

    poll()
    intervalId = setInterval(poll, 2000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [sessionId, router])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }}>Research in Progress</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem' }}>Session: {sessionId}</p>

      {error && (
        <div style={{ background: '#3a1a1a', border: '1px solid #a33', padding: '1rem', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        {stages.length === 0 && !error && <p style={{ textAlign: 'center' }}>Connecting to backend...</p>}
        {stages.map((stage) => (
          <div key={stage.name} style={{ background: '#151b2e', padding: '1rem', marginBottom: '0.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ textTransform: 'capitalize' }}>{stage.name}</span>
            <span style={{ color: '#888' }}>{stage.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
