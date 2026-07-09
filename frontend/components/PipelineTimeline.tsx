'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import StageIcon from '@/components/StageIcon'
import StatusBadge from '@/components/StatusBadge'
import { STAGE_LABELS } from '@/lib/constants'
import type { PipelineStage } from '@/hooks/usePolling'

interface PipelineTimelineProps {
  stages: PipelineStage[]
  error?: string | null
  onRetry?: () => void
}

export default function PipelineTimeline({
  stages,
  error,
  onRetry,
}: PipelineTimelineProps) {
  return (
    <div className="space-y-8">
      {/* Timeline */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 to-accent/20" />

        {/* Stages */}
        <div className="space-y-8">
          {stages.map((stage, idx) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-20"
            >
              {/* Icon */}
              <div className="absolute left-0 top-0">
                <motion.div
                  animate={{
                    scale:
                      stage.status === 'in_progress' ||
                      stage.status === 'revising'
                        ? [1, 1.1, 1]
                        : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <StageIcon
                    stageName={stage.name}
                    status={stage.status}
                    size={28}
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {STAGE_LABELS[stage.name]}
                  </h3>
                  <StatusBadge status={stage.status} />
                </div>

                {stage.output && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-muted-foreground leading-relaxed max-w-md"
                  >
                    {typeof stage.output === 'string'
                      ? stage.output
                      : stage.output.message ||
                        JSON.stringify(stage.output).substring(0, 200)}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20"
        >
          <div>
            <p className="text-sm font-medium text-destructive">
              Research encountered an issue
            </p>
            <p className="text-sm text-destructive/80 mt-1">
              {error}
            </p>
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          )}
        </motion.div>
      )}
    </div>
  )
}
