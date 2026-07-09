'use client'

import { Stage } from '@/hooks/use-session-status'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, RotateCw } from 'lucide-react'
import { useState } from 'react'

interface StageCardProps {
  stage: Stage
  index: number
  total: number
}

const STAGE_ICONS: Record<string, string> = {
  planner: '📋',
  retriever: '🔍',
  analyst: '📊',
  critic: '✓',
}

const STATUS_COLORS: Record<string, string> = {
  waiting: 'bg-muted/30 border-muted/50',
  in_progress: 'bg-accent/10 border-accent/50',
  revising: 'bg-accent/10 border-accent/50',
  done: 'bg-card border-border',
}

const STATUS_LABELS: Record<string, string> = {
  waiting: 'Waiting',
  in_progress: 'Processing',
  revising: 'Revising',
  done: 'Complete',
}

function StatusIndicator({ status }: { status: Stage['status'] }) {
  if (status === 'in_progress' || status === 'revising') {
    return (
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-accent pulse-glow" />
        <span className="text-xs font-mono text-accent">
          {STATUS_LABELS[status]}
        </span>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-mono text-green-400">
          {STATUS_LABELS[status]}
        </span>
      </div>
    )
  }

  return (
    <span className="text-xs font-mono text-muted-foreground">
      {STATUS_LABELS[status]}
    </span>
  )
}

export function StageCard({ stage, index, total }: StageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasOutput = stage.output !== null && stage.status === 'done'
  const isRevising = stage.status === 'revising'

  return (
    <div className="relative">
      {/* Vertical connector line */}
      {index < total - 1 && (
        <div className="absolute left-5 top-full h-4 w-0.5 bg-gradient-to-b from-border to-transparent translate-y-0" />
      )}

      {/* Card */}
      <motion.div
        className={`relative rounded-lg border p-4 transition-all ${STATUS_COLORS[stage.status]}`}
        animate={{
          boxShadow:
            stage.status === 'in_progress' || stage.status === 'revising'
              ? '0 0 20px rgba(245, 158, 11, 0.2)'
              : 'none',
        }}
      >
        {/* Revising animation */}
        {isRevising && (
          <motion.div
            className="absolute -top-4 right-4 flex items-center gap-1 text-xs text-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <RotateCw size={12} />
            <span>Revising</span>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-xl">{STAGE_ICONS[stage.name]}</div>
            <div className="flex-1">
              <h3 className="font-mono font-medium text-foreground capitalize">
                {stage.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Stage {index + 1} of {total}
              </p>
            </div>
          </div>
          <StatusIndicator status={stage.status} />
        </div>

        {/* Output section */}
        {hasOutput && (
          <>
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
              whileHover={{ x: 2 }}
            >
              <ChevronDown
                size={14}
                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
              View output
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <OutputPreview output={stage.output} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  )
}

function OutputPreview({ output }: { output: unknown }) {
  if (!output) return null

  if (typeof output === 'string') {
    return (
      <p className="text-sm text-foreground bg-background/50 rounded p-2 font-mono text-xs line-clamp-4">
        {output}
      </p>
    )
  }

  if (typeof output === 'object') {
    return (
      <pre className="text-xs text-foreground bg-background/50 rounded p-2 font-mono overflow-auto max-h-48 line-clamp-8">
        {JSON.stringify(output, null, 2)}
      </pre>
    )
  }

  return (
    <p className="text-sm text-foreground bg-background/50 rounded p-2 font-mono text-xs">
      {String(output)}
    </p>
  )
}
