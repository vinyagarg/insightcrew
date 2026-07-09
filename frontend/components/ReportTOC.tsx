'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ReportSection } from '@/hooks/useReport'

interface ReportTOCProps {
  sections: ReportSection[]
  onSelect?: (index: number) => void
}

export default function ReportTOC({ sections, onSelect }: ReportTOCProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSectionClick = (index: number) => {
    const element = document.getElementById(`section-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsOpen(false)
      if (onSelect) onSelect(index)
    }
  }

  // Desktop sidebar
  const desktopTOC = (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:block sticky top-24 h-fit space-y-2 p-4 bg-card rounded-lg border border-border"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
        Contents
      </p>
      <div className="space-y-1">
        {sections.map((section, idx) => (
          <motion.button
            key={idx}
            whileHover={{ x: 4 }}
            onClick={() => handleSectionClick(idx)}
            className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-accent rounded transition-colors"
          >
            {section.heading}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )

  // Mobile menu
  const mobileTOC = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Menu */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-lg p-4 lg:hidden"
          >
            <div className="max-h-96 overflow-y-auto space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-2">
                Contents
              </p>
              {sections.map((section, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSectionClick(idx)}
                  className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-accent rounded transition-colors"
                >
                  {section.heading}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {desktopTOC}

      {/* Mobile Toggle Button */}
      <motion.div className="fixed bottom-6 right-6 z-30 lg:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-accent text-accent-foreground p-3 shadow-lg"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </motion.div>

      {mobileTOC}
    </>
  )
}
