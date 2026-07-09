'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'
import { Logo } from '@/components/logo'

const EXAMPLE_QUERIES = [
  'Latest AI breakthroughs in 2024',
  'How to build scalable microservices',
  'Emerging trends in quantum computing',
  'Best practices for system design',
]

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error('API URL not configured')
      }

      const response = await fetch(`${apiUrl}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API response:', data)

      const sessionId = data.session_id

      if (!sessionId) {
        throw new Error('No session ID returned from API. Response was: ' + JSON.stringify(data))
      }

      router.push(`/session/${sessionId}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start research'
      console.error('Search error:', err)
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <Logo />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            InsightCrew
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Multi-agent AI research assistant. Ask anything, get comprehensive insights.
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm">
            {error}
          </div>
        )}

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center">
            Try these searches
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXAMPLE_QUERIES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(query)}
                disabled={isLoading}
                className="p-4 rounded-lg bg-card border border-border hover:border-accent/50 text-left text-sm text-foreground transition-all hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {query}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
