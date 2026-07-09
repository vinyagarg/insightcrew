import { useEffect, useState, useCallback } from 'react'

export interface Stage {
  name: 'planner' | 'retriever' | 'analyst' | 'critic'
  status: 'waiting' | 'in_progress' | 'revising' | 'done'
  output: unknown
}

export interface SessionStatus {
  status: 'running' | 'done' | 'error'
  stages: Stage[]
}

export function useSessionStatus(sessionId: string) {
  const [status, setStatus] = useState<'running' | 'done' | 'error'>('running')
  const [stages, setStages] = useState<Stage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  const fetchStatus = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error('API URL not configured')
      }

      const response = await fetch(`${apiUrl}/api/research/${sessionId}/status`)

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`)
      }

      const data: SessionStatus = await response.json()
      setStatus(data.status)
      setStages(data.stages || [])

      if (data.status !== 'running') {
        setIsPolling(false)
      }

      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch status'
      setError(message)
      setIsPolling(false)
    }
  }, [sessionId])

  useEffect(() => {
    // Fetch immediately on mount
    fetchStatus()

    // Set up polling interval
    if (!isPolling) return

    const interval = setInterval(fetchStatus, 2000)

    return () => clearInterval(interval)
  }, [fetchStatus, isPolling])

  return {
    status,
    stages,
    error,
    isPolling,
  }
}
