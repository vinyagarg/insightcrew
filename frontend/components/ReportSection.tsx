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

  const citationMap = new Map(section.sources.map((src) => [src.id, src]))
  const confidenceStyle = CONFIDENCE_COLORS[section.confidence]

  // Split into real paragraphs first (on blank lines), fall back to whole content as one paragraph
  const paragraphs = section.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const paragraphList = paragraphs.length > 0 ? paragraphs : [section.content]

  const renderParagraph = (paragraph: string, pIdx: number) => {
    return paragraph.split(/(\[\d+\])/).map((part, idx) => {
      const match = part.match(/\[(\d+)\]/)
      if (match) {
        const citationId = parseInt(match[1]!, 10)
        const source = citationMap.get(citationId)
        if (!source) return null

        return (
          <CitationPopover
            key={`${sectionIndex}-${pIdx}-${idx}`}
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
      return part ? <span key={`${sectionIndex}-${pIdx}-${idx}`}>{part}</span> : null
    })
  }

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

      <div className="space-y-4 text-base leading-relaxed text-foreground max-w-none">
        {paragraphList.map((paragraph, pIdx) => (
          <p key={pIdx} className="leading-relaxed">
            {renderParagraph(paragraph, pIdx)}
          </p>
        ))}
      </div>
    </motion.section>
  )
}
