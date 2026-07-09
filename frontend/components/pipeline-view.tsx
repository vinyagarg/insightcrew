'use client'

import { Stage } from '@/hooks/use-session-status'
import { StageCard } from './stage-card'
import { motion } from 'framer-motion'

interface PipelineViewProps {
  stages: Stage[]
  status: 'running' | 'done' | 'error'
  error: string | null
  isPolling: boolean
}

const STAGE_NAMES: Record<string, string> = {
  planner: 'Planner',
  retriever: 'Retriever',
  analyst: 'Analyst',
  critic: 'Critic',
}

export function PipelineView({
  stages,
  status,
  error,
  isPolling,
}: PipelineViewProps) {
  // Ensure we have all 4 stages
  const allStages = ['planner', 'retriever', 'analyst', 'critic'].map((name) => {
    return (
      stages.find((s) => s.name === name) || {
        name: name as 'planner' | 'retriever' | 'analyst' | 'critic',
        status: 'waiting' as const,
        output: null,
      }
    )
  })

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Research in Progress
        </h1>
        <p className="text-muted-foreground">
          {status === 'done' ? 'Research complete' : 'Processing your query...'}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Pipeline Timeline */}
      <div className="space-y-4">
        {allStages.map((stage, index) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StageCard stage={stage} index={index} total={allStages.length} />
          </motion.div>
        ))}
      </div>

      {/* Status indicator */}
      <div className="mt-12 text-center">
        {isPolling ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">
              {status === 'running'
                ? 'Processing...'
                : status === 'error'
                  ? 'Error occurred'
                  : 'Completed'}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            {status === 'error' ? 'Research failed' : 'Research completed'}
          </span>
        )}
      </div>
    </div>
  )
}
