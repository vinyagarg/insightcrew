'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Citation } from '@/hooks/useReport'

interface CitationPopoverProps {
  citationId: number
  source: Citation
  isSelected: boolean
  onSelect: () => void
}

export default function CitationPopover({
  citationId,
  source,
  isSelected,
  onSelect,
}: CitationPopoverProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative inline-block">
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onSelect}
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-accent hover:bg-accent/10 transition-colors font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        [{citationId}]
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {(isSelected || isHovered) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-64 z-50 p-3 bg-card border border-border rounded-lg shadow-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Close button for mobile */}
            {isSelected && (
              <button
                onClick={onSelect}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Source #{citationId}
              </p>
              <p className="text-sm font-semibold text-foreground line-clamp-2">
                {source.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {source.snippet}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
              >
                Visit source
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
