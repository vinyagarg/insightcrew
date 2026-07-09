'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useResearchHistory } from '@/hooks/useResearchHistory'
import { formatTime } from '@/lib/utils'

export default function ResearchHistory() {
  const router = useRouter()
  const { history, isLoading } = useResearchHistory()

  if (isLoading) {
    return null
  }

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-2 py-12"
      >
        <p className="text-sm text-muted-foreground">No research yet.</p>
        <p className="text-xs text-muted-foreground">
          Start by asking a question above.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="space-y-4"
    >
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          Recent Research
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {history.map((session, idx) => (
            <motion.div
              key={session.sessionId}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className="p-4 cursor-pointer hover:border-accent/50 transition-colors"
                onClick={() => router.push(`/session/${session.sessionId}/report`)}
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium line-clamp-2 text-foreground">
                    {session.query}
                  </p>
                  <Badge variant="muted" className="text-xs">
                    {formatTime(new Date(session.timestamp))}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
