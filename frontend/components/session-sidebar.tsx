'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, ArrowLeft, Trash2 } from 'lucide-react'
import { Logo } from './logo'

interface SessionItem {
  sessionId: string
  query: string
  timestamp: number
}

interface SessionSidebarProps {
  sessionId: string
}

const STORAGE_KEY = 'insight_crew_sessions'

export function SessionSidebar({ sessionId }: SessionSidebarProps) {
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [isOpen, setIsOpen] = useState(true)

  // Load sessions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSessions(JSON.parse(stored))
      } catch (err) {
        console.error('Failed to parse sessions:', err)
      }
    }
  }, [])

  // Add new session to history when mounted
  useEffect(() => {
    if (!sessionId) return

    setSessions((prev) => {
      // Check if session already exists
      const exists = prev.some((s) => s.sessionId === sessionId)
      if (exists) return prev

      const newSession: SessionItem = {
        sessionId,
        query: 'Current Research',
        timestamp: Date.now(),
      }

      const updated = [newSession, ...prev].slice(0, 10) // Keep last 10
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [sessionId])

  const handleNewSearch = () => {
    router.push('/')
  }

  const handleSelectSession = (id: string) => {
    router.push(`/session/${id}/report`)
  }

  const handleClearHistory = () => {
    setSessions([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleDeleteSession = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation()
    setSessions((prev) => {
      const updated = prev.filter((s) => s.sessionId !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-card border border-border text-foreground hover:bg-secondary transition-colors"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-40 md:static md:translate-x-0 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <Logo />
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <button
            onClick={handleNewSearch}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-background font-medium hover:bg-accent/90 transition-colors"
          >
            <Plus size={16} />
            New Search
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length > 0 ? (
            <div className="p-4 space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground px-2 mb-3">
                Recent Sessions
              </p>
              {sessions.map((session) => (
                <motion.button
                  key={session.sessionId}
                  onClick={() => handleSelectSession(session.sessionId)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-3 rounded-lg border transition-all group ${
                    session.sessionId === sessionId
                      ? 'bg-accent/10 border-accent/50'
                      : 'bg-background border-border hover:bg-secondary hover:border-border/80'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.query}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </p>
                  <button
                    onClick={(e) => handleDeleteSession(e, session.sessionId)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p className="text-sm">No sessions yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="p-4 border-t border-border flex-shrink-0">
            <button
              onClick={handleClearHistory}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear history
            </button>
          </div>
        )}
      </motion.aside>
    </>
  )
}
