'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { API_URL } from '@/lib/constants'
import { useResearchHistory } from '@/hooks/useResearchHistory'

interface SearchBarProps {
  externalQuery?: string
}

export default function SearchBar({ externalQuery }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addSession } = useResearchHistory()

  useEffect(() => {
    if (externalQuery) {
      setQuery(externalQuery)
    }
  }, [externalQuery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to start research')
      }

      const data = await response.json()
      const sessionId = data.session_id

      addSession(sessionId, query.trim())
      router.push(`/session/${sessionId}`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start research'
      setError(errorMsg)
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="What do you want researched today?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="text-base h-12"
            autoFocus
          />
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? 'Starting...' : 'Research'}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </form>
    </motion.div>
  )
}
