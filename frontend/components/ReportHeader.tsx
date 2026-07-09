'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Copy, Download, ArrowLeft } from 'lucide-react'
import { copyToClipboard, downloadAsText } from '@/lib/utils'
import { useState } from 'react'

interface ReportHeaderProps {
  query: string
  onCopy?: () => void
}

export default function ReportHeader({ query, onCopy }: ReportHeaderProps) {
  const router = useRouter()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(query)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      if (onCopy) onCopy()
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    downloadAsText(query, 'research-report.txt')
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

      {/* Action Buttons */}
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
