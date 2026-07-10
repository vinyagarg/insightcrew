'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface Citation {
  id: number
  title: string
  url: string
  snippet: string
}

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

  if (!source) {
    return <span>[{citationId}]</span>
  }

  const title = source.title || 'Untitled source'
  const snippet = source.snippet || ''
  const url = source.url || '#'

  return (
    <span className="relative inline whitespace-nowrap">
      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onSelect}
        className="inline-flex items-center gap-1 px-1 rounded text-accent hover:bg-accent/10 transition-colors font-medium align-super text-xs"
      >
        [{citationId}]
      </button>

      <AnimatePresence>
        {(isSelected || isHovered) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-72 z-50 p-4 rounded-lg shadow-2xl border border-border bg-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isSelected && (
              <button
                type="button"
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
                {title}
              </p>
              {snippet && (
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {snippet}
                </p>
              )}
              
                href={url}
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
    </span>
  )
}
