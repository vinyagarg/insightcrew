'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { Citation } from '@/hooks/useReport'

interface SourcesListProps {
  sources: Citation[]
}

export default function SourcesList({ sources }: SourcesListProps) {
  // Deduplicate sources by URL
  const uniqueSources = Array.from(
    new Map(sources.map((src) => [src.url, src])).values()
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="space-y-4 mt-12 pt-8 border-t border-border"
      id="sources"
    >
      <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
        Sources
      </h2>

      <div className="grid gap-4">
        {uniqueSources.map((source, idx) => (
          <motion.a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="block"
          >
            <Card className="p-4 hover:border-accent/50 transition-colors">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                    {source.title}
                  </h3>
                  <ExternalLink
                    size={16}
                    className="text-muted-foreground flex-shrink-0 mt-0.5"
                  />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {source.snippet}
                </p>
                <p className="text-xs text-accent truncate">
                  {new URL(source.url).hostname}
                </p>
              </div>
            </Card>
          </motion.a>
        ))}
      </div>
    </motion.section>
  )
}
