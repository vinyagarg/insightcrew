'use client'

import { motion } from 'framer-motion'
import { ReportData, ReportSection } from '@/app/session/[sessionId]/report/page'
import { SourcePopover } from './source-popover'
import { useState } from 'react'

interface ReportViewProps {
  report: ReportData
}

const CONFIDENCE_COLORS: Record<string, { badge: string; text: string }> = {
  high: {
    badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    text: 'High confidence',
  },
  medium: {
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    text: 'Medium confidence',
  },
  low: {
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    text: 'Low confidence',
  },
}

function CitationLink({
  citationId,
  sources,
}: {
  citationId: number
  sources: ReportSection['sources']
}) {
  const source = sources.find((s) => s.id === citationId)

  if (!source) return <span className="text-accent">[{citationId}]</span>

  return (
    <SourcePopover key={citationId} source={source}>
      <button className="text-accent hover:text-accent/80 transition-colors font-medium cursor-help">
        [{citationId}]
      </button>
    </SourcePopover>
  )
}

function renderContentWithCitations(
  content: string,
  sources: ReportSection['sources']
) {
  // Find all citations like [1], [2], etc.
  const parts: Array<{ type: 'text' | 'citation'; content: string; id?: number }> = []
  const citationRegex = /\[(\d+)\]/g
  let lastIndex = 0
  let match

  while ((match = citationRegex.exec(content)) !== null) {
    // Add text before citation
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }

    // Add citation
    parts.push({
      type: 'citation',
      content: match[0],
      id: parseInt(match[1]),
    })

    lastIndex = citationRegex.lastIndex
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return (
    <p className="text-foreground leading-relaxed text-pretty">
      {parts.map((part, idx) =>
        part.type === 'citation' ? (
          <CitationLink
            key={idx}
            citationId={part.id!}
            sources={sources}
          />
        ) : (
          <span key={idx}>{part.content}</span>
        )
      )}
    </p>
  )
}

export function ReportView({ report }: ReportViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  const totalSources = Array.from(
    new Set(report.sections.flatMap((s) => s.sources.map((src) => src.id)))
  ).length

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Research Report
          </h1>
          <p className="text-muted-foreground">
            {report.sections.length} sections • {totalSources} sources
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {report.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-border bg-card p-6 hover:border-border/80 transition-colors"
            >
              {/* Section header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2 text-pretty">
                    {section.heading}
                  </h2>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                    CONFIDENCE_COLORS[section.confidence].badge
                  }`}
                >
                  {CONFIDENCE_COLORS[section.confidence].text}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                {renderContentWithCitations(section.content, section.sources)}
              </div>

              {/* Sources */}
              {section.sources.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <button
                    onClick={() => toggleSection(index)}
                    className="text-xs font-mono text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                  >
                    <span>
                      {expandedSections.has(index) ? '▼' : '▶'} {section.sources.length}{' '}
                      source{section.sources.length !== 1 ? 's' : ''}
                    </span>
                  </button>

                  {expandedSections.has(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-2"
                    >
                      {section.sources.map((source) => (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded bg-background/50 hover:bg-background border border-border/50 hover:border-border transition-colors group"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-accent font-mono text-xs mt-0.5 flex-shrink-0">
                              [{source.id}]
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
                                {source.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {source.snippet}
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-1.5 truncate">
                                {new URL(source.url).hostname}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground"
        >
          <p>Report generated by InsightCrew</p>
        </motion.div>
      </div>
    </main>
  )
}
