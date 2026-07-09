'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { ReportSection } from '@/app/session/[sessionId]/report/page'

interface SourcePopoverProps {
  source: ReportSection['sources'][0]
  children: React.ReactNode
}

export function SourcePopover({ source, children }: SourcePopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="inline-block relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline"
      >
        {children}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 z-50 bg-popover border border-border rounded-lg shadow-lg p-4"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X size={16} />
            </button>

            {/* Source content */}
            <div className="pr-6">
              <h4 className="font-medium text-foreground mb-2 line-clamp-2 text-sm">
                {source.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
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
