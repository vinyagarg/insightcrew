'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Copy, Download, ArrowLeft } from 'lucide-react'
import { copyToClipboard, downloadAsText } from '@/lib/utils'
import { useState } from 'react'

interface Source {
  id: number
  title: string
  url: string
  snippet: string
}

interface Section {
  heading: string
  content: string
  confidence: string
  sources: Source[]
}

interface ReportHeaderProps {
  query: string
  sections: Section[]
  onCopy?: () => void
}

function buildFullReportText(query: string, sections: Section[]): string {
  let text = `Research Report\n${query}\n\n`

  sections.forEach((section, idx) => {
    text += `${idx + 1}. ${section.heading}\n`
    text += `Confidence: ${section.confidence}\n\n`
    text += `${section.content}\n\n`
  })

  const allSources = sections.flatMap((s) => s.sources)
  const uniqueSources = Array.from(
    new Map(allSources.map((s) => [s.id, s])).values()
  )

  if (uniqueSources.length > 0) {
    text += `Sources\n`
    uniqueSources.forEach((source) => {
      text += `[${source.id}] ${source.title} — ${source.url}\n`
    })
  }

  return text
}

export default function ReportHeader({ query, sections, onCopy }: ReportHeaderProps) {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const fullText = buildFullReportText(query, sections)
      await copyToClipboard(fullText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      if (onCopy) onCopy()
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const fullText = buildFullReportText(query, sections)
    downloadAsText(fullText, 'research-report.txt')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-8 border-b border-border"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          New Research
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
          Research Report
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          {query}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          <Copy size={16} />
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
        >
          <Download size={16} />
          Export
        </Button>
      </div>
    </motion.div>
  )
}
