'use client'

import { motion } from 'framer-motion'
import { EXAMPLE_QUERIES } from '@/lib/constants'

interface ExampleChipsProps {
  onSelect: (query: string) => void
}

export default function ExampleChips({ onSelect }: ExampleChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-2"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        Try asking about:
      </p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_QUERIES.map((query, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(query)}
            className="px-3 py-2 text-sm rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {query}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
