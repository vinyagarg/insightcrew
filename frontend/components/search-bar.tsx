'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      setQuery('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          placeholder="What do you want researched?"
          className="w-full px-6 py-4 pr-14 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-3 p-2 text-accent hover:text-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Search"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  )
}
