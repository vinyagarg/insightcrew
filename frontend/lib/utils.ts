import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadAsText(text: string, filename: string) {
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function parseCitations(content: string): {
  text: string
  citationPositions: Array<{ start: number; end: number; citationId: number }>
} {
  const citationPositions: Array<{ start: number; end: number; citationId: number }> = []
  let adjustedContent = content
  let offset = 0

  const citationRegex = /\[(\d+)\]/g
  let match

  // First pass: collect all citation positions
  const matches = Array.from(content.matchAll(citationRegex))
  matches.forEach((m) => {
    const citationId = parseInt(m[1]!, 10)
    const originalStart = m.index!
    const adjustedStart = originalStart - offset
    citationPositions.push({
      start: adjustedStart,
      end: adjustedStart,
      citationId,
    })
    offset += m[0].length
  })

  // Remove citation markers from content
  adjustedContent = content.replace(citationRegex, '')

  return { text: adjustedContent, citationPositions }
}
