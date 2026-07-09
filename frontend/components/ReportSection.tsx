'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import CitationPopover from '@/components/CitationPopover'
import { CONFIDENCE_COLORS } from '@/lib/constants'
import type { ReportSection as ReportSectionType } from '@/hooks/useReport'

interface ReportSectionProps {
  section: ReportSectionType
  sectionIndex: number
}

export default function ReportSection({
  section,
  sectionIndex,
}: ReportSectionProps) {
  const [selectedCitation, setSelectedCitation] = useState<number | null>(null)

  // Parse content and find citation markers
  const parsedContent = section.content
  const citationRegex = /\[(\d+)\]/g
  const citationMatches = Array.from(parsedContent.matchAll(citationRegex))

  // Map citation IDs to their sources
  const citationMap = new Map(
    section.sources.map((src) => [src.id, src])
  )

  const confidenceStyle = CONFIDENCE_COLORS[section.confidence]

  return (
    <motion.section
      id={`section-${sectionIndex}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-4 scroll-mt-24"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            {section.heading}
          </h2>
        </div>
        <Badge
          variant="outline"
          className={`${confidenceStyle.bg} ${confidenceStyle.text} border-0 shrink-0`}
        >
          {section.confidence.charAt(0).toUpperCase() + section.confidence.slice(1)} confidence
        </Badge>
      </div>

      {/* Content with inline citations */}
      <div className="space-y-4 text-base leading-relaxed text-foreground prose-invert max-w-none">
        {parsedContent.split(/(\[\d+\])/).map((part, idx) => {
          const match = part.match(/\[(\d+)\]/)
          if (match) {
            const citationId = parseInt(match[1]!, 10)
            const source = citationMap.get(citationId)
            if (!source) return null

            return (
              <CitationPopover
                key={`${sectionIndex}-${idx}`}
                citationId={citationId}
                source={source}
                isSelected={selectedCitation === citationId}
                onSelect={() =>
                  setSelectedCitation(
                    selectedCitation === citationId ? null : citationId
                  )
                }
              />
            )
          }

          return part ? <span key={`${sectionIndex}-${idx}`}>{part}</span> : null
        })}
      </div>
    </motion.section>
  )
}
