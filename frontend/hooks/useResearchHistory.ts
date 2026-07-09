import { useEffect, useState } from 'react'
import { STORAGE_KEYS } from '@/lib/constants'

export interface ResearchSession {
  sessionId: string
  query: string
  timestamp: number
}

export function useResearchHistory() {
  const [history, setHistory] = useState<ResearchSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.RESEARCH_HISTORY)
      if (saved) {
        try {
          setHistory(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to parse research history:', e)
          setHistory([])
        }
      }
      setIsLoading(false)
    }
  }, [])

  const addSession = (sessionId: string, query: string) => {
    const newSession: ResearchSession = {
      sessionId,
      query,
      timestamp: Date.now(),
    }
    const updated = [newSession, ...history].slice(0, 20) // Keep last 20
    setHistory(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RESEARCH_HISTORY, JSON.stringify(updated))
    }
  }

  const clearHistory = () => {
    setHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.RESEARCH_HISTORY)
    }
  }

  return {
    history,
    isLoading,
    addSession,
    clearHistory,
  }
}
