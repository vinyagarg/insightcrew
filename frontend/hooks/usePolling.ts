import { useCallback, useEffect, useRef, useState } from 'react'
import { API_URL, POLLING_INTERVAL, POLLING_TIMEOUT } from '@/lib/constants'

export interface PipelineStage {
  name: 'planner' | 'retriever' | 'analyst' | 'critic'
  status: 'waiting' | 'in_progress' | 'revising' | 'done'
  output: Record<string, any> | null
}

export interface PipelineStatus {
  status: 'running' | 'done' | 'error'
  stages: PipelineStage[]
  error?: string
}

export function usePolling(sessionId: string, enabled: boolean = true) {
  const [pipelineData, setPipelineData] = useState<PipelineStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const poll = useCallback(async () => {
    try {
      const elapsed = Date.now() - startTimeRef.current
      if (elapsed > POLLING_TIMEOUT) {
        setError('Research taking longer than expected. Please try again.')
        return
      }

      const response = await fetch(`${API_URL}/api/research/${sessionId}/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      setPipelineData(data)
      setError(null)

      // Stop polling if done or error
      if (data.status === 'done' || data.status === 'error') {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch status'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (!enabled || !sessionId) return

    startTimeRef.current = Date.now()
    
    // Initial poll
    poll()

    // Set up interval
    intervalRef.current = setInterval(poll, POLLING_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [sessionId, enabled, poll])

  const retry = useCallback(() => {
    setError(null)
    setIsLoading(true)
    startTimeRef.current = Date.now()
    poll()
  }, [poll])

  return {
    pipelineData,
    isLoading,
    error,
    retry,
  }
}
