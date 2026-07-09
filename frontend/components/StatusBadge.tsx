import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: 'waiting' | 'in_progress' | 'revising' | 'done' | 'error'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case 'done':
        return 'variant'
      case 'in_progress':
      case 'revising':
        return 'secondary'
      case 'waiting':
        return 'outline'
      case 'error':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'in_progress':
        return 'In Progress'
      case 'revising':
        return 'Revising'
      case 'waiting':
        return 'Waiting'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const statusColors = {
    done: 'bg-green-500/10 text-green-700 dark:text-green-300',
    in_progress: 'bg-accent/10 text-accent dark:text-amber-300',
    revising: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    waiting: 'bg-muted text-muted-foreground',
    error: 'bg-destructive/10 text-destructive',
  }

  return (
    <Badge
      className={`text-xs ${statusColors[status] || ''}`}
      variant="outline"
    >
      {getLabel()}
    </Badge>
  )
}
